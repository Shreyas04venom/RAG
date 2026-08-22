import * as React from "react";

interface CosmicOrbCanvasProps {
  level?: number;
  active?: boolean;
  phase?: "idle" | "listening" | "processing" | "answer";
  size?: number;
}

/**
 * Native GPU-Accelerated Cosmic Orb Canvas:
 * - Mathematical multi-layer plasma accretion disc
 * - Orbiting cosmic dust particles with gravitational drift
 * - Electric violet (#8b5cf6) + cyan (#38bdf8) aurora glow
 * - Real-time audio reactive pulse expansion
 * 
 * Performance: Uses refs for rapidly-changing values (level, active, phase)
 * so the animation loop runs continuously without effect teardown/rebuild.
 */
export function CosmicOrbCanvas({
  level = 0,
  active = false,
  phase = "idle",
  size = 360,
}: CosmicOrbCanvasProps) {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const animFrameRef = React.useRef<number | null>(null);

  // Store rapidly-changing props in refs so the render loop reads them
  // without causing the useEffect to restart
  const levelRef = React.useRef(level);
  const activeRef = React.useRef(active);
  const phaseRef = React.useRef(phase);

  levelRef.current = level;
  activeRef.current = active;
  phaseRef.current = phase;

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Retina display scaling
    const dpr = typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    ctx.scale(dpr, dpr);

    const centerX = size / 2;
    const centerY = size / 2;
    const baseRadius = size * 0.28;

    // Particles system
    const numParticles = 45;
    const particles = Array.from({ length: numParticles }, (_, i) => ({
      angle: (i * 2 * Math.PI) / numParticles,
      distance: baseRadius * (1.1 + (i % 5) * 0.14),
      speed: 0.008 + (i % 3) * 0.004,
      size: 1.2 + (i % 4) * 0.8,
      color: i % 2 === 0 ? "#38bdf8" : i % 3 === 0 ? "#c084fc" : "#8b5cf6",
      opacity: 0.3 + (i % 5) * 0.15,
      pulseOffset: i * 0.4,
    }));

    let time = 0;

    const render = () => {
      time += 0.03;
      ctx.clearRect(0, 0, size, size);

      // Read current values from refs (no effect restart needed)
      const currentLevel = levelRef.current;
      const currentActive = activeRef.current;
      const currentPhase = phaseRef.current;

      const boost = currentPhase === "listening" ? Math.min(1, currentLevel * 2.5) : currentActive ? 0.35 : 0;
      const pulseScale = 1 + Math.sin(time * 2) * 0.04 + boost * 0.18;

      // 1. Ambient Background Core Bloom
      const ambientGrad = ctx.createRadialGradient(
        centerX,
        centerY,
        baseRadius * 0.2,
        centerX,
        centerY,
        size * 0.48,
      );
      ambientGrad.addColorStop(0, "rgba(139, 92, 246, 0.45)");
      ambientGrad.addColorStop(0.4, "rgba(56, 189, 248, 0.25)");
      ambientGrad.addColorStop(0.8, "rgba(236, 72, 153, 0.1)");
      ambientGrad.addColorStop(1, "transparent");

      ctx.fillStyle = ambientGrad;
      ctx.beginPath();
      ctx.arc(centerX, centerY, size * 0.48, 0, Math.PI * 2);
      ctx.fill();

      // 2. Concentric Orbit Rings
      for (let r = 0; r < 3; r++) {
        const ringRadius = (baseRadius * (1.25 + r * 0.22)) * pulseScale;
        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(time * (r % 2 === 0 ? 0.25 : -0.25));

        ctx.strokeStyle = r === 0 ? "rgba(56, 189, 248, 0.35)" : "rgba(139, 92, 246, 0.25)";
        ctx.lineWidth = 1.2;
        ctx.setLineDash([8, 14]);
        ctx.beginPath();
        ctx.arc(0, 0, ringRadius, 0, Math.PI * 2);
        ctx.stroke();

        // Orbit Marker Node
        const nodeAngle = time * (0.8 + r * 0.3);
        const nx = Math.cos(nodeAngle) * ringRadius;
        const ny = Math.sin(nodeAngle) * ringRadius;
        ctx.fillStyle = r === 0 ? "#38bdf8" : "#c084fc";
        ctx.shadowColor = r === 0 ? "#38bdf8" : "#8b5cf6";
        ctx.shadowBlur = 12;
        ctx.beginPath();
        ctx.arc(nx, ny, 2.5 + (r === 0 ? 1 : 0), 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // 3. Swirling Dust Particles
      for (const p of particles) {
        p.angle += p.speed * (currentPhase === "processing" ? 3 : 1);
        const d = p.distance * pulseScale + Math.sin(time + p.pulseOffset) * 6;
        const px = centerX + Math.cos(p.angle) * d;
        const py = centerY + Math.sin(p.angle) * d;

        ctx.save();
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 10;
        ctx.fillStyle = p.color;
        ctx.globalAlpha = Math.min(1, p.opacity + (currentActive ? 0.3 : 0));
        ctx.beginPath();
        ctx.arc(px, py, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // 4. Electric Aurora Conic Gradient Ring
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(time * (currentPhase === "processing" ? 1.8 : 0.6));

      const auroraRadius = baseRadius * 1.05 * pulseScale;
      ctx.lineWidth = 3.5;
      ctx.shadowColor = "#8b5cf6";
      ctx.shadowBlur = 24 + boost * 20;

      const segments = 60;
      for (let s = 0; s < segments; s++) {
        const startA = (s * 2 * Math.PI) / segments;
        const endA = ((s + 1) * 2 * Math.PI) / segments;
        const progress = s / segments;

        const rColor = Math.round(139 + Math.sin(progress * Math.PI * 2) * 50);
        const gColor = Math.round(92 + Math.cos(progress * Math.PI * 2) * 60);
        const bColor = Math.round(246 - progress * 40);

        ctx.strokeStyle = `rgba(${rColor}, ${gColor}, ${bColor}, 0.85)`;
        ctx.beginPath();
        ctx.arc(0, 0, auroraRadius, startA, endA);
        ctx.stroke();
      }
      ctx.restore();

      // 5. Dark Center Glass Core
      const coreRadius = baseRadius * 0.82 * pulseScale;
      const coreGrad = ctx.createRadialGradient(
        centerX - coreRadius * 0.2,
        centerY - coreRadius * 0.2,
        coreRadius * 0.1,
        centerX,
        centerY,
        coreRadius,
      );
      coreGrad.addColorStop(0, "rgba(22, 31, 56, 0.95)");
      coreGrad.addColorStop(0.6, "rgba(10, 14, 30, 0.98)");
      coreGrad.addColorStop(1, "#060814");

      ctx.save();
      ctx.fillStyle = coreGrad;
      ctx.shadowColor = "rgba(139, 92, 246, 0.5)";
      ctx.shadowBlur = 30;
      ctx.beginPath();
      ctx.arc(centerX, centerY, coreRadius, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = "rgba(255, 255, 255, 0.25)";
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.restore();

      // 6. Central Energy Nucleus
      const nucleusRadius = coreRadius * 0.32;
      const nucGrad = ctx.createRadialGradient(
        centerX,
        centerY,
        0,
        centerX,
        centerY,
        nucleusRadius,
      );
      nucGrad.addColorStop(0, "rgba(255, 255, 255, 0.95)");
      nucGrad.addColorStop(0.4, "rgba(56, 189, 248, 0.85)");
      nucGrad.addColorStop(0.8, "rgba(139, 92, 246, 0.6)");
      nucGrad.addColorStop(1, "transparent");

      ctx.save();
      ctx.fillStyle = nucGrad;
      ctx.shadowColor = "#38bdf8";
      ctx.shadowBlur = 20;
      ctx.beginPath();
      ctx.arc(centerX, centerY, nucleusRadius, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      animFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [size]); // Only restart on size change — level/active/phase are read from refs

  return (
    <canvas
      ref={canvasRef}
      style={{ width: size, height: size }}
      className="pointer-events-none absolute inset-0 m-auto select-none"
    />
  );
}
