type Bar = {
  piano: number[];
  bass: [number, number];
  lead: number | null;
  leadBeat: 0 | 1 | 2;
};

/** Three short smooth-jazz charts. Same band, different changes, like a 90s forecast bed. */
const TUNES: Bar[][] = [
  [
    { piano: [293.66, 349.23, 440, 523.25], bass: [146.83, 110], lead: null, leadBeat: 1 },
    { piano: [196, 246.94, 293.66, 349.23], bass: [98, 146.83], lead: 392, leadBeat: 1 },
    { piano: [261.63, 329.63, 392, 493.88], bass: [130.81, 196], lead: 329.63, leadBeat: 2 },
    { piano: [220, 261.63, 329.63, 392], bass: [110, 164.81], lead: null, leadBeat: 1 },
    { piano: [293.66, 349.23, 440, 523.25], bass: [146.83, 110], lead: 440, leadBeat: 1 },
    { piano: [196, 246.94, 293.66, 349.23], bass: [98, 123.47], lead: null, leadBeat: 1 },
    { piano: [261.63, 329.63, 392, 493.88], bass: [130.81, 196], lead: 523.25, leadBeat: 2 },
    { piano: [220, 261.63, 329.63, 392], bass: [110, 82.41], lead: 392, leadBeat: 1 },
  ],
  [
    { piano: [196, 233.08, 293.66, 349.23], bass: [98, 146.83], lead: null, leadBeat: 1 },
    { piano: [261.63, 329.63, 392, 466.16], bass: [130.81, 196], lead: 349.23, leadBeat: 2 },
    { piano: [174.61, 220, 261.63, 329.63], bass: [87.31, 130.81], lead: 440, leadBeat: 1 },
    { piano: [233.08, 293.66, 349.23, 440], bass: [116.54, 174.61], lead: null, leadBeat: 1 },
    { piano: [196, 233.08, 293.66, 349.23], bass: [98, 116.54], lead: 293.66, leadBeat: 1 },
    { piano: [261.63, 329.63, 392, 466.16], bass: [130.81, 174.61], lead: null, leadBeat: 1 },
    { piano: [174.61, 220, 261.63, 329.63], bass: [87.31, 130.81], lead: 523.25, leadBeat: 2 },
    { piano: [233.08, 293.66, 349.23, 440], bass: [116.54, 87.31], lead: 349.23, leadBeat: 1 },
  ],
  [
    { piano: [261.63, 329.63, 392], bass: [130.81, 98], lead: 523.25, leadBeat: 0 },
    { piano: [220, 261.63, 329.63], bass: [110, 164.81], lead: null, leadBeat: 1 },
    { piano: [174.61, 220, 261.63], bass: [87.31, 130.81], lead: 440, leadBeat: 2 },
    { piano: [196, 246.94, 293.66], bass: [98, 146.83], lead: null, leadBeat: 1 },
    { piano: [261.63, 329.63, 392], bass: [130.81, 164.81], lead: null, leadBeat: 1 },
    { piano: [233.08, 293.66, 349.23], bass: [116.54, 174.61], lead: 466.16, leadBeat: 1 },
    { piano: [220, 261.63, 329.63], bass: [110, 82.41], lead: null, leadBeat: 1 },
    { piano: [196, 246.94, 293.66, 392], bass: [98, 73.42], lead: 392, leadBeat: 2 },
  ],
];

/** Named cable beds. Same band, different changes. */
export const BEDS = [
  { id: "local", label: "Local on the 8s" },
  { id: "horizon", label: "Blue horizon" },
  { id: "night", label: "Night desk" },
] as const;

let context: AudioContext | null = null;
let master: GainNode | null = null;
let bed: GainNode | null = null;
let noise: AudioBuffer | null = null;
let timer: number | null = null;
let nextBeat = 0;
let step = 0;
let playing = false;
let lastStinger = 0;
let tuneIndex = 0;

function ctx() {
  if (typeof window === "undefined") return null;
  const Ctor =
    window.AudioContext ||
    (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!Ctor) return null;
  if (!context) {
    context = new Ctor();
    master = context.createGain();
    master.gain.value = 0.9;
    master.connect(context.destination);
    const warm = context.createBiquadFilter();
    warm.type = "lowpass";
    warm.frequency.value = 3800;
    bed = context.createGain();
    bed.gain.value = 1e-4;
    bed.connect(warm);
    warm.connect(master);
  }
  if (context.state === "suspended") void context.resume();
  return context;
}

