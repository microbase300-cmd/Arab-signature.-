// Arab Signature Hotel & Suites — Luxury Front Desk High-Impact Sound Synthesizer
// Web Audio API pure synthesizer (zero external mp3/wav files, zero latency, 100% reliable)
// Specifically engineered to produce VERY LOUD, crystal-clear hotel reception alert sounds:
// 1. Room Reservation Fanfare & Front Desk Bell Chime (Cuts through lobby ambient noise)
// 2. High-Energy Food & Drinks Order Alert (For Main Reception & Dining Hub)
// 3. Two-Tone Concierge Intercom Ping

let sharedAudioCtx = null;
let isAudioUnlocked = false;

/**
 * Get or initialize shared AudioContext
 */
export function getAudioContext() {
  if (typeof window === 'undefined') return null;
  if (!sharedAudioCtx) {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (AudioCtx) {
      sharedAudioCtx = new AudioCtx();
    }
  }
  if (sharedAudioCtx && sharedAudioCtx.state === 'suspended') {
    sharedAudioCtx.resume().then(() => {
      isAudioUnlocked = true;
    }).catch(() => {});
  } else if (sharedAudioCtx && sharedAudioCtx.state === 'running') {
    isAudioUnlocked = true;
  }
  return sharedAudioCtx;
}

/**
 * Autoplay Unlocker: Attaches one-time interaction listeners to window
 * Ensures audio plays without browser autoplay blocking.
 */
export function initAudioUnlocker() {
  if (typeof window === 'undefined' || isAudioUnlocked) return;

  const unlock = () => {
    const ctx = getAudioContext();
    if (ctx) {
      ctx.resume().then(() => {
        isAudioUnlocked = true;
        ['click', 'touchstart', 'keydown'].forEach(evt => {
          window.removeEventListener(evt, unlock);
        });
      }).catch(() => {});
    }
  };

  ['click', 'touchstart', 'keydown'].forEach(evt => {
    window.addEventListener(evt, unlock, { once: true, passive: true });
  });
}

/**
 * Helper to build a Master Dynamics Compressor Node
 * Boosts perceived acoustic loudness (RMS) while preventing clipping/distortion
 */
function createMasterOutput(ctx, masterGainVal = 0.98) {
  const compressor = ctx.createDynamicsCompressor();
  compressor.threshold.setValueAtTime(-14, ctx.currentTime);
  compressor.knee.setValueAtTime(10, ctx.currentTime);
  compressor.ratio.setValueAtTime(4, ctx.currentTime);
  compressor.attack.setValueAtTime(0.003, ctx.currentTime);
  compressor.release.setValueAtTime(0.18, ctx.currentTime);

  const masterGain = ctx.createGain();
  masterGain.gain.setValueAtTime(masterGainVal, ctx.currentTime);

  compressor.connect(masterGain);
  masterGain.connect(ctx.destination);

  return compressor;
}

/**
 * Helper to play an acoustic bell harmonic note
 */
function playHarmonicBell(ctx, dest, freq, delay, duration, gainLevel = 0.8) {
  const t = ctx.currentTime + delay;

  // 1. Fundamental tone (Sine wave for pure chime body)
  const osc1 = ctx.createOscillator();
  const gain1 = ctx.createGain();
  osc1.type = 'sine';
  osc1.frequency.setValueAtTime(freq, t);

  gain1.gain.setValueAtTime(0, t);
  gain1.gain.linearRampToValueAtTime(gainLevel, t + 0.015);
  gain1.gain.exponentialRampToValueAtTime(0.0005, t + duration);

  osc1.connect(gain1);
  gain1.connect(dest);
  osc1.start(t);
  osc1.stop(t + duration);

  // 2. Bright Upper Harmonic (Triangle wave for physical brass strike presence)
  const osc2 = ctx.createOscillator();
  const gain2 = ctx.createGain();
  osc2.type = 'triangle';
  osc2.frequency.setValueAtTime(freq * 2.01, t); // Slight overtone detune for authentic acoustic ring

  gain2.gain.setValueAtTime(0, t);
  gain2.gain.linearRampToValueAtTime(gainLevel * 0.45, t + 0.01);
  gain2.gain.exponentialRampToValueAtTime(0.0005, t + duration * 0.65);

  osc2.connect(gain2);
  gain2.connect(dest);
  osc2.start(t);
  osc2.stop(t + duration);
}

