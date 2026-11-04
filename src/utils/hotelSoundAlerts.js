// Arab Signature Hotel & Suites — Luxury Front Desk High-Impact Sound Synthesizer
// Web Audio API pure synthesizer (zero external mp3/wav files, zero latency, 100% reliable)
// Specifically engineered to produce VERY LOUD, crystal-clear hotel reception alert sounds:
// 1. Room Reservation Fanfare (8s Continuous Ringing)
// 2. High-Energy Food & Drinks Order Alert (8s Continuous Ringing)
// 3. Front Desk Wing Intercom Alert (8s Continuous Ringtone)
// 4. Two-Tone Concierge Intercom Ping

let sharedAudioCtx = null;
let isAudioUnlocked = false;
let keepAliveOsc = null;

let activeSoundInterval = null;
let activeSoundTimeout = null;
let isAlertSoundActive = false;

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
 * Robust Audio Unlocker & Background Keep-Alive
 * Connects a sub-audible oscillator to keep browser audio hardware running
 * so background tabs and sudden notifications play immediately with zero delay.
 */
export function ensureAudioUnlocked() {
  const ctx = getAudioContext();
  if (!ctx) return Promise.resolve(false);

  return ctx.resume().then(() => {
    isAudioUnlocked = true;
    if (!keepAliveOsc) {
      try {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        gain.gain.value = 0.00001; // Sub-audible, keeps audio clock ticking
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        keepAliveOsc = osc;
      } catch (e) {}
    }
    return true;
  }).catch(() => false);
}

export function isAudioReady() {
  return isAudioUnlocked && sharedAudioCtx && sharedAudioCtx.state === 'running';
}

export function initAudioUnlocker() {
  if (typeof window === 'undefined') return;

  const unlock = () => {
    ensureAudioUnlocked().then(() => {
      ['click', 'touchstart', 'keydown'].forEach(evt => {
        window.removeEventListener(evt, unlock);
      });
    });
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
 * HARD STOP: Silences any currently playing continuous 8-second alert immediately
 */
export function stopAllAlertSounds() {
  isAlertSoundActive = false;
  if (activeSoundInterval) {
    clearInterval(activeSoundInterval);
    activeSoundInterval = null;
  }
  if (activeSoundTimeout) {
    clearTimeout(activeSoundTimeout);
    activeSoundTimeout = null;
  }
}

export function stopWingIntercomRingtone() {
  stopAllAlertSounds();
}

export function isWingRingtoneActive() {
  return isAlertSoundActive;
}

export function isAlertActive() {
  return isAlertSoundActive;
}

/**
 * Generic 8-Second Continuous Cadence Runner
 * Repeats burstFn at regular intervals across exactly durationMs (8 seconds)
 */
function playContinuousCadence(burstFn, intervalMs = 1500, durationMs = 8000) {
  try {
    stopAllAlertSounds();
    isAlertSoundActive = true;
    const startTime = Date.now();

    const runBurst = () => {
      if (!isAlertSoundActive) return;
      if (Date.now() - startTime >= durationMs) {
        stopAllAlertSounds();
        return;
      }
      const ctx = getAudioContext();
      if (!ctx) return;

      if (ctx.state === 'suspended') {
        ctx.resume().then(() => {
          if (isAlertSoundActive) burstFn(ctx);
        }).catch(() => {});
      } else {
        burstFn(ctx);
      }
    };

    // First burst immediately
    runBurst();

    // Repeat cadence
    activeSoundInterval = setInterval(runBurst, intervalMs);

    // Hard stop at durationMs
    activeSoundTimeout = setTimeout(() => {
      stopAllAlertSounds();
    }, durationMs);

    return stopAllAlertSounds;
  } catch (err) {
    console.warn('[Continuous Cadence Alert Notice]:', err);
  }
}

/**
 * Sound Burst 1: Reservation Fanfare Burst (C6, E6, G6, C7, A6, E7)
 */
function burstReservationFanfare(ctx) {
  const master = createMasterOutput(ctx, 1.0);
  playHarmonicBell(ctx, master, 1046.50, 0.00, 0.45, 0.85); // C6
  playHarmonicBell(ctx, master, 1318.51, 0.02, 0.50, 0.90); // E6
  playHarmonicBell(ctx, master, 1567.98, 0.18, 0.60, 0.95); // G6
  playHarmonicBell(ctx, master, 2093.00, 0.20, 0.65, 1.00); // C7
  playHarmonicBell(ctx, master, 1760.00, 0.42, 1.10, 0.95); // A6
  playHarmonicBell(ctx, master, 2637.02, 0.44, 1.15, 0.85); // E7
}

/**
 * Sound Burst 2: Dining Order Double-Strike Bell (F6, A6, C7)
 */
function burstDiningChime(ctx) {
  const master = createMasterOutput(ctx, 1.0);
  // Strike 1
  playHarmonicBell(ctx, master, 1396.91, 0.00, 0.35, 0.90); // F6
  playHarmonicBell(ctx, master, 1760.00, 0.05, 0.45, 0.95); // A6
  playHarmonicBell(ctx, master, 2093.00, 0.12, 0.70, 1.00); // C7
  // Strike 2
  playHarmonicBell(ctx, master, 1396.91, 0.35, 0.35, 0.90); // F6
  playHarmonicBell(ctx, master, 1760.00, 0.40, 0.45, 0.95); // A6
  playHarmonicBell(ctx, master, 2093.00, 0.48, 0.90, 1.00); // C7
}

/**
 * Sound Burst 3: Wing Intercom High Bell Strike (A5, C6, E6)
 */
function burstWingIntercomChime(ctx) {
  const master = createMasterOutput(ctx, 1.0);
  // Cadence 1
  playHarmonicBell(ctx, master, 880.00, 0.00, 0.30, 0.90);
  playHarmonicBell(ctx, master, 1046.50, 0.03, 0.35, 0.95);
  playHarmonicBell(ctx, master, 1318.51, 0.06, 0.40, 1.00);
  // Cadence 2
  playHarmonicBell(ctx, master, 880.00, 0.32, 0.30, 0.90);
  playHarmonicBell(ctx, master, 1046.50, 0.35, 0.35, 0.95);
  playHarmonicBell(ctx, master, 1318.51, 0.38, 0.48, 1.00);
}

/**
 * 1. 8-SECOND CONTINUOUS ROOM RESERVATION ALERT
 * Rings fanfare continuously for 8 seconds to ensure receptionist hears it.
 */
export function playLoudReservationAlert8s() {
  return playContinuousCadence(burstReservationFanfare, 1450, 8000);
}
export const playLoudReservationAlert = playLoudReservationAlert8s;

/**
 * 2. 8-SECOND CONTINUOUS FOOD & DRINKS ORDER ALERT
 * Rings dining bells continuously for 8 seconds to ensure kitchen/bar/desk hears it.
 */
export function playLoudDiningOrderAlert8s() {
  return playContinuousCadence(burstDiningChime, 1400, 8000);
}
export const playLoudDiningOrderAlert = playLoudDiningOrderAlert8s;

/**
 * 3. 8-SECOND CONTINUOUS WING INTERCOM RINGTONE
 * Rings cross-wing intercom bells continuously for 8 seconds.
 */
export function playWingIntercomRingtone8s() {
  return playContinuousCadence(burstWingIntercomChime, 1400, 8000);
}

/**
 * 4. SINGLE TWO-TONE CONCIERGE INTERCOM PING (Non-urgent / quick ping)
 */
export function playIntercomPing() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const play = (c) => {
      const master = createMasterOutput(c, 0.85);
      playHarmonicBell(c, master, 659.25, 0.00, 0.35, 0.75); // E5
      playHarmonicBell(c, master, 880.00, 0.16, 0.55, 0.85); // A5
    };
    if (ctx.state === 'suspended') {
      ctx.resume().then(() => play(ctx)).catch(() => {});
    } else {
      play(ctx);
    }
  } catch (err) {
    console.warn('[Intercom Ping Notice]:', err);
  }
}

