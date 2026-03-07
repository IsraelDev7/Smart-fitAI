interface StatCardProps {
  label: string;
  value: string;
  hint?: string;
  color?: string;
}

export function StatCard({ label, value, hint, color = "#10B981" }: StatCardProps) {
  return (
    <article
      className="glass"
      style={{
        padding: 16,
        borderColor: `${color}55`
      }}
    >
      <p style={{ margin: 0, color: "var(--muted)", fontSize: "0.82rem" }}>{label}</p>
      <p style={{ margin: "0.4rem 0", fontSize: "1.4rem", fontWeight: 800 }}>{value}</p>
      {hint ? <p style={{ margin: 0, fontSize: "0.8rem", color: "var(--muted)" }}>{hint}</p> : null}
    </article>
  );
}
