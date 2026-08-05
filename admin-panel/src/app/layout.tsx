import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import SidebarNav from "../components/SidebarNav";

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
      <body className={`${inter.className} bg-gray-50 flex h-screen overflow-hidden`}>
        {/* Sidebar */}
        <aside className="w-64 bg-slate-900 text-white flex flex-col h-full shrink-0">
          <div className="p-6 border-b border-slate-800">
            <h1 className="text-xl font-bold tracking-wider italic text-emerald-400">Palmeira's Admin</h1>
          </div>
          
          <SidebarNav />
          
          <div className="p-4 border-t border-slate-800">
            <button className="w-full px-4 py-2 bg-slate-800 rounded hover:bg-slate-700 transition-colors text-sm">
              Cerrar Sesión
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto bg-slate-50 text-slate-900">
          <header className="bg-white shadow-sm px-8 py-4 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-slate-700">Gestión de Sitio Web Público</h2>
            <div className="flex items-center gap-4">
              <a
                href="/landing.html"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-4 py-2 bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 transition-colors text-xs font-bold uppercase tracking-wider rounded-xl shadow-sm cursor-pointer"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                Ver Sitio Público
              </a>
              <span className="text-sm font-medium text-slate-500">Admin User</span>
              <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold">
                A
              </div>
            </div>
          </header>
          <div className="p-8">
            {children}
          </div>
        </main>
      </body>
    </html>
  );
}
