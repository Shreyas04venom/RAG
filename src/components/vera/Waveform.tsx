import * as React from "react";

/** Live mic waveform. Bars react to real input level with a smoothed rolling buffer. */
export function Waveform({ level, bars = 56, active }: { level: number; bars?: number; active: boolean }) {
  const [history, setHistory] = React.useState<number[]>(() => Array(bars).fill(0.06));

  React.useEffect(() => {
    if (!active) return;
    const id = window.setInterval(() => {
      setHistory((prev) => {
        const next = prev.slice(1);
        next.push(Math.max(0.06, Math.min(1, level * (0.75 + Math.random() * 0.5))));
        return next;
      });
    }, 55);
    return () => window.clearInterval(id);
  }, [active, level, bars]);

  return (
    <div className="flex h-24 w-full items-center justify-center gap-1.5" aria-hidden>
      {history.map((v, i) => {
        const envelope = Math.sin((i / history.length) * Math.PI);
        const height = Math.max(4, v * envelope * 96);
        return (
          <span
            key={i}
            className="w-1.5 rounded-full transition-[height] duration-100"
            style={{
              height,
              background: `linear-gradient(to top, var(--color-primary), var(--color-accent))`,
              opacity: 0.35 + envelope * 0.6,
              boxShadow: v > 0.4 ? "0 0 12px var(--color-primary)" : undefined,
            }}
          />
        );
      })}
    </div>
  );
}