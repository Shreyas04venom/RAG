# Vera (Voice-Evidence Retrieval Assistant) - Implementation Plan

Implement the full voice-enabled RAG pipeline for the MS MARCO-XI dataset with sub-200ms retrieval latency, hybrid search, and grounding verification, following the "Master Implementation Prompt" exactly. The interface will be refined to a premium, minimal aesthetic similar to Claude.

## User Review Required

> [!IMPORTANT]
> - **Sarvam API Key**: Provided as `sk_o1j0ip7k_xIdIHf7fmapqex1nCiqtvYR3`. I will configure this as a secret.
> - **MS MARCO Dataset**: I will proceed with pulling the best subset from `ai4bharat/MSMARCO-XI` (e.g., the English/Indic high-quality pairs) for the ingestion logic.

## Proposed Changes

### 1. Database & Search (HNSW + BM25)
- Enhance `public.chunks` with full-text search capabilities for sparse retrieval.
- Implement `match_chunks` stored procedure for hybrid search:
  - Vector search (cosine similarity) using `pgvector` with HNSW index.
  - Keyword search using Postgres `tsvector`.
  - Reciprocal Rank Fusion (RRF) to combine results.
- Create ingestion scripts to process the `ai4bharat/MSMARCO-XI` dataset using semantic and parent-child chunking.

### 2. RAG Orchestration (src/lib/rag.functions.ts)
- Integrate **Sarvam Streaming STT** using the provided API key.
- Implement a lightweight query classifier (rule-based/embedding heuristic) to route queries (factual vs. comparative).
- Replace mock retrieval with actual hybrid search calls to Supabase.
- Implement the **Answerability Gate**:
  - Score based on top retrieval match, query coverage, and result agreement.
  - Abstain if score is below 0.45.
- Implement **Grounded Generation**:
  - Call `openai/gpt-4o` (via AI Gateway) with structured output.
  - Post-hoc grounding check: extract claims and verify lexical/embedding overlap with evidence.

### 3. Observability & Evaluation
- Instrument every stage with latency logging (`latency_traces` table).
- Build a test suite of ~30 queries to compute real P50/P70/P100 metrics.
- Implement **Developer Mode** UI with a real-time waterfall trace of these metrics.

### 4. UI/UX (src/routes/index.tsx)
- **Claude-like Aesthetic**: Clean, minimal, high-quality typography (Inter), soft shadows, and a "calm" color palette (slate/neutral/amber).
- Refine the voice interface with distinct states: Listening, Understanding, Searching, Verifying.
- Show expandable "Evidence Cards" for citations.
- Add confidence indicators (Answered, Low Confidence, Abstained).

## Technical Details
- **STT**: Sarvam (Indic-optimized).
- **Embeddings**: `text-embedding-3-small` (1536 dims).
- **LLM**: `openai/gpt-4o`.
- **Latency Targets**: Retrieval P70 < 200ms; TTFB < 500ms.
- **Chunking**: Sentence-aware semantic splits + parent-child mappings.
