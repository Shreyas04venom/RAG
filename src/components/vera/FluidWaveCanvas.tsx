import * as React from "react";

interface FluidWaveCanvasProps {
  level?: number;
  active?: boolean;
}

/**
 * Real-time Mathematical Harmonic Fluid Wave Ribbon Canvas:
 * - Multi-frequency flowing neon sine waves across the screen
 * - Real-time audio reactive amplitude from mic level
 * - Neon electric violet + cyan gradient glow
 * 
 * Performance: Uses refs for level/active to avoid effect restarts on every audio frame.
 */
export function FluidWaveCanvas({ level = 0, active = true }: FluidWaveCanvasProps) {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const animFrameRef = React.useRef<number | null>(null);

  // Store rapidly-changing props in refs
  const levelRef = React.useRef(level);
  const activeRef = React.useRef(active);
  levelRef.current = level;
  activeRef.current = active;

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = 200);

    const handleResize = () => {
      if (!canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = 200;
    };
    window.addEventListener("resize", handleResize);

    let time = 0;

    const render = () => {
      time += 0.025;
      ctx.clearRect(0, 0, width, height);

      // Read from refs instead of closure variables
      const currentLevel = levelRef.current;
      const currentActive = activeRef.current;

      const audioBoost = currentActive ? Math.max(0.1, Math.min(1, currentLevel * 2.8)) : 0.05;
      const centerY = height / 2;

      // Wave 1: Primary Electric Purple Wave
      ctx.save();
      const grad1 = ctx.createLinearGradient(0, 0, width, 0);
      grad1.addColorStop(0, "rgba(139, 92, 246, 0.05)");
      grad1.addColorStop(0.3, "rgba(139, 92, 246, 0.7)");
      grad1.addColorStop(0.7, "rgba(192, 132, 252, 0.95)");
      grad1.addColorStop(1, "rgba(56, 189, 248, 0.05)");

      ctx.strokeStyle = grad1;
      ctx.lineWidth = 3.5;
      ctx.shadowColor = "#8b5cf6";
      ctx.shadowBlur = 18;
      ctx.beginPath();

      for (let x = 0; x < width; x += 4) {
        const envelope = Math.sin((x / width) * Math.PI);
        const y =
          centerY +
          Math.sin(x * 0.008 + time * 2) * (28 + audioBoost * 45) * envelope +
          Math.sin(x * 0.016 + time * 3) * (14 + audioBoost * 20) * envelope;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
      ctx.restore();

      // Wave 2: Cyan Counter-Wave
      ctx.save();
      const grad2 = ctx.createLinearGradient(0, 0, width, 0);
      grad2.addColorStop(0, "rgba(56, 189, 248, 0.05)");
      grad2.addColorStop(0.3, "rgba(56, 189, 248, 0.85)");
      grad2.addColorStop(0.7, "rgba(139, 92, 246, 0.7)");
      grad2.addColorStop(1, "rgba(236, 72, 153, 0.05)");

      ctx.strokeStyle = grad2;
      ctx.lineWidth = 2.5;
      ctx.shadowColor = "#38bdf8";
      ctx.shadowBlur = 20;
      ctx.beginPath();

      for (let x = 0; x < width; x += 4) {
        const envelope = Math.sin((x / width) * Math.PI);
        const y =
          centerY +
          Math.sin(x * 0.007 - time * 2.2 + 1.2) * (24 + audioBoost * 38) * envelope +
          Math.cos(x * 0.014 - time * 1.5) * (12 + audioBoost * 18) * envelope;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
      ctx.restore();

      // Wave 3: Subtle High-Frequency Harmonic
      ctx.save();
      ctx.strokeStyle = "rgba(236, 72, 153, 0.4)";
      ctx.lineWidth = 1.2;
      ctx.setLineDash([4, 8]);
      ctx.beginPath();
      for (let x = 0; x < width; x += 6) {
        const envelope = Math.sin((x / width) * Math.PI);
        const y =
          centerY +
          Math.sin(x * 0.02 + time * 4) * (18 + audioBoost * 25) * envelope;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
      ctx.restore();

      animFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, []); // Empty deps — level and active are read from refs

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 w-full h-48 select-none z-0"
    />
  );
}
