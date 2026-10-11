import React from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import EventsSection from '@/components/EventsSection';
import GallerySection from '@/components/GallerySection';
import SupportersSection from '@/components/SupportersSection';
import Footer from '@/components/Footer';
import LycorisParticles from '@/components/LycorisParticles';
import { Moon, Sparkles, Compass, Shield, Heart } from 'lucide-react';

export default function HomePage() {
  return (
    <main className="relative min-h-screen flex flex-col bg-gothic-bg">
      {/* Camada Interativa de Pétalas de Lycoris Flutuando */}
      <LycorisParticles />

      {/* Barra de Navegação Superior */}
      <Navbar />

      {/* Banner Cinematográfico (Hero) */}
      <Hero />

      {/* Seção Sobre / Filosofia da Marca */}
      <section id="sobre" className="relative py-24 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto z-10">
        <div className="rounded-3xl bg-gradient-to-b from-zinc-900/80 to-zinc-950/90 border border-lycoris-900/40 p-8 sm:p-14 shadow-2xl backdrop-blur-md">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-lycoris-950 border border-lycoris-800/60 text-lycoris-300 text-xs font-semibold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-lycoris-400" />
                Manifesto da Comunidade
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white tracking-tight leading-tight">
                Um Jardim Carmesim Onde a <span className="text-lycoris-500">Arte e a Conexão</span> Florescem
              </h2>
              <p className="font-sans text-zinc-300 leading-relaxed text-sm sm:text-base">
                Inspirado na mística da flor <em>Lycoris Radiata</em> (Red Spider Lily), o <strong>Lycoris Garden</strong> nasceu como um santuário para usuários do VRChat que buscam escapar do ruído convencional. Valorizamos a calma noturna, o respeito mútuo e a celebração da beleza estética.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-xl bg-black/40 border border-zinc-800">
                  <div className="flex items-center gap-2 text-lycoris-400 font-serif font-bold text-sm">
                    <Moon className="w-4 h-4 text-lycoris-500" />
                    Atmosfera
                  </div>
                  <p className="text-xs text-zinc-400 mt-1.5 leading-relaxed">
                    Instâncias selecionadas, iluminação suave e trilhas sonoras imersivas.
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-black/40 border border-zinc-800">
                  <div className="flex items-center gap-2 text-gothic-gold font-serif font-bold text-sm">
                    <Compass className="w-4 h-4 text-gothic-gold" />
                    Diversão
                  </div>
                  <p className="text-xs text-zinc-400 mt-1.5 leading-relaxed">
                    Mais do que flores, criamos ambientes vivos para relaxar e trocar experiências.
                  </p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-full max-w-sm aspect-square rounded-2xl overflow-hidden border border-lycoris-600/40 shadow-lycoris-glow group">
                <img
                  src="/images/brand-guide.jpg"
                  alt="Guia de Marca Lycoris Garden"
                  className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent flex flex-col justify-end p-6">
                  <span className="text-[11px] uppercase tracking-widest text-lycoris-400 font-bold">
                    Identidade Visual
                  </span>
                  <span className="font-serif text-lg font-bold text-white">
                    Guia Oficial da Comunidade
                  </span>
                  <span className="text-xs text-zinc-300 mt-1">
                    Cores, tipografia e diretrizes de harmonia no metaverso.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Seção de Eventos Dinâmicos */}
      <EventsSection />

      {/* Seção da Galeria com Lightbox e Comentários */}
      <GallerySection />

      {/* Seção de Apoiadores (LupratuVR & Ph4nt0m) */}
      <SupportersSection />

      {/* Rodapé Oficial */}
      <Footer />
    </main>
  );
}
