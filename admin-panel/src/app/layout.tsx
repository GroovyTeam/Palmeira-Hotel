import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import SidebarNav from "../components/SidebarNav";

import AdminLayoutWrapper from "../components/AdminLayoutWrapper";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Palmeira's Hotel | Admin Panel",
  description: "Administración del sitio web público",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <AdminLayoutWrapper>{children}</AdminLayoutWrapper>
      </body>
    </html>
  );
}
