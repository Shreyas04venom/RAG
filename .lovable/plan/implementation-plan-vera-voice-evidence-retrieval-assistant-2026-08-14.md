# Implementation Plan - Vera (Voice-Evidence Retrieval Assistant)

Build a high-performance, voice-enabled RAG system ("Vera") for the HH Goa 2026 challenge.

## Goals & Identity
- **Name**: Vera (Voice-Evidence Retrieval Assistant).
- **Positioning**: "Vera answers out loud, and never says something it can't prove."
- **Performance**: Sub-200ms retrieval latency (measured as P50/P70/P100).

## Technical Architecture
- **Voice Stack**: Sarvam STT (Indic-optimized) for streaming transcription.
- **Data & Retrieval**:
  - **Dataset**: `ai4bharat/MSMARCO-XI`.
  - **Storage**: Lovable Cloud (PostgreSQL + `pgvector` HNSW).
  - **Chunking**: Semantic chunking + Parent-Child strategies.
  - **Hybrid Search**: Dense Vector (1536d) + Sparse BM25 fused with RRF.
- **Reliability & Guardrails**:
  - **Answerability Gate**: Threshold-based check to abstain if evidence is insufficient.
  - **Grounding Check**: Post-generation overlap verification between claims and evidence.
  - **Harness**: Structured orchestration (Query Classifier -> Hybrid Search -> Fusion -> Gate -> Generation -> Grounding).

## Observability
- **Trace Waterfall**: Detailed stage-by-stage latency logging (STT, Classification, Retrieval, Fusion, Generation, Grounding).
- **Metrics**: P50/P70/P100 latency analytics derived from real log traces.

## Implementation Steps
1. **Schema & Data Ingestion**:
   - Chunks table with `pgvector` indexing.
   - Latency Traces table for instrumentation.
   - Ingestion script for MSMARCO-XI with advanced chunking.
2. **Retrieval Pipeline**:
   - Dense retrieval (embeddings).
   - Sparse retrieval (BM25) and RRF logic.
   - Answerability gate logic.
3. **Voice & LLM**:
   - Sarvam STT integration.
   - Structured generation (Answer + Claims).
   - Grounding check implementation.
4. **UI/UX**:
   - Calm, minimal "User Mode" for voice interaction.
   - "Developer Mode" for real-time waterfall traces and P-metrics.
5. **Evaluation**:
   - Run fixed test suite to verify benchmarks.
