# Implementation Plan - High-Fidelity UI & End-to-End RAG

Redesign Vera's interface to exactly match the provided high-fidelity dark UI and complete the end-to-end RAG pipeline integration.

## User Review Required

> [!IMPORTANT]
> - The new UI uses **Space Grotesk** and **Inter** fonts.
> - Background involves complex CSS animations and gradients to mimic the "orbital" feel.
> - The RAG pipeline will use the provided Sarvam API key for STT and MS MARCO dataset for retrieval.

## Proposed Changes

### UI & Styling
- **Theme Enhancements**: Extend `src/styles.css` with advanced orbital animations, glassmorphism variants, and deep obsidian/purple color tokens.
- **Hero Landing (Screen 1)**: Update `src/routes/index.tsx` to exactly match the "Vera" hero state with a "Start Speaking" button and subtle orbital background.
- **Listening State (Screen 2)**: Enhance `VoiceCircle.tsx` with high-fidelity wave animations and "How can I help you?" text overlay.
- **Processing State (Screen 3)**: Implement the "orbital radar" visualization with a step-by-step checklist (Understanding query, Searching MS MARCO, etc.).
- **Answer View (Screen 4)**: Redesign the result card with "Claude-like" soft dark styling, grid-based source citations, and a "Listen" button.
- **Dashboard (Screen 5)**: Update `Dashboard.tsx` to match the grid layout with stats (Questions Asked, Verified Answers, Sources Used) and a brain-visualization graphic.
- **Dev/Analytics View (Screen 6)**: Implement a professional analytics dashboard with line charts (Query Volume) and bar charts (Top Sources).
- **Settings (Screen 9)**: Update `Settings.tsx` to match the sidebar-layout configuration panel.

### Backend & RAG Integration
- **Sarvam STT**: Replace mock STT in `rag.functions.ts` with actual Sarvam streaming API integration.
- **Hybrid Search**: Refine `match_chunks` RPC to handle real user queries with HNSW and BM25 fusion.
- **Latency Instrumentation**: Ensure all stages (STT, Retrieval, LLM Generation, Grounding) are correctly logged to `latency_traces` and visualized in the Dev View.

## Technical Details
- **Frontend**: TanStack Start, React 19, Tailwind CSS v4, Lucide Icons.
- **Backend**: Supabase (PostgreSQL + pgvector), TanStack server functions.
- **Animations**: CSS keyframes for orbits, Tailwind's `animate-in` for transitions.
- **State Management**: React `useState` machine for switching between Landing -> Listening -> Processing -> Result -> Dashboard/Settings.

## Execution Order
1. **Styling Update**: Update `src/styles.css` with new tokens and animations.
2. **Component Overhaul**: Batch update `VoiceCircle`, `Dashboard`, `Settings`, and `Hero` components.
3. **Route Integration**: Update `src/routes/index.tsx` to orchestrate the new screens.
4. **Backend Completion**: Finalize `rag.functions.ts` with Sarvam integration.
5. **Verification**: Run browser tests to ensure visual fidelity and functional flow.