function rhodes(audio: AudioContext, dest: GainNode, when: number, freq: number, dur: number, peak: number) {
  const osc = audio.createOscillator();
  const chorus = audio.createOscillator();
  const gain = audio.createGain();
  osc.type = "sine";
  chorus.type = "triangle";
  osc.frequency.setValueAtTime(freq, when);
  chorus.frequency.setValueAtTime(freq, when);
  chorus.detune.setValueAtTime(8, when);
  gain.gain.setValueAtTime(1e-4, when);
  gain.gain.exponentialRampToValueAtTime(Math.max(1e-4, peak), when + 0.07);
  gain.gain.exponentialRampToValueAtTime(1e-4, when + dur);
  osc.connect(gain);
  chorus.connect(gain);
  gain.connect(dest);
  osc.start(when);
  chorus.start(when);
  osc.stop(when + dur + 0.05);
  chorus.stop(when + dur + 0.05);
}

function bass(audio: AudioContext, dest: GainNode, when: number, freq: number, dur: number, peak: number) {
  const osc = audio.createOscillator();
  const gain = audio.createGain();
  osc.type = "sine";
  osc.frequency.setValueAtTime(freq * 1.04, when);
  osc.frequency.exponentialRampToValueAtTime(Math.max(40, freq), when + 0.06);
  gain.gain.setValueAtTime(1e-4, when);
  gain.gain.exponentialRampToValueAtTime(Math.max(1e-4, peak), when + 0.03);
  gain.gain.exponentialRampToValueAtTime(1e-4, when + dur);
  osc.connect(gain);
  gain.connect(dest);
  osc.start(when);
  osc.stop(when + dur + 0.04);
}

function lead(audio: AudioContext, dest: GainNode, when: number, freq: number, dur: number, peak: number) {
  const osc = audio.createOscillator();
  const body = audio.createOscillator();
  const lfo = audio.createOscillator();
  const wobble = audio.createGain();
  const gain = audio.createGain();
  osc.type = "sine";
  body.type = "triangle";
  lfo.type = "sine";
  osc.frequency.setValueAtTime(freq, when);
  body.frequency.setValueAtTime(freq, when);
  body.detune.setValueAtTime(-6, when);
  lfo.frequency.setValueAtTime(4.2, when);
  wobble.gain.setValueAtTime(freq * 0.008, when);
  lfo.connect(wobble);
  wobble.connect(osc.frequency);
  gain.gain.setValueAtTime(1e-4, when);
  gain.gain.exponentialRampToValueAtTime(Math.max(1e-4, peak), when + 0.12);
  gain.gain.exponentialRampToValueAtTime(1e-4, when + dur);
  osc.connect(gain);
  body.connect(gain);
  gain.connect(dest);
  osc.start(when);
  body.start(when);
  lfo.start(when);
  osc.stop(when + dur + 0.05);
  body.stop(when + dur + 0.05);
  lfo.stop(when + dur + 0.05);
}

function brush(audio: AudioContext, when: number, peak: number) {
  if (!bed) return;
  if (!noise) {
    noise = audio.createBuffer(1, Math.floor(audio.sampleRate * 0.2), audio.sampleRate);
    const data = noise.getChannelData(0);
    for (let i = 0; i < data.length; i += 1) data[i] = Math.random() * 2 - 1;
  }
  const source = audio.createBufferSource();
  source.buffer = noise;
  const filter = audio.createBiquadFilter();
  filter.type = "bandpass";
  filter.frequency.value = 2800;
  filter.Q.value = 0.7;
  const gain = audio.createGain();
  gain.gain.setValueAtTime(Math.max(1e-4, peak), when);
  gain.gain.exponentialRampToValueAtTime(1e-4, when + 0.12);
  source.connect(filter);
  filter.connect(gain);
  gain.connect(bed);
  source.start(when);
  source.stop(when + 0.14);
}

function bell(audio: AudioContext, dest: GainNode, when: number, freq: number, dur: number, peak: number) {
  const osc = audio.createOscillator();
  const gain = audio.createGain();
  osc.type = "sine";
  osc.frequency.setValueAtTime(freq, when);
  gain.gain.setValueAtTime(1e-4, when);
  gain.gain.exponentialRampToValueAtTime(Math.max(1e-4, peak), when + 0.02);
  gain.gain.exponentialRampToValueAtTime(1e-4, when + dur);
  osc.connect(gain);
  gain.connect(dest);
  osc.start(when);
  osc.stop(when + dur + 0.03);
}

const HORIZON = [
  { piano: [220, 261.63, 329.63, 440], bass: 110, note: 659.25 },
  { piano: [196, 246.94, 293.66, 392], bass: 98, note: 587.33 },
  { piano: [174.61, 220, 261.63, 349.23], bass: 87.31, note: 523.25 },
  { piano: [164.81, 196, 246.94, 329.63], bass: 82.41, note: 493.88 },
  { piano: [174.61, 220, 261.63, 349.23], bass: 87.31, note: 523.25 },
  { piano: [130.81, 164.81, 196, 261.63], bass: 65.41, note: 392 },
  { piano: [146.83, 174.61, 220, 293.66], bass: 73.42, note: 698.46 },
  { piano: [110, 164.81, 220, 329.63], bass: 55, note: 440 },
];

