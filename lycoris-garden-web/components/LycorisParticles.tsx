"use client";

import React, { useEffect, useRef } from 'react';

interface Petal {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  rotation: number;
  rotationSpeed: number;
  opacity: number;
  oscillationSpeed: number;
  oscillationDistance: number;
  oscillationStep: number;
  color: string;
}

export default function LycorisParticles() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    // Paleta de pétalas Lycoris Radiata
    const petalColors = [
      'rgba(225, 29, 72, ',   // Vermelho Lycoris (#E11D48)
      'rgba(190, 18, 60, ',   // Carmesim Profundo (#BE123C)
      'rgba(153, 12, 26, ',   // Vermelho Brandkit (#990C1A)
      'rgba(255, 42, 85, ',   // Vermelho Brilho Glow
      'rgba(218, 175, 55, ',  // Toques dourados de pólen (#DAAF37)
    ];

    const petalCount = Math.min(45, Math.floor(window.innerWidth / 30));
    const petals: Petal[] = [];

    for (let i = 0; i < petalCount; i++) {
      petals.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 8 + 6,
        speedX: Math.random() * 0.8 - 0.4,
        speedY: Math.random() * 1.2 + 0.6,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.03,
        opacity: Math.random() * 0.5 + 0.25,
        oscillationSpeed: Math.random() * 0.02 + 0.01,
        oscillationDistance: Math.random() * 1.5 + 0.5,
        oscillationStep: Math.random() * Math.PI * 2,
        color: petalColors[Math.floor(Math.random() * petalColors.length)],
      });
    }

    let mouseX = -1000;
    let mouseY = -1000;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    window.addEventListener('mousemove', handleMouseMove);

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < petals.length; i++) {
        const p = petals[i];

        // Atualização de posições com oscilação orgânica de vento
        p.oscillationStep += p.oscillationSpeed;
        p.x += p.speedX + Math.sin(p.oscillationStep) * p.oscillationDistance;
        p.y += p.speedY;
        p.rotation += p.rotationSpeed;

        // Efeito de repulsão suave do cursor do mouse
        const dx = p.x - mouseX;
        const dy = p.y - mouseY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          const force = (120 - dist) / 120;
          p.x += (dx / dist) * force * 3;
          p.y += (dy / dist) * force * 3;
        }

        // Reposicionar quando sair da tela
        if (p.y > height + 20) {
          p.y = -20;
          p.x = Math.random() * width;
        }
        if (p.x > width + 20) p.x = -20;
        if (p.x < -20) p.x = width + 20;

        // Desenhar forma estilizada de pétala de Red Spider Lily (Lycoris Radiata)
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);

        // Brilho sutil rubi
        ctx.shadowColor = 'rgba(225, 29, 72, 0.4)';
        ctx.shadowBlur = 6;

        ctx.fillStyle = p.color + p.opacity + ')';
        ctx.beginPath();
        // Curva Bezier para criar a silhueta graciosa e pontiaguda da pétala
        ctx.moveTo(0, -p.size);
        ctx.bezierCurveTo(p.size * 0.6, -p.size * 0.4, p.size * 0.8, p.size * 0.5, 0, p.size);
        ctx.bezierCurveTo(-p.size * 0.8, p.size * 0.5, -p.size * 0.6, -p.size * 0.4, 0, -p.size);
        ctx.fill();

        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-0 h-full w-full opacity-70"
      aria-hidden="true"
    />
  );
}
