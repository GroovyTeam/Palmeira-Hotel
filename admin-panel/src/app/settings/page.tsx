'use client';

import React, { useState, useEffect } from 'react';

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
    qna?: Array<{
      id: string;
      keywords: string;
      response: string;
    }>;
  };
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function loadSettings() {
      try {
        const res = await fetch('/api/settings');
        if (!res.ok) throw new Error('No se pudieron cargar los ajustes.');
        const data = await res.json();
        const sanitized = {
          ...data,
          chatbot: {
            enabled: true,
            botName: 'Asistente Palmeira',
            welcomeMsg: '',
            qna: [],
            ...(data.chatbot || {})
          }
        };
        setSettings(sanitized);
      } catch (err: any) {
        setError(err.message || 'Error de conexión');
      } finally {
        setLoading(false);
      }
    }
    loadSettings();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (!settings) return;
    const { name, value } = e.target;
    
    if (name.startsWith('socials.')) {
      const field = name.split('.')[1];
      setSettings({
        ...settings,
        socials: {
          ...settings.socials,
          [field]: value
        }
      });
    } else if (name.startsWith('chatbot.')) {
      const field = name.split('.')[1];
      setSettings({
        ...settings,
        chatbot: {
          ...settings.chatbot,
          [field]: value
        }
      });
    } else {
      setSettings({
        ...settings,
        [name]: value
      });
    }
  };

  const handleChatbotToggle = () => {
    if (!settings) return;
    setSettings({
      ...settings,
      chatbot: {
        ...settings.chatbot,
        enabled: !settings.chatbot.enabled
      }
    });
  };

  const handleWaChatbotToggle = () => {
    if (!settings) return;
    setSettings({
      ...settings,
      chatbot: {
        ...settings.chatbot,
        waBotEnabled: !settings.chatbot.waBotEnabled
      }
    });
  };

  const handleAddQna = () => {
    if (!settings) return;
    const currentQna = settings.chatbot.qna || [];
    const newQnaItem = {
      id: `qna_${Math.random().toString(36).substr(2, 9)}`,
      keywords: '',
      response: ''
    };
    setSettings({
      ...settings,
      chatbot: {
        ...settings.chatbot,
        qna: [...currentQna, newQnaItem]
      }
    });
  };

  const handleRemoveQna = (index: number) => {
    if (!settings) return;
    const currentQna = settings.chatbot.qna || [];
    const updatedQna = currentQna.filter((_, idx) => idx !== index);
    setSettings({
      ...settings,
      chatbot: {
        ...settings.chatbot,
        qna: updatedQna
      }
    });
  };

  const handleQnaChange = (index: number, field: 'keywords' | 'response', value: string) => {
    if (!settings) return;
    const currentQna = [...(settings.chatbot.qna || [])];
    currentQna[index] = {
      ...currentQna[index],
      [field]: value
    };
    setSettings({
      ...settings,
      chatbot: {
        ...settings.chatbot,
        qna: currentQna
      }
    });
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
      
      if (!res.ok) throw new Error('Error al guardar ajustes.');
      const data = await res.json();
      setSettings(data);
      setSuccessMsg('Ajustes guardados correctamente. Los cambios se reflejarán en la landing page.');
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
        <p className="text-slate-500 text-sm mt-4">Cargando configuraciones...</p>
      </div>
    );
  }

  if (error && !settings) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 p-6 rounded-2xl text-center">
        <p className="font-semibold">Error al cargar configuraciones</p>
        <p className="text-sm mt-1">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
        <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Ajustes del Sitio Web</h1>
        <p className="text-sm text-slate-500 mt-1">
          Configura los horarios de check-in/out, enlaces de redes sociales y estado del asistente virtual.
        </p>
      </div>

      {successMsg && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-6 py-4 rounded-xl text-sm font-semibold">
          {successMsg}
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl text-sm font-semibold">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Horarios & Contacto */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-6">
          <h2 className="text-lg font-bold text-slate-800 border-b pb-3 border-slate-100">Horarios y Contacto</h2>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Check-in Time</label>
              <input
                type="text"
                name="checkin"
                value={settings?.checkin || ''}
                onChange={handleChange}
                placeholder="15:00"
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Check-out Time</label>
              <input
                type="text"
                name="checkout"
                value={settings?.checkout || ''}
                onChange={handleChange}
                placeholder="12:00"
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:outline-none"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">WhatsApp de Reservaciones</label>
            <input
              type="text"
              name="whatsapp"
              value={settings?.whatsapp || ''}
              onChange={handleChange}
              placeholder="527731758654"
              className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:outline-none"
              required
            />
            <p className="text-[10px] text-slate-400 mt-1.5">Ingrese el número con código de país, sin espacios (ej. México 52).</p>
          </div>
        </div>

        {/* Redes Sociales */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-6">
          <h2 className="text-lg font-bold text-slate-800 border-b pb-3 border-slate-100">Redes Sociales (Enlaces Activos)</h2>
          
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Enlace de Instagram</label>
            <input
              type="url"
              name="socials.instagram"
              value={settings?.socials?.instagram || ''}
              onChange={handleChange}
              placeholder="https://instagram.com/nombre"
              className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Enlace de Facebook</label>
            <input
              type="url"
              name="socials.facebook"
              value={settings?.socials?.facebook || ''}
              onChange={handleChange}
              placeholder="https://facebook.com/nombre"
              className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Asistente Chatbot */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-8 lg:col-span-2">
          {/* Web Chatbot Sub-section */}
          <div className="space-y-6">
            <div className="flex justify-between items-center border-b pb-3 border-slate-100">
              <h2 className="text-lg font-bold text-slate-800">Asistente Virtual (Web Chatbot)</h2>
              <button
                type="button"
                onClick={handleChatbotToggle}
                className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all border cursor-pointer ${
                  settings?.chatbot?.enabled
                    ? 'bg-emerald-100 border-emerald-300 text-emerald-700'
                    : 'bg-slate-100 border-slate-200 text-slate-500'
                }`}
              >
                {settings?.chatbot?.enabled ? 'Activo' : 'Desactivado'}
              </button>
            </div>

            {settings?.chatbot?.enabled && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fadeIn">
                <div className="md:col-span-1">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Nombre del Bot</label>
                  <input
                    type="text"
                    name="chatbot.botName"
                    value={settings?.chatbot?.botName || ''}
                    onChange={handleChange}
                    placeholder="Asistente Palmeira"
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:outline-none"
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Mensaje de Bienvenida</label>
                  <textarea
                    name="chatbot.welcomeMsg"
                    value={settings?.chatbot?.welcomeMsg || ''}
                    onChange={handleChange}
                    placeholder="Escribe el saludo inicial..."
                    rows={3}
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:outline-none"
                    required
                  />
                </div>
              </div>
            )}
          </div>

          {/* WhatsApp Chatbot Sub-section */}
          <div className="space-y-6 pt-6 border-t border-slate-100">
            <div className="flex justify-between items-center border-b pb-3 border-slate-100">
              <div>
                <h2 className="text-lg font-bold text-slate-800">Chatbot de WhatsApp (WA Bot)</h2>
                <p className="text-xs text-slate-400 mt-0.5">Controla la simulación y respuestas automáticas del bot de mensajería.</p>
              </div>
              <button
                type="button"
                onClick={handleWaChatbotToggle}
                className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all border cursor-pointer ${
                  settings?.chatbot?.waBotEnabled
                    ? 'bg-emerald-100 border-emerald-300 text-emerald-700'
                    : 'bg-slate-100 border-slate-200 text-slate-500'
                }`}
              >
                {settings?.chatbot?.waBotEnabled ? 'Activo' : 'Desactivado'}
              </button>
            </div>

            {settings?.chatbot?.waBotEnabled && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fadeIn">
                <div className="md:col-span-3">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Mensaje Automatizado de Bienvenida WA</label>
                  <textarea
                    name="chatbot.waWelcomeMsg"
                    value={settings?.chatbot?.waWelcomeMsg || ''}
                    onChange={handleChange}
                    placeholder="Escribe el mensaje que el bot de WhatsApp responderá automáticamente..."
                    rows={3}
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:outline-none"
                    required
                  />
                </div>
              </div>
            )}
          </div>
          
          {/* Chatbot Q&A Manager */}
          {settings?.chatbot?.enabled && (
            <div className="border-t border-slate-100 pt-6 mt-6 space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-bold text-slate-800">Preguntas Frecuentes y Respuestas (Asistente Web)</h3>
                  <p className="text-xs text-slate-400 mt-0.5">Controla qué responde el bot según las palabras clave del usuario.</p>
                </div>
                <button
                  type="button"
                  onClick={handleAddQna}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold uppercase tracking-wider rounded-xl cursor-pointer flex items-center gap-1.5 shadow-sm"
                >
                  <span className="text-sm font-semibold">+</span> Agregar Respuesta
                </button>
              </div>
              
              <div className="space-y-4">
                {(settings.chatbot.qna || []).map((item, idx) => (
                  <div key={item.id || idx} className="bg-slate-50 p-4 rounded-2xl border border-slate-200 relative space-y-3">
                    <button
                      type="button"
                      onClick={() => handleRemoveQna(idx)}
                      className="absolute top-4 right-4 text-slate-400 hover:text-red-500 font-bold text-sm cursor-pointer transition-colors"
                      title="Eliminar esta respuesta"
                    >
                      ✕
                    </button>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pr-6">
                      <div className="md:col-span-1">
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Palabras Clave (por coma)</label>
                        <input
                          type="text"
                          value={item.keywords}
                          onChange={(e) => handleQnaChange(idx, 'keywords', e.target.value)}
                          placeholder="ej. horario, hora, check-in"
                          className="w-full px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:outline-none"
                          required
                        />
                      </div>
                      <div className="md:col-span-3">
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Respuesta Automática del Asistente</label>
                        <textarea
                          value={item.response}
                          onChange={(e) => handleQnaChange(idx, 'response', e.target.value)}
                          placeholder="Escribe lo que el bot responderá si detecta las palabras clave..."
                          rows={2}
                          className="w-full px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:outline-none"
                          required
                        />
                      </div>
                    </div>
                  </div>
                ))}
                {(settings.chatbot.qna || []).length === 0 && (
                  <div className="text-center py-6 bg-slate-50 border border-dashed border-slate-200 rounded-2xl">
                    <p className="text-xs text-slate-400 italic">No hay respuestas personalizadas registradas. El bot redirigirá a WhatsApp por defecto.</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="lg:col-span-2 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-bold uppercase tracking-wider rounded-xl cursor-pointer shadow-md transition-all disabled:opacity-50"
          >
            {saving ? 'Guardando...' : 'Guardar Ajustes'}
          </button>
        </div>
      </form>
    </div>
  );
}
