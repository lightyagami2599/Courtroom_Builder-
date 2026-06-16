import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI Courtroom LMS",
  description: "AI-powered courtroom learning management system with 3D scene editor.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-zinc-950 text-zinc-100 antialiased">{children}</body>
    </html>
  );
}
