'use client';

import React, { useState } from 'react';
import SidebarNav from './SidebarNav';

export default function AdminLayoutWrapper({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 text-slate-900 w-full relative">
      {/* Sidebar Overlay for mobile */}
      {isOpen && (
        <div 
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm z-30 lg:hidden"
        />
      )}

      {/* Sidebar aside */}
      <aside className={`fixed inset-y-0 left-0 w-64 bg-slate-900 text-white flex flex-col h-full shrink-0 z-40 transform transition-transform duration-300 lg:translate-x-0 lg:static ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="p-6 border-b border-slate-800 flex justify-between items-center">
          <h1 className="text-xl font-bold tracking-wider italic text-emerald-400">Palmeira's Admin</h1>
          <button 
            onClick={() => setIsOpen(false)}
            className="lg:hidden text-slate-400 hover:text-white text-xl cursor-pointer"
          >
            ✕
          </button>
        </div>
        
        <SidebarNav />
        
        <div className="p-4 border-t border-slate-800">
          <button className="w-full px-4 py-2 bg-slate-800 rounded hover:bg-slate-700 transition-colors text-sm">
            Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden h-full">
        {/* Header */}
        <header className="bg-white shadow-sm px-6 py-4 flex justify-between items-center shrink-0">
          <div className="flex items-center gap-3">
            {/* Mobile burger toggle */}
            <button 
              onClick={() => setIsOpen(true)}
              className="lg:hidden p-2 hover:bg-slate-100 rounded-lg text-slate-650 cursor-pointer"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <h2 className="text-base sm:text-lg font-semibold text-slate-700 truncate">
              Gestión de Sitio Web Público
            </h2>
          </div>
          
          <div className="flex items-center gap-2 sm:gap-4">
            <a
              href="/landing.html"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 transition-colors text-[10px] sm:text-xs font-bold uppercase tracking-wider rounded-xl shadow-sm cursor-pointer"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              <span className="hidden sm:inline">Ver Sitio Público</span>
              <span className="sm:hidden">Sitio</span>
            </a>
            <span className="text-xs sm:text-sm font-medium text-slate-500 hidden md:inline">Admin User</span>
            <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold shrink-0">
              A
            </div>
          </div>
        </header>
        
        {/* Children scrollable panel */}
        <main className="flex-1 overflow-y-auto bg-slate-50 text-slate-900 p-4 sm:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
