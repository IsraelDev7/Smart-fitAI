"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

type NavHref = "/" | "/dashboard" | "/marketplace" | "/community";

const links: Array<{ href: NavHref; label: string }> = [
  { href: "/", label: "Home" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/marketplace", label: "Marketplace" },
  { href: "/community", label: "Community" }
];

export function MainNav() {
  const pathname = usePathname();
  const router = useRouter();
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    const supabase = getSupabaseBrowserClient();

    if (!supabase) {
      setEmail(null);
      return;
    }

    let mounted = true;

    supabase.auth.getUser().then(({ data }) => {
      if (!mounted) {
        return;
      }

      setEmail(data.user?.email ?? null);
    });

    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setEmail(session?.user?.email ?? null);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const onLogout = async () => {
    const supabase = getSupabaseBrowserClient();
    if (supabase) {
      await supabase.auth.signOut();
    }

    router.push("/auth");
    router.refresh();
  };

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 40,
        borderBottom: "1px solid rgba(255,255,255,0.1)",
        background: "rgba(10,10,10,0.75)",
        backdropFilter: "blur(12px)"
      }}
    >
      <div
        className="container"
        style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0.9rem 0", gap: 12 }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: 12,
              background: "linear-gradient(130deg, #10b981, #22d3ee)",
              boxShadow: "0 8px 24px rgba(34,211,238,0.24)"
            }}
          />
          <strong>SmartFit AI</strong>
        </div>

        <nav style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
          {links.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                style={{
                  borderRadius: 999,
                  padding: "0.42rem 0.9rem",
                  fontSize: "0.88rem",
                  border: "1px solid rgba(255,255,255,0.2)",
                  background: active ? "rgba(16,185,129,0.22)" : "transparent"
                }}
              >
                {link.label}
              </Link>
            );
          })}

          {email ? (
            <>
              <span className="pill">{email}</span>
              <button
                type="button"
                onClick={onLogout}
                style={{
                  borderRadius: 999,
                  border: "1px solid rgba(249,115,22,0.45)",
                  background: "rgba(249,115,22,0.2)",
                  color: "white",
                  padding: "0.4rem 0.9rem",
                  fontWeight: 600,
                  cursor: "pointer"
                }}
              >
                Logout
              </button>
            </>
          ) : (
            <Link href="/auth" className="gradient-button">
              Login
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}