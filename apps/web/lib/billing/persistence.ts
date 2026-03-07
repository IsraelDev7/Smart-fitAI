import type { BillingCurrency, BillingInterval, BillingPlanCode } from "./pricing";
import { getSupabaseAdmin } from "@/lib/supabase/admin";

interface PendingPaymentInput {
  tenantId?: string;
  userId?: string;
  planCode: BillingPlanCode;
  interval: BillingInterval;
  currency: BillingCurrency;
  amount: number;
  method: string;
  providerPaymentId?: string;
  metadata?: Record<string, unknown>;
}

interface SubscriptionUpsertInput {
  tenantId?: string;
  userId?: string;
  planCode: BillingPlanCode;
  status: string;
  provider: string;
  providerCustomerId?: string;
  providerSubscriptionId?: string;
  currentPeriodStart?: number | null;
  currentPeriodEnd?: number | null;
}

interface PaymentSuccessInput {
  tenantId?: string;
  userId?: string;
  amount: number;
  currency: BillingCurrency;
  method: string;
  providerPaymentId: string;
  metadata?: Record<string, unknown>;
}

async function resolvePlanId(planCode: BillingPlanCode, tenantId?: string) {
  const admin = getSupabaseAdmin();
  if (!admin) {
    return null;
  }

  if (tenantId) {
    const tenantPlan = await admin
      .from("subscription_plans")
      .select("id")
      .eq("code", planCode)
      .eq("tenant_id", tenantId)
      .maybeSingle();

    if (tenantPlan.data?.id) {
      return tenantPlan.data.id as string;
    }
  }

  const globalPlan = await admin
    .from("subscription_plans")
    .select("id")
    .eq("code", planCode)
    .is("tenant_id", null)
    .maybeSingle();

  return (globalPlan.data?.id as string | undefined) ?? null;
}

export async function recordPendingPayment(input: PendingPaymentInput) {
  const admin = getSupabaseAdmin();
  if (!admin || !input.tenantId || !input.userId) {
    return;
  }

  const planId = await resolvePlanId(input.planCode, input.tenantId);
  if (!planId) {
    return;
  }

  await admin.from("payments").insert({
    tenant_id: input.tenantId,
    user_id: input.userId,
    provider: "stripe",
    provider_payment_id: input.providerPaymentId,
    currency: input.currency,
    amount: input.amount,
    status: "pending",
    method: input.method,
    metadata: {
      ...input.metadata,
      plan_code: input.planCode,
      interval: input.interval,
      plan_id: planId
    }
  });
}

export async function upsertUserSubscription(input: SubscriptionUpsertInput) {
  const admin = getSupabaseAdmin();
  if (!admin || !input.tenantId || !input.userId) {
    return;
  }

  const planId = await resolvePlanId(input.planCode, input.tenantId);
  if (!planId) {
    return;
  }

  const payload = {
    tenant_id: input.tenantId,
    user_id: input.userId,
    plan_id: planId,
    provider: input.provider,
    provider_customer_id: input.providerCustomerId,
    provider_subscription_id: input.providerSubscriptionId,
    status: input.status,
    current_period_start: input.currentPeriodStart ? new Date(input.currentPeriodStart * 1000).toISOString() : null,
    current_period_end: input.currentPeriodEnd ? new Date(input.currentPeriodEnd * 1000).toISOString() : null,
    cancel_at_period_end: false
  };

  if (input.providerSubscriptionId) {
    const existing = await admin
      .from("user_subscriptions")
      .select("id")
      .eq("provider_subscription_id", input.providerSubscriptionId)
      .maybeSingle();

    if (existing.data?.id) {
      await admin.from("user_subscriptions").update(payload).eq("id", existing.data.id);
      return;
    }
  }

  const byUser = await admin
    .from("user_subscriptions")
    .select("id")
    .eq("tenant_id", input.tenantId)
    .eq("user_id", input.userId)
    .maybeSingle();

  if (byUser.data?.id) {
    await admin.from("user_subscriptions").update(payload).eq("id", byUser.data.id);
    return;
  }

  await admin.from("user_subscriptions").insert(payload);
}

export async function recordSuccessfulPayment(input: PaymentSuccessInput) {
  const admin = getSupabaseAdmin();
  if (!admin || !input.tenantId || !input.userId) {
    return;
  }

  const existing = await admin
    .from("payments")
    .select("id")
    .eq("provider_payment_id", input.providerPaymentId)
    .maybeSingle();

  const payload = {
    tenant_id: input.tenantId,
    user_id: input.userId,
    provider: "stripe",
    provider_payment_id: input.providerPaymentId,
    currency: input.currency,
    amount: input.amount,
    status: "succeeded",
    method: input.method,
    metadata: input.metadata ?? {},
    paid_at: new Date().toISOString()
  };

  if (existing.data?.id) {
    await admin.from("payments").update(payload).eq("id", existing.data.id);
    return;
  }

  await admin.from("payments").insert(payload);
}