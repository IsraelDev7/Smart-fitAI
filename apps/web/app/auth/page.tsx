"use client";

import { FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

export default function AuthPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const title = useMemo(() => (mode === "signin" ? "Sign in" : "Create account"), [mode]);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus(null);

    const supabase = getSupabaseBrowserClient();

    if (!supabase) {
      setStatus("Missing Supabase env vars. Configure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.");
      return;
    }

    setLoading(true);

    if (mode === "signin") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setStatus(error.message);
      } else {
        setStatus("Signed in successfully.");
        router.push("/dashboard");
        router.refresh();
      }
      setLoading(false);
      return;
    }

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          locale: "pt"
        }
      }
    });

    if (error) {
      setStatus(error.message);
      setLoading(false);
      return;
    }

    setStatus("Account created. Check your email if confirmation is enabled.");
    setLoading(false);
  };

  return (
    <div style={{ display: "grid", placeItems: "center", minHeight: "72vh", paddingTop: 20 }}>
      <section className="glass" style={{ width: "min(460px, 94vw)", padding: 22 }}>
        <p className="pill" style={{ marginTop: 0 }}>SmartFit AI Access</p>
        <h1 style={{ marginTop: 10 }}>{title}</h1>

        <form onSubmit={onSubmit} style={{ display: "grid", gap: 10 }}>
          {mode === "signup" ? (
            <label style={labelStyle}>
              Full name
              <input
                value={fullName}
                onChange={(event) => setFullName(event.target.value)}
                style={inputStyle}
                placeholder="Your name"
                required
              />
            </label>
          ) : null}

          <label style={labelStyle}>
            Email
            <input
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              style={inputStyle}
              placeholder="you@email.com"
              type="email"
              required
            />
          </label>

          <label style={labelStyle}>
            Password
            <input
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              style={inputStyle}
              placeholder="At least 6 chars"
              type="password"
              minLength={6}
              required
            />
          </label>

          <button className="gradient-button" type="submit" disabled={loading} style={{ opacity: loading ? 0.65 : 1 }}>
            {loading ? "Please wait..." : title}
          </button>
        </form>

        <button
          type="button"
          onClick={() => setMode((prev) => (prev === "signin" ? "signup" : "signin"))}
          style={{
            marginTop: 12,
            background: "transparent",
            border: "none",
            color: "var(--secondary)",
            cursor: "pointer",
            padding: 0
          }}
        >
          {mode === "signin" ? "Need an account? Sign up" : "Already have an account? Sign in"}
        </button>

        {status ? <p style={{ color: "var(--muted)", marginTop: 10 }}>{status}</p> : null}
      </section>
    </div>
  );
}

const labelStyle: React.CSSProperties = {
  display: "grid",
  gap: 6,
  fontSize: "0.86rem",
  color: "var(--muted)"
};

const inputStyle: React.CSSProperties = {
  borderRadius: 12,
  border: "1px solid rgba(255,255,255,0.24)",
  background: "rgba(255,255,255,0.05)",
  color: "white",
  padding: "0.7rem 0.82rem",
  outline: "none"
};