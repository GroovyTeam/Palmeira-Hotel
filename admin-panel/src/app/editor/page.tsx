'use client';

import React, { useState, useEffect, useRef } from 'react';

interface Settings {
  email: string;
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
    bgImage?: string;
  };
  about: {
    poolTitle: string;
    poolDesc: string;
    serviceTitle: string;
    serviceDesc: string;
    poolImage?: string;
    serviceImage?: string;
  };
  rooms: {
    list: Array<{
      id: string;
      title: string;
      priceFrom: string;
      description: string;
      amenities: string[];
      imageSrc: string;
    }>;
  };
  location: {
    title: string;
    desc: string;
  };
  services: {
    title: string;
    desc: string;
    list: Array<{
      id: string;
      icon: string;
      title: string;
      description: string;
    }>;
  };
  restaurant: {
    title: string;
    desc: string;
    image?: string;
  };
  beach: {
    title: string;
    desc: string;
    image?: string;
  };
  footer: {
    brand: string;
    copy: string;
  };
}

type ActiveTab = 'hero' | 'services' | 'rooms' | 'about' | 'restaurant' | 'beach' | 'location' | 'contact-footer';

export default function LiveEditor() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [galleryItems, setGalleryItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Active edit tab and selected room tracker
  const [activeTab, setActiveTab] = useState<ActiveTab>('hero');
  const [selectedRoomIndex, setSelectedRoomIndex] = useState<number>(0);
  const [newRoomAmenity, setNewRoomAmenity] = useState('');
  
  // Iframe tracking
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Load configuration and gallery items
  useEffect(() => {
    async function loadData() {
      try {
        const resSettings = await fetch('/api/settings');
        if (!resSettings.ok) throw new Error('No se pudieron cargar los datos del sitio.');
        const data = await resSettings.json();
        
        // Ensure defaults exist for all layout nodes
        const sanitizedData: Settings = {
          ...data,
          email: data.email || 'hotelpalmeira@gmail.com',
          hero: data.hero || { titleLine1: '', titleLine2: '', subtitle: '', bgImage: '' },
          about: data.about || { poolTitle: '', poolDesc: '', serviceTitle: '', serviceDesc: '', poolImage: '', serviceImage: '' },
          rooms: data.rooms || { list: [] },
          location: data.location || { title: '', desc: '' },
          services: data.services || { title: '', desc: '', list: [] },
          restaurant: data.restaurant || { title: '', desc: '', image: '' },
          beach: data.beach || { title: '', desc: '', image: '' },
          footer: data.footer || { brand: '', copy: '' }
        };
        setSettings(sanitizedData);

        // Fetch gallery items
        const resGallery = await fetch('/api/gallery');
        if (resGallery.ok) {
          const gallery = await resGallery.json();
          setGalleryItems(gallery || []);
        }
      } catch (err: any) {
        setError(err.message || 'Error de conexión');
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Update iframe DOM when data and iframe are loaded
  useEffect(() => {
    if (iframeLoaded && settings && iframeRef.current?.contentWindow) {
      const doc = iframeRef.current.contentWindow.document;
      updateAllIframeElements(doc, settings);
      scrollToSection(doc, activeTab);
    }
  }, [iframeLoaded, settings, activeTab]);

  // Inject all edits directly in iframe DOM
  const updateAllIframeElements = (doc: Document, s: Settings) => {
    // 1. Hero Text & Background
    if (s.hero) {
      const titleEl = doc.getElementById('hero-title');
      if (titleEl) titleEl.innerHTML = `${s.hero.titleLine1 || ''}<br /><em>${s.hero.titleLine2 || ''}</em>`;
      
      const subtitleEl = doc.getElementById('hero-subtitle');
      if (subtitleEl) subtitleEl.textContent = s.hero.subtitle || '';

      const heroHeaderEl = doc.getElementById('top');
      if (heroHeaderEl && s.hero.bgImage) {
        heroHeaderEl.style.backgroundImage = `linear-gradient(rgba(25, 28, 28, 0.4), rgba(25, 28, 28, 0.4)), url('${s.hero.bgImage}')`;
      }
    }
    
    // 2. Services Section (Title, Desc & Dynamic Grid)
    if (s.services) {
      const servicesTitleEl = doc.getElementById('services-title');
      if (servicesTitleEl) servicesTitleEl.textContent = s.services.title || '';
      
      const servicesDescEl = doc.getElementById('services-desc');
      if (servicesDescEl) servicesDescEl.textContent = s.services.desc || '';

      const grid = doc.getElementById('services-grid');
      if (grid && s.services.list && s.services.list.length > 0) {
        grid.innerHTML = s.services.list.map(srv => `
          <div class="service-card">
            <div class="service-icon">
              <span class="material-symbols-outlined">${srv.icon || 'star'}</span>
            </div>
            <h3>${srv.title || ''}</h3>
            <p>${srv.description || ''}</p>
          </div>
        `).join('');
      }
    }
    
    // 3. About / Nosotros (Texts & Images)
    if (s.about) {
      const poolTitleEl = doc.getElementById('about-pool-title');
      if (poolTitleEl) poolTitleEl.innerHTML = `<span class="material-symbols-outlined">pool</span> ${s.about.poolTitle || ''}`;
      
      const poolDescEl = doc.getElementById('about-pool-desc');
      if (poolDescEl) poolDescEl.textContent = s.about.poolDesc || '';
      
      const serviceTitleEl = doc.getElementById('about-service-title');
      if (serviceTitleEl) serviceTitleEl.innerHTML = `<span class="material-symbols-outlined">volunteer_activism</span> ${s.about.serviceTitle || ''}`;
      
      const serviceDescEl = doc.getElementById('about-service-desc');
      if (serviceDescEl) serviceDescEl.textContent = s.about.serviceDesc || '';

      const poolImg = doc.getElementById('experience-img-1') as HTMLImageElement;
      if (poolImg && s.about.poolImage) poolImg.src = s.about.poolImage;

      const serviceImg = doc.getElementById('experience-img-2') as HTMLImageElement;
      if (serviceImg && s.about.serviceImage) serviceImg.src = s.about.serviceImage;
    }
    
    // 4. Rooms (Dynamic Multi-room Showcase)
    if (s.rooms && s.rooms.list && s.rooms.list.length > 0) {
      const roomsContainer = doc.getElementById('rooms-container');
      if (roomsContainer) {
        roomsContainer.innerHTML = s.rooms.list.map((room, index) => {
          const amenitiesHTML = (room.amenities || []).map(a => `
            <li>
              <span class="material-symbols-outlined">check_circle</span> ${a}
            </li>
          `).join('');

          return `
            <div class="room-showcase" style="${index > 0 ? 'margin-top: 3.5rem; border-top: 1px solid rgba(57, 102, 99, 0.1); padding-top: 3.5rem;' : ''}">
              <div class="room-slider">
                <div class="slides">
                  <img class="active" src="${room.imageSrc || './public/img/recursos/room1.png'}" alt="${room.title}" />
                </div>
              </div>
              <div class="room-info">
                <div class="room-price">Desde ${room.priceFrom || ''} / noche</div>
                <h3>${room.title || ''}</h3>
                <p>${room.description || ''}</p>
                <ul class="room-amenities">
                  ${amenitiesHTML}
                </ul>
                <div class="room-schedules" style="margin: 1.2rem 0; display: flex; gap: 1.5rem; font-size: 0.9rem; color: var(--primary);">
                  <div>
                    <strong style="color: var(--tertiary);">Check-in:</strong> <span class="room-val-checkin">${s.checkin || '15:00'} hrs</span>
                  </div>
                  <div>
                    <strong style="color: var(--tertiary);">Check-out:</strong> <span class="room-val-checkout">${s.checkout || '12:00'} hrs</span>
                  </div>
                </div>
                <button class="btn-whatsapp" style="width:100%; border:none; outline:none; text-decoration:none; display:inline-flex; align-items:center; justify-content:center; gap:0.5rem; cursor:pointer;" onclick="document.getElementById('navReservar').click()">
                  <i class="fa-brands fa-whatsapp"></i>
                  Reservar por WhatsApp
                </button>
              </div>
            </div>
          `;
        }).join('');
      }
    }

    // 5. Restaurant
    if (s.restaurant) {
      const restTitleEl = doc.getElementById('restaurant-title');
      if (restTitleEl) restTitleEl.textContent = s.restaurant.title || '';
      
      const restDescEl = doc.getElementById('restaurant-desc');
      if (restDescEl) restDescEl.textContent = s.restaurant.desc || '';

      const restImg = doc.getElementById('restaurant-img') as HTMLImageElement;
      if (restImg && s.restaurant.image) restImg.src = s.restaurant.image;
    }

    // 6. Beach Moments
    if (s.beach) {
      const beachTitleEl = doc.getElementById('beach-title');
      if (beachTitleEl) beachTitleEl.textContent = s.beach.title || '';
      
      const beachDescEl = doc.getElementById('beach-desc');
      if (beachDescEl) beachDescEl.textContent = s.beach.desc || '';

      const beachImg = doc.getElementById('beach-img') as HTMLImageElement;
      if (beachImg && s.beach.image) beachImg.src = s.beach.image;
    }
    
    // 7. Location
    if (s.location) {
      const locationTitleEl = doc.getElementById('location-title');
      if (locationTitleEl) locationTitleEl.textContent = s.location.title || '';
      
      const locationDescEl = doc.getElementById('location-desc');
      if (locationDescEl) locationDescEl.textContent = s.location.desc || '';
    }

    // 8. Email
    const emailEl = doc.getElementById('contact-email-text');
    if (emailEl && s.email) emailEl.textContent = s.email;

    // 9. Footer Brand & Copyright Copy
    if (s.footer) {
      const footerBrandEl = doc.getElementById('footer-brand');
      if (footerBrandEl && s.footer.brand) footerBrandEl.textContent = s.footer.brand;

      const footerCopyEl = doc.getElementById('footer-copy');
      if (footerCopyEl && s.footer.copy) footerCopyEl.textContent = s.footer.copy;
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
      location: 'ubicacion',
      'contact-footer': 'contacto'
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

  // Simple field updates
  const handleFieldChange = (section: string, field: string, value: string) => {
    if (!settings) return;
    setSettings({
      ...settings,
      [section]: {
        ...(settings as any)[section],
        [field]: value
      }
    });
  };

  // File Upload Helper to convert local files to base64
  const handleFileUpload = (callback: (base64: string) => void) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          callback(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Image Selector layout
  const ImageSelector = ({ label, value, onChange }: { label: string, value: string, onChange: (val: string) => void }) => (
    <div className="space-y-2 border border-slate-100 p-3 rounded-xl bg-slate-50">
      <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">{label}</label>
      <div className="flex gap-2">
        <input
          type="text"
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Ruta de imagen (ej. ./public/img/...)"
          className="flex-1 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500"
        />
        <label className="px-3 py-1.5 bg-slate-800 hover:bg-slate-900 text-white text-[10px] font-bold uppercase tracking-wider rounded-lg cursor-pointer flex items-center justify-center whitespace-nowrap">
          <span>Subir Archivo</span>
          <input type="file" accept="image/*" onChange={handleFileUpload(onChange)} className="hidden" />
        </label>
      </div>
      {galleryItems.length > 0 && (
        <div className="flex flex-col gap-1">
          <label className="block text-[9px] uppercase tracking-wider text-slate-400 font-semibold">O importar desde Galería:</label>
          <select
            onChange={(e) => {
              if (e.target.value) {
                onChange(e.target.value);
                e.target.value = '';
              }
            }}
            className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs focus:outline-none"
          >
            <option value="">-- Seleccionar imagen --</option>
            {galleryItems.map((item: any) => (
              <option key={item.id} value={item.src}>{item.alt || item.src}</option>
            ))}
          </select>
        </div>
      )}
      {value && (
        <div className="mt-2 relative w-20 h-14 rounded-lg border overflow-hidden bg-slate-100">
          <img src={value} alt="Preview" className="w-full h-full object-cover" />
        </div>
      )}
    </div>
  );

  // SERVICES HANDLERS
  const handleServiceChange = (index: number, field: string, value: string) => {
    if (!settings) return;
    const currentList = [...(settings.services.list || [])];
    currentList[index] = {
      ...currentList[index],
      [field]: value
    };
    setSettings({
      ...settings,
      services: {
        ...settings.services,
        list: currentList
      }
    });
  };

  const handleAddService = () => {
    if (!settings) return;
    const currentList = settings.services.list || [];
    const newService = {
      id: `srv_${Math.random().toString(36).substr(2, 9)}`,
      icon: 'star',
      title: 'Nuevo Servicio',
      description: 'Escribe la descripción de tu servicio aquí.'
    };
    setSettings({
      ...settings,
      services: {
        ...settings.services,
        list: [...currentList, newService]
      }
    });
  };

  const handleRemoveService = (index: number) => {
    if (!settings) return;
    const currentList = settings.services.list || [];
    const updated = currentList.filter((_, idx) => idx !== index);
    setSettings({
      ...settings,
      services: {
        ...settings.services,
        list: updated
      }
    });
  };

  // ROOMS HANDLERS
  const handleRoomChange = (index: number, field: string, value: any) => {
    if (!settings) return;
    const currentList = [...(settings.rooms.list || [])];
    currentList[index] = {
      ...currentList[index],
      [field]: value
    };
    setSettings({
      ...settings,
      rooms: {
        ...settings.rooms,
        list: currentList
      }
    });
  };

  const handleAddRoom = () => {
    if (!settings) return;
    const currentList = settings.rooms.list || [];
    const newRoom = {
      id: `room_${Date.now()}`,
      title: 'Nueva Habitación',
      priceFrom: '$1,599 MXN',
      description: 'Habitación confortable con amenidades de lujo.',
      amenities: ['Cama acogedora', 'Limpieza', 'Wi-Fi de alta velocidad'],
      imageSrc: './public/img/recursos/room1.png'
    };
    const updated = [...currentList, newRoom];
    setSettings({
      ...settings,
      rooms: {
        ...settings.rooms,
        list: updated
      }
    });
    setSelectedRoomIndex(updated.length - 1);
  };

  const handleRemoveRoom = (index: number) => {
    if (!settings) return;
    const currentList = settings.rooms.list || [];
    if (currentList.length <= 1) {
      alert("Debe mantener al menos una habitación en el sitio.");
      return;
    }
    const updated = currentList.filter((_, idx) => idx !== index);
    setSettings({
      ...settings,
      rooms: {
        ...settings.rooms,
        list: updated
      }
    });
    setSelectedRoomIndex(0);
  };

  const handleAddRoomAmenity = (roomIdx: number, e: React.FormEvent) => {
    e.preventDefault();
    if (!settings || !newRoomAmenity.trim()) return;
    
    const room = (settings.rooms.list || [])[roomIdx];
    if (!room) return;
    const updatedAmenities = [...(room.amenities || []), newRoomAmenity.trim()];
    handleRoomChange(roomIdx, 'amenities', updatedAmenities);
    setNewRoomAmenity('');
  };

  const handleRemoveRoomAmenity = (roomIdx: number, amenityIdx: number) => {
    if (!settings) return;
    const room = (settings.rooms.list || [])[roomIdx];
    if (!room) return;
    const updatedAmenities = (room.amenities || []).filter((_, idx) => idx !== amenityIdx);
    handleRoomChange(roomIdx, 'amenities', updatedAmenities);
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
      setSuccessMsg('¡Cambios guardados con éxito! Los textos e imágenes se han actualizado en producción.');
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
            Modifica cualquier texto, imagen o listado y observa los resultados instantáneamente en el previsualizador.
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
            <div className="flex border-b border-slate-200 pb-2.5 overflow-x-auto gap-2 scrollbar-none">
              {(['hero', 'services', 'rooms', 'about', 'restaurant', 'beach', 'location', 'contact-footer'] as const).map((tab) => {
                const labels = {
                  hero: 'Hero',
                  services: 'Servicios',
                  rooms: 'Habitaciones',
                  about: 'Nosotros',
                  restaurant: 'Restaurante',
                  beach: 'Playa',
                  location: 'Ubicación',
                  'contact-footer': 'Contacto/Footer'
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
            <div className="space-y-4 max-h-[500px] overflow-y-auto pr-1">
              
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
                      rows={3}
                      className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:outline-none"
                    />
                  </div>
                  <ImageSelector
                    label="Imagen de Fondo de Hero"
                    value={settings.hero.bgImage || ''}
                    onChange={(val) => handleFieldChange('hero', 'bgImage', val)}
                  />
                </div>
              )}

              {/* SERVICES */}
              {activeTab === 'services' && settings && (
                <div className="space-y-4 animate-fadeIn">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Título de la Sección</label>
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
                      rows={3}
                      className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:outline-none"
                    />
                  </div>
                  
                  {/* Dynamic Services List */}
                  <div className="border-t border-slate-100 pt-4 space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">Listado de Servicios</h3>
                      <button
                        type="button"
                        onClick={handleAddService}
                        className="px-2.5 py-1 bg-slate-800 hover:bg-slate-900 text-white text-[10px] font-bold uppercase rounded-lg cursor-pointer"
                      >
                        + Agregar Servicio
                      </button>
                    </div>

                    <div className="space-y-4">
                      {(settings.services.list || []).map((srv, idx) => (
                        <div key={srv.id || idx} className="bg-slate-50 border border-slate-200 p-3 rounded-xl relative space-y-2.5">
                          <button
                            type="button"
                            onClick={() => handleRemoveService(idx)}
                            className="absolute top-2 right-2 text-slate-400 hover:text-red-500 font-bold text-xs cursor-pointer"
                          >
                            ✕
                          </button>
                          <div className="grid grid-cols-3 gap-2 pr-4">
                            <div className="col-span-1">
                              <label className="block text-[9px] font-bold uppercase text-slate-400 mb-1">Icono</label>
                              <select
                                value={srv.icon}
                                onChange={(e) => handleServiceChange(idx, 'icon', e.target.value)}
                                className="w-full px-2 py-1 bg-white border border-slate-200 rounded-lg text-xs"
                              >
                                <option value="location_on">Ubicación</option>
                                <option value="pool">Alberca</option>
                                <option value="restaurant">Restaurante</option>
                                <option value="local_parking">Parking</option>
                                <option value="wifi">Wi-Fi</option>
                                <option value="brunch_dining">Desayuno</option>
                                <option value="beach_access">Playa</option>
                                <option value="ac_unit">Clima</option>
                                <option value="tv">Televisión</option>
                                <option value="key">Llave</option>
                                <option value="star">Estrella</option>
                              </select>
                            </div>
                            <div className="col-span-2">
                              <label className="block text-[9px] font-bold uppercase text-slate-400 mb-1">Título del Servicio</label>
                              <input
                                type="text"
                                value={srv.title}
                                onChange={(e) => handleServiceChange(idx, 'title', e.target.value)}
                                placeholder="Ej. Wi-Fi"
                                className="w-full px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-xs"
                              />
                            </div>
                          </div>
                          <div>
                            <label className="block text-[9px] font-bold uppercase text-slate-400 mb-1">Descripción</label>
                            <textarea
                              value={srv.description}
                              onChange={(e) => handleServiceChange(idx, 'description', e.target.value)}
                              placeholder="Ej. Conexión de alta velocidad gratis..."
                              rows={2}
                              className="w-full px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-xs"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* ROOMS */}
              {activeTab === 'rooms' && settings && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="flex justify-between items-center border-b pb-2">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">Gestor de Habitaciones</h3>
                    <button
                      type="button"
                      onClick={handleAddRoom}
                      className="px-2.5 py-1 bg-slate-800 hover:bg-slate-900 text-white text-[10px] font-bold uppercase rounded-lg cursor-pointer"
                    >
                      + Nueva Habitación
                    </button>
                  </div>

                  {/* Room Selector Tab buttons */}
                  <div className="flex gap-2 overflow-x-auto pb-1">
                    {(settings.rooms.list || []).map((room, idx) => (
                      <div key={room.id || idx} className="flex shrink-0">
                        <button
                          type="button"
                          onClick={() => setSelectedRoomIndex(idx)}
                          className={`px-3 py-1.5 text-xs font-bold rounded-lg border cursor-pointer transition-all ${
                            selectedRoomIndex === idx
                              ? 'bg-slate-800 border-slate-800 text-white'
                              : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                          }`}
                        >
                          Hab #{idx + 1}
                        </button>
                        {(settings.rooms.list || []).length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveRoom(idx)}
                            className="bg-red-50 text-red-500 border border-l-0 border-slate-200 hover:bg-red-100 px-1.5 rounded-r-lg font-bold text-xs"
                            title="Eliminar esta habitación"
                          >
                            &times;
                          </button>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Selected Room Editor Fields */}
                  {settings.rooms.list && settings.rooms.list[selectedRoomIndex] && (
                    <div className="space-y-4 bg-slate-50/50 p-4 rounded-xl border border-slate-150 animate-fadeIn">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Título de Habitación</label>
                          <input
                            type="text"
                            value={settings.rooms.list[selectedRoomIndex].title}
                            onChange={(e) => handleRoomChange(selectedRoomIndex, 'title', e.target.value)}
                            placeholder="Ej. Sencilla Confort"
                            className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Precio Desde</label>
                          <input
                            type="text"
                            value={settings.rooms.list[selectedRoomIndex].priceFrom}
                            onChange={(e) => handleRoomChange(selectedRoomIndex, 'priceFrom', e.target.value)}
                            placeholder="Ej. $1,599 MXN"
                            className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs focus:outline-none"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Descripción</label>
                        <textarea
                          value={settings.rooms.list[selectedRoomIndex].description}
                          onChange={(e) => handleRoomChange(selectedRoomIndex, 'description', e.target.value)}
                          placeholder="Describe la habitación..."
                          rows={2.5}
                          className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs focus:outline-none"
                        />
                      </div>

                      {/* Image selector for selected room */}
                      <ImageSelector
                        label="Imagen de Habitación"
                        value={settings.rooms.list[selectedRoomIndex].imageSrc}
                        onChange={(val) => handleRoomChange(selectedRoomIndex, 'imageSrc', val)}
                      />

                      {/* Selected Room Amenities */}
                      <div className="space-y-2.5 pt-2 border-t border-slate-200">
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">Amenidades de esta Habitación</label>
                        <form onSubmit={(e) => handleAddRoomAmenity(selectedRoomIndex, e)} className="flex gap-2">
                          <input
                            type="text"
                            placeholder="Nueva amenidad (ej. Caja fuerte)"
                            value={newRoomAmenity}
                            onChange={(e) => setNewRoomAmenity(e.target.value)}
                            className="flex-1 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs focus:outline-none"
                          />
                          <button
                            type="submit"
                            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded-lg cursor-pointer"
                          >
                            Añadir
                          </button>
                        </form>
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {(settings.rooms.list[selectedRoomIndex].amenities || []).map((amenity, idx) => (
                            <span
                              key={idx}
                              className="inline-flex items-center gap-1.5 text-[11px] bg-white hover:bg-red-50 hover:text-red-700 text-slate-700 font-medium px-2 py-0.5 rounded border border-slate-200 transition-colors cursor-pointer group"
                              onClick={() => handleRemoveRoomAmenity(selectedRoomIndex, idx)}
                            >
                              {amenity}
                              <span className="text-[9px] text-slate-400 group-hover:text-red-500 font-bold">&times;</span>
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
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
                  <ImageSelector
                    label="Imagen Alberca"
                    value={settings.about.poolImage || ''}
                    onChange={(val) => handleFieldChange('about', 'poolImage', val)}
                  />

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
                  <ImageSelector
                    label="Imagen Atención Personal"
                    value={settings.about.serviceImage || ''}
                    onChange={(val) => handleFieldChange('about', 'serviceImage', val)}
                  />
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
                      rows={4}
                      className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:outline-none"
                    />
                  </div>
                  <ImageSelector
                    label="Imagen del Restaurante"
                    value={settings.restaurant.image || ''}
                    onChange={(val) => handleFieldChange('restaurant', 'image', val)}
                  />
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
                      rows={4}
                      className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:outline-none"
                    />
                  </div>
                  <ImageSelector
                    label="Imagen Sección Playa"
                    value={settings.beach.image || ''}
                    onChange={(val) => handleFieldChange('beach', 'image', val)}
                  />
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
                      placeholder="Describe la proximidad al mar..."
                      rows={4}
                      className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:outline-none"
                    />
                  </div>
                </div>
              )}

              {/* CONTACT & FOOTER */}
              {activeTab === 'contact-footer' && settings && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Correo de Contacto</label>
                      <input
                        type="email"
                        value={settings.email}
                        onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                        placeholder="contacto@hotelpalmeira.com"
                        className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">WhatsApp de Reservas</label>
                      <input
                        type="text"
                        value={settings.whatsapp}
                        onChange={(e) => setSettings({ ...settings, whatsapp: e.target.value })}
                        placeholder="527731758654"
                        className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Hora Check-in</label>
                      <input
                        type="text"
                        value={settings.checkin}
                        onChange={(e) => setSettings({ ...settings, checkin: e.target.value })}
                        placeholder="15:00"
                        className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Hora Check-out</label>
                      <input
                        type="text"
                        value={settings.checkout}
                        onChange={(e) => setSettings({ ...settings, checkout: e.target.value })}
                        placeholder="12:00"
                        className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                      />
                    </div>
                  </div>

                  <div className="border-t border-slate-100 pt-3">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Título de Marca en Footer</label>
                    <input
                      type="text"
                      value={settings.footer?.brand || ''}
                      onChange={(e) => handleFieldChange('footer', 'brand', e.target.value)}
                      placeholder="Palmeira's Tuxpan Beach..."
                      className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Texto de Copyright Footer</label>
                    <textarea
                      value={settings.footer?.copy || ''}
                      onChange={(e) => handleFieldChange('footer', 'copy', e.target.value)}
                      placeholder="© 2025 Hotel Palmeira's..."
                      rows={2}
                      className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
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
