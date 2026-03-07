export const PLAN_PRICES = {
  monthly: {
    free: { usd: 0, eur: 0, gbp: 0, brl: 0 },
    standard: { usd: 29, eur: 29, gbp: 29, brl: 39.9 },
    vip: { usd: 89, eur: 89, gbp: 89, brl: 99.9 }
  },
  yearly: {
    free: { usd: 0, eur: 0, gbp: 0, brl: 0 },
    standard: { usd: 290, eur: 290, gbp: 290, brl: 399 },
    vip: { usd: 890, eur: 890, gbp: 890, brl: 999 }
  }
} as const;

export const SUPPORTED_LOCALES = ["en", "pt", "es"] as const;
