const SOUND_MUTED_KEY = "sentinel.tactical-click-muted";

export function isTacticalSoundMuted(): boolean {
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem(SOUND_MUTED_KEY) === "true";
}

/** A short, mechanical ratchet click for deliberate event transitions. */
export function playTacticalClick(): void {
  if (typeof window === "undefined" || isTacticalSoundMuted()) return;
  const AudioContextClass = window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AudioContextClass) return;

  const context = new AudioContextClass();
  const now = context.currentTime;
  const master = context.createGain();
  const compressor = context.createDynamicsCompressor();
  master.gain.setValueAtTime(0.82, now);
  compressor.threshold.value = -18;
  compressor.knee.value = 4;
  compressor.ratio.value = 7;
  compressor.attack.value = 0.001;
  compressor.release.value = 0.035;
  master.connect(compressor);
  compressor.connect(context.destination);

  // A hard pawl strike followed by a quieter metal rebound reads as one ratchet notch.
  [
    { offset: 0, level: 0.42, frequency: 3200, duration: 0.008 },
    { offset: 0.011, level: 0.18, frequency: 2100, duration: 0.01 },
  ].forEach(({ offset, level, frequency, duration }) => {
    const buffer = context.createBuffer(1, Math.ceil(context.sampleRate * duration), context.sampleRate);
    const channel = buffer.getChannelData(0);
    for (let i = 0; i < channel.length; i += 1) {
      const decay = Math.exp(-9 * i / channel.length);
      channel[i] = (Math.random() * 2 - 1) * decay;
    }
    const source = context.createBufferSource();
    const filter = context.createBiquadFilter();
    const gain = context.createGain();
    filter.type = "bandpass";
    filter.frequency.value = frequency;
    filter.Q.value = 2.6;
    gain.gain.setValueAtTime(0.0001, now + offset);
    gain.gain.exponentialRampToValueAtTime(level, now + offset + 0.0007);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + offset + duration);
    source.buffer = buffer;
    source.connect(filter).connect(gain).connect(master);
    source.start(now + offset);
    source.stop(now + offset + duration);
  });

  const body = context.createOscillator();
  const bodyGain = context.createGain();
  body.type = "sine";
  body.frequency.setValueAtTime(680, now);
  body.frequency.exponentialRampToValueAtTime(420, now + 0.018);
  bodyGain.gain.setValueAtTime(0.11, now);
  bodyGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.022);
  body.connect(bodyGain).connect(master);
  body.start(now);
  body.stop(now + 0.024);
  body.addEventListener("ended", () => { void context.close(); }, { once: true });
}

let sharedAudioContext: AudioContext | null = null;

function getSharedAudioContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  const AudioContextClass = window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AudioContextClass) return null;
  try {
    if (!sharedAudioContext || sharedAudioContext.state === "closed") {
      sharedAudioContext = new AudioContextClass();
    }
    if (sharedAudioContext.state === "suspended") {
      sharedAudioContext.resume().catch(() => {});
    }
    return sharedAudioContext;
  } catch {
    return null;
  }
}

let lastMorseBeepTime = 0;

/** Plays an authentic tactical telegraph morse CW tone (750 Hz sine with raised-cosine keying) */
export function playMorseBeep(type: "dit" | "dah" = "dit"): void {
  if (typeof window === "undefined" || isTacticalSoundMuted()) return;
  const nowMs = Date.now();
  // Minimum throttle to avoid audio queue collision
  const minInterval = type === "dit" ? 38 : 95;
  if (nowMs - lastMorseBeepTime < minInterval) return;
  lastMorseBeepTime = nowMs;

  const ctx = getSharedAudioContext();
  if (!ctx || ctx.state !== "running") return;

  try {
    const now = ctx.currentTime;
    // Authentic ITU radio telegraphy duration: dit = 42ms, dah = 126ms (1:3 ratio)
    const duration = type === "dit" ? 0.042 : 0.126;
    const freq = 750; // Standard international CW sidetone

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(freq, now);

    // Raised-cosine 4ms attack and release envelope to prevent key-click splatter
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.linearRampToValueAtTime(0.048, now + 0.004);
    gain.gain.setValueAtTime(0.048, now + duration - 0.005);
    gain.gain.linearRampToValueAtTime(0.0001, now + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + duration);
  } catch {
    // Audio safe fallback
  }
}

/** Plays a soft tactical lock-in chime when morse decryption completes */
export function playDecryptionComplete(): void {
  if (typeof window === "undefined" || isTacticalSoundMuted()) return;
  const ctx = getSharedAudioContext();
  if (!ctx || ctx.state !== "running") return;

  try {
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(880, now);
    osc.frequency.exponentialRampToValueAtTime(1174.66, now + 0.08);

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.linearRampToValueAtTime(0.038, now + 0.006);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.11);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.11);
  } catch {
    // Audio safe fallback
  }
}

export function setTacticalSoundMuted(muted: boolean): void {
  if (typeof window !== "undefined") window.localStorage.setItem(SOUND_MUTED_KEY, String(muted));
}

