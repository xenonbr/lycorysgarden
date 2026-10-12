"use client";

import React, { useEffect, useRef } from 'react';

type ParticleType = 'flower' | 'petal_stamen' | 'petal';

interface LycorisParticle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  rotation: number;
  rotationSpeed: number;
  tilt: number;
  tiltSpeed: number;
  opacity: number;
  type: ParticleType;
  oscillationStep: number;
  oscillationSpeed: number;
  oscillationDistance: number;
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

    // Conjunto de partículas temáticas de Lycoris Radiata
    const totalCount = Math.min(38, Math.floor(window.innerWidth / 35));
    const particles: LycorisParticle[] = [];

    for (let i = 0; i < totalCount; i++) {
      const rand = Math.random();
      // Distribuição: flores inteiras de Lycoris, pétalas com filamento e pétalas onduladas
      const type: ParticleType =
        rand < 0.25 ? 'flower' : rand < 0.65 ? 'petal_stamen' : 'petal';

      const baseSize = type === 'flower' ? Math.random() * 8 + 14 : Math.random() * 8 + 12;

      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: baseSize,
        speedX: Math.random() * 0.7 - 0.35,
        speedY: type === 'flower' ? Math.random() * 0.7 + 0.45 : Math.random() * 0.9 + 0.6,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.02,
        tilt: Math.random() * Math.PI * 2,
        tiltSpeed: Math.random() * 0.025 + 0.015,
        opacity: type === 'flower' ? Math.random() * 0.35 + 0.45 : Math.random() * 0.4 + 0.35,
        type,
        oscillationStep: Math.random() * Math.PI * 2,
        oscillationSpeed: Math.random() * 0.018 + 0.01,
        oscillationDistance: Math.random() * 1.6 + 0.8,
      });
    }

    let mouseX = -1000;
    let mouseY = -1000;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // 1. Desenho: Flor Completa de Lycoris Radiata (Red Spider Lily)
    const drawFlower = (p: LycorisParticle) => {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation);
      ctx.scale(Math.cos(p.tilt), 1); // Rotação 3D no ar

      ctx.shadowColor = 'rgba(225, 29, 72, 0.5)';
      ctx.shadowBlur = 8;

      const petals = 6;
      const petalLen = p.size * 1.5;
      const petalWidth = p.size * 0.32;
      const stamenCount = 7;
      const stamenLen = p.size * 2.3;

      // Estames longos e curvados característicos da flor-aranha
      ctx.strokeStyle = `rgba(255, 42, 85, ${p.opacity * 0.85})`;
      ctx.lineWidth = 1.1;

      for (let i = 0; i < stamenCount; i++) {
        const baseAngle = (i * Math.PI * 2) / stamenCount + 0.12;
        const endAngle = baseAngle + 0.42;

        ctx.beginPath();
        ctx.moveTo(0, 0);

        const cpX = Math.cos(baseAngle) * stamenLen * 0.45;
        const cpY = Math.sin(baseAngle) * stamenLen * 0.45;
        const endX = Math.cos(endAngle) * stamenLen;
        const endY = Math.sin(endAngle) * stamenLen;

        ctx.quadraticCurveTo(cpX, cpY, endX, endY);
        ctx.stroke();

        // Antera de pólen dourada brilhante na ponta
        ctx.fillStyle = `rgba(218, 175, 55, ${p.opacity * 0.95})`;
        ctx.beginPath();
        ctx.arc(endX, endY, 1.5, 0, Math.PI * 2);
        ctx.fill();
      }

      // 6 pétalas estreitas e onduladas
      for (let i = 0; i < petals; i++) {
        const angle = (i * Math.PI * 2) / petals;
        ctx.save();
        ctx.rotate(angle);

        ctx.fillStyle = `rgba(225, 29, 72, ${p.opacity * 0.9})`;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.bezierCurveTo(
          petalLen * 0.35,
          -petalWidth,
          petalLen * 0.75,
          -petalWidth * 0.5,
          petalLen,
          0
        );
        ctx.bezierCurveTo(
          petalLen * 0.75,
          petalWidth * 0.5,
          petalLen * 0.35,
          petalWidth,
          0,
          0
        );
        ctx.fill();

        // Linha central mais escura da pétala
        ctx.strokeStyle = `rgba(153, 12, 26, ${p.opacity * 0.7})`;
        ctx.lineWidth = 0.8;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(petalLen * 0.8, 0);
        ctx.stroke();

        ctx.restore();
      }

      // Centro carmesim
      ctx.fillStyle = `rgba(153, 12, 26, ${p.opacity})`;
      ctx.beginPath();
      ctx.arc(0, 0, p.size * 0.22, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    };

    // 2. Desenho: Pétala Graciosa com Filamento de Pólen
    const drawPetalWithStamen = (p: LycorisParticle) => {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation);
      ctx.scale(Math.cos(p.tilt), 1);

      ctx.shadowColor = 'rgba(225, 29, 72, 0.45)';
      ctx.shadowBlur = 6;

      const len = p.size * 1.8;
      const w = p.size * 0.45;

      // Filamento curvado com ponta dourada
      ctx.strokeStyle = `rgba(255, 42, 85, ${p.opacity * 0.8})`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(-len * 0.3, 0);
      ctx.quadraticCurveTo(len * 0.3, -w * 2, len * 1.1, -w * 0.8);
      ctx.stroke();

      ctx.fillStyle = `rgba(218, 175, 55, ${p.opacity * 0.9})`;
      ctx.beginPath();
      ctx.arc(len * 1.1, -w * 0.8, 1.4, 0, Math.PI * 2);
      ctx.fill();

      // Pétala ondulada
      ctx.fillStyle = `rgba(225, 29, 72, ${p.opacity * 0.85})`;
      ctx.beginPath();
      ctx.moveTo(-len * 0.4, 0);
      ctx.bezierCurveTo(-len * 0.1, -w, len * 0.4, -w * 0.8, len * 0.7, 0);
      ctx.bezierCurveTo(len * 0.4, w * 0.8, -len * 0.1, w, -len * 0.4, 0);
      ctx.fill();

      ctx.restore();
    };

    // 3. Desenho: Pétala Individual Ondulada
    const drawPetal = (p: LycorisParticle) => {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation);
      ctx.scale(Math.cos(p.tilt), 1);

      ctx.shadowColor = 'rgba(225, 29, 72, 0.4)';
      ctx.shadowBlur = 5;

      const len = p.size * 1.4;
      const w = p.size * 0.38;

      ctx.fillStyle = `rgba(190, 18, 60, ${p.opacity * 0.8})`;
      ctx.beginPath();
      ctx.moveTo(-len * 0.5, 0);
      ctx.bezierCurveTo(-len * 0.15, -w, len * 0.3, -w * 0.7, len * 0.6, 0);
      ctx.bezierCurveTo(len * 0.3, w * 0.7, -len * 0.15, w, -len * 0.5, 0);
      ctx.fill();

      ctx.restore();
    };

    // Loop de Animação
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        p.oscillationStep += p.oscillationSpeed;
        p.x += p.speedX + Math.sin(p.oscillationStep) * p.oscillationDistance;
        p.y += p.speedY;
        p.rotation += p.rotationSpeed;
        p.tilt += p.tiltSpeed;

        // Repulsão suave do cursor do mouse
        const dx = p.x - mouseX;
        const dy = p.y - mouseY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 130) {
          const force = (130 - dist) / 130;
          p.x += (dx / dist) * force * 3.5;
          p.y += (dy / dist) * force * 3.5;
        }

        // Reposicionar ao sair da tela
        if (p.y > height + 40) {
          p.y = -40;
          p.x = Math.random() * width;
        }
        if (p.x > width + 40) p.x = -40;
        if (p.x < -40) p.x = width + 40;

        if (p.type === 'flower') {
          drawFlower(p);
        } else if (p.type === 'petal_stamen') {
          drawPetalWithStamen(p);
        } else {
          drawPetal(p);
        }
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
      className="pointer-events-none fixed inset-0 z-0 h-full w-full opacity-80"
      aria-hidden="true"
    />
  );
}
