import React, { useEffect, useRef } from 'react';

interface PetalCanvasProps {
  enabled?: boolean;
  style?: 'sakura' | 'white-rose' | 'golden';
  speed?: number;
}

interface Petal {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  rotation: number;
  rotationSpeed: number;
  tiltAngle: number;
  tiltSpeed: number;
  opacity: number;
  color: string;
  petalType: number; // 0 or 1 for shape variation
}

export const PetalCanvas: React.FC<PetalCanvasProps> = ({
  enabled = true,
  style = 'sakura',
  speed = 1,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!enabled) return;
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

    // Get color palette based on style
    const getColors = () => {
      switch (style) {
        case 'white-rose':
          return [
            'rgba(255, 255, 255, 0.85)',
            'rgba(250, 248, 245, 0.8)',
            'rgba(242, 238, 233, 0.75)',
            'rgba(255, 240, 245, 0.65)',
          ];
        case 'golden':
          return [
            'rgba(243, 229, 185, 0.75)',
            'rgba(235, 215, 160, 0.7)',
            'rgba(250, 242, 220, 0.85)',
            'rgba(212, 185, 125, 0.6)',
          ];
        case 'sakura':
        default:
          return [
            'rgba(255, 220, 228, 0.78)',
            'rgba(255, 235, 240, 0.85)',
            'rgba(250, 205, 218, 0.7)',
            'rgba(255, 245, 247, 0.9)',
          ];
      }
    };

    const colors = getColors();

    // Initialize petals (mobile: 24 petals, desktop: 40 petals for gentle elegance)
    const petalCount = window.innerWidth < 768 ? 24 : 38;
    const petals: Petal[] = [];

    for (let i = 0; i < petalCount; i++) {
      petals.push({
        x: Math.random() * width,
        y: Math.random() * height - height,
        size: Math.random() * 8 + 9, // 9 - 17px
        speedX: (Math.random() - 0.5) * 0.8 * speed,
        speedY: (Math.random() * 0.9 + 0.6) * speed,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.02,
        tiltAngle: Math.random() * Math.PI,
        tiltSpeed: Math.random() * 0.02 + 0.008,
        opacity: Math.random() * 0.4 + 0.5,
        color: colors[Math.floor(Math.random() * colors.length)],
        petalType: Math.random() > 0.5 ? 1 : 0,
      });
    }

    let wind = 0;
    let windTarget = 0;
    let stepCount = 0;

    const drawPetal = (p: Petal) => {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation);
      const scaleX = Math.sin(p.tiltAngle);
      ctx.scale(scaleX, 1);

      ctx.fillStyle = p.color;
      ctx.beginPath();

      if (p.petalType === 0) {
        // Organic curved sakura petal shape
        ctx.moveTo(0, -p.size);
        ctx.bezierCurveTo(p.size * 0.7, -p.size * 0.7, p.size * 0.9, p.size * 0.4, 0, p.size);
        ctx.bezierCurveTo(-p.size * 0.9, p.size * 0.4, -p.size * 0.7, -p.size * 0.7, 0, -p.size);
      } else {
        // Soft rounded rose/floral petal shape
        ctx.moveTo(0, -p.size * 0.8);
        ctx.quadraticCurveTo(p.size * 0.8, -p.size * 0.2, p.size * 0.5, p.size * 0.9);
        ctx.quadraticCurveTo(0, p.size * 0.6, -p.size * 0.5, p.size * 0.9);
        ctx.quadraticCurveTo(-p.size * 0.8, -p.size * 0.2, 0, -p.size * 0.8);
      }

      ctx.fill();

      // Subtle delicate center vein highlight
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.lineWidth = 0.5;
      ctx.beginPath();
      ctx.moveTo(0, -p.size * 0.6);
      ctx.lineTo(0, p.size * 0.5);
      ctx.stroke();

      ctx.restore();
    };

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      stepCount++;
      if (stepCount % 120 === 0) {
        windTarget = (Math.random() - 0.4) * 0.8;
      }
      wind += (windTarget - wind) * 0.01;

      for (let i = 0; i < petals.length; i++) {
        const p = petals[i];

        // Update physics
        p.tiltAngle += p.tiltSpeed;
        p.rotation += p.rotationSpeed;
        p.y += p.speedY;
        p.x += p.speedX + wind + Math.sin(p.tiltAngle) * 0.5;

        // Wrap around bottom/edges
        if (p.y > height + 20) {
          p.y = -20;
          p.x = Math.random() * width;
        }
        if (p.x > width + 20) {
          p.x = -20;
        } else if (p.x < -20) {
          p.x = width + 20;
        }

        drawPetal(p);
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [enabled, style, speed]);

  if (!enabled) return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-30 overflow-hidden"
      style={{ opacity: 0.9 }}
      aria-hidden="true"
    />
  );
};
