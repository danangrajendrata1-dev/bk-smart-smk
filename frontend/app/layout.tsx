import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "BK SMART SMK",
  description: "Aplikasi manajemen Bimbingan Konseling SMK",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
