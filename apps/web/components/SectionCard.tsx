interface SectionCardProps {
  title: string;
  subtitle?: string;
  children: any;
}

export function SectionCard({ title, subtitle, children }: SectionCardProps) {
  return (
    <section className="glass" style={{ padding: 18 }}>
      <header style={{ marginBottom: 12 }}>
        <h3 style={{ margin: 0, fontSize: "1.1rem" }}>{title}</h3>
        {subtitle ? <p style={{ margin: "0.35rem 0 0", color: "var(--muted)", fontSize: "0.92rem" }}>{subtitle}</p> : null}
      </header>
      {children}
    </section>
  );
}
