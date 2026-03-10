// Dev note: root layout only wires metadata and global styles; keep cross-page wrappers here, not in route files.
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SQL Practice",
  description: "Practice SQL assignments and run queries",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}


