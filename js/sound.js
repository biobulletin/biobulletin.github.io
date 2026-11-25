/* =========================================================
   Sound — tiny sound effects made by the browser itself.

   No audio files: the Web Audio API lets us create a tone
   (an "oscillator", like a digital tuning fork) and shape how
   loud it is over time (a "gain" node, like a volume knob).
   A short tone that slides up = "pop", two quick high notes = "coin".
   ========================================================= */

const Sound = (() => {
  let ctx = null;   // the AudioContext: the browser's sound engine

  // Browsers only allow sound after the user clicks/taps something,
  // so we create (or wake up) the engine the first time we play.
  function engine() {
    if (!ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return null;          // very old browser: stay silent
      ctx = new AudioCtx();
    }
    if (ctx.state === "suspended") ctx.resume();
    return ctx;
  }

  // Play one tone.
  // freq: pitch in Hz · dur: seconds · type: wave shape · vol: 0–1
  // delay: start later (for little melodies) · slideTo: glide to this pitch
  function tone(c, { freq, dur = 0.12, type = "sine", vol = 0.12, delay = 0, slideTo = null }) {
    const start = c.currentTime + delay;
    const osc = c.createOscillator();
    const gain = c.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, start);
    if (slideTo) osc.frequency.exponentialRampToValueAtTime(slideTo, start + dur);

    // Volume: fade in very fast, then fade out → no harsh clicks
    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.exponentialRampToValueAtTime(vol, start + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + dur);

    osc.connect(gain).connect(c.destination);   // tone → volume knob → speakers
    osc.start(start);
    osc.stop(start + dur + 0.02);
  }

  // A cheerful scale (C D E G A C) for the clickable science icons
  const NOTES = [523.25, 587.33, 659.25, 783.99, 880.0, 1046.5];

  const effects = {
    click: (c) => tone(c, { freq: 660, dur: 0.05, type: "triangle", vol: 0.06 }),
    tick:  (c) => tone(c, { freq: 900, dur: 0.03, type: "square", vol: 0.03 }),
    pop:   (c) => tone(c, { freq: 320, dur: 0.12, vol: 0.14, slideTo: 720 }),
    boing: (c) => tone(c, { freq: 180, dur: 0.3, vol: 0.14, slideTo: 620 }),
    error: (c) => tone(c, { freq: 220, dur: 0.2, type: "sawtooth", vol: 0.05, slideTo: 140 }),
    coin: (c) => {
      tone(c, { freq: 988, dur: 0.08, type: "square", vol: 0.05 });
      tone(c, { freq: 1319, dur: 0.22, type: "square", vol: 0.05, delay: 0.08 });
    },
    chime: (c) => [523.25, 659.25, 783.99].forEach((f, i) =>
      tone(c, { freq: f, dur: 0.3, vol: 0.1, delay: i * 0.08 })),
    win: (c) => [523.25, 659.25, 783.99, 1046.5].forEach((f, i) =>
      tone(c, { freq: f, dur: 0.35, type: "triangle", vol: 0.12, delay: i * 0.1 })),
    note: (c, i = 0) => tone(c, { freq: NOTES[i % NOTES.length], dur: 0.35, type: "triangle", vol: 0.12 }),
  };

  function play(name, arg) {
    if (Store.get().muted) return;
    const effect = effects[name];
    if (!effect) return;
    const c = engine();
    if (c) effect(c, arg);
  }

  return { play, names: Object.keys(effects) };
})();