const NIGHT_MELODY = [392, 440, 493.88, 587.33, 659.25, 587.33, 493.88, 440, 349.23, 392, 440, 523.25, 587.33, 523.25, 440, 392];
const NIGHT_BASS = [98, 110, 82.41, 98, 73.42, 87.31, 98, 65.41];
const SONG_BPM = [84, 68, 112];

function playLocal(when: number, step: number) {
  if (!context || !bed) return;
  const tune = TUNES[0];
  const bar = tune[Math.floor(step / 4) % tune.length];
  const place = step % 4;
  if (!bar) return;
  if (place === 0) {
    bar.piano.forEach((freq, i) => rhodes(context!, bed!, when, freq, 2.1, 0.034 - i * 0.005));
    bass(context, bed, when, bar.bass[0], 0.55, 0.1);
  }
  if (place === 2) bass(context, bed, when, bar.bass[1], 0.4, 0.065);
  if (place === 1 || place === 3) brush(context, when, place === 3 ? 0.016 : 0.012);
  if (bar.lead && place === bar.leadBeat) lead(context, bed, when, bar.lead, 1.35, 0.04);
}

function playHorizon(when: number, step: number) {
  if (!context || !bed || step % 4 !== 0) return;
  const bar = HORIZON[Math.floor(step / 4) % HORIZON.length];
  if (!bar) return;
  bar.piano.forEach((freq, i) => rhodes(context!, bed!, when, freq, 3.4, 0.028 - i * 0.004));
  bass(context, bed, when, bar.bass, 1.8, 0.07);
  bell(context, bed, when, bar.note, 2.6, 0.05);
}

function playNight(when: number, step: number) {
  if (!context || !bed) return;
  const note = NIGHT_MELODY[step % NIGHT_MELODY.length] ?? 392;
  bell(context, bed, when, note, 0.22, 0.055);
  const place = step % 4;
  if (place === 0 || place === 2) {
    const root = NIGHT_BASS[Math.floor(step / 4) % NIGHT_BASS.length] ?? 98;
    bass(context, bed, when, place === 0 ? root : root * 1.5, 0.24, 0.08);
  }
  if (place === 1) rhodes(context, bed, when, note / 2, 0.18, 0.03);
  if (place === 3) brush(context, when, 0.02);
}

function tick() {
  if (!context || !bed || !playing) return;
  const beat = 60 / (SONG_BPM[tuneIndex] ?? 84);
  while (nextBeat < context.currentTime + 0.5) {
    if (tuneIndex === 1) playHorizon(nextBeat, step);
    else if (tuneIndex === 2) playNight(nextBeat, step);
    else playLocal(nextBeat, step);
    nextBeat += beat;
    step += 1;
  }
  timer = window.setTimeout(tick, 140);
}

export function unlockAudio() {
  ctx();
}

export function setBedTune(id: string) {
  const index = BEDS.findIndex((item) => item.id === id);
  tuneIndex = index < 0 ? 0 : index;
  step = 0;
  if (context && playing) nextBeat = context.currentTime + 0.05;
}

export function startBed(volume: number) {
  const audio = ctx();
  if (!audio || !bed) return;
  bed.gain.cancelScheduledValues(audio.currentTime);
  bed.gain.linearRampToValueAtTime(Math.max(1e-4, volume), audio.currentTime + 0.2);
  if (!playing) {
    playing = true;
    nextBeat = audio.currentTime + 0.12;
    step = 0;
    tick();
  }
}

export function stopBed() {
  playing = false;
  if (timer != null) {
    window.clearTimeout(timer);
    timer = null;
  }
  if (context && bed) {
    const now = context.currentTime;
    bed.gain.cancelScheduledValues(now);
    bed.gain.setValueAtTime(Math.max(1e-4, bed.gain.value), now);
    bed.gain.linearRampToValueAtTime(1e-4, now + 0.35);
  }
}

export function setBedVolume(volume: number) {
  if (!context || !bed || !playing) return;
  bed.gain.cancelScheduledValues(context.currentTime);
  bed.gain.linearRampToValueAtTime(Math.max(1e-4, volume), context.currentTime + 0.05);
}

function sting(notes: number[], gap: number, peak: number) {
  const audio = ctx();
  if (!audio || !master) return false;
  const start = audio.currentTime + 0.05;
  notes.forEach((freq, i) => rhodes(audio, master!, start + i * gap, freq, 0.7, peak));
  return true;
}

export function hourStinger() {
  const audio = ctx();
  if (!audio || !master) return false;
  if (lastStinger > 0 && audio.currentTime - lastStinger < 50) return false;
  lastStinger = audio.currentTime;
  return sting([392, 493.88, 587.33, 659.25], 0.16, 0.045);
}

export function bulletinStinger() {
  return sting([329.63, 392, 493.88, 523.25], 0.14, 0.05);
}
