import { PLAN_PRICES } from "@smartfit/shared";

export type BillingInterval = "monthly" | "yearly";
export type BillingCurrency = "usd" | "eur" | "gbp" | "brl";
export type BillingPlanCode = keyof typeof PLAN_PRICES.monthly;

export function resolvePlanAmount(plan: BillingPlanCode, interval: BillingInterval, currency: BillingCurrency) {
  const source = interval === "yearly" ? PLAN_PRICES.yearly : PLAN_PRICES.monthly;
  const value = (source[plan] as Record<string, number>)[currency];

  if (typeof value !== "number") {
    return null;
  }

  return value;
}

export function toStripeInterval(interval: BillingInterval): "month" | "year" {
  return interval === "yearly" ? "year" : "month";
}

export function normalizeCurrency(value: string): BillingCurrency | null {
  const normalized = value.toLowerCase();

  if (normalized === "usd" || normalized === "eur" || normalized === "gbp" || normalized === "brl") {
    return normalized;
  }

  return null;
}

export function cents(amount: number) {
  return Math.round(amount * 100);
}