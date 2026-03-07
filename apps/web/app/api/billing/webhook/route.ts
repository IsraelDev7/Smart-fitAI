import { NextRequest, NextResponse } from "next/server";
import type Stripe from "stripe";
import { getStripe } from "@/lib/stripe/server";
import { recordSuccessfulPayment, upsertUserSubscription } from "@/lib/billing/persistence";
import { normalizeCurrency, type BillingPlanCode } from "@/lib/billing/pricing";

export const dynamic = "force-dynamic";

function metadataFromObject(source: { metadata?: Record<string, string> | null } | null | undefined) {
  return source?.metadata ?? {};
}

function isPlanCode(value: string | undefined): value is BillingPlanCode {
  return value === "standard" || value === "vip" || value === "free";
}

export async function POST(request: NextRequest) {
  const stripe = getStripe();
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!stripe || !webhookSecret) {
    return NextResponse.json({ error: "missing Stripe webhook configuration" }, { status: 500 });
  }

  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "missing stripe-signature header" }, { status: 400 });
  }

  const payload = await request.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(payload, signature, webhookSecret);
  } catch (error) {
    return NextResponse.json({ error: "invalid webhook signature", details: String(error) }, { status: 400 });
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const metadata = metadataFromObject(session);
      const planCode = metadata.plan_code;

      if (isPlanCode(planCode) && metadata.user_id && metadata.tenant_id) {
        await upsertUserSubscription({
          tenantId: metadata.tenant_id,
          userId: metadata.user_id,
          planCode,
          status: "active",
          provider: "stripe",
          providerCustomerId: typeof session.customer === "string" ? session.customer : undefined,
          providerSubscriptionId: typeof session.subscription === "string" ? session.subscription : undefined
        });
      }
      break;
    }

    case "invoice.payment_succeeded": {
      const invoice = event.data.object as Stripe.Invoice;
      const subscriptionId = typeof (invoice as any).subscription === "string" ? (invoice as any).subscription : undefined;
      if (!subscriptionId) {
        break;
      }

      const subscriptionRaw = await stripe.subscriptions.retrieve(subscriptionId);
      const subscription = subscriptionRaw as any;
      const metadata = metadataFromObject(subscription);
      const planCode = metadata.plan_code;
      const currency = normalizeCurrency(invoice.currency ?? "usd") ?? "usd";

      if (isPlanCode(planCode) && metadata.user_id && metadata.tenant_id) {
        await upsertUserSubscription({
          tenantId: metadata.tenant_id,
          userId: metadata.user_id,
          planCode,
          status: subscription.status,
          provider: "stripe",
          providerCustomerId: typeof subscription.customer === "string" ? subscription.customer : undefined,
          providerSubscriptionId: subscription.id,
          currentPeriodStart: subscription.current_period_start,
          currentPeriodEnd: subscription.current_period_end
        });

        await recordSuccessfulPayment({
          tenantId: metadata.tenant_id,
          userId: metadata.user_id,
          amount: (invoice.amount_paid ?? 0) / 100,
          currency,
          method: "stripe_card",
          providerPaymentId: typeof (invoice as any).payment_intent === "string" ? (invoice as any).payment_intent : invoice.id,
          metadata
        });
      }
      break;
    }

    case "customer.subscription.updated":
    case "customer.subscription.deleted": {
      const subscription = event.data.object as any;
      const metadata = metadataFromObject(subscription);
      const planCode = metadata.plan_code;

      if (isPlanCode(planCode) && metadata.user_id && metadata.tenant_id) {
        await upsertUserSubscription({
          tenantId: metadata.tenant_id,
          userId: metadata.user_id,
          planCode,
          status: subscription.status,
          provider: "stripe",
          providerCustomerId: typeof subscription.customer === "string" ? subscription.customer : undefined,
          providerSubscriptionId: subscription.id,
          currentPeriodStart: subscription.current_period_start,
          currentPeriodEnd: subscription.current_period_end
        });
      }
      break;
    }

    case "payment_intent.succeeded": {
      const intent = event.data.object as Stripe.PaymentIntent;
      const metadata = metadataFromObject(intent);
      const planCode = metadata.plan_code;
      const interval = metadata.interval === "yearly" ? "yearly" : "monthly";
      const currency = normalizeCurrency(intent.currency ?? "usd") ?? "usd";

      if (isPlanCode(planCode) && metadata.user_id && metadata.tenant_id) {
        const now = Math.floor(Date.now() / 1000);
        const periodSeconds = interval === "yearly" ? 31536000 : 2592000;

        await upsertUserSubscription({
          tenantId: metadata.tenant_id,
          userId: metadata.user_id,
          planCode,
          status: "active",
          provider: "stripe",
          providerCustomerId: typeof intent.customer === "string" ? intent.customer : undefined,
          providerSubscriptionId: intent.id,
          currentPeriodStart: now,
          currentPeriodEnd: now + periodSeconds
        });

        await recordSuccessfulPayment({
          tenantId: metadata.tenant_id,
          userId: metadata.user_id,
          amount: (intent.amount_received ?? intent.amount) / 100,
          currency,
          method: "stripe_pix",
          providerPaymentId: intent.id,
          metadata
        });
      }
      break;
    }

    default:
      break;
  }

  return NextResponse.json({ received: true });
}