import { RequireAuth } from "@/components/RequireAuth";
import { StatCard } from "@/components/StatCard";
import { SectionCard } from "@/components/SectionCard";
import { dashboard } from "@/lib/mock-data";
import { pct } from "@/lib/math";

export default function DashboardPage() {
  return (
    <RequireAuth>
      <div style={{ display: "grid", gap: 14, paddingTop: 20 }}>
        <h1 style={{ margin: 0, fontSize: "1.8rem" }}>Dashboard</h1>

        <div style={{ display: "grid", gap: 10, gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))" }}>
          <StatCard label="Streak" value={`${dashboard.streak} days`} color="#F97316" />
          <StatCard label="XP" value={`${dashboard.xp}`} color="#EAB308" />
          <StatCard label="Level" value={`${dashboard.level}`} color="#22D3EE" />
          <StatCard
            label="Workout progression"
            value={`${dashboard.workoutsCompleted}/${dashboard.workoutsGoal}`}
            hint={`${pct(dashboard.workoutsCompleted, dashboard.workoutsGoal)}% complete`}
            color="#10B981"
          />
        </div>

        <div style={{ display: "grid", gap: 12, gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))" }}>
          <SectionCard title="Workout today" subtitle="Upper body strength | 52 min">
            <ProgressRow label="Completion" value={68} target={100} />
            <button className="gradient-button" style={{ marginTop: 10 }}>Confirm workout</button>
          </SectionCard>

          <SectionCard title="Nutrition" subtitle="Daily macro and hydration tracking">
            <ProgressRow label="Calories" value={dashboard.calories} target={dashboard.caloriesTarget} />
            <ProgressRow label="Water ml" value={dashboard.waterMl} target={dashboard.waterTarget} color="#22D3EE" />
          </SectionCard>
        </div>

        <SectionCard title="Nutri Muzy AI" subtitle="AI coach format: Explanation | Advice | Encouragement">
          <p style={{ margin: "0 0 0.45rem" }}>
            Explanation: Consistent protein intake and progressive overload are core for body recomposition.
          </p>
          <p style={{ margin: "0 0 0.45rem" }}>Advice: Hit protein target and complete 8k steps today.</p>
          <p style={{ margin: 0 }}>Encouragement: Discipline now creates visible results in 90 days.</p>
        </SectionCard>
      </div>
    </RequireAuth>
  );
}

function ProgressRow({ label, value, target, color = "#10B981" }: { label: string; value: number; target: number; color?: string }) {
  const percentage = pct(value, target);

  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, fontSize: "0.86rem" }}>
        <span>{label}</span>
        <span style={{ color: "var(--muted)" }}>{value}/{target}</span>
      </div>
      <div style={{ height: 8, borderRadius: 999, background: "rgba(255,255,255,0.14)", overflow: "hidden" }}>
        <div style={{ width: `${percentage}%`, height: "100%", background: color }} />
      </div>
    </div>
  );
}
