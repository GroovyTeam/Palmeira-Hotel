'use client';

import React, { useState, useEffect, useRef } from 'react';

interface Settings {
  checkin: string;
  checkout: string;
  whatsapp: string;
  socials: {
    instagram: string;
    facebook: string;
  };
  chatbot: {
    enabled: boolean;
    botName: string;
    welcomeMsg: string;
    waBotEnabled?: boolean;
    waWelcomeMsg?: string;
  };
  hero: {
    titleLine1: string;
    titleLine2: string;
    subtitle: string;
  };
  about: {
    poolTitle: string;
    poolDesc: string;
    serviceTitle: string;
    serviceDesc: string;
  };
  rooms: {
    priceFrom: string;
    title: string;
    description: string;
    amenities: string[];
  };
  location: {
    title: string;
    desc: string;
  };
  services: {
    title: string;
    desc: string;
  };
  restaurant: {
    title: string;
    desc: string;
  };
  beach: {
    title: string;
    desc: string;
  };
}

type ActiveTab = 'hero' | 'services' | 'rooms' | 'about' | 'restaurant' | 'beach' | 'location';

export default function LiveEditor() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Active edit tab
  const [activeTab, setActiveTab] = useState<ActiveTab>('hero');
  const [newAmenity, setNewAmenity] = useState('');
  
  // Iframe tracking
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Load configuration
  useEffect(() => {
    async function loadSettings() {
      try {
        const res = await fetch('/api/settings');
        if (!res.ok) throw new Error('No se pudieron cargar los datos del sitio.');
        const data = await res.json();
        
        // Ensure defaults exist for all layout nodes
        const sanitizedData: Settings = {
          ...data,
          hero: data.hero || { titleLine1: '', titleLine2: '', subtitle: '' },
          about: data.about || { poolTitle: '', poolDesc: '', serviceTitle: '', serviceDesc: '' },
          rooms: data.rooms || { priceFrom: '', title: '', description: '', amenities: [] },
          location: data.location || { title: '', desc: '' },
          services: data.services || { title: '', desc: '' },
          restaurant: data.restaurant || { title: '', desc: '' },
          beach: data.beach || { title: '', desc: '' }
        };
        setSettings(sanitizedData);
      } catch (err: any) {
        setError(err.message || 'Error de conexión');
      } finally {
        setLoading(false);
      }
    }
    loadSettings();
  }, []);

  // Update iframe DOM when data and iframe are loaded
  useEffect(() => {
    if (iframeLoaded && settings && iframeRef.current?.contentWindow) {
      const doc = iframeRef.current.contentWindow.document;
      updateAllIframeElements(doc, settings);
      scrollToSection(doc, activeTab);
    }
  }, [iframeLoaded, settings]);

  // Inject all edits directly in iframe DOM
  const updateAllIframeElements = (doc: Document, s: Settings) => {
    // 1. Hero
    if (s.hero) {
      const titleEl = doc.getElementById('hero-title');
      if (titleEl) titleEl.innerHTML = `${s.hero.titleLine1 || ''}<br /><em>${s.hero.titleLine2 || ''}</em>`;
      
      const subtitleEl = doc.getElementById('hero-subtitle');
      if (subtitleEl) subtitleEl.textContent = s.hero.subtitle || '';
    }
    
    // 2. Services
    if (s.services) {
      const servicesTitleEl = doc.getElementById('services-title');
      if (servicesTitleEl) servicesTitleEl.textContent = s.services.title || '';
      
      const servicesDescEl = doc.getElementById('services-desc');
      if (servicesDescEl) servicesDescEl.textContent = s.services.desc || '';
    }
    
    // 3. About / Nosotros
    if (s.about) {
      const poolTitleEl = doc.getElementById('about-pool-title');
      if (poolTitleEl) poolTitleEl.innerHTML = `<span class="material-symbols-outlined">pool</span> ${s.about.poolTitle || ''}`;
      
      const poolDescEl = doc.getElementById('about-pool-desc');
      if (poolDescEl) poolDescEl.textContent = s.about.poolDesc || '';
      
      const serviceTitleEl = doc.getElementById('about-service-title');
      if (serviceTitleEl) serviceTitleEl.innerHTML = `<span class="material-symbols-outlined">volunteer_activism</span> ${s.about.serviceTitle || ''}`;
      
      const serviceDescEl = doc.getElementById('about-service-desc');
      if (serviceDescEl) serviceDescEl.textContent = s.about.serviceDesc || '';
    }
    
    // 4. Rooms
    if (s.rooms) {
      const roomPriceEl = doc.getElementById('room-price');
      if (roomPriceEl) roomPriceEl.textContent = `Desde ${s.rooms.priceFrom || ''} / noche`;
      
      const roomTitleEl = doc.getElementById('room-title');
      if (roomTitleEl) roomTitleEl.textContent = s.rooms.title || '';
      
      const roomDescEl = doc.getElementById('room-desc');
      if (roomDescEl) roomDescEl.textContent = s.rooms.description || '';
      
      const roomAmenitiesEl = doc.getElementById('room-amenities-list');
      if (roomAmenitiesEl && s.rooms.amenities && s.rooms.amenities.length > 0) {
        roomAmenitiesEl.innerHTML = s.rooms.amenities.map(amenity => `
          <li>
            <span class="material-symbols-outlined">check_circle</span> ${amenity}
          </li>
        `).join('');
      }
    }

    // 5. Restaurant
    if (s.restaurant) {
      const restTitleEl = doc.getElementById('restaurant-title');
      if (restTitleEl) restTitleEl.textContent = s.restaurant.title || '';
      
      const restDescEl = doc.getElementById('restaurant-desc');
      if (restDescEl) restDescEl.textContent = s.restaurant.desc || '';
    }

    // 6. Beach Moments
    if (s.beach) {
      const beachTitleEl = doc.getElementById('beach-title');
      if (beachTitleEl) beachTitleEl.textContent = s.beach.title || '';
      
      const beachDescEl = doc.getElementById('beach-desc');
      if (beachDescEl) beachDescEl.textContent = s.beach.desc || '';
    }
    
    // 7. Location
    if (s.location) {
      const locationTitleEl = doc.getElementById('location-title');
      if (locationTitleEl) locationTitleEl.textContent = s.location.title || '';
      
      const locationDescEl = doc.getElementById('location-desc');
      if (locationDescEl) locationDescEl.textContent = s.location.desc || '';
    }
  };

  // Smooth scroll iframe viewport to edited block
  const scrollToSection = (doc: Document, tab: ActiveTab) => {
    if (!iframeRef.current?.contentWindow) return;
    
    const sectionIds = {
      hero: 'top',
      services: 'servicios',
      rooms: 'habitaciones',
      about: 'detalles',
      restaurant: 'restaurante',
      beach: 'playa',
      location: 'ubicacion'
    };
    
    if (tab === 'hero') {
      iframeRef.current.contentWindow.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      const sectionId = sectionIds[tab];
      const el = doc.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  };

  const handleTabChange = (tab: ActiveTab) => {
    setActiveTab(tab);
    if (iframeLoaded && iframeRef.current?.contentWindow) {
      scrollToSection(iframeRef.current.contentWindow.document, tab);
    }
  };

  // Immediate hot updates
  const handleFieldChange = (
    section: 'hero' | 'about' | 'rooms' | 'location' | 'services' | 'restaurant' | 'beach',
    field: string,
    value: string
  ) => {
    if (!settings) return;
    const updatedSettings = {
      ...settings,
      [section]: {
        ...settings[section],
        [field]: value
      }
    };
    setSettings(updatedSettings);

    if (iframeRef.current?.contentWindow) {
      const doc = iframeRef.current.contentWindow.document;
      
      if (section === 'hero' && (field === 'titleLine1' || field === 'titleLine2')) {
        const el = doc.getElementById('hero-title');
        if (el) {
          const l1 = field === 'titleLine1' ? value : settings.hero.titleLine1;
          const l2 = field === 'titleLine2' ? value : settings.hero.titleLine2;
          el.innerHTML = `${l1}<br /><em>${l2}</em>`;
        }
      } else if (section === 'hero' && field === 'subtitle') {
        const el = doc.getElementById('hero-subtitle');
        if (el) el.textContent = value;
      } else if (section === 'services' && field === 'title') {
        const el = doc.getElementById('services-title');
        if (el) el.textContent = value;
      } else if (section === 'services' && field === 'desc') {
        const el = doc.getElementById('services-desc');
        if (el) el.textContent = value;
      } else if (section === 'about' && field === 'poolTitle') {
        const el = doc.getElementById('about-pool-title');
        if (el) el.innerHTML = `<span class="material-symbols-outlined">pool</span> ${value}`;
      } else if (section === 'about' && field === 'poolDesc') {
        const el = doc.getElementById('about-pool-desc');
        if (el) el.textContent = value;
      } else if (section === 'about' && field === 'serviceTitle') {
        const el = doc.getElementById('about-service-title');
        if (el) el.innerHTML = `<span class="material-symbols-outlined">volunteer_activism</span> ${value}`;
      } else if (section === 'about' && field === 'serviceDesc') {
        const el = doc.getElementById('about-service-desc');
        if (el) el.textContent = value;
      } else if (section === 'rooms' && field === 'priceFrom') {
        const el = doc.getElementById('room-price');
        if (el) el.textContent = `Desde ${value} / noche`;
      } else if (section === 'rooms' && field === 'title') {
        const el = doc.getElementById('room-title');
        if (el) el.textContent = value;
      } else if (section === 'rooms' && field === 'description') {
        const el = doc.getElementById('room-desc');
        if (el) el.textContent = value;
      } else if (section === 'restaurant' && field === 'title') {
        const el = doc.getElementById('restaurant-title');
        if (el) el.textContent = value;
      } else if (section === 'restaurant' && field === 'desc') {
        const el = doc.getElementById('restaurant-desc');
        if (el) el.textContent = value;
      } else if (section === 'beach' && field === 'title') {
        const el = doc.getElementById('beach-title');
        if (el) el.textContent = value;
      } else if (section === 'beach' && field === 'desc') {
        const el = doc.getElementById('beach-desc');
        if (el) el.textContent = value;
      } else if (section === 'location' && field === 'title') {
        const el = doc.getElementById('location-title');
        if (el) el.textContent = value;
      } else if (section === 'location' && field === 'desc') {
        const el = doc.getElementById('location-desc');
        if (el) el.textContent = value;
      }
    }
  };

  const updateIframeAmenities = (amenities: string[]) => {
    if (iframeRef.current?.contentWindow) {
      const doc = iframeRef.current.contentWindow.document;
      const el = doc.getElementById('room-amenities-list');
      if (el) {
        el.innerHTML = amenities.map(amenity => `
          <li>
            <span class="material-symbols-outlined">check_circle</span> ${amenity}
          </li>
        `).join('');
      }
    }
  };

  const handleAddAmenity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings || !newAmenity.trim()) return;
    
    const updatedAmenities = [...(settings.rooms.amenities || []), newAmenity.trim()];
    setSettings({
      ...settings,
      rooms: {
        ...settings.rooms,
        amenities: updatedAmenities
      }
    });
    setNewAmenity('');
    updateIframeAmenities(updatedAmenities);
  };

  const handleRemoveAmenity = (index: number) => {
    if (!settings) return;
    const updatedAmenities = (settings.rooms.amenities || []).filter((_, i) => i !== index);
    setSettings({
      ...settings,
      rooms: {
        ...settings.rooms,
        amenities: updatedAmenities
      }
    });
    updateIframeAmenities(updatedAmenities);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;
    
    setSaving(true);
    setSuccessMsg(null);
    setError(null);
    
    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings),
      });
      
      if (!res.ok) throw new Error('Error al guardar las modificaciones.');
      const data = await res.json();
      setSettings(data);
      setSuccessMsg('¡Cambios guardados con éxito! Los textos se han actualizado de forma permanente en la base de datos.');
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (err: any) {
      setError(err.message || 'Error de conexión');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-12 text-center">
        <div className="inline-block w-8 h-8 border-4 border-slate-200 border-t-emerald-500 rounded-full animate-spin"></div>
        <p className="text-slate-500 text-sm mt-4">Cargando Live Editor...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Editor del Sitio en Vivo</h1>
          <p className="text-sm text-slate-500 mt-1">
            Modifica cualquier texto y observa los resultados instantáneamente en la vista real del sitio de producción.
          </p>
        </div>
      </div>

      {successMsg && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-6 py-4 rounded-xl text-sm font-semibold animate-fadeIn">
          {successMsg}
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl text-sm font-semibold">
          {error}
        </div>
      )}

      {/* Grid: Forms Left / Iframe Right */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-stretch">
        
        {/* LEFT Panel (spans 5 cols) */}
        <div className="xl:col-span-5 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between min-h-[620px]">
          
          <div className="space-y-6">
            {/* Tabs Selector */}
            <div className="flex border-b border-slate-205 pb-2.5 overflow-x-auto gap-2 scrollbar-none">
              {(['hero', 'services', 'rooms', 'about', 'restaurant', 'beach', 'location'] as const).map((tab) => {
                const labels = {
                  hero: 'Hero',
                  services: 'Servicios',
                  rooms: 'Habitaciones',
                  about: 'Nosotros',
                  restaurant: 'Restaurante',
                  beach: 'Playa',
                  location: 'Ubicación'
                };
                const isActive = activeTab === tab;
                return (
                  <button
                    key={tab}
                    onClick={() => handleTabChange(tab)}
                    className={`px-3.5 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                      isActive
                        ? 'bg-slate-800 text-white shadow-md'
                        : 'bg-slate-50 text-slate-500 hover:text-slate-800 hover:bg-slate-100'
                    }`}
                  >
                    {labels[tab]}
                  </button>
                );
              })}
            </div>

            {/* Form Fields */}
            <div className="space-y-4">
              
              {/* HERO */}
              {activeTab === 'hero' && settings && (
                <div className="space-y-4 animate-fadeIn">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Título - Línea 1 (Texto plano)</label>
                    <input
                      type="text"
                      value={settings.hero.titleLine1}
                      onChange={(e) => handleFieldChange('hero', 'titleLine1', e.target.value)}
                      placeholder="Ej. Hotel"
                      className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Título - Línea 2 / Cursiva (Texto plano)</label>
                    <input
                      type="text"
                      value={settings.hero.titleLine2}
                      onChange={(e) => handleFieldChange('hero', 'titleLine2', e.target.value)}
                      placeholder="Ej. Palmeira's Tuxpan Beach"
                      className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Lema o Subtítulo</label>
                    <textarea
                      value={settings.hero.subtitle}
                      onChange={(e) => handleFieldChange('hero', 'subtitle', e.target.value)}
                      placeholder="Escribe la invitación..."
                      rows={4}
                      className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:outline-none"
                    />
                  </div>
                </div>
              )}

              {/* SERVICES */}
              {activeTab === 'services' && settings && (
                <div className="space-y-4 animate-fadeIn">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Título de la Sección de Servicios</label>
                    <input
                      type="text"
                      value={settings.services.title}
                      onChange={(e) => handleFieldChange('services', 'title', e.target.value)}
                      placeholder="Vive y disfruta la naturaleza"
                      className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Descripción de la Sección</label>
                    <textarea
                      value={settings.services.desc}
                      onChange={(e) => handleFieldChange('services', 'desc', e.target.value)}
                      placeholder="Escribe la descripción general..."
                      rows={5}
                      className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:outline-none"
                    />
                  </div>
                </div>
              )}

              {/* ROOMS */}
              {activeTab === 'rooms' && settings && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Precio Desde</label>
                      <input
                        type="text"
                        value={settings.rooms.priceFrom}
                        onChange={(e) => handleFieldChange('rooms', 'priceFrom', e.target.value)}
                        placeholder="Ej. $1,599 MXN"
                        className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Título de Habitación</label>
                      <input
                        type="text"
                        value={settings.rooms.title}
                        onChange={(e) => handleFieldChange('rooms', 'title', e.target.value)}
                        placeholder="Ej. Descanso y tranquilidad"
                        className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:outline-none"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Descripción</label>
                    <textarea
                      value={settings.rooms.description}
                      onChange={(e) => handleFieldChange('rooms', 'description', e.target.value)}
                      placeholder="Describe la habitación..."
                      rows={3}
                      className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:outline-none"
                    />
                  </div>
                  
                  {/* Amenities */}
                  <div className="space-y-3">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">Amenidades</label>
                    <form onSubmit={handleAddAmenity} className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Nueva amenidad (ej. Caja fuerte)"
                        value={newAmenity}
                        onChange={(e) => setNewAmenity(e.target.value)}
                        className="flex-1 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:outline-none"
                      />
                      <button
                        type="submit"
                        className="px-3 py-1.5 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded-lg cursor-pointer"
                      >
                        Añadir
                      </button>
                    </form>
                    <div className="flex flex-wrap gap-2 pt-1">
                      {settings.rooms.amenities && settings.rooms.amenities.length > 0 ? (
                        settings.rooms.amenities.map((amenity, idx) => (
                          <span
                            key={idx}
                            className="inline-flex items-center gap-1.5 text-xs bg-slate-100 hover:bg-red-50 hover:text-red-700 text-slate-700 font-medium px-2.5 py-1 rounded-md border border-slate-200 transition-colors cursor-pointer group"
                            onClick={() => handleRemoveAmenity(idx)}
                          >
                            {amenity}
                            <span className="text-[10px] text-slate-400 group-hover:text-red-500 font-bold">&times;</span>
                          </span>
                        ))
                      ) : (
                        <p className="text-[11px] text-slate-400 italic">No hay amenidades registradas.</p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* ABOUT */}
              {activeTab === 'about' && settings && (
                <div className="space-y-4 animate-fadeIn">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Título de Alberca</label>
                    <input
                      type="text"
                      value={settings.about.poolTitle}
                      onChange={(e) => handleFieldChange('about', 'poolTitle', e.target.value)}
                      placeholder="La Alberca"
                      className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Descripción Alberca (Chukum)</label>
                    <textarea
                      value={settings.about.poolDesc}
                      onChange={(e) => handleFieldChange('about', 'poolDesc', e.target.value)}
                      placeholder="Detalla la alberca..."
                      rows={3}
                      className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:outline-none"
                    />
                  </div>
                  <div className="border-t border-slate-100 pt-3">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Título de Trato al Cliente</label>
                    <input
                      type="text"
                      value={settings.about.serviceTitle}
                      onChange={(e) => handleFieldChange('about', 'serviceTitle', e.target.value)}
                      placeholder="Atención de su personal"
                      className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Descripción Trato al Cliente</label>
                    <textarea
                      value={settings.about.serviceDesc}
                      onChange={(e) => handleFieldChange('about', 'serviceDesc', e.target.value)}
                      placeholder="Detalla el trato del personal..."
                      rows={3}
                      className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:outline-none"
                    />
                  </div>
                </div>
              )}

              {/* RESTAURANT */}
              {activeTab === 'restaurant' && settings && (
                <div className="space-y-4 animate-fadeIn">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Título del Restaurante</label>
                    <input
                      type="text"
                      value={settings.restaurant.title}
                      onChange={(e) => handleFieldChange('restaurant', 'title', e.target.value)}
                      placeholder="Restaurante Xanat, Beach & Food"
                      className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Descripción Culinaria</label>
                    <textarea
                      value={settings.restaurant.desc}
                      onChange={(e) => handleFieldChange('restaurant', 'desc', e.target.value)}
                      placeholder="Describe la experiencia de restaurante..."
                      rows={6}
                      className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:outline-none"
                    />
                  </div>
                </div>
              )}

              {/* BEACH */}
              {activeTab === 'beach' && settings && (
                <div className="space-y-4 animate-fadeIn">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Título Momentos Playa</label>
                    <input
                      type="text"
                      value={settings.beach.title}
                      onChange={(e) => handleFieldChange('beach', 'title', e.target.value)}
                      placeholder="Momentos en la Playa"
                      className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Descripción Experiencia Playa</label>
                    <textarea
                      value={settings.beach.desc}
                      onChange={(e) => handleFieldChange('beach', 'desc', e.target.value)}
                      placeholder="Describe los atardeceres y playa..."
                      rows={6}
                      className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:outline-none"
                    />
                  </div>
                </div>
              )}

              {/* LOCATION */}
              {activeTab === 'location' && settings && (
                <div className="space-y-4 animate-fadeIn">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Título de Ubicación</label>
                    <input
                      type="text"
                      value={settings.location.title}
                      onChange={(e) => handleFieldChange('location', 'title', e.target.value)}
                      placeholder="Ubicación"
                      className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Descripción de Proximidad</label>
                    <textarea
                      value={settings.location.desc}
                      onChange={(e) => handleFieldChange('location', 'desc', e.target.value)}
                      placeholder="Describe la proximidad al mar y centro..."
                      rows={6}
                      className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:outline-none"
                    />
                  </div>
                </div>
              )}

            </div>
          </div>

          {/* Submit */}
          <div className="pt-4 border-t border-slate-100 mt-6 flex justify-end">
            <button
              onClick={handleSubmit}
              disabled={saving}
              className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold uppercase tracking-wider rounded-xl cursor-pointer shadow-md transition-all disabled:opacity-50"
            >
              {saving ? 'Guardando...' : 'Guardar Modificaciones'}
            </button>
          </div>

        </div>

        {/* RIGHT Panel: Iframe Preview */}
        <div className="xl:col-span-7 bg-slate-900 rounded-2xl p-4 border border-slate-800 shadow-xl overflow-hidden self-stretch flex flex-col min-h-[620px]">
          {/* Browser Bar */}
          <div className="flex items-center justify-between bg-slate-950 px-4 py-2 rounded-t-xl border-b border-slate-900 shrink-0 select-none">
            <div className="flex gap-1.5">
              <span className="w-3 h-3 rounded-full bg-rose-500"></span>
              <span className="w-3 h-3 rounded-full bg-amber-500"></span>
              <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
            </div>
            <div className="bg-slate-900 text-slate-400 text-[10px] px-8 py-0.5 rounded-md w-72 truncate text-center font-mono">
              http://localhost:3000/landing.html
            </div>
            <div className="flex gap-1.5 items-center text-slate-500 text-[10px]">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>LIVE PREVIEW</span>
            </div>
          </div>

          {/* Iframe wrapper */}
          <div className="flex-1 bg-white rounded-b-xl overflow-hidden relative">
            <iframe
              id="landing-preview-iframe"
              ref={iframeRef}
              src="/landing.html"
              className="w-full h-full border-none outline-none"
              onLoad={() => setIframeLoaded(true)}
            />
            
            {!iframeLoaded && (
              <div className="absolute inset-0 bg-slate-950 flex flex-col justify-center items-center gap-3">
                <div className="w-6 h-6 border-2 border-slate-800 border-t-emerald-500 rounded-full animate-spin"></div>
                <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Cargando Landing Page...</span>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
