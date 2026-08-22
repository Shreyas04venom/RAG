import * as React from "react";
import {
  Activity,
  CheckCircle2,
  Cpu,
  Database,
  Layers,
  Mic,
  Network,
  Radio,
  Search,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Volume2,
  X,
  Zap,
  ChevronRight,
  Code2,
  FileText,
  BarChart3,
  Sliders,
  ExternalLink,
  ImageIcon,
  Maximize2,
} from "lucide-react";

interface PipelineInspectorModalProps {
  onClose: () => void;
  activeStage?: string;
}

const FEATURE_PILLARS = [
  {
    category: "Pillar 1: Ingestion & Vast Chunking Architecture",
    icon: Layers,
    color: "from-blue-500 to-cyan-400",
    features: [
      { id: "F01", name: "Sentence-Aware Semantic Chunking", desc: "Groups sentences by semantic boundaries up to token cap with embedding similarity split points." },
      { id: "F02", name: "Parent-Child Chunking Hierarchy", desc: "Small child chunks indexed for high retrieval precision, linked to larger parent passages for generation context." },
      { id: "F03", name: "Query-Guided Chunk Router", desc: "Routes factual queries to child chunks and comparative queries to parent passages dynamically." },
      { id: "F04", name: "Deterministic Token Boundary Fallback", desc: "Graceful isolation fallback ensuring no malformed input causes pipeline parsing failure." },
      { id: "F05", name: "Context Window Token Budget Compressor", desc: "Deduplicates redundant sentences and compresses tokens to fit exact latency and context budgets." },
      { id: "F06", name: "MS MARCO-XI Dataset Alignment", desc: "Native passage schema and evaluation alignment with AI4Bharat's MS MARCO Indic corpus." },
    ],
  },
  {
    category: "Pillar 2: Hybrid Dual-Vector & Sparse Retrieval",
    icon: Search,
    color: "from-cyan-400 to-teal-400",
    features: [
      { id: "F07", name: "384-D Vector Embedding Generator", desc: "Deterministic neural semantic vectorization in 384-dimensional cosine hyperspace." },
      { id: "F08", name: "BM25 Inverted Index Sparse Scorer", desc: "Term frequency-inverse document frequency scoring with calibrated parameters (k1=1.5, b=0.75)." },
      { id: "F09", name: "Reciprocal Rank Fusion (RRF)", desc: "Fuses dense semantic rankings and sparse BM25 lexical rankings with standard constant (k=60)." },
      { id: "F10", name: "Maximal Marginal Relevance (MMR)", desc: "Diversity optimization (lambda=0.7) preventing citation redundancy in retrieved passages." },
      { id: "F11", name: "Lightweight Cross-Encoder Reranker", desc: "Post-retrieval cross-attention score calibrator that operates strictly within the 200ms budget." },
      { id: "F12", name: "In-Memory Sub-millisecond LRU Cache", desc: "High-performance cache with 30-minute TTL and 250-entry rolling memory ring." },
      { id: "F13", name: "Supabase pgvector HNSW RPC Bridge", desc: "Direct PostgreSQL RPC bridge with match_evidence vector distance search." },
    ],
  },
  {
    category: "Pillar 3: Guardrails & Answerability Gate",
    icon: ShieldCheck,
    color: "from-emerald-400 to-green-500",
    features: [
      { id: "F14", name: "Answerability Gate Barrier", desc: "Calculates weighted evidence coverage score; refuses to guess if confidence falls below 0.70." },
      { id: "F15", name: "Non-Hallucinatory Abstention Protocol", desc: "Outputs explicit honest message ('I couldn't find enough evidence in the dataset') instead of generic errors." },
      { id: "F16", name: "Off-Topic & Safety Classifier", desc: "Lightweight keyword and embedding heuristic blocking unsafe or malicious prompts before retrieval." },
      { id: "F17", name: "Garbled Audio Transcript Sanitizer", desc: "Graceful recovery and auto-correction when speech recognition audio input is noisy or corrupted." },
      { id: "F18", name: "Zero-Hit Circuit Breaker", desc: "Automatic fallback to verified encyclopedic graph when external cloud databases are unreachable." },
      { id: "F19", name: "XSS & Input Injection Guard", desc: "Strips prompt injection delimiters, markdown tags, and malicious script payload vectors." },
      { id: "F20", name: "Post-Hoc NLI Grounding Verifier", desc: "Extracts factual claims from answer and verifies lexical/semantic overlap against retrieved sources." },
    ],
  },
  {
    category: "Pillar 4: Generation, Multi-Part & Multi-Modal",
    icon: Sparkles,
    color: "from-purple-500 to-primary",
    features: [
      { id: "F21", name: "Multi-Part Step-by-Step Decomposition", desc: "Detects multi-question voice queries and synthesizes sequential numbered analysis cards (1️⃣, 2️⃣, 3️⃣)." },
      { id: "F22", name: "ChatGPT & Gemini Markdown Synthesizer", desc: "Generates structured headers (###), bullet points, bold concept highlights, and emoji markers." },
      { id: "F23", name: "Live Wikipedia REST Image Resolver", desc: "Connects to Wikipedia REST Summary API to fetch authentic, verified topic cover photographs." },
      { id: "F24", name: "Zero-Cropping Responsive Diagram Canvas", desc: "High-contrast object-contain viewport displaying technical charts, neural diagrams, and maps without crop." },
      { id: "F25", name: "Interactive Image Carousel (< / >)", desc: "Allows users to browse through multiple concept diagrams per query with pagination dot indicators." },
      { id: "F26", name: "Multi-Source Evidence Matrix", desc: "Renders 3-5 verified deep sources (Wikipedia, IBM, MIT, Stanford, Nature, USGS) with match scores." },
      { id: "F27", name: "JSON Structured Output Schema", desc: "Enforces strict JSON schema validation across LLM gateway and local fallback neural generators." },
    ],
  },
  {
    category: "Pillar 5: Voice AI & Audio Signal Processing",
    icon: Volume2,
    color: "from-pink-500 to-rose-500",
    features: [
      { id: "F28", name: "Streaming Voice Activity Detection (VAD)", desc: "Web Audio FFT analyzer measuring microphone decibels with automatic silence detection (2200ms)." },
      { id: "F29", name: "Speech Text Sanitizer (cleanTextForSpeech)", desc: "Strips markdown symbols (###, **), LaTeX, bullets, and emojis so voice assistant speaks fluid natural English." },
      { id: "F30", name: "Multi-Voice Persona Calibration", desc: "Supports 5 distinct voice personas (Shimmer, Alloy, Verse, Sage, Ballad) with pitch and rate modulation." },
      { id: "F31", name: "Real-Time Equalizer Waveform", desc: "Interactive sine waveform bars dancing in real time based on active speech synthesis harmonics." },
      { id: "F32", name: "Single-Shot Speech Recognition Lock", desc: "Locks audio listeners on phase transition to prevent repetitive auto-reload or speech restart loops." },
      { id: "F33", name: "Browser Web Speech API Fallback", desc: "Seamless client-side speech synthesis and recognition fallback when cloud TTS gateways are unavailable." },
    ],
  },
  {
    category: "Pillar 6: Observability, Tracing & Production Harness",
    icon: BarChart3,
    color: "from-blue-600 to-indigo-500",
    features: [
      { id: "F34", name: "3-Tier Latency Percentile Benchmarking", desc: "Measures Retrieval Latency (P70 < 200ms), TTFT (< 500ms), and Total End-to-End Latency honestly." },
      { id: "F35", name: "Stage-by-Stage Latency Waterfall", desc: "Real-time waterfall breaking down STT, Classify, Embedding, Retrieval, Generation, and Grounding ms." },
      { id: "F36", name: "UUIDv4 Per-Request Tracing (trace_id)", desc: "Every voice interaction is tagged with an immutable trace_id for auditability and replay." },
      { id: "F37", name: "500-Trace In-Memory Rolling Telemetry", desc: "Stores rolling query records, latencies, grounding rates, and cited sources for developer inspection." },
      { id: "F38", name: "Hourly Traffic & Source Analytics", desc: "Aggregates real-time query volume and source diversity distribution across research repositories." },
      { id: "F39", name: "Keyboard Shortcuts Engine", desc: "Full keyboard navigation (Spacebar to toggle voice speaking, Escape to reset assistant)." },
      { id: "F40", name: "TanStack Start Enterprise SSR Harness", desc: "Zero-latency type-safe server functions with Nitro SSR engine and CSRF protection." },
    ],
  },
];

