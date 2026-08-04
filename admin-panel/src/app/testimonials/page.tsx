'use client';

import React, { useState, useEffect } from 'react';

interface Testimonial {
  id: string;
  stars: number;
  author: string;
  quote: string;
}

export default function TestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Form states
  const [newAuthor, setNewAuthor] = useState('');
  const [newStars, setNewStars] = useState(5);
  const [newQuote, setNewQuote] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchTestimonials = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/testimonials');
      if (!res.ok) throw new Error('No se pudieron obtener los testimonios.');
      const data = await res.json();
      setTestimonials(data);
    } catch (err: any) {
      setError(err.message || 'Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const handleAddTestimonial = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuote) return;

    setSubmitting(true);
    try {
      const res = await fetch('/api/testimonials', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          author: newAuthor,
          stars: newStars,
          quote: newQuote
        }),
      });

      if (!res.ok) throw new Error('No se pudo guardar el testimonio.');
      const added = await res.json();

      setTestimonials((prev) => [...prev, added]);
      setNewAuthor('');
      setNewStars(5);
      setNewQuote('');
    } catch (err: any) {
      alert(err.message || 'Error al guardar testimonio');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteTestimonial = async (id: string) => {
    if (!confirm('¿Estás seguro de que deseas eliminar este testimonio de forma permanente?')) return;

    setDeletingId(id);
    try {
      const res = await fetch(`/api/testimonials/${id}`, {
        method: 'DELETE',
      });

      if (!res.ok) throw new Error('No se pudo eliminar el testimonio.');
      setTestimonials((prev) => prev.filter(t => t.id !== id));
    } catch (err: any) {
      alert(err.message || 'Error al eliminar');
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-12 text-center">
        <div className="inline-block w-8 h-8 border-4 border-slate-200 border-t-emerald-500 rounded-full animate-spin"></div>
        <p className="text-slate-500 text-sm mt-4">Cargando opiniones de huéspedes...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Gestión de Testimonios</h1>
          <p className="text-sm text-slate-500 mt-1">
            Administra las opiniones y experiencias reales que se muestran de tus huéspedes en la landing page.
          </p>
        </div>
        <button
          onClick={fetchTestimonials}
          className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold rounded-xl transition-all cursor-pointer"
        >
          Sincronizar
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form panel (Left side) */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm h-fit space-y-6">
          <h2 className="text-lg font-bold text-slate-800 border-b pb-3 border-slate-100">Agregar Testimonio</h2>
          
          <form onSubmit={handleAddTestimonial} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Huésped / Autor</label>
              <input
                type="text"
                placeholder="Ej. Familia Gómez o Mariana R."
                value={newAuthor}
                onChange={(e) => setNewAuthor(e.target.value)}
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Calificación (Estrellas)</label>
              <select
                value={newStars}
                onChange={(e) => setNewStars(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:outline-none"
              >
                <option value="5">★★★★★ (5 Estrellas)</option>
                <option value="4">★★★★☆ (4 Estrellas)</option>
                <option value="3">★★★☆☆ (3 Estrellas)</option>
                <option value="2">★★☆☆☆ (2 Estrellas)</option>
                <option value="1">★☆☆☆☆ (1 Estrella)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Cita / Reseña (Tono Natural)</label>
              <textarea
                placeholder="Ej. Me encantó la estadía, la alberca de Chukum es súper refrescante..."
                value={newQuote}
                onChange={(e) => setNewQuote(e.target.value)}
                rows={4}
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:outline-none"
                required
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-bold uppercase tracking-wider rounded-xl cursor-pointer shadow-sm transition-all disabled:opacity-50"
            >
              {submitting ? 'Añadiendo...' : 'Guardar Opinión'}
            </button>
          </form>
        </div>

        {/* List panel (Right side) */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm lg:col-span-2 space-y-6">
          <h2 className="text-lg font-bold text-slate-800 border-b pb-3 border-slate-100">Testimonios Activos ({testimonials.length})</h2>
          
          {testimonials.length === 0 ? (
            <p className="text-slate-400 text-sm text-center py-12">No hay testimonios registrados.</p>
          ) : (
            <div className="divide-y divide-slate-100">
              {testimonials.map((t) => (
                <div key={t.id} className="py-4 first:pt-0 last:pb-0 flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-slate-700">{t.author}</span>
                      <span className="text-xs text-amber-500">{'★'.repeat(t.stars)}</span>
                    </div>
                    <p className="text-sm text-slate-600 italic leading-relaxed">
                      "{t.quote}"
                    </p>
                    <p className="text-[10px] font-mono text-slate-400">ID: {t.id}</p>
                  </div>

                  <button
                    onClick={() => handleDeleteTestimonial(t.id)}
                    disabled={deletingId === t.id}
                    className="p-1.5 bg-slate-100 hover:bg-red-50 hover:text-red-600 text-slate-400 rounded-lg transition-all shrink-0 cursor-pointer border border-transparent hover:border-red-100"
                    title="Eliminar testimonio"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
