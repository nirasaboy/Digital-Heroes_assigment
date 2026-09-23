import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ReduxProvider from "../components/ReduxProvider";
import AuthNav from "../components/AuthNav";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Digital Heroes",
  description: "Golf performance tracking, charity fundraising, and monthly draws.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <ReduxProvider>
          <header style={{ padding: '20px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--accent-primary)' }}>
              <a href="/" style={{ textDecoration: 'none', color: 'inherit' }}>Digital Heroes</a>
            </div>
            <nav style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
              <AuthNav />
            </nav>
          </header>
          <main style={{ flex: 1 }}>
            {children}
          </main>
        </ReduxProvider>
      </body>
    </html>
  );
}
