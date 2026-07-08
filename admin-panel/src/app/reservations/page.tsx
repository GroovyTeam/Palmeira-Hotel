'use client';

import React, { useState, useEffect } from 'react';

interface Reservation {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  status: 'pending' | 'contacted' | 'cancelled';
  createdAt: string;
}

export default function ReservationsPage() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filters and search
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'contacted' | 'cancelled'>('all');
  
  // Feedback states
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Fetch reservations
  const fetchReservations = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/reservations');
      if (!res.ok) {
        throw new Error('No se pudieron obtener las reservaciones.');
      }
      const data = await res.json();
      setReservations(data);
      setError(null);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Error de conexión con el servidor.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  // Update reservation status
  const updateStatus = async (id: string, newStatus: Reservation['status']) => {
    try {
      setUpdatingId(id);
      const res = await fetch(`/api/reservations/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) {
        throw new Error('No se pudo actualizar el estado de la reservación.');
      }

      const updated = await res.json();
      setReservations((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status: updated.status } : r))
      );
    } catch (err: any) {
      alert(err.message || 'Ocurrió un error al actualizar.');
    } finally {
      setUpdatingId(null);
    }
  };

  // Delete reservation
  const deleteRes = async (id: string) => {
    if (!confirm('¿Estás seguro de que deseas eliminar esta solicitud de reservación permanentemente?')) {
      return;
    }

    try {
      setDeletingId(id);
      const res = await fetch(`/api/reservations/${id}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        throw new Error('No se pudo eliminar la reservación.');
      }

      setReservations((prev) => prev.filter((r) => r.id !== id));
    } catch (err: any) {
      alert(err.message || 'Ocurrió un error al eliminar.');
    } finally {
      setDeletingId(null);
    }
  };

  // Contact client via WhatsApp
  const contactClient = async (res: Reservation) => {
    // Format WhatsApp number
    // Clean spaces, hyphens, and make sure we have country code (default to Mexico 52 if it looks like a 10-digit number)
    let cleanedPhone = res.phone.replace(/\D/g, '');
    if (cleanedPhone.length === 10) {
      cleanedPhone = `52${cleanedPhone}`;
    }

    const message = `Hola *${res.firstName} ${res.lastName}*, te saludamos de *Hotel Palmeira*. Recibimos tu solicitud de información para una reserva y nos gustaría ayudarte a planificar tu estancia. ¿Hay alguna fecha o tipo de habitación en particular que te interese?`;
    const encodedMessage = encodeURIComponent(message);
    const waUrl = `https://wa.me/${cleanedPhone}?text=${encodedMessage}`;

    // Open WhatsApp
    window.open(waUrl, '_blank');

    // Auto-update status to contacted if it was pending
    if (res.status === 'pending') {
      await updateStatus(res.id, 'contacted');
    }
  };

  // Filter & Search logic
  const filteredReservations = reservations.filter((res) => {
    const fullName = `${res.firstName} ${res.lastName}`.toLowerCase();
    const matchesSearch =
      fullName.includes(searchQuery.toLowerCase()) ||
      res.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      res.phone.includes(searchQuery);

    const matchesStatus = statusFilter === 'all' || res.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Date formatting
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleString('es-MX', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Gestión de Reservaciones</h1>
          <p className="text-sm text-slate-500 mt-1">
            Administra los contactos de clientes que solicitaron asesoría por WhatsApp.
          </p>
        </div>
        <button
          onClick={fetchReservations}
          className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold rounded-xl transition-all cursor-pointer"
        >
          <svg className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 8H18" />
          </svg>
          Sincronizar
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col md:flex-row gap-4 justify-between items-center">
        {/* Search */}
        <div className="relative w-full md:w-96">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </span>
          <input
            type="text"
            placeholder="Buscar por nombre, email o teléfono..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-slate-800"
          />
        </div>

        {/* Status Filters */}
        <div className="flex flex-wrap gap-2 w-full md:w-auto">
          {(['all', 'pending', 'contacted', 'cancelled'] as const).map((filter) => {
            const labels = {
              all: 'Todos',
              pending: 'Pendientes',
              contacted: 'Contactados',
              cancelled: 'Cancelados',
            };
            const isActive = statusFilter === filter;
            return (
              <button
                key={filter}
                onClick={() => setStatusFilter(filter)}
                className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer border ${
                  isActive
                    ? 'bg-emerald-500 text-white border-emerald-500 shadow-[0_4px_12px_rgba(16,185,129,0.15)]'
                    : 'bg-white hover:bg-slate-50 text-slate-500 border-slate-200'
                }`}
              >
                {labels[filter]}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content Area */}
      {error ? (
        <div className="bg-red-50 border border-red-200 text-red-700 p-6 rounded-2xl text-center">
          <p className="font-semibold">Error al cargar datos</p>
          <p className="text-sm mt-1">{error}</p>
          <button
            onClick={fetchReservations}
            className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded-xl transition-all"
          >
            Reintentar
          </button>
        </div>
      ) : loading ? (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-12 text-center">
          <div className="inline-block w-8 h-8 border-4 border-slate-200 border-t-emerald-500 rounded-full animate-spin"></div>
          <p className="text-slate-500 text-sm mt-4">Cargando reservaciones...</p>
        </div>
      ) : filteredReservations.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-12 text-center">
          <svg className="w-12 h-12 text-slate-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0a2 2 0 01-2 2H6a2 2 0 01-2-2m16 0V9a2 2 0 00-2-2H6a2 2 0 00-2 2v2m16 4h-2a2 2 0 00-2 2v3a2 2 0 002 2h2a2 2 0 002-2v-3a2 2 0 00-2-2zM6 20h2a2 2 0 002-2v-3a2 2 0 00-2-2H6a2 2 0 00-2 2v3a2 2 0 002 2z" />
          </svg>
          <p className="text-slate-700 font-semibold">No se encontraron reservaciones</p>
          <p className="text-slate-400 text-sm mt-1">
            {searchQuery || statusFilter !== 'all'
              ? 'Intenta cambiar los términos de búsqueda o filtros.'
              : 'Las solicitudes que envíen los clientes aparecerán listadas aquí.'}
          </p>
        </div>
      ) : (
        /* Table / Cards Container */
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          {/* Desktop Table View */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/75 border-b border-slate-100 text-slate-400 text-[10px] font-bold uppercase tracking-wider">
                  <th className="py-4 px-6">Cliente</th>
                  <th className="py-4 px-6">Contacto</th>
                  <th className="py-4 px-6">Fecha Registro</th>
                  <th className="py-4 px-6">Estado</th>
                  <th className="py-4 px-6 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredReservations.map((res) => (
                  <tr key={res.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-5 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-700 uppercase">
                          {res.firstName[0]}
                          {res.lastName[0]}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-800 text-sm">
                            {res.firstName} {res.lastName}
                          </p>
                          <span className="text-[10px] text-slate-400 font-mono">ID: {res.id}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-5 px-6">
                      <div className="text-sm">
                        <p className="text-slate-700">{res.phone}</p>
                        <p className="text-xs text-slate-400 mt-0.5">{res.email}</p>
                      </div>
                    </td>
                    <td className="py-5 px-6 text-sm text-slate-500">
                      {formatDate(res.createdAt)}
                    </td>
                    <td className="py-5 px-6">
                      <span
                        className={`inline-flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                          res.status === 'pending'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200/50'
                            : res.status === 'contacted'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/50'
                            : 'bg-slate-100 text-slate-600 border border-slate-200/50'
                        }`}
                      >
                        {res.status === 'pending' && (
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                        )}
                        {res.status === 'pending' ? 'Pendiente' : res.status === 'contacted' ? 'Contactado' : 'Cancelado'}
                      </span>
                    </td>
                    <td className="py-5 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {/* Contact WhatsApp Button */}
                        <button
                          onClick={() => contactClient(res)}
                          title="Contactar por WhatsApp"
                          className="p-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 hover:text-emerald-700 rounded-xl transition-all cursor-pointer"
                        >
                          <svg className="w-4.5 h-4.5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.965C16.59 2.016 14.11 1.001 11.99 1.001c-5.444 0-9.87 4.372-9.874 9.802-.001 1.761.472 3.479 1.374 5.023l-.95 3.472 3.51-.909zM17.96 15.03c-.326-.162-1.93-.939-2.228-1.047-.3-.109-.519-.163-.737.163-.218.327-.844 1.047-1.036 1.265-.19.217-.383.245-.71.082-.326-.163-1.378-.502-2.624-1.601-.968-.853-1.623-1.908-1.813-2.235-.19-.327-.02-.504.143-.666.147-.145.327-.381.49-.572.163-.19.218-.327.327-.545.109-.218.054-.409-.028-.572-.081-.163-.737-1.743-1.01-2.397-.265-.634-.534-.549-.738-.56-.19-.01-.409-.012-.627-.012-.218 0-.573.081-.873.409-.3.327-1.145 1.102-1.145 2.686 0 1.584 1.145 3.115 1.309 3.333.163.218 2.248 3.385 5.45 4.748.761.325 1.355.518 1.819.661.766.24 1.463.207 2.013.125.614-.092 1.93-.778 2.203-1.492.273-.713.273-1.325.19-1.455-.082-.128-.272-.209-.597-.372z" />
                          </svg>
                        </button>

                        {/* Status Change Buttons */}
                        {res.status !== 'contacted' && (
                          <button
                            onClick={() => updateStatus(res.id, 'contacted')}
                            disabled={updatingId === res.id}
                            title="Marcar como Contactado"
                            className="p-2 bg-slate-100 hover:bg-emerald-50 text-slate-500 hover:text-emerald-600 rounded-xl transition-all cursor-pointer disabled:opacity-50"
                          >
                            <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          </button>
                        )}

                        {res.status !== 'cancelled' && (
                          <button
                            onClick={() => updateStatus(res.id, 'cancelled')}
                            disabled={updatingId === res.id}
                            title="Marcar como Cancelado"
                            className="p-2 bg-slate-100 hover:bg-rose-50 text-slate-500 hover:text-rose-600 rounded-xl transition-all cursor-pointer disabled:opacity-50"
                          >
                            <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        )}

                        {res.status === 'cancelled' && (
                          <button
                            onClick={() => updateStatus(res.id, 'pending')}
                            disabled={updatingId === res.id}
                            title="Reabrir / Marcar Pendiente"
                            className="p-2 bg-slate-100 hover:bg-amber-50 text-slate-500 hover:text-amber-600 rounded-xl transition-all cursor-pointer disabled:opacity-50"
                          >
                            <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 8H18" />
                            </svg>
                          </button>
                        )}

                        {/* Delete Button */}
                        <button
                          onClick={() => deleteRes(res.id)}
                          disabled={deletingId === res.id}
                          title="Eliminar registro"
                          className="p-2 bg-slate-100 hover:bg-red-50 text-slate-500 hover:text-red-600 rounded-xl transition-all cursor-pointer disabled:opacity-50"
                        >
                          <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="block lg:hidden divide-y divide-slate-100">
            {filteredReservations.map((res) => (
              <div key={res.id} className="p-5 hover:bg-slate-50/50 transition-colors space-y-4">
                <div className="flex justify-between items-start gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-700 uppercase shrink-0">
                      {res.firstName[0]}
                      {res.lastName[0]}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-800 text-sm">
                        {res.firstName} {res.lastName}
                      </p>
                      <span className="text-[10px] text-slate-400 font-mono">ID: {res.id}</span>
                    </div>
                  </div>
                  <span
                    className={`inline-flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                      res.status === 'pending'
                        ? 'bg-amber-50 text-amber-700 border border-amber-200/50'
                        : res.status === 'contacted'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/50'
                        : 'bg-slate-100 text-slate-600 border border-slate-200/50'
                    }`}
                  >
                    {res.status === 'pending' && (
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                    )}
                    {res.status === 'pending' ? 'Pendiente' : res.status === 'contacted' ? 'Contactado' : 'Cancelado'}
                  </span>
                </div>

                <div className="text-xs space-y-1 bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <p className="text-slate-600"><span className="font-medium text-slate-400">Tel:</span> {res.phone}</p>
                  <p className="text-slate-600"><span className="font-medium text-slate-400">Email:</span> {res.email}</p>
                  <p className="text-slate-400 text-[10px] mt-1"><span className="font-medium text-slate-400">Registro:</span> {formatDate(res.createdAt)}</p>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                  {/* Contact WhatsApp Button */}
                  <button
                    onClick={() => contactClient(res)}
                    className="flex items-center gap-2 px-3.5 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-bold rounded-xl transition-all cursor-pointer"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.965C16.59 2.016 14.11 1.001 11.99 1.001c-5.444 0-9.87 4.372-9.874 9.802-.001 1.761.472 3.479 1.374 5.023l-.95 3.472 3.51-.909zM17.96 15.03c-.326-.162-1.93-.939-2.228-1.047-.3-.109-.519-.163-.737.163-.218.327-.844 1.047-1.036 1.265-.19.217-.383.245-.71.082-.326-.163-1.378-.502-2.624-1.601-.968-.853-1.623-1.908-1.813-2.235-.19-.327-.02-.504.143-.666.147-.145.327-.381.49-.572.163-.19.218-.327.327-.545.109-.218.054-.409-.028-.572-.081-.163-.737-1.743-1.01-2.397-.265-.634-.534-.549-.738-.56-.19-.01-.409-.012-.627-.012-.218 0-.573.081-.873.409-.3.327-1.145 1.102-1.145 2.686 0 1.584 1.145 3.115 1.309 3.333.163.218 2.248 3.385 5.45 4.748.761.325 1.355.518 1.819.661.766.24 1.463.207 2.013.125.614-.092 1.93-.778 2.203-1.492.273-.713.273-1.325.19-1.455-.082-.128-.272-.209-.597-.372z" />
                    </svg>
                    WhatsApp
                  </button>

                  {/* Status Toggle buttons */}
                  {res.status !== 'contacted' && (
                    <button
                      onClick={() => updateStatus(res.id, 'contacted')}
                      disabled={updatingId === res.id}
                      className="p-2 bg-slate-100 hover:bg-emerald-50 text-slate-500 hover:text-emerald-600 rounded-xl transition-all cursor-pointer"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </button>
                  )}

                  {res.status !== 'cancelled' && (
                    <button
                      onClick={() => updateStatus(res.id, 'cancelled')}
                      disabled={updatingId === res.id}
                      className="p-2 bg-slate-100 hover:bg-rose-50 text-slate-500 hover:text-rose-600 rounded-xl transition-all cursor-pointer"
                    >
                      <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}

                  <button
                    onClick={() => deleteRes(res.id)}
                    disabled={deletingId === res.id}
                    className="p-2 bg-slate-100 hover:bg-red-50 text-slate-500 hover:text-red-600 rounded-xl transition-all cursor-pointer"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
