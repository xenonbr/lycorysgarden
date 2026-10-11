"use client";

import React from 'react';
import Link from 'next/link';
import { ExternalLink, ShieldCheck, Heart, Moon } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="relative bg-black border-t border-zinc-900 text-zinc-400 font-sans z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Coluna 1: Sobre & Marca */}
          <div className="space-y-4 md:col-span-2">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-lycoris-900 flex items-center justify-center border border-lycoris-600/40 text-lycoris-300 font-serif font-bold text-sm">
                LG
              </div>
              <span className="font-serif text-xl font-bold text-white tracking-wider">
                LYCORIS <span className="text-lycoris-500">GARDEN</span>
              </span>
            </div>
            <p className="text-sm text-zinc-400 max-w-md leading-relaxed">
              Comunidade imersiva no VRChat dedicada à estética de Lycoris Radiata, encontros sob a lua cheia, artes visuais, avatares góticos e tranquilidade noturna.
            </p>
            <p className="font-serif italic text-xs text-lycoris-400/80">
              &ldquo;As flores de Lycoris florescem onde as almas se encontram sob o luar.&rdquo;
            </p>
          </div>

          {/* Coluna 2: Navegação Rápida */}
          <div className="space-y-3">
            <h4 className="font-serif text-sm font-semibold text-white uppercase tracking-wider">
              Navegação
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="hover:text-lycoris-400 transition-colors">
                  Início
                </Link>
              </li>
              <li>
                <Link href="#eventos" className="hover:text-lycoris-400 transition-colors">
                  Eventos
                </Link>
              </li>
              <li>
                <Link href="#galeria" className="hover:text-lycoris-400 transition-colors">
                  Galeria Comunitária
                </Link>
              </li>
              <li>
                <Link href="#apoiadores" className="hover:text-lycoris-400 transition-colors">
                  Apoiadores
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-lycoris-400 transition-colors">
                  Acesso Administrativo
                </Link>
              </li>
            </ul>
          </div>

          {/* Coluna 3: Links e Conexões */}
          <div className="space-y-3">
            <h4 className="font-serif text-sm font-semibold text-white uppercase tracking-wider">
              Conexões
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="https://vrc.group/LYCORI.7672"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 hover:text-lycoris-400 transition-colors"
                >
                  <span>Grupo no VRChat</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </li>
              <li>
                <a
                  href="https://lupratuvr.vercel.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 hover:text-gothic-gold transition-colors"
                >
                  <span>LupratuVR</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </li>
              <li>
                <a
                  href="https://ph4nt0m.carrd.co/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 hover:text-gothic-gold transition-colors"
                >
                  <span>Ph4nt0m Art</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Linha Inferior com Copyright & Diretrizes */}
        <div className="pt-10 mt-10 border-t border-zinc-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
          <div>
            &copy; {new Date().getFullYear()} Lycoris Garden. Todos os direitos reservados à comunidade.
          </div>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-zinc-400">
              <Moon className="w-3.5 h-3.5 text-lycoris-400" />
              Ambiente VRChat Noturno
            </span>
            <span>•</span>
            <span className="flex items-center gap-1 text-zinc-400">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              Diretrizes de Convivência Ativas
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
