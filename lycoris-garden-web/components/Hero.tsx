"use client";

import React from 'react';
import Image from 'next/image';
import { ExternalLink, Calendar, ChevronDown, Flame } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-24 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Imagem de Fundo com Vinheta e Gradiente Gótico */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/banner.jpg"
          alt="Lycoris Garden Banner"
          fill
          priority
          className="object-cover object-center opacity-30 filter brightness-75 contrast-125"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-gothic-bg/80 via-gothic-bg/70 to-gothic-bg" />
        <div className="absolute inset-0 bg-radial-vignette opacity-80" />
      </div>

      {/* Conteúdo Central */}
      <div className="relative z-10 max-w-5xl mx-auto text-center space-y-8">
        {/* Badge Místico */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-lycoris-950/80 border border-lycoris-700/50 backdrop-blur-md shadow-lycoris-glow animate-float">
          <Flame className="w-4 h-4 text-lycoris-500 animate-pulse" />
          <span className="text-xs uppercase tracking-widest text-lycoris-300 font-semibold">
            VRChat Community • Red Spider Lily
          </span>
        </div>

        {/* Título Principal */}
        <div className="space-y-4">
          <h1 className="font-serif text-5xl sm:text-7xl lg:text-8xl font-black tracking-tight text-white drop-shadow-2xl">
            LYCORIS <span className="text-transparent bg-clip-text bg-gradient-to-r from-lycoris-400 via-lycoris-500 to-lycoris-700">GARDEN</span>
          </h1>
          <p className="font-serif italic text-lg sm:text-2xl text-gothic-gold font-light tracking-wide max-w-2xl mx-auto drop-shadow">
            &ldquo;Lycoris‚ um jardim onde a vida e a morte se encontram.&rdquo;
          </p>
        </div>

        {/* Descrição da Comunidade */}
        <p className="font-sans text-base sm:text-lg text-zinc-300 max-w-2xl mx-auto leading-relaxed font-normal">
Instâncias com DJs
Sorteios
Eventos e atividades especiais
Uma comunidade para conhecer pessoas e criar memórias

Entre no jardim‚ e se torne um Lírio․
        </p>

        {/* Botões de Ação (CTAs) */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <a
            href="https://vrc.group/LYCORI.7672"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-xl bg-lycoris-600 hover:bg-lycoris-500 text-white font-semibold text-base shadow-lycoris-glow hover:shadow-lycoris-glow-lg transition-all duration-300 hover:scale-[1.02] border border-lycoris-400/40"
          >
            <span>Filiação ao Grupo no VRChat</span>
            <ExternalLink className="w-5 h-5 text-lycoris-200" />
          </a>

          <a
            href="#eventos"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-zinc-900/80 hover:bg-zinc-800 text-zinc-200 hover:text-white font-medium text-base border border-zinc-700/60 hover:border-lycoris-700/60 backdrop-blur-sm transition-all duration-300"
          >
            <Calendar className="w-5 h-5 text-lycoris-400" />
            <span>Ver Próximos Eventos</span>
          </a>
        </div>

        {/* Destaques / Estatísticas Rápidas */}
        <div className="pt-12 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
          <div className="p-4 rounded-xl bg-zinc-950/60 border border-zinc-800/80 backdrop-blur-sm">
            <div className="font-serif text-2xl sm:text-3xl font-bold text-lycoris-400">1.2K+</div>
            <div className="text-xs text-zinc-400 tracking-wider uppercase mt-1">Membros Ativos</div>
          </div>
          <div className="p-4 rounded-xl bg-zinc-950/60 border border-zinc-800/80 backdrop-blur-sm">
            <div className="font-serif text-2xl sm:text-3xl font-bold text-gothic-gold">80+</div>
            <div className="text-xs text-zinc-400 tracking-wider uppercase mt-1">Encontros Noturnos</div>
          </div>
          <div className="p-4 rounded-xl bg-zinc-950/60 border border-zinc-800/80 backdrop-blur-sm">
            <div className="font-serif text-2xl sm:text-3xl font-bold text-white">PC & Quest</div>
            <div className="text-xs text-zinc-400 tracking-wider uppercase mt-1">Suporte Híbrido</div>
          </div>
          <div className="p-4 rounded-xl bg-zinc-950/60 border border-zinc-800/80 backdrop-blur-sm">
            <div className="font-serif text-2xl sm:text-3xl font-bold text-lycoris-500">100%</div>
            <div className="text-xs text-zinc-400 tracking-wider uppercase mt-1">Atmosfera Gótica</div>
          </div>
        </div>

        {/* Indicador de Rolagem */}
        <div className="pt-8 flex justify-center">
          <a
            href="#sobre"
            className="text-zinc-500 hover:text-lycoris-400 transition-colors p-2 rounded-full hover:bg-zinc-900/50 animate-bounce"
            aria-label="Rolar para a seção sobre"
          >
            <ChevronDown className="w-6 h-6" />
          </a>
        </div>
      </div>
    </section>
  );
}
