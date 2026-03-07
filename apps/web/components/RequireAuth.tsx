"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

export function RequireAuth({ children }: { children: any }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [supabaseConfigured, setSupabaseConfigured] = useState(true);

  useEffect(() => {
    const supabase = getSupabaseBrowserClient();

    if (!supabase) {
      setSupabaseConfigured(false);
      setLoading(false);
      return;
    }

    let mounted = true;

    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) {
        return;
      }

      setSession(data.session ?? null);
      setLoading(false);
    });

    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      setLoading(false);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  if (loading) {
    return <p style={{ color: "var(--muted)" }}>Checking session...</p>;
  }

  if (!supabaseConfigured) {
    return (
      <section className="glass" style={{ padding: 20, maxWidth: 560 }}>
        <h2 style={{ marginTop: 0 }}>Supabase not configured</h2>
        <p style={{ color: "var(--muted)" }}>
          Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to enable authentication.
        </p>
      </section>
    );
  }

  if (!session) {
    return (
      <section className="glass" style={{ padding: 20, maxWidth: 520 }}>
        <h2 style={{ marginTop: 0 }}>Sign in required</h2>
        <p style={{ color: "var(--muted)" }}>You need an account session to access this area.</p>
        <Link href="/auth" className="gradient-button" style={{ display: "inline-block" }}>
          Go to login
        </Link>
      </section>
    );
  }

  return children;
}