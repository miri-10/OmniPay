'use client';

import { useEffect, useRef, useState } from 'react';

interface Star {
  x: number;
  y: number;
  size: number;
  opacity: number;
  twinkleSpeed: number;
  twinklePhase: number;
}

const CinematicBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const stars: Star[] = [];
    for (let i = 0; i < 150; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height * 0.7,
        size: Math.random() * 1.5 + 0.5,
        opacity: Math.random() * 0.5 + 0.2,
        twinkleSpeed: Math.random() * 0.02 + 0.005,
        twinklePhase: Math.random() * Math.PI * 2
      });
    }

    let animationId: number;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const time = Date.now() * 0.001;

      const centerX = canvas.width / 2 + (mousePos.x - canvas.width / 2) * 0.1;
      const gradient = ctx.createRadialGradient(
        centerX, canvas.height * 0.9, 0,
        centerX, canvas.height * 0.9, canvas.height * 0.8
      );
      gradient.addColorStop(0, 'rgba(79, 70, 229, 0.12)');
      gradient.addColorStop(0.3, 'rgba(124, 58, 237, 0.06)');
      gradient.addColorStop(0.6, 'rgba(139, 92, 246, 0.03)');
      gradient.addColorStop(1, 'transparent');
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
      ctx.lineWidth = 1;
      
      const horizonY = canvas.height * 0.75;
      const vanishX = canvas.width / 2;
      
      for (let i = -20; i <= 20; i++) {
        const bottomX = vanishX + i * 80;
        const topX = vanishX + i * 15;
        ctx.beginPath();
        ctx.moveTo(topX, horizonY);
        ctx.lineTo(bottomX, canvas.height);
        ctx.stroke();
      }
      
      for (let i = 0; i < 12; i++) {
        const y = horizonY + Math.pow(i / 12, 2) * (canvas.height - horizonY);
        const spread = (i / 12) * canvas.width;
        ctx.beginPath();
        ctx.moveTo(vanishX - spread, y);
        ctx.lineTo(vanishX + spread, y);
        ctx.stroke();
      }

      stars.forEach((star) => {
        const twinkle = Math.sin(time * star.twinkleSpeed * 10 + star.twinklePhase);
        const currentOpacity = star.opacity * (0.5 + twinkle * 0.5);
        
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${currentOpacity})`;
        ctx.fill();

        if (star.size > 1) {
          ctx.beginPath();
          ctx.arc(star.x, star.y, star.size * 2, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, ${currentOpacity * 0.15})`;
          ctx.fill();
        }
      });

      animationId = requestAnimationFrame(render);
    };

    render();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationId);
    };
  }, [mousePos]);

  return (
    <>
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-0" />
      <div className="portal-glow" />
    </>
  );
};

export default CinematicBackground;
