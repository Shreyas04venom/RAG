import * as React from "react";
import { ArrowUpRight, Brain, Clock, Mic, Sparkles, TrendingUp, Zap } from "lucide-react";

interface DashboardViewProps {
  onAskQuestion: (query: string) => void;
  onStartVoice: () => void;
}

const RECENT_QUESTIONS = [
  { q: "What causes earthquakes?", time: "2 mins ago", verified: true },
  { q: "Explain photosynthesis in simple terms", time: "1 hour ago", verified: true },
  { q: "Who is the founder of Microsoft?", time: "3 hours ago", verified: true },
  { q: "Latest developments in quantum computing", time: "5 hours ago", verified: true },
  { q: "What is a minority government?", time: "Yesterday", verified: true },
];

export function DashboardView({ onAskQuestion, onStartVoice }: DashboardViewProps) {
  return (
    <div className="relative z-10 flex w-full max-w-6xl flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Greeting */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-semibold tracking-tight text-white md:text-4xl">
            Welcome back, Shreyas 👋
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Here is an overview of your research queries and verified evidence insights.
          </p>
        </div>
      </div>

      {/* Top 3 Stat Cards (Screen 5) */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="glass-card rounded-3xl p-6 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
              Questions Asked
            </span>
            <span className="grid h-7 w-7 place-items-center rounded-lg bg-primary/20 text-primary">
              <Zap className="h-4 w-4" />
            </span>
          </div>
          <div className="mt-4 flex items-baseline gap-3">
            <span className="text-4xl font-bold text-white">128</span>
            <span className="flex items-center text-xs font-semibold text-emerald-400">
              <TrendingUp className="mr-1 h-3 w-3" /> ↑ 18% this week
            </span>
          </div>
        </div>

        <div className="glass-card rounded-3xl p-6 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
              Verified Answers
            </span>
            <span className="grid h-7 w-7 place-items-center rounded-lg bg-emerald-500/20 text-emerald-400">
              <Sparkles className="h-4 w-4" />
            </span>
          </div>
          <div className="mt-4 flex items-baseline gap-3">
            <span className="text-4xl font-bold text-white">97%</span>
            <span className="text-xs font-semibold text-accent">★ High accuracy</span>
          </div>
        </div>

        <div className="glass-card rounded-3xl p-6 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
              Sources Used
            </span>
            <span className="grid h-7 w-7 place-items-center rounded-lg bg-accent/20 text-accent">
              <Brain className="h-4 w-4" />
            </span>
          </div>
          <div className="mt-4 flex items-baseline gap-3">
            <span className="text-4xl font-bold text-white">342</span>
            <span className="text-xs font-semibold text-muted-foreground">From MS MARCO</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Recent Questions (Left) + 3D Holographic AI Neural Core (Right) */}
      <div className="grid gap-8 lg:grid-cols-12">
        {/* Recent Questions List (Screen 5 Left) */}
        <div className="glass rounded-[2rem] p-8 lg:col-span-7 space-y-6">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Clock className="h-4 w-4 text-accent" /> Recent Questions
            </h3>
            <span className="text-xs text-muted-foreground">Updated in real-time</span>
          </div>

          <div className="space-y-3">
            {RECENT_QUESTIONS.map((item, i) => (
              <button
                key={i}
                onClick={() => onAskQuestion(item.q)}
                className="group flex w-full items-center justify-between rounded-2xl border border-white/5 bg-white/[0.02] p-4 text-left transition-all hover:border-primary/40 hover:bg-white/[0.05]"
              >
                <div className="min-w-0 pr-4">
                  <span className="block truncate text-sm font-semibold text-foreground group-hover:text-accent transition-colors">
                    {item.q}
                  </span>
                  <span className="text-[11px] text-muted-foreground">{item.time}</span>
                </div>
                <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-white/5 group-hover:bg-primary/20 group-hover:text-primary transition-colors">
                  <ArrowUpRight className="h-4 w-4" />
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* 3D Holographic AI Neural Core & Quick Start (Screen 5 Right) */}
        <div className="flex flex-col gap-6 lg:col-span-5">
          {/* Glowing Neural Brain Visualization */}
          <div className="glass relative flex h-64 flex-col items-center justify-center overflow-hidden rounded-[2rem] p-6 text-center">
            {/* Ambient pedestal glow */}
            <div className="absolute inset-0 bg-radial from-primary/25 via-transparent to-transparent" />
            <div className="absolute bottom-6 h-12 w-48 rounded-full bg-accent/30 blur-2xl" />

            {/* Floating Brain Icon / Hologram */}
            <div className="relative z-10 animate-brain">
              <div className="grid h-28 w-28 place-items-center rounded-3xl bg-gradient-to-tr from-primary/30 via-accent/30 to-purple-600/40 p-4 border border-white/20 shadow-2xl backdrop-blur-xl">
                <Brain className="h-16 w-16 text-cyan-300 drop-shadow-[0_0_20px_#38bdf8]" />
              </div>
            </div>

            <span className="relative z-10 mt-4 text-xs font-bold uppercase tracking-[0.25em] text-accent">
              Neural Evidence Engine
            </span>
          </div>

          {/* Quick Start Action Card */}
          <div className="glass-card rounded-[2rem] p-6 space-y-4">
            <div>
              <h4 className="text-base font-bold text-white">Quick Start</h4>
              <p className="mt-1 text-xs text-muted-foreground">
                Ask anything out loud and get instant answers verified against real sources.
              </p>
            </div>
            <button
              onClick={onStartVoice}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-primary to-accent py-3.5 text-xs font-bold uppercase tracking-widest text-primary-foreground shadow-lg shadow-primary/30 transition-transform hover:scale-[1.02] active:scale-98 cursor-pointer"
            >
              <Mic className="h-4 w-4" /> Ask Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
