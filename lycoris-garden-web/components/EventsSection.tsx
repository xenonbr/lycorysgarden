"use client";

import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, ExternalLink, Copy, Check, Sparkles, AlertCircle } from 'lucide-react';
import { VRChatEvent } from '@/lib/types';
import { INITIAL_EVENTS } from '@/lib/mockData';

export default function EventsSection() {
  const [events, setEvents] = useState<VRChatEvent[]>(INITIAL_EVENTS);
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    async function fetchEvents() {
      try {
        setLoading(true);
        const res = await fetch('/api/events');
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            setEvents(data);
          }
        }
      } catch (err) {
        console.warn('Usando eventos locais:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchEvents();
  }, []);

  const handleCopyLink = (url: string, id: string) => {
    if (!url) return;
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  return (
    <section id="eventos" className="relative py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto z-10">
      {/* Cabeçalho da Seção */}
      <div className="text-center space-y-4 mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-lycoris-950/70 border border-lycoris-800/40 text-lycoris-400 text-xs font-semibold uppercase tracking-widest">
          <Calendar className="w-3.5 h-3.5 text-lycoris-500" />
          Calendário de Instâncias
        </div>
        <h2 className="font-serif text-3xl sm:text-5xl font-bold text-white tracking-tight">
          Próximos <span className="text-lycoris-500">Eventos</span>
        </h2>
        <div className="flex items-center justify-center gap-3">
          <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-lycoris-600" />
          <div className="w-2 h-2 rotate-45 bg-lycoris-500 shadow-lycoris-glow" />
          <div className="h-[1px] w-12 bg-gradient-to-l from-transparent to-lycoris-600" />
        </div>
        <p className="font-sans text-zinc-400 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
          Nossas instâncias no VRChat são criadas com foco em ambientação sonora imersiva, estética noturna e convivência respeitosa. Verifique os horários e garanta sua presença.
        </p>
      </div>

      {/* Grid de Eventos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {events.map((event) => (
          <article
            key={event.id}
            className="group relative rounded-2xl bg-gradient-to-b from-zinc-900/90 to-zinc-950/90 border border-zinc-800/80 hover:border-lycoris-600/50 p-6 flex flex-col justify-between transition-all duration-300 hover:shadow-lycoris-glow hover:-translate-y-1 backdrop-blur-sm"
          >
            {/* Efeito Glow Interno */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-lycoris-600/10 rounded-full blur-3xl pointer-events-none group-hover:bg-lycoris-600/20 transition-all" />

            <div className="space-y-4">
              {/* Badges de Categoria e Data */}
              <div className="flex items-center justify-between gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-lycoris-950 border border-lycoris-800/60 text-lycoris-300">
                  {event.category || 'Encontro Oficial'}
                </span>
                <span className="flex items-center gap-1.5 text-xs text-gothic-gold font-medium">
                  <Clock className="w-3.5 h-3.5" />
                  {event.time}
                </span>
              </div>

              {/* Título do Evento */}
              <h3 className="font-serif text-2xl font-bold text-white group-hover:text-lycoris-300 transition-colors">
                {event.title}
              </h3>

              {/* Data e Local VRChat */}
              <div className="space-y-2 text-xs sm:text-sm text-zinc-400 pt-1">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-lycoris-500 shrink-0" />
                  <span>{new Date(event.date).toLocaleDateString('pt-BR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                </div>
                <div className="flex items-center gap-2 text-zinc-300">
                  <MapPin className="w-4 h-4 text-lycoris-500 shrink-0" />
                  <span className="font-medium text-white">{event.vrchat_world}</span>
                </div>
              </div>

              {/* Descrição */}
              <p className="font-sans text-xs sm:text-sm text-zinc-400 leading-relaxed line-clamp-3">
                {event.description}
              </p>
            </div>

            {/* Ações do Card */}
            <div className="pt-6 mt-6 border-t border-zinc-800/80 flex items-center justify-between gap-3">
              {event.world_url ? (
                <>
                  <a
                    href={event.world_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl bg-lycoris-700/80 hover:bg-lycoris-600 text-white text-xs font-semibold shadow-sm transition-all duration-200"
                  >
                    <span>Lançar Mundo</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>

                  <button
                    onClick={() => handleCopyLink(event.world_url || '', event.id)}
                    title="Copiar link da instância"
                    className="p-2.5 rounded-xl bg-zinc-800/70 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-colors"
                  >
                    {copiedId === event.id ? (
                      <Check className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </>
              ) : (
                <div className="w-full text-center text-xs text-zinc-500 italic py-2">
                  Link da instância liberado 30min antes
                </div>
              )}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
