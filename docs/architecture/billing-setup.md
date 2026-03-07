# Billing Setup (Stripe + Supabase)

## Implemented endpoints

- `POST /api/billing/checkout`
  - providers: `stripe_card`, `stripe_pix`, `zelle`
  - creates Stripe Checkout Session (card) or PaymentIntent (pix)
  - writes pending payment in Supabase when service role is configured

- `POST /api/billing/webhook`
  - validates Stripe signature
  - processes:
    - `checkout.session.completed`
    - `invoice.payment_succeeded`
    - `customer.subscription.updated`
    - `customer.subscription.deleted`
    - `payment_intent.succeeded`
  - updates `user_subscriptions` and `payments`

## Required credentials

- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `NEXT_PUBLIC_SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `NEXT_PUBLIC_APP_URL`

Optional:

- `ZELLE_INSTRUCTIONS_URL`

## Webhook setup in Stripe

1. Create webhook endpoint pointing to:
   - `https://YOUR_DOMAIN/api/billing/webhook`
2. Subscribe events listed above
3. Copy webhook signing secret to `STRIPE_WEBHOOK_SECRET`

## Checkout request payload example

```json
{
  "plan": "standard",
  "interval": "monthly",
  "currency": "usd",
  "provider": "stripe_card",
  "tenantId": "TENANT_UUID",
  "userId": "USER_UUID",
  "customerEmail": "user@email.com"
}
```

## Notes

- `free` plan bypasses billing.
- `stripe_pix` currently activates subscription via webhook on `payment_intent.succeeded`.
- `zelle` returns manual instructions and keeps status as pending until manual confirmation flow is implemented.

Important: Each webhook endpoint has its own secret. If Stripe is currently sending events to n8n, that signing secret will only validate events for n8n, not for this app endpoint.
