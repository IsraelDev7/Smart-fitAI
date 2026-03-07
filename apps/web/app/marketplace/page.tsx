import { RequireAuth } from "@/components/RequireAuth";
import { SectionCard } from "@/components/SectionCard";
import { marketplacePrograms } from "@/lib/mock-data";

export default function MarketplacePage() {
  return (
    <RequireAuth>
      <div style={{ display: "grid", gap: 14, paddingTop: 20 }}>
        <h1 style={{ margin: 0, fontSize: "1.8rem" }}>Program Marketplace</h1>
        <p style={{ margin: 0, color: "var(--muted)" }}>
          Browse coach programs by goal, difficulty, duration, and price.
        </p>

        <div style={{ display: "grid", gap: 12, gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))" }}>
          {marketplacePrograms.map((program) => (
            <SectionCard
              key={program.id}
              title={program.title}
              subtitle={`${program.coach} | ${program.durationDays} days | ${program.price}`}
            >
              <p style={{ margin: "0 0 0.8rem", color: "var(--muted)" }}>
                Rating {program.rating} ({program.reviews} reviews)
              </p>
              <button className="gradient-button">Open sales page</button>
            </SectionCard>
          ))}
        </div>
      </div>
    </RequireAuth>
  );
}
