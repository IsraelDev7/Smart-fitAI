import Link from "next/link";
import { FadeIn } from "@/components/FadeIn";
import { SectionCard } from "@/components/SectionCard";
import { pricing } from "@/lib/mock-data";

export default function MarketingPage() {
  return (
    <div style={{ display: "grid", gap: 24, paddingTop: 26 }}>
      <FadeIn>
        <section className="glass" style={{ padding: 24, display: "grid", gap: 14 }}>
          <span className="pill">SaaS Fitness + Nutrition + Social</span>
          <h1 style={{ margin: 0, fontSize: "clamp(1.8rem, 4vw, 3rem)", lineHeight: 1.1 }}>
            SMARTFIT AI PLATFORM
          </h1>
          <p style={{ margin: 0, color: "var(--muted)", maxWidth: 760 }}>
            Multi-tenant ecosystem for coaches, nutritionists, and students. Build programs, sell subscriptions,
            track progress, and scale globally.
          </p>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <Link href="/dashboard" className="gradient-button">
              Start 90-day transformation
            </Link>
            <Link
              href="/marketplace"
              style={{
                borderRadius: 999,
                border: "1px solid rgba(255,255,255,0.25)",
                padding: "0.72rem 1.1rem",
                fontWeight: 600
              }}
            >
              Browse marketplace
            </Link>
          </div>
        </section>
      </FadeIn>

      <FadeIn delay={0.06}>
        <div style={{ display: "grid", gap: 12, gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))" }}>
          {pricing.map((plan) => (
            <SectionCard key={plan.name} title={plan.name} subtitle={`Monthly: ${plan.monthly} | Yearly: ${plan.yearly}`}>
              <ul style={{ margin: 0, paddingLeft: "1rem", color: "var(--muted)", lineHeight: 1.8 }}>
                {plan.features.map((feature) => (
                  <li key={feature}>{feature}</li>
                ))}
              </ul>
            </SectionCard>
          ))}
        </div>
      </FadeIn>
    </div>
  );
}
