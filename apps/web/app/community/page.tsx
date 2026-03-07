import { RequireAuth } from "@/components/RequireAuth";
import { SectionCard } from "@/components/SectionCard";
import { communityPosts } from "@/lib/mock-data";

export default function CommunityPage() {
  return (
    <RequireAuth>
      <div style={{ display: "grid", gap: 14, paddingTop: 20, maxWidth: 860 }}>
        <h1 style={{ margin: 0, fontSize: "1.8rem" }}>Community Feed</h1>
        {communityPosts.map((post) => (
          <SectionCard key={post.id} title={post.author} subtitle={post.badge}>
            <p style={{ margin: "0 0 1rem", lineHeight: 1.6 }}>{post.text}</p>
            <div style={{ display: "flex", gap: 8 }}>
              <span className="pill">Like {post.likes}</span>
              <span className="pill">Comment {post.comments}</span>
              <span className="pill">Share</span>
            </div>
          </SectionCard>
        ))}

        <SectionCard title="Safety and moderation" subtitle="AI + human moderation workflow">
          <ul style={{ margin: 0, paddingLeft: "1rem", color: "var(--muted)", lineHeight: 1.8 }}>
            <li>Toxicity and harassment detection before publish.</li>
            <li>Image moderation for explicit or harmful content.</li>
            <li>Escalation queue for moderator review and appeals.</li>
          </ul>
        </SectionCard>
      </div>
    </RequireAuth>
  );
}