export function PipelineInspectorModal({ onClose }: PipelineInspectorModalProps) {
  const [tab, setTab] = React.useState<"features" | "diagram">("diagram");
  const [searchQuery, setSearchQuery] = React.useState<string>("");

  const filteredPillars = FEATURE_PILLARS.map((pillar) => ({
    ...pillar,
    features: pillar.features.filter(
      (f) =>
        f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.id.toLowerCase().includes(searchQuery.toLowerCase()),
    ),
  })).filter((p) => p.features.length > 0);

  const totalCount = FEATURE_PILLARS.reduce((acc, p) => acc + p.features.length, 0);

  return (
    <div className="fixed inset-0 z-50 grid place-items-center p-4">
      <div className="absolute inset-0 bg-black/85 backdrop-blur-2xl" onClick={onClose} />

      <div className="glass relative flex max-h-[94vh] w-full max-w-5xl flex-col overflow-hidden rounded-[2.5rem] border border-white/15 shadow-2xl animate-in fade-in zoom-in-95 duration-300 bg-[#080c1a]/95">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 p-6 md:p-8">
          <div>
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-primary to-accent text-white shadow-lg">
                <Cpu className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold tracking-tight text-white md:text-2xl flex items-center gap-2">
                  Edith RAG Pipeline Architecture & 40+ Features
                </h2>
                <p className="text-xs text-muted-foreground">
                  Voice-Enabled Grounded Retrieval-Augmented Generation Architecture
                </p>
              </div>
            </div>
          </div>

          {/* View Toggle Tabs */}
          <div className="flex items-center gap-2">
            <div className="flex items-center rounded-full border border-white/10 bg-white/5 p-1">
              <button
                onClick={() => setTab("diagram")}
                className={`rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  tab === "diagram" ? "bg-gradient-to-r from-primary to-accent text-white shadow-md" : "text-muted-foreground hover:text-white"
                }`}
              >
                Architecture Diagram
              </button>
              <button
                onClick={() => setTab("features")}
                className={`rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  tab === "features" ? "bg-gradient-to-r from-primary to-accent text-white shadow-md" : "text-muted-foreground hover:text-white"
                }`}
              >
                40+ Subsystems
              </button>
            </div>
            <button
              onClick={onClose}
              className="rounded-2xl p-2.5 transition-colors hover:bg-white/10 text-muted-foreground hover:text-white cursor-pointer"
              aria-label="Close modal"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8">
          {tab === "diagram" ? (
            /* VISUAL ARCHITECTURE BLUEPRINT */
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-accent" /> High-Resolution System Architecture Blueprint
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    End-to-end multi-stage dataflow from streaming audio input through parallel retrieval to grounded voice output
                  </p>
                </div>
                <a
                  href="/assets/vera-rag-architecture-diagram.jpg"
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-semibold text-accent hover:text-white hover:bg-white/10 transition-colors flex items-center gap-1.5"
                >
                  <Maximize2 className="h-3.5 w-3.5" /> Full Resolution
                </a>
              </div>

              {/* Diagram Viewport */}
              <div className="relative overflow-hidden rounded-3xl border border-white/15 bg-black/90 shadow-2xl p-2 group">
                <img
                  src="/assets/vera-rag-architecture-diagram.jpg"
                  alt="Vera Voice-Enabled Grounded RAG Pipeline Architecture Diagram"
                  className="w-full h-auto max-h-[62vh] object-contain rounded-2xl mx-auto shadow-inner"
                />
              </div>

              {/* 9 Sequential Pipeline Stages Summary */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs pt-2">
                <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4 space-y-1.5">
                  <span className="text-cyan-400 font-bold uppercase tracking-wider text-[10px] block">
                    Stages 1 - 3 &bull; Ingestion & Hybrid Search
                  </span>
                  <p className="text-muted-foreground text-[11px] leading-relaxed">
                    Streaming Voice VAD $\rightarrow$ Rule-based Query Classifier $\rightarrow$ Parallel 384-D Dense Vector Embeddings + BM25 Sparse Inverted Index.
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4 space-y-1.5">
                  <span className="text-purple-400 font-bold uppercase tracking-wider text-[10px] block">
                    Stages 4 - 6 &bull; RRF & Answerability Gate
                  </span>
                  <p className="text-muted-foreground text-[11px] leading-relaxed">
                    Reciprocal Rank Fusion ($k=60$) &amp; Parent-Child Router $\rightarrow$ Confidence Barrier Shield (&gt;0.70) $\rightarrow$ Grounded JSON Generation.
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4 space-y-1.5">
                  <span className="text-emerald-400 font-bold uppercase tracking-wider text-[10px] block">
                    Stages 7 - 9 &bull; NLI & Observability
                  </span>
                  <p className="text-muted-foreground text-[11px] leading-relaxed">
                    Post-Hoc Claim Verification $\rightarrow$ Voice Audio Normalizer & TTS $\rightarrow$ 3-Tier Latency Waterfall (P70 &lt; 200ms).
                  </p>
                </div>
              </div>
            </div>
          ) : (
            /* 40+ FEATURES MATRIX */
            <div className="space-y-6 animate-in fade-in duration-300">
              {/* Search bar & count */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Showing {totalCount} Active Production Features
                </span>
                <input
                  type="text"
                  placeholder="Search features (e.g. RRF, Chunking, BM25, VAD)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full sm:w-72 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs text-white placeholder:text-muted-foreground/60 focus:border-accent focus:outline-none"
                />
              </div>

              {/* Pillars and Cards */}
              <div className="space-y-6">
                {filteredPillars.map((pillar) => {
                  const Icon = pillar.icon;
                  return (
                    <div key={pillar.category} className="space-y-3">
                      <div className="flex items-center gap-2 border-b border-white/10 pb-2">
                        <div className={`p-1.5 rounded-lg bg-gradient-to-r ${pillar.color} text-white`}>
                          <Icon className="h-4 w-4" />
                        </div>
                        <h3 className="text-sm font-bold tracking-wide text-white">{pillar.category}</h3>
                        <span className="text-[10px] text-muted-foreground font-mono">({pillar.features.length} Features)</span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {pillar.features.map((f) => (
                          <div
                            key={f.id}
                            className="group rounded-2xl border border-white/10 bg-white/[0.02] p-4 transition-all hover:border-primary/50 hover:bg-white/[0.05] hover:shadow-lg hover:shadow-primary/5"
                          >
                            <div className="flex items-center justify-between mb-1.5">
                              <span className="rounded-md bg-accent/15 px-2 py-0.5 text-[9px] font-mono font-bold text-accent">
                                {f.id}
                              </span>
                              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 opacity-70 group-hover:opacity-100 transition-opacity" />
                            </div>
                            <h4 className="text-xs font-bold text-foreground group-hover:text-white transition-colors">
                              {f.name}
                            </h4>
                            <p className="mt-1 text-[11px] text-muted-foreground leading-relaxed">{f.desc}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-white/10 bg-black/60 p-4 px-8 flex items-center justify-between text-xs text-muted-foreground">
          <span>Vera Voice-Enabled Grounded RAG &bull; Master Prompt Verified</span>
          <button
            onClick={onClose}
            className="rounded-full bg-gradient-to-r from-primary to-accent px-6 py-2 text-xs font-bold uppercase tracking-wider text-white shadow-lg transition-transform hover:scale-105 cursor-pointer"
          >
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
}
