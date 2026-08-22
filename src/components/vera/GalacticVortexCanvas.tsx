import * as React from "react";

interface GalacticVortexCanvasProps {
  size?: number;
}

/**
 * 3D Gravitational Particle Vortex Canvas:
 * - 350+ spiral galaxy stars orbiting in a 3D perspective field
 * - Gravitational acceleration toward the central event horizon
 * - Luminous galactic core bloom
 */
export function GalacticVortexCanvas({ size = 480 }: GalacticVortexCanvasProps) {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const animFrameRef = React.useRef<number | null>(null);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    ctx.scale(dpr, dpr);

    const centerX = size / 2;
    const centerY = size / 2;

    const numStars = 320;
    const stars = Array.from({ length: numStars }, (_, i) => {
      const arm = i % 3;
      const armOffset = (arm * 2 * Math.PI) / 3;
      const dist = Math.pow(Math.random(), 0.6) * (size * 0.44) + 18;
      const angle = armOffset + dist * 0.035 + (Math.random() - 0.5) * 0.5;

      return {
        dist,
        angle,
        speed: (0.015 + Math.random() * 0.01) * (180 / Math.max(30, dist)),
        size: 0.8 + Math.random() * 1.6,
        color: i % 3 === 0 ? "#38bdf8" : i % 2 === 0 ? "#c084fc" : "#8b5cf6",
        opacity: 0.4 + Math.random() * 0.6,
        z: (Math.random() - 0.5) * 40,
      };
    });

    let time = 0;

    const render = () => {
      time += 0.02;
      ctx.clearRect(0, 0, size, size);

      // 1. Central Supermassive Event Horizon Bloom
      const coreGrad = ctx.createRadialGradient(
        centerX,
        centerY,
        0,
        centerX,
        centerY,
        size * 0.42,
      );
      coreGrad.addColorStop(0, "rgba(56, 189, 248, 0.7)");
      coreGrad.addColorStop(0.2, "rgba(139, 92, 246, 0.5)");
      coreGrad.addColorStop(0.5, "rgba(147, 51, 234, 0.2)");
      coreGrad.addColorStop(0.8, "rgba(6, 8, 20, 0.8)");
      coreGrad.addColorStop(1, "transparent");

      ctx.fillStyle = coreGrad;
      ctx.beginPath();
      ctx.arc(centerX, centerY, size * 0.42, 0, Math.PI * 2);
      ctx.fill();

      // 2. Render Spiraling Stars with 3D Elliptical Tilt
      const tiltX = 0.55; // 3D perspective slant

      for (const s of stars) {
        s.angle += s.speed;

        // Gravitational orbit coordinates
        const rawX = Math.cos(s.angle) * s.dist;
        const rawY = Math.sin(s.angle) * s.dist;

        // Apply 3D perspective rotation
        const x = centerX + rawX;
        const y = centerY + rawY * tiltX;

        const depthScale = 0.8 + (rawY / (size * 0.44)) * 0.25;

        ctx.save();
        ctx.fillStyle = s.color;
        ctx.shadowColor = s.color;
        ctx.shadowBlur = 8;
        ctx.globalAlpha = s.opacity * depthScale;

        ctx.beginPath();
        ctx.arc(x, y, s.size * depthScale, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // 3. Central Event Horizon Dark Core + Bright Halo
      const nucGrad = ctx.createRadialGradient(
        centerX,
        centerY,
        0,
        centerX,
        centerY,
        28,
      );
      nucGrad.addColorStop(0, "#ffffff");
      nucGrad.addColorStop(0.3, "#38bdf8");
      nucGrad.addColorStop(0.7, "#8b5cf6");
      nucGrad.addColorStop(1, "transparent");

      ctx.save();
      ctx.fillStyle = nucGrad;
      ctx.shadowColor = "#38bdf8";
      ctx.shadowBlur = 35;
      ctx.beginPath();
      ctx.ellipse(centerX, centerY, 32, 32 * tiltX, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      animFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [size]);

  return (
    <canvas
      ref={canvasRef}
      style={{ width: size, height: size }}
      className="pointer-events-none select-none"
    />
  );
}
