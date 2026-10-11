"use client";

import React from 'react';
import { HeartHandshake, ExternalLink, Sparkles, Award } from 'lucide-react';
import { INITIAL_SUPPORTERS } from '@/lib/mockData';

export default function SupportersSection() {
  return (
    <section id="apoiadores" className="relative py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto z-10">
      {/* Cabeçalho */}
      <div className="text-center space-y-4 mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-lycoris-950/70 border border-gothic-gold/30 text-gothic-gold text-xs font-semibold uppercase tracking-widest">
          <Award className="w-3.5 h-3.5" />
          Gratidão e Parcerias
        </div>
        <h2 className="font-serif text-3xl sm:text-5xl font-bold text-white tracking-tight">
          Nossos <span className="text-gothic-gold">Apoiadores</span>
        </h2>
        <div className="flex items-center justify-center gap-3">
          <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-gothic-gold" />
          <div className="w-2 h-2 rotate-45 bg-gothic-gold shadow-gold-glow" />
          <div className="h-[1px] w-12 bg-gradient-to-l from-transparent to-gothic-gold" />
        </div>
        <p className="font-sans text-zinc-400 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
          Expressamos nossa sincera admiração aos criadores e projetos que apoiam as noites e o desenvolvimento contínuo da comunidade Lycoris Garden.
        </p>
      </div>

      {/* Cards de Apoiadores Oficiais */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {INITIAL_SUPPORTERS.map((supporter) => (
          <div
            key={supporter.name}
            className="group relative rounded-2xl bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 border border-zinc-800 hover:border-gothic-gold/50 p-8 flex flex-col justify-between transition-all duration-300 hover:shadow-gold-glow hover:-translate-y-1"
          >
            {/* Brilho Dourado Sutil */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gothic-gold/5 rounded-full blur-3xl group-hover:bg-gothic-gold/15 transition-all" />

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-zinc-900 border border-gothic-gold/30 text-gothic-gold">
                  {supporter.role}
                </span>
                <Sparkles className="w-4 h-4 text-gothic-gold/70" />
              </div>

              <h3 className="font-serif text-3xl font-bold text-white group-hover:text-gothic-gold transition-colors">
                {supporter.name}
              </h3>

              <p className="font-sans text-sm text-zinc-300 leading-relaxed">
                {supporter.tagline}
              </p>
            </div>

            <div className="pt-6 mt-6 border-t border-zinc-800">
              <a
                href={supporter.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm font-semibold text-gothic-gold hover:text-white transition-colors group-hover:translate-x-1 duration-200"
              >
                <span>Conhecer Projeto</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
