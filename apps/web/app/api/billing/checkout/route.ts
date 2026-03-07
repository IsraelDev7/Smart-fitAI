import { NextRequest, NextResponse } from "next/server";
import {
  cents,
  normalizeCurrency,
  resolvePlanAmount,
  toStripeInterval,
  type BillingInterval,
  type BillingPlanCode
} from "@/lib/billing/pricing";
import { getStripe } from "@/lib/stripe/server";
import { recordPendingPayment } from "@/lib/billing/persistence";

type CheckoutProvider = "stripe_card" | "stripe_pix" | "zelle";

interface CheckoutPayload {
  plan: BillingPlanCode;
  interval?: BillingInterval;
  currency: string;
  provider?: CheckoutProvider;
  userId?: string;
  tenantId?: string;
  customerEmail?: string;
  successUrl?: string;
  cancelUrl?: string;
}

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const payload = (await request.json().catch(() => null)) as CheckoutPayload | null;

  if (!payload?.plan || !payload?.currency) {
    return NextResponse.json({ error: "plan and currency are required" }, { status: 400 });
  }

  if (payload.plan === "free") {
    return NextResponse.json({ error: "free plan does not require checkout" }, { status: 400 });
  }

  const interval: BillingInterval = payload.interval === "yearly" ? "yearly" : "monthly";
  const currency = normalizeCurrency(payload.currency);

  if (!currency) {
    return NextResponse.json({ error: "unsupported currency" }, { status: 400 });
  }

  const amount = resolvePlanAmount(payload.plan, interval, currency);
  if (amount === null) {
    return NextResponse.json({ error: "unsupported plan/currency combination" }, { status: 400 });
  }

  const provider: CheckoutProvider = payload.provider ?? "stripe_card";
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? request.nextUrl.origin ?? "http://localhost:3000";

  const metadata = {
    tenant_id: payload.tenantId ?? "",
    user_id: payload.userId ?? "",
    plan_code: payload.plan,
    interval,
    currency,
    provider
  };

  if (provider === "zelle") {
    await recordPendingPayment({
      tenantId: payload.tenantId,
      userId: payload.userId,
      planCode: payload.plan,
      interval,
      currency,
      amount,
      method: "zelle_manual",
      providerPaymentId: `zelle-${Date.now()}`,
      metadata
    });

    return NextResponse.json({
      status: "pending_manual",
      provider: "zelle",
      amount,
      currency,
      instructionsUrl: process.env.ZELLE_INSTRUCTIONS_URL ?? null,
      nextAction: "Send transfer proof to support for manual activation"
    });
  }

  const stripe = getStripe();
  if (!stripe) {
    return NextResponse.json({ error: "missing STRIPE_SECRET_KEY" }, { status: 500 });
  }

  if (provider === "stripe_pix") {
    const intent = await stripe.paymentIntents.create({
      amount: cents(amount),
      currency,
      payment_method_types: ["pix"],
      receipt_email: payload.customerEmail,
      description: `SmartFit ${payload.plan} ${interval}`,
      metadata
    });

    await recordPendingPayment({
      tenantId: payload.tenantId,
      userId: payload.userId,
      planCode: payload.plan,
      interval,
      currency,
      amount,
      method: "stripe_pix",
      providerPaymentId: intent.id,
      metadata
    });

    return NextResponse.json({
      status: "requires_action",
      provider: "stripe_pix",
      paymentIntentId: intent.id,
      clientSecret: intent.client_secret,
      amount,
      currency
    });
  }

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    payment_method_types: ["card"],
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency,
          unit_amount: cents(amount),
          recurring: {
            interval: toStripeInterval(interval)
          },
          product_data: {
            name: `SmartFit ${payload.plan.toUpperCase()} ${interval.toUpperCase()}`
          }
        }
      }
    ],
    success_url: payload.successUrl ?? `${appUrl}/dashboard?payment=success`,
    cancel_url: payload.cancelUrl ?? `${appUrl}/dashboard?payment=cancelled`,
    customer_email: payload.customerEmail,
    client_reference_id: payload.userId,
    metadata,
    subscription_data: {
      metadata
    }
  });

  await recordPendingPayment({
    tenantId: payload.tenantId,
    userId: payload.userId,
    planCode: payload.plan,
    interval,
    currency,
    amount,
    method: "stripe_card",
    providerPaymentId: session.id,
    metadata
  });

  return NextResponse.json({
    status: "pending",
    provider: "stripe_card",
    checkoutSessionId: session.id,
    checkoutUrl: session.url,
    amount,
    currency,
    interval
  });
}