/**
 * 1. VERY LOUD ROOM RESERVATION ALERT
 * High-energy, resonant 3-stage luxury hotel front desk brass fanfare
 * Plays multi-harmonic chimes that pierce through ambient hall noise
 */
export function playLoudReservationAlert() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    if (ctx.state === 'suspended') ctx.resume();

    const master = createMasterOutput(ctx, 1.0); // Maximum clean loudness

    // --- Cycle 1: Urgent Rising Front Desk Chime ---
    // Note 1: High alert strike
    playHarmonicBell(ctx, master, 1046.50, 0.00, 0.55, 0.85); // C6
    playHarmonicBell(ctx, master, 1318.51, 0.02, 0.60, 0.90); // E6

    // Note 2: Higher register strike
    playHarmonicBell(ctx, master, 1567.98, 0.22, 0.70, 0.95); // G6
    playHarmonicBell(ctx, master, 2093.00, 0.24, 0.75, 1.00); // C7

    // Note 3: Long luxury brass bell sustain
    playHarmonicBell(ctx, master, 1760.00, 0.50, 1.40, 0.95); // A6
    playHarmonicBell(ctx, master, 2637.02, 0.52, 1.50, 0.85); // E7

    // --- Cycle 2: Secondary High-Impact Repeat (0.9s later) ---
    playHarmonicBell(ctx, master, 1318.51, 0.90, 0.55, 0.90); // E6
    playHarmonicBell(ctx, master, 1760.00, 1.08, 0.70, 0.95); // A6
    playHarmonicBell(ctx, master, 2093.00, 1.28, 1.60, 1.00); // C7 (Grand finish bell)
    playHarmonicBell(ctx, master, 2637.02, 1.30, 1.60, 0.90); // E7
  } catch (err) {
    console.warn('[Loud Reservation Sound Notice]:', err);
  }
}

/**
 * 2. VERY LOUD FOOD & DRINKS ORDER ALERT (Main Reception & Bar/Kitchen)
 * Distinctive energetic double-strike dining bell
 */
export function playLoudDiningOrderAlert() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    if (ctx.state === 'suspended') ctx.resume();

    const master = createMasterOutput(ctx, 0.98);

    // Double Ring 1
    playHarmonicBell(ctx, master, 1396.91, 0.00, 0.40, 0.90); // F6
    playHarmonicBell(ctx, master, 1760.00, 0.08, 0.55, 0.95); // A6
    playHarmonicBell(ctx, master, 2093.00, 0.18, 0.90, 1.00); // C7

    // Double Ring 2 (Rapid second ring)
    playHarmonicBell(ctx, master, 1396.91, 0.42, 0.40, 0.90); // F6
    playHarmonicBell(ctx, master, 1760.00, 0.50, 0.55, 0.95); // A6
    playHarmonicBell(ctx, master, 2093.00, 0.60, 1.30, 1.00); // C7
  } catch (err) {
    console.warn('[Loud Dining Order Sound Notice]:', err);
  }
}

/**
 * 3. FRONT DESK INTERCOM CHIME
 * Pleasant two-tone concierge walkie ping
 */
export function playIntercomPing() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    if (ctx.state === 'suspended') ctx.resume();

    const master = createMasterOutput(ctx, 0.85);
    playHarmonicBell(ctx, master, 659.25, 0.00, 0.35, 0.75); // E5
    playHarmonicBell(ctx, master, 880.00, 0.16, 0.55, 0.85); // A5
  } catch (err) {
    console.warn('[Intercom Ping Notice]:', err);
  }
}

/**
 * Test loud sound immediately (also unlocks audio on user click)
 */
export function testLoudAlert(type = 'reservation') {
  initAudioUnlocker();
  const ctx = getAudioContext();
  if (ctx && ctx.state === 'suspended') {
    ctx.resume();
  }
  if (type === 'dining') {
    playLoudDiningOrderAlert();
  } else if (type === 'intercom') {
    playIntercomPing();
  } else {
    playLoudReservationAlert();
  }
}
