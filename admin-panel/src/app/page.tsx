import React from 'react';

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Stats */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-2">Reseñas Aprobadas</h3>
          <p className="text-3xl font-bold text-slate-800">15,002</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-2">Fotos en Galería</h3>
          <p className="text-3xl font-bold text-slate-800">24</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-2">Estado del Sitio</h3>
          <p className="text-xl font-bold text-emerald-500">En Línea</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100">
          <h3 className="text-lg font-semibold text-slate-800">Actividad Reciente</h3>
        </div>
        <div className="p-6 text-sm text-slate-600">
          <ul className="space-y-4">
            <li className="flex gap-4">
              <span className="w-2 h-2 rounded-full bg-emerald-400 mt-1.5"></span>
              <div>
                <p className="font-medium text-slate-800">Sitio web actualizado a "Editorial Tranquility"</p>
                <p className="text-slate-500">Hace 2 horas</p>
              </div>
            </li>
            <li className="flex gap-4">
              <span className="w-2 h-2 rounded-full bg-blue-400 mt-1.5"></span>
              <div>
                <p className="font-medium text-slate-800">Nuevas imágenes agregadas al catálogo</p>
                <p className="text-slate-500">Hace 3 horas</p>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
