import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "AstraDrive Analytics Demo",
  description: "A fictional, synthetic analytics instrumentation test surface.",
};

const navigation = [
  ["/vehicles", "Vehicles"],
  ["/compare", "Compare"],
  ["/dealers", "Dealers"],
  ["/test-drive", "Test drive"],
  ["/quote", "Quote"],
] as const;

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en-AU">
      <body>
        <div className="bg-[#15231d] px-4 py-2 text-center text-sm text-white">
          This is a fictional portfolio demonstration. It is not a real vehicle
          sales website.
        </div>
        <header className="border-b border-[var(--line)] bg-[var(--surface)]">
          <div className="shell flex min-h-18 flex-wrap items-center justify-between gap-4 py-3">
            <Link href="/" className="text-xl font-black tracking-tight">
              AstraDrive <span className="text-[var(--brand)]">Lab</span>
            </Link>
            <nav aria-label="Primary navigation">
              <ul className="flex flex-wrap gap-x-5 gap-y-2 text-sm font-semibold">
                {navigation.map(([href, label]) => (
                  <li key={href}>
                    <Link href={href}>{label}</Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </header>
        <main>{children}</main>
        <footer className="mt-20 border-t border-[var(--line)] py-8 text-sm text-[var(--muted)]">
          <div className="shell flex flex-wrap justify-between gap-4">
            <p>Synthetic data only. No real vehicle offer or performance claim.</p>
            <Link href="/privacy">Privacy and consent behaviour</Link>
          </div>
        </footer>
      </body>
    </html>
  );
}
