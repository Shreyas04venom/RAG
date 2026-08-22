/**
 * ADVANCED HIGH-SENSITIVITY DSP AUDIO RECORDER & ADAPTIVE VAD ENGINE
 * - High-pass + Low-pass Biquad filtering (eliminates fan rumble, AC noise, and high hiss)
 * - Hardware AGC + Dynamic Range Compressor (amplifies faint/whisper speech without clipping)
 * - Self-calibrating ambient noise-floor tracker for reliable low-volume speech detection
 * - 16 kHz Mono PCM downsampler + 16-bit WAV encoder
 */

export type Recorder = {
  stop: () => Promise<{ base64: string; mimeType: string; bytes: number }>;
  cancel: () => void;
};

const TARGET_RATE = 16000;

export async function startRecording(opts: {
  onLevel?: (level: number) => void;
  onSilence?: () => void;
  silenceMs?: number;
}): Promise<Recorder> {
  // 1. Request microphone stream with hardware DSP processing
  const stream = await navigator.mediaDevices.getUserMedia({
    audio: {
      echoCancellation: true,
      noiseSuppression: true,
      autoGainControl: true,
      channelCount: 1,
      sampleRate: 48000,
    },
  });

  const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
  const source = ctx.createMediaStreamSource(stream);

  // 2. High-Pass Filter: Cuts sub-vocal rumble (<85Hz), AC hum, and table vibrations
  const highPass = ctx.createBiquadFilter();
  highPass.type = "highpass";
  highPass.frequency.setValueAtTime(85, ctx.currentTime);
  highPass.Q.setValueAtTime(0.7, ctx.currentTime);

  // 3. Low-Pass Filter: Cuts high-frequency hiss (>7200Hz)
  const lowPass = ctx.createBiquadFilter();
  lowPass.type = "lowpass";
  lowPass.frequency.setValueAtTime(7200, ctx.currentTime);
  lowPass.Q.setValueAtTime(0.7, ctx.currentTime);

  // 4. Dynamic Range Compressor: Boosts low-volume & whisper voice while protecting against loud bursts
  const compressor = ctx.createDynamicsCompressor();
  compressor.threshold.setValueAtTime(-28, ctx.currentTime);
  compressor.knee.setValueAtTime(30, ctx.currentTime);
  compressor.ratio.setValueAtTime(12, ctx.currentTime);
  compressor.attack.setValueAtTime(0.003, ctx.currentTime);
  compressor.release.setValueAtTime(0.25, ctx.currentTime);

  // 5. Post-Compressor Soft-Speech Gain Booster
  const gainNode = ctx.createGain();
  gainNode.gain.setValueAtTime(2.2, ctx.currentTime);

  // 6. Analyser & Script Processor
  const analyser = ctx.createAnalyser();
  analyser.fftSize = 1024;
  analyser.smoothingTimeConstant = 0.3;

  const processor = ctx.createScriptProcessor(4096, 1, 1);
  const chunks: Float32Array[] = [];
  let stopped = false;
  let lastLoud = Date.now();
  let spoke = false;

  // Adaptive noise floor baseline
  let noiseFloor = 0.008;
  let frameCount = 0;

  processor.onaudioprocess = (e) => {
    if (stopped) return;
    const input = e.inputBuffer.getChannelData(0);
    chunks.push(new Float32Array(input));

    // Calculate RMS energy of processed clean signal
    let sum = 0;
    for (let i = 0; i < input.length; i++) {
      sum += input[i]! * input[i]!;
    }
    const rms = Math.sqrt(sum / input.length);

    // Live adaptive noise floor tracker (calibrates room ambience during quiet moments)
    frameCount++;
    if (frameCount < 10) {
      noiseFloor = Math.max(0.003, Math.min(0.02, (noiseFloor + rms) / 2));
    } else if (rms < noiseFloor * 1.3) {
      noiseFloor = noiseFloor * 0.95 + rms * 0.05;
    }

    // Normalized visual level for UI animation (0.0 to 1.0)
    const visualLevel = Math.min(1, Math.max(0, (rms - noiseFloor) * 12));
    opts.onLevel?.(visualLevel);

    // Adaptive voice activity detection threshold (sensitive to whisper / low voices)
    const speechThreshold = Math.max(0.008, noiseFloor * 1.5);

    if (rms > speechThreshold) {
      lastLoud = Date.now();
      spoke = true;
    } else if (spoke && opts.onSilence && Date.now() - lastLoud > (opts.silenceMs ?? 2500)) {
      spoke = false;
      opts.onSilence();
    }
  };

  // Connect Audio Graph: Mic -> HighPass -> LowPass -> Compressor -> Gain -> Analyser -> Processor -> Destination
  source.connect(highPass);
  highPass.connect(lowPass);
  lowPass.connect(compressor);
  compressor.connect(gainNode);
  gainNode.connect(analyser);
  gainNode.connect(processor);
  processor.connect(ctx.destination);

  const teardown = () => {
    stopped = true;
    processor.onaudioprocess = null;
    try {
      processor.disconnect();
      gainNode.disconnect();
      compressor.disconnect();
      lowPass.disconnect();
      highPass.disconnect();
      source.disconnect();
    } catch {
      // noop
    }
    stream.getTracks().forEach((t) => t.stop());
  };

  return {
    cancel: () => {
      if (!stopped) teardown();
      void ctx.close().catch(() => undefined);
    },
    stop: async () => {
      if (!stopped) teardown();
      const rate = ctx.sampleRate;
      await ctx.close().catch(() => undefined);
      const pcm = downsample(concat(chunks), rate, TARGET_RATE);
      const wav = encodeWav(pcm, TARGET_RATE);
      return { base64: toBase64(wav), mimeType: "audio/wav", bytes: wav.byteLength };
    },
  };
}

function concat(chunks: Float32Array[]): Float32Array {
  const total = chunks.reduce((n, c) => n + c.length, 0);
  const out = new Float32Array(total);
  let off = 0;
  for (const c of chunks) {
    out.set(c, off);
    off += c.length;
  }
  return out;
}

function downsample(input: Float32Array, from: number, to: number): Float32Array {
  if (to >= from) return input;
  const ratio = from / to;
  const out = new Float32Array(Math.floor(input.length / ratio));
  for (let i = 0; i < out.length; i++) {
    const start = Math.floor(i * ratio);
    const end = Math.min(input.length, Math.floor((i + 1) * ratio));
    let sum = 0;
    for (let j = start; j < end; j++) sum += input[j]!;
    out[i] = sum / Math.max(1, end - start);
  }
  return out;
}

function encodeWav(samples: Float32Array, rate: number): ArrayBuffer {
  const buffer = new ArrayBuffer(44 + samples.length * 2);
  const view = new DataView(buffer);
  const str = (offset: number, s: string) => {
    for (let i = 0; i < s.length; i++) view.setUint8(offset + i, s.charCodeAt(i));
  };
  str(0, "RIFF");
  view.setUint32(4, 36 + samples.length * 2, true);
  str(8, "WAVE");
  str(12, "fmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, 1, true);
  view.setUint32(24, rate, true);
  view.setUint32(28, rate * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  str(36, "data");
  view.setUint32(40, samples.length * 2, true);
  let offset = 44;
  for (let i = 0; i < samples.length; i++, offset += 2) {
    const s = Math.max(-1, Math.min(1, samples[i]!));
    view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7fff, true);
  }
  return buffer;
}

function toBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  for (let i = 0; i < bytes.length; i += 8192) {
    binary += String.fromCharCode(...bytes.subarray(i, i + 8192));
  }
  return btoa(binary);
}