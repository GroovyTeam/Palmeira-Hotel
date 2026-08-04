'use client';

import React, { useState, useEffect } from 'react';

interface GalleryItem {
  id: string;
  src: string;
  alt: string;
  category: string;
  spanClass?: string;
}

export default function GalleryPage() {
  const [photos, setPhotos] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [newSrc, setNewSrc] = useState('');
  const [newAlt, setNewAlt] = useState('');
  const [newCategory, setNewCategory] = useState('general');
  const [newSpan, setNewSpan] = useState('span-1-1');
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchPhotos = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/gallery');
      if (!res.ok) throw new Error('No se pudieron obtener las fotos de la galería.');
      const data = await res.json();
      setPhotos(data);
    } catch (err: any) {
      setError(err.message || 'Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPhotos();
  }, []);

  const handleAddPhoto = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSrc) return;

    setSubmitting(true);
    try {
      const res = await fetch('/api/gallery', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          src: newSrc,
          alt: newAlt,
          category: newCategory,
          spanClass: newSpan
        }),
      });

      if (!res.ok) throw new Error('No se pudo añadir la foto.');
      const added = await res.json();
      
      setPhotos((prev) => [...prev, added]);
      setNewSrc('');
      setNewAlt('');
      setNewCategory('general');
      setNewSpan('span-1-1');
    } catch (err: any) {
      alert(err.message || 'Error al añadir foto');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeletePhoto = async (id: string) => {
    if (!confirm('¿Estás seguro de que deseas eliminar esta imagen de la galería?')) return;
    
    setDeletingId(id);
    try {
      const res = await fetch(`/api/gallery/${id}`, {
        method: 'DELETE',
      });

      if (!res.ok) throw new Error('No se pudo eliminar la imagen.');
      setPhotos((prev) => prev.filter(p => p.id !== id));
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
        <p className="text-slate-500 text-sm mt-4">Cargando galería de fotos...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Galería de Momentos</h1>
          <p className="text-sm text-slate-500 mt-1">
            Administra las perspectivas y ángulos visuales del hotel expuestos en el sitio público.
          </p>
        </div>
        <button
          onClick={fetchPhotos}
          className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold rounded-xl transition-all cursor-pointer"
        >
          Sincronizar
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form to add photos (Left side) */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm h-fit space-y-6">
          <h2 className="text-lg font-bold text-slate-800 border-b pb-3 border-slate-100">Agregar Nueva Imagen</h2>
          
          <form onSubmit={handleAddPhoto} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Ruta o URL de Imagen</label>
              <input
                type="text"
                placeholder="./public/img/recursos/nombre.jpg"
                value={newSrc}
                onChange={(e) => setNewSrc(e.target.value)}
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Descripción Alternativa (SEO)</label>
              <input
                type="text"
                placeholder="Ej. Vista de la alberca al amanecer"
                value={newAlt}
                onChange={(e) => setNewAlt(e.target.value)}
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:outline-none"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Categoría</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:outline-none"
                >
                  <option value="general">General</option>
                  <option value="habitaciones">Habitaciones</option>
                  <option value="alberca">Alberca</option>
                  <option value="restaurante">Restaurante</option>
                  <option value="playa">Playa</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Tamaño Mosaico</label>
                <select
                  value={newSpan}
                  onChange={(e) => setNewSpan(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:outline-none"
                >
                  <option value="span-1-1">Pequeño (1x1)</option>
                  <option value="span-2-1">Ancho (2x1)</option>
                  <option value="span-1-2">Alto (1x2)</option>
                  <option value="span-2-2">Grande (2x2)</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-bold uppercase tracking-wider rounded-xl cursor-pointer shadow-sm transition-all disabled:opacity-50"
            >
              {submitting ? 'Añadiendo...' : 'Añadir a Galería'}
            </button>
          </form>
        </div>

        {/* Gallery display grid (Right side, spans 2 cols) */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm lg:col-span-2">
          <h2 className="text-lg font-bold text-slate-800 border-b pb-3 border-slate-100 mb-4">Fotos Activas ({photos.length})</h2>
          
          {photos.length === 0 ? (
            <p className="text-slate-400 text-sm text-center py-12">No hay imágenes configuradas en la galería.</p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {photos.map((photo) => (
                <div key={photo.id} className="group relative aspect-video bg-slate-100 rounded-xl overflow-hidden border border-slate-200/50 shadow-sm flex flex-col justify-end">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={photo.src.startsWith('.') ? photo.src.substring(1) : photo.src}
                    alt={photo.alt}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-60"></div>
                  
                  {/* Category badge */}
                  <span className="absolute top-2 left-2 text-[9px] font-bold px-2 py-0.5 bg-emerald-500 text-white rounded-full uppercase tracking-wider">
                    {photo.category}
                  </span>

                  {/* Size badge */}
                  <span className="absolute top-2 right-2 text-[9px] font-bold px-2 py-0.5 bg-slate-850/80 text-white rounded-full uppercase tracking-wider">
                    {photo.spanClass?.replace('span-', '')}
                  </span>

                  {/* Info and delete action */}
                  <div className="p-3 relative flex justify-between items-center gap-2">
                    <div className="min-w-0">
                      <p className="text-[10px] text-white/90 font-medium truncate" title={photo.alt}>
                        {photo.alt}
                      </p>
                    </div>
                    <button
                      onClick={() => handleDeletePhoto(photo.id)}
                      disabled={deletingId === photo.id}
                      className="p-1 bg-red-600 hover:bg-red-700 text-white rounded-md transition-all shrink-0 cursor-pointer"
                      title="Eliminar foto"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
