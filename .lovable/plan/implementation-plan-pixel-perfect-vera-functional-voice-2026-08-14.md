# Implementation Plan - Pixel Perfect Vera & Functional Voice

The goal is to match the reference image `user-uploads://file-7` exactly and ensure the voice functionality works as intended.

## User Interface (Pixel Perfect Fidelity)

### 1. Global Styles (`src/styles.css`)
- Refine `oklch` palette to match the deep navy/purple obsidian theme.
- Enhance `bg-mesh` to match the orbital glow distribution in the mockup.
- Add specific typography settings for 'Space Grotesk' and 'Inter'.
- Improve glassmorphism tokens.

### 2. Layout & Interactions (`src/routes/index.tsx`)
- Implement the exact navigation bar: Vera logo (gradient square), Features, How it Works, Trust, Dev View button.
- Reorganize main state machine:
    - **Hero**: Orbital core + "Start Speaking" button with soundwave icon.
    - **Listening**: Central microphone icon + real-time waveform visualization (horizontal wave).
    - **Processing**: Orbital radar + checklist: "Understanding query", "Searching MS MARCO", "Verifying sources", "Generating response".
    - **Answer**: Glass card with "Verification Complete", "Evidence Base" grid, "Listen" button with icon, and feedback thumbs.
- Implement the **Dev View** as a dedicated overlay with:
    - Stats: Total Queries, Avg. Response Time, Accuracy Rate, Uptime.
    - Charts: Query Volume (area chart) and Top Sources (bar chart).

### 3. Voice Interaction Hub (`src/components/vera/VoiceCircle.tsx`)
- Redesign for 3 distinct states:
    - **Idle**: Glow rings + Mic icon.
    - **Listening**: Pulsing center + Mic icon.
    - **Processing**: Spinning orbital rings with radar sweep effect.
- Fix interaction issues (pointer events) to ensure reliable activation.

## Backend Functionality

### 1. Real Speech Processing (`src/lib/rag.functions.ts`)
- Replace mock STT with a robust server-side handler.
- Integrate **Sarvam Streaming API** if possible, or use a high-performance STT fallback.
- Ensure `match_chunks` RPC is correctly optimized for MS MARCO data.
- Refine grounding logic to match the "Verified" status in the UI.

### 2. Audio Utilities (`src/lib/audio.ts`)
- Add client-side voice detection (VAD) to auto-stop listening.
- Implement robust audio recording (Web Audio API) for better STT accuracy.

## Technical Details
- Framework: TanStack Start (React 19, React Router 10).
- Backend: Lovable Cloud (Supabase).
- Data: MS MARCO-XI.
- Fonts: Space Grotesk, Inter.
- Animations: Tailwind + Custom CSS Keyframes.
