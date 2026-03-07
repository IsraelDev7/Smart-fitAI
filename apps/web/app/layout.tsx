import type { Metadata } from "next";
import "./globals.css";
import { MainNav } from "@/components/MainNav";

export const metadata: Metadata = {
  title: "SmartFit AI Platform",
  description: "Multi-tenant fitness and nutrition SaaS platform",
  applicationName: "SmartFit AI",
  appleWebApp: {
    capable: true,
    title: "SmartFit AI",
    statusBarStyle: "black-translucent"
  }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <MainNav />
        <main className="container" style={{ paddingBottom: 40 }}>
          {children}
        </main>
      </body>
    </html>
  );
}
