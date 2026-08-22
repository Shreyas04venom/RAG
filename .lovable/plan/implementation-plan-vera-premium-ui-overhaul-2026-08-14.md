# Implementation Plan - Vera Premium UI Overhaul

Redesign the application to match the dark, futuristic, high-fidelity aesthetic shown in the reference image (user-uploads://file-5). The UI will feature a deep navy/purple palette, glow effects, orbital animations, and a multi-screen dashboard.

## User Experience

### 1. Visual Theme
- **Background**: Deep obsidian/navy with subtle purple gradients and mesh noise.
- **Typography**: Space Grotesk for headings, Inter for body text.
- **Components**: Glassmorphism with thin borders and inner glows.

### 2. Multi-State Interface
- **Hero Landing**: Floating orbital ring ("Vera") with a prominent "Start Speaking" button.
- **Listening State**: Voice waveform visualizer and orbital pulse.
- **Processing State**: "Analyzing your question" with a circular radar/galaxy animation and step-by-step verification status (Understanding, Searching, Verifying, Generating).
- **Answer View**: Elegant cards with "Evidence Base" citations and "Listen" (TTS) playback.
- **Dashboard**: "Welcome back" screen with stats (Questions Asked, Verified Answers, Sources Used).
- **Developer View**: Real-time performance waterfall and accuracy metrics.
- **Settings**: Theme, Voice Output, Language, and Auto-play controls.

## Technical Details

### Frontend Components
- **`VoiceCircle`**: SVG-based orbital ring with CSS animations (rotate, pulse, glow).
- **`Waveform`**: Canvas or SVG-based audio visualizer synchronized with the recording state.
- **`Dashboard`**: Grid-based layout for user stats and recent history.
- **`TraceView`**: Updated developer mode with P50/P70/P100 metrics.

### Styling
- **Tailwind v4**: Define custom tokens for the "Vera" palette (Deep Navy, Neon Purple, Cyan Glow).
- **Framer Motion**: For smooth transitions between states (Hero -> Listening -> Processing -> Answer).

### Backend Integration
- Maintain existing `processVoiceQuery` server function.
- Add `getDashboardStats` server function to fetch user-specific metrics.
- Integrate TTS (Text-to-Speech) using Sarvam API for the "Listen" feature.

## Implementation Steps

1. **Theme Setup**: Update `src/styles.css` with the new color palette and global dark mode styles.
2. **Core Components**: Build `VoiceCircle`, `Waveform`, and `EvidenceCard` with the new aesthetic.
3. **Screen States**: Implement the state machine in `src/routes/index.tsx` (Landing -> Listening -> Processing -> Result).
4. **Dashboard & Settings**: Create sidebars/modals for the Dashboard and Settings views as seen in the reference.
5. **Animation & Polish**: Add Framer Motion transitions and glow effects to all interactions.