/**
 * 5. BROWSER PUSH NOTIFICATION HELPER
 */
export function requestNotificationPermission() {
  if (typeof window !== 'undefined' && 'Notification' in window) {
    try {
      if (Notification.permission === 'default') {
        return Notification.requestPermission();
      }
      return Promise.resolve(Notification.permission);
    } catch (e) {
      return Promise.resolve('denied');
    }
  }
  return Promise.resolve('denied');
}

export function pushWingIntercomNotification({ senderBadge, senderName, text }) {
  if (typeof window !== 'undefined' && 'Notification' in window) {
    if (Notification.permission === 'granted') {
      try {
        const notif = new Notification(`🏨 Intercom • ${senderBadge || 'Front Desk'}`, {
          body: `${senderName || 'Desk'}: "${text || 'Incoming cross-wing message...'}"`,
          icon: '/logo.jpg',
          badge: '/logo.jpg',
          tag: 'wing-intercom-alert',
          requireInteraction: true
        });
        notif.onclick = () => {
          window.focus();
          ensureAudioUnlocked();
          notif.close();
        };
      } catch (e) {
        console.warn('[Browser Push Notification Error]:', e);
      }
    }
  }
}

export function pushReservationNotification({ guestName, roomNumber, code }) {
  if (typeof window !== 'undefined' && 'Notification' in window) {
    if (Notification.permission === 'granted') {
      try {
        const notif = new Notification(`🛎️ NEW RESERVATION • Room #${roomNumber}`, {
          body: `${guestName} reserved Room #${roomNumber} (${code || 'Pending'}).`,
          icon: '/logo.jpg',
          badge: '/logo.jpg',
          tag: 'reservation-alert',
          requireInteraction: true
        });
        notif.onclick = () => {
          window.focus();
          ensureAudioUnlocked();
          notif.close();
        };
      } catch (e) {}
    }
  }
}

export function pushDiningOrderNotification({ orderId, guestName, serviceLocation }) {
  if (typeof window !== 'undefined' && 'Notification' in window) {
    if (Notification.permission === 'granted') {
      try {
        const notif = new Notification(`🍽️ NEW DINING ORDER • ${orderId}`, {
          body: `${guestName} (${serviceLocation}) placed order ${orderId}.`,
          icon: '/logo.jpg',
          badge: '/logo.jpg',
          tag: 'dining-alert',
          requireInteraction: true
        });
        notif.onclick = () => {
          window.focus();
          ensureAudioUnlocked();
          notif.close();
        };
      } catch (e) {}
    }
  }
}

/**
 * Test loud sound immediately (also unlocks audio on user click)
 */
export function testLoudAlert(type = 'reservation') {
  ensureAudioUnlocked();
  if (type === 'dining') {
    playLoudDiningOrderAlert8s();
  } else if (type === 'wing_8s' || type === 'ringtone') {
    playWingIntercomRingtone8s();
  } else if (type === 'intercom') {
    playIntercomPing();
  } else {
    playLoudReservationAlert8s();
  }
}
