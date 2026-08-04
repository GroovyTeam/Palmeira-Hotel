import React from 'react';
import { getReservations } from '../lib/reservations';
import Link from 'next/link';

// Helper to format date
function formatDate(dateStr: string) {
  const date = new Date(dateStr);
  
  // Simple relative time helper
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMins < 60) {
    return diffMins <= 1 ? 'Hace un momento' : `Hace ${diffMins} minutos`;
  } else if (diffHours < 24) {
    return diffHours === 1 ? 'Hace 1 hora' : `Hace ${diffHours} horas`;
  } else if (diffDays < 7) {
    return diffDays === 1 ? 'Ayer' : `Hace ${diffDays} días`;
  } else {
    return date.toLocaleDateString('es-MX', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  }
}

export default async function Dashboard() {
  const reservations = await getReservations();

  const totalContacts = reservations.length;
  const pendingCount = reservations.filter((r) => r.status === 'pending').length;
  const confirmedCount = reservations.filter((r) => r.status === 'confirmed').length;
  const contactedCount = reservations.filter((r) => r.status === 'contacted').length;
  const contactRate = totalContacts > 0 ? Math.round(((contactedCount + confirmedCount) / totalContacts) * 100) : 0;

  const recentReservations = reservations.slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Confirmadas Online</h3>
            <p className="text-3xl font-bold text-emerald-600">{confirmedCount}</p>
          </div>
          <div className="mt-4 flex items-center gap-1.5 text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md w-fit">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            Venta cerrada en web
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Pendientes WhatsApp</h3>
            <p className="text-3xl font-bold text-amber-600">{pendingCount}</p>
          </div>
          <div className="mt-4 flex items-center gap-1.5 text-xs font-medium text-amber-600 bg-amber-50 px-2 py-1 rounded-md w-fit">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
            Requiere atención
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Total Solicitudes</h3>
            <p className="text-3xl font-bold text-slate-800">{totalContacts}</p>
          </div>
          <div className="mt-4 text-xs font-medium text-slate-505 bg-slate-50 px-2 py-1 rounded-md w-fit">
            Registradas en total
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Conversión Total</h3>
            <p className="text-3xl font-bold text-slate-800">{contactRate}%</p>
          </div>
          <div className="mt-4 flex items-center gap-1.5 text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md w-fit">
            {confirmedCount + contactedCount} de {totalContacts} cerrados
          </div>
        </div>
      </div>

      {/* Main Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent activity (left/center) */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden lg:col-span-2">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
            <h3 className="text-lg font-bold text-slate-800">Solicitudes Recientes</h3>
            <Link
              href="/reservations"
              className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 hover:underline transition-all"
            >
              Ver todas →
            </Link>
          </div>
          <div className="p-6">
            {recentReservations.length === 0 ? (
              <div className="text-center py-8 text-slate-400 text-sm">
                No hay solicitudes de reservación registradas.
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {recentReservations.map((res) => (
                  <div key={res.id} className="py-4 first:pt-0 last:pb-0 flex items-center justify-between gap-4">
                    <div className="flex gap-4 items-start">
                      <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-700 shrink-0 uppercase">
                        {res.firstName[0]}
                        {res.lastName[0]}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-800 text-sm">
                          {res.firstName} {res.lastName}
                        </p>
                        <p className="text-xs text-slate-500">
                          Tel: {res.phone} • {res.email}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2 shrink-0">
                      <span className="text-xs text-slate-400">{formatDate(res.createdAt)}</span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                          res.status === 'pending'
                            ? 'bg-amber-100 text-amber-700 border border-amber-200'
                            : res.status === 'confirmed'
                            ? 'bg-emerald-500 text-white border border-emerald-600'
                            : res.status === 'contacted'
                            ? 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                            : 'bg-slate-100 text-slate-600 border border-slate-200'
                        }`}
                      >
                        {res.status === 'pending'
                          ? 'Pendiente'
                          : res.status === 'confirmed'
                          ? 'Confirmada'
                          : res.status === 'contacted'
                          ? 'Contactado'
                          : 'Cancelado'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Site Stats / Details (right) */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-slate-800">Resumen de Contenidos</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex justify-between items-center py-2 border-b border-slate-100">
                <span className="text-slate-500">Reseñas Aprobadas</span>
                <span className="font-bold text-slate-700">15,002</span>
              </li>
              <li className="flex justify-between items-center py-2 border-b border-slate-100">
                <span className="text-slate-500">Fotos en Galería</span>
                <span className="font-bold text-slate-700">24</span>
              </li>
              <li className="flex justify-between items-center py-2 border-b border-slate-100">
                <span className="text-slate-500">Sección Experiencias</span>
                <span className="font-bold text-emerald-600">Activo</span>
              </li>
              <li className="flex justify-between items-center py-2">
                <span className="text-slate-500">Diseño Editorial</span>
                <span className="font-bold text-slate-700">Tranquility v2.1</span>
              </li>
            </ul>
          </div>

          <div className="mt-8 bg-emerald-50/50 p-4 rounded-xl border border-emerald-100/50">
            <h4 className="text-xs font-bold text-emerald-800 uppercase tracking-wider mb-1">
              Acceso de Invitados
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Las reservaciones se guardan cuando un cliente hace clic en enviar en la landing page principal y es redirigido a WhatsApp.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
