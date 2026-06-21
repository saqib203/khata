import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PumpERP",
  description: "Cloud ERP for pump business management"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
