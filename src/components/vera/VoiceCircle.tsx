import * as React from "react";
import { Mic, Square, Sparkles } from "lucide-react";
import type { Phase } from "@/hooks/useVera";
import { CosmicOrbCanvas } from "./CosmicOrbCanvas";
import { FluidWaveCanvas } from "./FluidWaveCanvas";

interface VoiceCircleProps {
  phase: Phase;
  level?: number;
  speaking?: boolean;
  onClick: () => void;
  size?: number;
  showWaves?: boolean;
}

/**
 * Ultra-Responsive Native Cosmic Voice Orb & Wave Nexus:
 * - Rendered with GPU-accelerated HTML5 Canvas (CosmicOrbCanvas + FluidWaveCanvas)
 * - 100% responsive for all laptop and desktop screens
 * - Live real-time audio reactive feedback
 * - Interactive click-to-talk trigger
 */
export function VoiceCircle({
  phase,
  level = 0,
  speaking = false,
  onClick,
  size = 350,
  showWaves = true,
}: VoiceCircleProps) {
  const listening = phase === "listening";
  const processing = phase === "processing";
  const active = listening || processing || speaking;

  return (
    <div className="relative flex w-full flex-col items-center justify-center">
      {/* Real-time Fluid Wave Ribbons across the viewport when Listening/Speaking */}
      {showWaves && (listening || speaking) && (
        <FluidWaveCanvas level={level} active={listening || speaking} />
      )}

      {/* Main Center Interactive Orb */}
      <button
        type="button"
        aria-label={
          listening
            ? "Stop listening"
            : processing
              ? "Processing query"
              : speaking
                ? "Speaking answer"
                : "Click to start voice query"
        }
        onClick={onClick}
        className="group relative z-10 grid cursor-pointer place-items-center rounded-full outline-none transition-all duration-300 hover:scale-105 active:scale-95 focus-visible:ring-4 focus-visible:ring-primary/50"
        style={{ width: size, height: size }}
      >
        {/* Native Mathematical Cosmic Canvas Visualizer */}
        <CosmicOrbCanvas
          level={level}
          active={active}
          phase={phase}
          size={size}
        />

        {/* Center Floating Tactile Icon Badge */}
        <span className="relative z-20 grid h-16 w-16 place-items-center rounded-full border border-border bg-card/85 shadow-2xl backdrop-blur-md transition-all duration-300 group-hover:scale-110 group-hover:bg-primary/20 group-hover:border-primary/60">
          {listening ? (
            <Square className="h-6 w-6 fill-current text-accent animate-pulse" />
          ) : processing ? (
            <span className="h-5 w-5 animate-ping rounded-full bg-accent" />
          ) : speaking ? (
            <Sparkles className="h-7 w-7 text-accent animate-spin" style={{ animationDuration: "6s" }} />
          ) : (
            <Mic className="h-7 w-7 text-foreground transition-transform group-hover:text-accent group-hover:scale-110" strokeWidth={2.2} />
          )}
        </span>
      </button>
    </div>
  );
}