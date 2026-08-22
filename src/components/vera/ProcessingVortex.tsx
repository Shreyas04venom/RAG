import * as React from "react";
import { Check, Loader2 } from "lucide-react";
import { STAGE_LABELS, type StageKey, type StageState } from "@/hooks/useVera";
import { GalacticVortexCanvas } from "./GalacticVortexCanvas";

interface ProcessingVortexProps {
  transcript?: string;
  stages: Record<StageKey, StageState>;
  onCancel?: () => void;
}

export function ProcessingVortex({ transcript, stages, onCancel }: ProcessingVortexProps) {
  return (
    <div className="relative z-10 flex w-full max-w-5xl flex-col items-center gap-10 animate-in fade-in duration-500">
      {/* Title & Query Header */}
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-light tracking-tight md:text-5xl text-foreground">
          Analyzing your question
        </h2>
        <p className="text-sm font-medium text-accent animate-pulse">
          Searching MS MARCO for trusted evidence…
        </p>
        {transcript && (
          <p className="mx-auto max-w-xl text-xs font-semibold uppercase tracking-wider text-muted-foreground mt-2">
            &ldquo;{transcript}&rdquo;
          </p>
        )}
      </div>

      {/* Main Split: 3D Cosmic Galaxy Vortex (Left) + Step Progress (Right) */}
      <div className="grid w-full grid-cols-1 items-center gap-8 lg:grid-cols-12">
        {/* Native 3D Gravitational Galactic Vortex Canvas */}
        <div className="relative flex items-center justify-center lg:col-span-7 h-96 overflow-hidden">
          {/* Ambient Glow */}
          <div className="absolute h-72 w-72 rounded-full bg-gradient-to-tr from-primary/50 via-accent/40 to-purple-600/50 blur-[100px]" />

          <GalacticVortexCanvas size={460} />
        </div>

        {/* Vertical Step Progress Checklist (Screen 3 Right) */}
        <div className="flex flex-col gap-3.5 lg:col-span-5">
          {(Object.keys(STAGE_LABELS) as StageKey[]).map((key) => {
            const state = stages[key];
            const isDone = state === "done";
            const isActive = state === "active";

            return (
              <div
                key={key}
                className={`flex items-center gap-4 rounded-2xl border px-5 py-4 transition-all duration-300 ${
                  isActive
                    ? "border-primary/60 bg-gradient-to-r from-primary/25 via-accent/15 to-transparent shadow-lg shadow-primary/20 scale-[1.02]"
                    : isDone
                      ? "border-white/10 bg-white/[0.03]"
                      : "border-white/5 opacity-40"
                }`}
              >
                {/* Status Indicator Icon */}
                <div
                  className={`grid h-8 w-8 shrink-0 place-items-center rounded-full border transition-colors ${
                    isDone
                      ? "border-emerald-500/40 bg-emerald-500/15 text-emerald-400"
                      : isActive
                        ? "border-primary/60 bg-primary/20 text-primary"
                        : "border-white/10 bg-white/5 text-muted-foreground"
                  }`}
                >
                  {isDone ? (
                    <Check className="h-4 w-4 text-emerald-400 stroke-[2.5]" />
                  ) : isActive ? (
                    <Loader2 className="h-4 w-4 animate-spin text-accent" />
                  ) : (
                    <span className="h-2 w-2 rounded-full bg-muted-foreground/50" />
                  )}
                </div>

                {/* Stage Label */}
                <div className="flex-1 min-w-0">
                  <span
                    className={`text-sm font-semibold block ${
                      isActive ? "text-foreground" : isDone ? "text-foreground/90" : "text-muted-foreground"
                    }`}
                  >
                    {STAGE_LABELS[key]}
                  </span>
                  <span className="text-[10px] text-muted-foreground">
                    {isDone ? "Verified & complete" : isActive ? "Searching & evaluating..." : "Pending"}
                  </span>
                </div>
              </div>
            );
          })}

          {onCancel && (
            <button
              onClick={onCancel}
              className="mt-2 text-xs font-semibold text-muted-foreground hover:text-accent transition-colors self-start px-2 py-1 cursor-pointer"
            >
              Cancel query
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
