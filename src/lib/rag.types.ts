export type LatencyTrace = {
  stt: number;
  classify: number;
  embedding: number;
  retrieval: number;
  generation: number;
  grounding: number;
  total: number;
};

export type Citation = {
  id: string;
  title: string;
  domain: string;
  url: string;
  snippet: string;
  score: number;
  cited: boolean;
};

export type QueryStatus = "ANSWERED" | "ANSWERED_LOW_CONFIDENCE" | "ABSTAINED";

export type ConceptImage = {
  url: string;
  caption: string;
  alt: string;
  photographer?: string;
  photographerUrl?: string;
  sourceUrl?: string;
  width?: number;
  height?: number;
};

export type QueryResponse = {
  traceId: string;
  query: string;
  mode: "factual" | "comparative" | "explanatory";
  answer: string;
  spokenSummary?: string;
  images?: ConceptImage[];
  status: QueryStatus;
  confidence: number;
  grounding: number;
  grounded: boolean;
  unsupportedTerms: string[];
  citations: Citation[];
  latencies: LatencyTrace;
};

export type Analytics = {
  totalQueries: number;
  avgResponseMs: number;
  groundedRate: number;
  abstainRate: number;
  corpusSize: number;
  p50: number;
  p70: number;
  p100: number;
  hourly: { hour: number; count: number }[];
  topSources: { name: string; count: number; pct: number }[];
  recent: { query: string; status: QueryStatus; createdAt: string; latency: number }[];
  stageAverages: { stage: string; ms: number }[];
};