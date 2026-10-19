import { i as __toESM } from "../_runtime.mjs";
import { i as require_react, r as require_jsx_runtime, t as useQuery } from "../_libs/react+tanstack__react-query.mjs";
import { a as string, i as object, t as number } from "../_libs/zod.mjs";
import { i as Bell, n as Radio, r as LocateFixed } from "../_libs/lucide-react.mjs";
import { n as TSS_SERVER_FUNCTION, r as getServerFnById, t as createServerFn } from "./ssr.mjs";
import { S as windSentence, _ as ringsFor, a as aboutWhen, c as clock, d as formatMiles, f as longWhen, g as plainAnswer, h as placeSentence, i as TAPE, l as compassWord, m as nextRing, n as MARKS, o as badgeClass, p as markLabel, r as STUDIOS, s as bulletinCopy, t as HORIZONS, u as countdown, v as shortWhen, x as viewingCall, y as skyWords } from "./tape-BM1iAg_i.mjs";
import { n as create, t as persist } from "../_libs/zustand.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-6iSO7qoH.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
/** Three short smooth-jazz charts. Same band, different changes, like a 90s forecast bed. */
var TUNES = [
	[
		{
			piano: [
				293.66,
				349.23,
				440,
				523.25
			],
			bass: [146.83, 110],
			lead: null,
			leadBeat: 1
		},
		{
			piano: [
				196,
				246.94,
				293.66,
				349.23
			],
			bass: [98, 146.83],
			lead: 392,
			leadBeat: 1
		},
		{
			piano: [
				261.63,
				329.63,
				392,
				493.88
			],
			bass: [130.81, 196],
			lead: 329.63,
			leadBeat: 2
		},
		{
			piano: [
				220,
				261.63,
				329.63,
				392
			],
			bass: [110, 164.81],
			lead: null,
			leadBeat: 1
		},
		{
			piano: [
				293.66,
				349.23,
				440,
				523.25
			],
			bass: [146.83, 110],
			lead: 440,
			leadBeat: 1
		},
		{
			piano: [
				196,
				246.94,
				293.66,
				349.23
			],
			bass: [98, 123.47],
			lead: null,
			leadBeat: 1
		},
		{
			piano: [
				261.63,
				329.63,
				392,
				493.88
			],
			bass: [130.81, 196],
			lead: 523.25,
			leadBeat: 2
		},
		{
			piano: [
				220,
				261.63,
				329.63,
				392
			],
			bass: [110, 82.41],
			lead: 392,
			leadBeat: 1
		}
	],
	[
		{
			piano: [
				196,
				233.08,
				293.66,
				349.23
			],
			bass: [98, 146.83],
			lead: null,
			leadBeat: 1
		},
		{
			piano: [
				261.63,
				329.63,
				392,
				466.16
			],
			bass: [130.81, 196],
			lead: 349.23,
			leadBeat: 2
		},
		{
			piano: [
				174.61,
				220,
				261.63,
				329.63
			],
			bass: [87.31, 130.81],
			lead: 440,
			leadBeat: 1
		},
		{
			piano: [
				233.08,
				293.66,
				349.23,
				440
			],
			bass: [116.54, 174.61],
			lead: null,
			leadBeat: 1
		},
		{
			piano: [
				196,
				233.08,
				293.66,
				349.23
			],
			bass: [98, 116.54],
			lead: 293.66,
			leadBeat: 1
		},
		{
			piano: [
				261.63,
				329.63,
				392,
				466.16
			],
			bass: [130.81, 174.61],
			lead: null,
			leadBeat: 1
		},
		{
			piano: [
				174.61,
				220,
				261.63,
				329.63
			],
			bass: [87.31, 130.81],
			lead: 523.25,
			leadBeat: 2
		},
		{
			piano: [
				233.08,
				293.66,
				349.23,
				440
			],
			bass: [116.54, 87.31],
			lead: 349.23,
			leadBeat: 1
		}
	],
	[
		{
			piano: [
				261.63,
				329.63,
				392
			],
			bass: [130.81, 98],
			lead: 523.25,
			leadBeat: 0
		},
		{
			piano: [
				220,
				261.63,
				329.63
			],
			bass: [110, 164.81],
			lead: null,
			leadBeat: 1
		},
		{
			piano: [
				174.61,
				220,
				261.63
			],
			bass: [87.31, 130.81],
			lead: 440,
			leadBeat: 2
		},
		{
			piano: [
				196,
				246.94,
				293.66
			],
			bass: [98, 146.83],
			lead: null,
			leadBeat: 1
		},
		{
			piano: [
				261.63,
				329.63,
				392
			],
			bass: [130.81, 164.81],
			lead: null,
			leadBeat: 1
		},
		{
			piano: [
				233.08,
				293.66,
				349.23
			],
			bass: [116.54, 174.61],
			lead: 466.16,
			leadBeat: 1
		},
		{
			piano: [
				220,
				261.63,
				329.63
			],
			bass: [110, 82.41],
			lead: null,
			leadBeat: 1
		},
		{
			piano: [
				196,
				246.94,
				293.66,
				392
			],
			bass: [98, 73.42],
			lead: 392,
			leadBeat: 2
		}
	]
];
var context = null;
var master = null;
var bed = null;
var noise = null;
var timer = null;
var nextBeat = 0;
var step = 0;
var playing = false;
var lastStinger = 0;
var tuneShift = 0;
var BPM = 84;
function ctx() {
	if (typeof window === "undefined") return null;
	const Ctor = window.AudioContext || window.webkitAudioContext;
	if (!Ctor) return null;
	if (!context) {
		context = new Ctor();
		master = context.createGain();
		master.gain.value = .9;
		master.connect(context.destination);
		const warm = context.createBiquadFilter();
		warm.type = "lowpass";
		warm.frequency.value = 3800;
		bed = context.createGain();
		bed.gain.value = 1e-4;
		bed.connect(warm);
		warm.connect(master);
	}
	if (context.state === "suspended") context.resume();
	return context;
}
function rhodes(audio, dest, when, freq, dur, peak) {
	const osc = audio.createOscillator();
	const chorus = audio.createOscillator();
	const gain = audio.createGain();
	osc.type = "sine";
	chorus.type = "triangle";
	osc.frequency.setValueAtTime(freq, when);
	chorus.frequency.setValueAtTime(freq, when);
	chorus.detune.setValueAtTime(8, when);
	gain.gain.setValueAtTime(1e-4, when);
	gain.gain.exponentialRampToValueAtTime(Math.max(1e-4, peak), when + .07);
	gain.gain.exponentialRampToValueAtTime(1e-4, when + dur);
	osc.connect(gain);
	chorus.connect(gain);
	gain.connect(dest);
	osc.start(when);
	chorus.start(when);
	osc.stop(when + dur + .05);
	chorus.stop(when + dur + .05);
}
function bass(audio, dest, when, freq, dur, peak) {
	const osc = audio.createOscillator();
	const gain = audio.createGain();
	osc.type = "sine";
	osc.frequency.setValueAtTime(freq * 1.04, when);
	osc.frequency.exponentialRampToValueAtTime(Math.max(40, freq), when + .06);
	gain.gain.setValueAtTime(1e-4, when);
	gain.gain.exponentialRampToValueAtTime(Math.max(1e-4, peak), when + .03);
	gain.gain.exponentialRampToValueAtTime(1e-4, when + dur);
	osc.connect(gain);
	gain.connect(dest);
	osc.start(when);
	osc.stop(when + dur + .04);
}
function lead(audio, dest, when, freq, dur, peak) {
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
	wobble.gain.setValueAtTime(freq * .008, when);
	lfo.connect(wobble);
	wobble.connect(osc.frequency);
	gain.gain.setValueAtTime(1e-4, when);
	gain.gain.exponentialRampToValueAtTime(Math.max(1e-4, peak), when + .12);
	gain.gain.exponentialRampToValueAtTime(1e-4, when + dur);
	osc.connect(gain);
	body.connect(gain);
	gain.connect(dest);
	osc.start(when);
	body.start(when);
	lfo.start(when);
	osc.stop(when + dur + .05);
	body.stop(when + dur + .05);
	lfo.stop(when + dur + .05);
}
function brush(audio, when, peak) {
	if (!bed) return;
	if (!noise) {
		noise = audio.createBuffer(1, Math.floor(audio.sampleRate * .2), audio.sampleRate);
		const data = noise.getChannelData(0);
		for (let i = 0; i < data.length; i += 1) data[i] = Math.random() * 2 - 1;
	}
	const source = audio.createBufferSource();
	source.buffer = noise;
	const filter = audio.createBiquadFilter();
	filter.type = "bandpass";
	filter.frequency.value = 2800;
	filter.Q.value = .7;
	const gain = audio.createGain();
	gain.gain.setValueAtTime(Math.max(1e-4, peak), when);
	gain.gain.exponentialRampToValueAtTime(1e-4, when + .12);
	source.connect(filter);
	filter.connect(gain);
	gain.connect(bed);
	source.start(when);
	source.stop(when + .14);
}
function tick() {
	if (!context || !bed || !playing) return;
	const beat = 60 / BPM;
	while (nextBeat < context.currentTime + .5) {
		const tune = TUNES[(Math.floor(step / 32) + tuneShift) % TUNES.length] ?? TUNES[0];
		const bar = tune[Math.floor(step / 4) % tune.length] ?? tune[0];
		const place = step % 4;
		if (place === 0 && bar) {
			bar.piano.forEach((freq, i) => rhodes(context, bed, nextBeat, freq, 2.1, .034 - i * .005));
			bass(context, bed, nextBeat, bar.bass[0], .55, .1);
		}
		if (place === 2 && bar) bass(context, bed, nextBeat, bar.bass[1], .4, .065);
		if ((place === 1 || place === 3) && bar) brush(context, nextBeat, place === 3 ? .016 : .012);
		if (bar?.lead && place === bar.leadBeat) lead(context, bed, nextBeat, bar.lead, 1.35, .04);
		nextBeat += beat;
		step += 1;
	}
	timer = window.setTimeout(tick, 140);
}
function unlockAudio() {
	ctx();
}
function startBed(volume) {
	const audio = ctx();
	if (!audio || !bed) return;
	bed.gain.cancelScheduledValues(audio.currentTime);
	bed.gain.linearRampToValueAtTime(Math.max(1e-4, volume), audio.currentTime + .2);
	if (!playing) {
		playing = true;
		nextBeat = audio.currentTime + .12;
		step = 0;
		tuneShift = Math.floor(Math.random() * TUNES.length);
		tick();
	}
}
function stopBed() {
	playing = false;
	if (timer != null) {
		window.clearTimeout(timer);
		timer = null;
	}
	if (context && bed) {
		const now = context.currentTime;
		bed.gain.cancelScheduledValues(now);
		bed.gain.setValueAtTime(Math.max(1e-4, bed.gain.value), now);
		bed.gain.linearRampToValueAtTime(1e-4, now + .35);
	}
}
function setBedVolume(volume) {
	if (!context || !bed || !playing) return;
	bed.gain.cancelScheduledValues(context.currentTime);
	bed.gain.linearRampToValueAtTime(Math.max(1e-4, volume), context.currentTime + .05);
}
function sting(notes, gap, peak) {
	const audio = ctx();
	if (!audio || !master) return false;
	const start = audio.currentTime + .05;
	notes.forEach((freq, i) => rhodes(audio, master, start + i * gap, freq, .7, peak));
	return true;
}
function hourStinger() {
	const audio = ctx();
	if (!audio || !master) return false;
	if (lastStinger > 0 && audio.currentTime - lastStinger < 50) return false;
	lastStinger = audio.currentTime;
	return sting([
		392,
		493.88,
		587.33,
		659.25
	], .16, .045);
}
function bulletinStinger() {
	return sting([
		329.63,
		392,
		493.88,
		523.25
	], .14, .05);
}
var starter = {
	id: "unset",
	label: "Your location",
	detail: "Not set yet",
	lat: 0,
	lon: 0,
	source: "unset"
};
var useDesk = create()(persist((set) => ({
	channel: "local",
	location: starter,
	radiusMi: 500,
	leads: [
		60,
		15,
		0
	],
	clearOnly: true,
	music: false,
	volume: .45,
	stingers: true,
	bulletins: [],
	fired: [],
	gpsNote: null,
	picked: false,
	setChannel: (channel) => set({ channel }),
	setLocation: (location) => set({
		location,
		picked: true,
		gpsNote: null
	}),
	setRadius: (radiusMi) => set({ radiusMi }),
	toggleLead: (minutes) => set((state) => ({ leads: state.leads.includes(minutes) ? state.leads.filter((lead) => lead !== minutes) : [...state.leads, minutes].sort((a, b) => b - a) })),
	addLead: (minutes) => set((state) => {
		const next = Math.round(minutes);
		if (!Number.isFinite(next) || next < 1 || next > 2880 || state.leads.includes(next)) return state;
		return { leads: [...state.leads, next].sort((a, b) => b - a) };
	}),
	removeLead: (minutes) => set((state) => ({ leads: state.leads.filter((lead) => lead !== minutes) })),
	setClearOnly: (clearOnly) => set({ clearOnly }),
	setMusic: (music) => set({ music }),
	setVolume: (volume) => set({ volume: Math.min(1, Math.max(0, volume)) }),
	setStingers: (stingers) => set({ stingers }),
	setGpsNote: (gpsNote) => set({ gpsNote }),
	pushBulletin: (bulletin) => set((state) => ({ bulletins: [{
		...bulletin,
		id: crypto.randomUUID(),
		at: Date.now()
	}, ...state.bulletins].slice(0, 8) })),
	markFired: (key) => set((state) => ({ fired: state.fired.includes(key) ? state.fired : [...state.fired, key].slice(-200) }))
}), {
	name: "sightline",
	skipHydration: true,
	partialize: (state) => ({
		channel: state.channel,
		location: state.location,
		radiusMi: state.radiusMi,
		leads: state.leads,
		clearOnly: state.clearOnly,
		volume: state.volume,
		stingers: state.stingers,
		bulletins: state.bulletins,
		fired: state.fired,
		picked: state.picked
	})
}));
var createSsrRpc = (functionId) => {
	const url = "/_serverFn/" + functionId;
	const serverFnMeta = { id: functionId };
	const fn = async (...args) => {
		return (await getServerFnById(functionId, { origin: "server" }))(...args);
	};
	return Object.assign(fn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var coords = object({
	lat: number().min(-90).max(90),
	lon: number().min(-180).max(180)
});
/** Launch Library 2 allows 15 calls an hour. Share one live list for 5 minutes. */
/** Backup list can refresh a little faster. It does not spend the Launch Library budget. */
/** Sky can refresh faster. Overlapping polls still share one call. */
/** LL2 status.name is the human label (Go for Launch, On Hold, Scrubbed, …). */
var briefInput = object({
	id: string().min(1).max(80),
	mission: string().min(1).max(180),
	provider: string().max(160)
});
var getLaunches = createServerFn({ method: "GET" }).handler(createSsrRpc("c552040674b8cd2bbe85c0f1ea66011ba0c525b907afa824376b2ea169fc795e"));
var getBrief = createServerFn({ method: "GET" }).validator(briefInput).handler(createSsrRpc("ce9ac5c0768b5f3b4feb598f37a05a72e1fb3dcdb76e7c0e784978f439b27293"));
var getSky = createServerFn({ method: "GET" }).validator(coords).handler(createSsrRpc("0a15e7bdc0d3468e1217855fdb886ddacaea9505c98f6d38ced39ee1d5e640c1"));
var getPlace = createServerFn({ method: "GET" }).validator(coords).handler(createSsrRpc("744661e3fada5ca36d2c6fe3388ec9c66f46b7fdbc66c4b9f8557254ecbc2633"));
var focus = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sun";
var on = `min-h-11 bg-sun px-3 font-display text-lg uppercase text-ink ${focus}`;
var off = `min-h-11 bg-channel px-3 font-display text-lg uppercase text-paper ${focus}`;
var field = `h-11 w-full min-w-0 max-w-full border border-line bg-channel px-2 font-display text-lg uppercase text-paper ${focus}`;
var locateBtn = `inline-flex min-h-11 w-full items-center justify-center gap-2 bg-sun px-3 font-display text-lg uppercase text-ink ${focus}`;
var seen = /* @__PURE__ */ new Set();
function age(at, now) {
	if (!at || !now) return "";
	const seconds = Math.max(0, Math.round((now - at) / 1e3));
	if (seconds < 5) return "just now";
	if (seconds < 60) return seconds === 1 ? "1 second ago" : `${seconds} seconds ago`;
	const minutes = Math.round(seconds / 60);
	if (minutes < 60) return minutes === 1 ? "1 minute ago" : `${minutes} minutes ago`;
	const hours = Math.round(minutes / 60);
	return hours === 1 ? "1 hour ago" : `${hours} hours ago`;
}
function useWire(now, mounted, known) {
	const location = useDesk((s) => s.location);
	const radiusMi = useDesk((s) => s.radiusMi);
	const feed = useQuery({
		queryKey: ["launches"],
		queryFn: () => getLaunches(),
		placeholderData: TAPE,
		staleTime: 15e3,
		refetchInterval: 6e4,
		refetchIntervalInBackground: true,
		enabled: mounted
	});
	const sky = useQuery({
		queryKey: [
			"sky",
			location.lat.toFixed(2),
			location.lon.toFixed(2)
		],
		queryFn: () => getSky({ data: {
			lat: location.lat,
			lon: location.lon
		} }),
		staleTime: 3e4,
		refetchInterval: 12e4,
		refetchIntervalInBackground: true,
		enabled: mounted && known
	});
	const skyStatus = sky.data ? "ready" : sky.isError ? "missing" : "loading";
	const bucket = now > 0 ? Math.floor(now / 15e3) : 0;
	const scored = (0, import_react.useMemo)(() => {
		const cutoff = bucket > 0 ? bucket * 15e3 - 12e5 : 0;
		return (feed.data?.launches ?? []).filter((launch) => new Date(launch.net).getTime() > cutoff).map((launch) => ({
			...launch,
			call: known ? viewingCall(launch, location.lat, location.lon, radiusMi, sky.data ?? null, skyStatus) : {
				...viewingCall(launch, location.lat, location.lon, radiusMi, null, "loading"),
				miles: 0,
				inRadius: false,
				seeLikely: false,
				id: "pending",
				cloud: null,
				precip: null
			}
		})).sort((a, b) => new Date(a.net).getTime() - new Date(b.net).getTime());
	}, [
		feed.data,
		known,
		location.lat,
		location.lon,
		radiusMi,
		sky.data,
		skyStatus,
		bucket
	]);
	return {
		feed,
		sky,
		skyStatus,
		scored,
		horizon: scored.filter((launch) => launch.call.inRadius),
		radiusMi
	};
}
function useDueBulletins(ready, now, scored, skyLoading) {
	(0, import_react.useEffect)(() => {
		if (!ready || now <= 0 || skyLoading) return;
		const { leads, clearOnly, fired, stingers } = useDesk.getState();
		let sent = 0;
		for (const launch of scored) {
			if (sent >= 3) break;
			if (/scrub|fail/i.test(launch.status) || !ringsFor(launch.call, clearOnly)) continue;
			const net = new Date(launch.net).getTime();
			if (!Number.isFinite(net)) continue;
			for (const lead of leads) {
				const key = `${launch.id}:${lead}`;
				if (seen.has(key) || fired.includes(key)) {
					seen.add(key);
					continue;
				}
				const at = net - lead * 6e4;
				if (now >= at && now - at < 18e4 && now < net + 12e4) {
					seen.add(key);
					useDesk.getState().markFired(key);
					const note = bulletinCopy(launch, lead);
					useDesk.getState().pushBulletin(note);
					if (stingers) bulletinStinger();
					if (typeof Notification !== "undefined" && Notification.permission === "granted") try {
						new Notification(note.title, { body: note.body });
					} catch {}
					document.title = note.title;
					window.setTimeout(() => {
						if (document.title === note.title) document.title = "Sightline";
					}, 2e4);
					sent += 1;
					break;
				}
			}
		}
	}, [
		ready,
		now,
		scored,
		skyLoading
	]);
}
function missionFacts(launch) {
	const facts = [`${launch.provider} is flying this mission on a ${launch.vehicle}.`, `The rocket leaves from ${launch.padName}${launch.location ? ` at ${launch.location}` : ""}.`];
	if (launch.missionType && launch.missionType !== "Unknown") facts.push(`The published mission type is ${launch.missionType}.`);
	return facts;
}
function MissionFold({ launch }) {
	const [open, setOpen] = (0, import_react.useState)(false);
	const notes = useQuery({
		queryKey: [
			"brief",
			launch.id,
			launch.mission
		],
		queryFn: () => getBrief({ data: {
			id: launch.id,
			mission: launch.mission,
			provider: launch.provider
		} }),
		enabled: open,
		staleTime: 6e5
	});
	const summary = launch.summary && launch.summary !== "Details TBD." ? launch.summary : `${launch.provider} has not published a description of this mission yet.`;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mt-3 border border-line",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
			type: "button",
			className: `flex min-h-11 w-full items-center justify-between gap-3 px-3 text-left font-display text-lg uppercase ${focus}`,
			"aria-expanded": open,
			onClick: () => setOpen((value) => !value),
			children: ["About this mission", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "shrink-0 text-sun",
				children: open ? "Hide" : "Show"
			})]
		}), open ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-2 border-t border-line px-3 py-3 text-sm leading-normal",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: summary }),
				missionFacts(launch).map((fact) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: fact }, fact)),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "pt-1 font-display text-base uppercase",
					children: "Recent headlines"
				}),
				notes.isPending ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-muted",
					children: "Looking up recent headlines."
				}) : null,
				notes.isError ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-muted",
					children: "Recent headlines are unavailable right now."
				}) : null,
				notes.data && notes.data.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-muted",
					children: "No recent headlines turned up for this mission."
				}) : null,
				notes.data && notes.data.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "grid gap-2",
					children: notes.data.map((note) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						className: "text-sun underline underline-offset-2",
						href: note.href,
						target: "_blank",
						rel: "noreferrer",
						children: note.title
					}), note.source ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "text-muted",
						children: [
							" ",
							note.source,
							"."
						]
					}) : null] }, note.href))
				}) : null,
				launch.url ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
					className: "text-sun underline underline-offset-2",
					href: launch.url,
					target: "_blank",
					rel: "noreferrer",
					children: "Read the launch record."
				}) }) : null
			]
		}) : null]
	});
}
function Answer({ now, launch, known }) {
	if (!launch) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "bg-channel px-3 py-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "font-display text-6xl leading-none uppercase",
			children: "None"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-2 text-base leading-normal",
			children: "There are no launches on the live list."
		})]
	});
	const answer = plainAnswer(launch.call);
	const remain = now > 0 ? new Date(launch.net).getTime() - now : 0;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "bg-channel px-3 py-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: `inline-block max-w-full px-2 font-display text-6xl leading-none whitespace-nowrap uppercase sm:text-7xl ${badgeClass(known && launch.call.inRadius ? launch.call.id : "pending")}`,
				children: !known ? "Wait" : launch.call.inRadius ? answer.word : "No"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-base leading-normal",
				children: !known ? "This will not call a launch visible until it has your location and the cloud forecast for liftoff." : launch.call.inRadius ? answer.command : "This launch is too far from you to see. It is not being called visible."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "mt-2 font-display text-3xl leading-none uppercase",
				children: launch.mission
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-1 text-sm leading-normal text-muted",
				children: [
					launch.vehicle,
					launch.location ? ` from ${launch.location}` : "",
					"."
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 text-sm leading-normal text-muted",
				children: "Time until liftoff"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-display text-5xl leading-none text-sun tabular-nums sm:text-6xl",
				children: now > 0 ? countdown(remain) : "——"
			}),
			known ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-base leading-normal",
				children: placeSentence(launch.call)
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-sm leading-normal text-muted",
				children: [
					"Liftoff is ",
					longWhen(launch.net, now > 0),
					". The published status is ",
					launch.status,
					".",
					launch.call.cloud == null ? "" : ` Cloud cover at liftoff is ${Math.round(launch.call.cloud)}%.`,
					launch.probability == null ? "" : ` The published chance of launching is ${launch.probability}%.`
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MissionFold, { launch })
		]
	});
}
function LaunchDesk() {
	const [now, setNow] = (0, import_react.useState)(0);
	const [ready, setReady] = (0, import_react.useState)(false);
	const [fixing, setFixing] = (0, import_react.useState)(false);
	const [more, setMore] = (0, import_react.useState)(false);
	const [reminders, setReminders] = (0, import_react.useState)(false);
	const [dismissed, setDismissed] = (0, import_react.useState)(null);
	const [permission, setPermission] = (0, import_react.useState)("missing");
	const location = useDesk((s) => s.location);
	const setLocation = useDesk((s) => s.setLocation);
	const known = useDesk((s) => s.picked) && location.source !== "unset";
	const radiusMi = useDesk((s) => s.radiusMi);
	const setRadius = useDesk((s) => s.setRadius);
	const gpsNote = useDesk((s) => s.gpsNote);
	const setGpsNote = useDesk((s) => s.setGpsNote);
	const music = useDesk((s) => s.music);
	const setMusic = useDesk((s) => s.setMusic);
	const volume = useDesk((s) => s.volume);
	const setVolume = useDesk((s) => s.setVolume);
	const stingers = useDesk((s) => s.stingers);
	const setStingers = useDesk((s) => s.setStingers);
	const leads = useDesk((s) => s.leads);
	const toggleLead = useDesk((s) => s.toggleLead);
	const clearOnly = useDesk((s) => s.clearOnly);
	const setClearOnly = useDesk((s) => s.setClearOnly);
	const bulletins = useDesk((s) => s.bulletins);
	const fired = useDesk((s) => s.fired);
	const wire = useWire(now, ready, known);
	const hourKey = (0, import_react.useRef)(null);
	useDueBulletins(ready, now, wire.scored, wire.skyStatus === "loading" || !known);
	(0, import_react.useEffect)(() => {
		const stop = useDesk.persist.onFinishHydration(() => {
			if (!useDesk.getState().picked) useDesk.setState({
				location: {
					id: "unset",
					label: "Your location",
					detail: "Not set yet",
					lat: 0,
					lon: 0,
					source: "unset"
				},
				picked: false
			});
			setReady(true);
		});
		useDesk.persist.rehydrate();
		return stop;
	}, []);
	(0, import_react.useEffect)(() => {
		const tick = () => setNow(Date.now());
		tick();
		const id = window.setInterval(tick, 1e3);
		return () => window.clearInterval(id);
	}, []);
	(0, import_react.useEffect)(() => {
		if (typeof Notification !== "undefined") setPermission(Notification.permission);
	}, []);
	(0, import_react.useEffect)(() => {
		const once = () => unlockAudio();
		window.addEventListener("pointerdown", once, { once: true });
		return () => window.removeEventListener("pointerdown", once);
	}, []);
	(0, import_react.useEffect)(() => {
		if (!music) {
			stopBed();
			return;
		}
		startBed(useDesk.getState().volume);
		return () => stopBed();
	}, [music]);
	(0, import_react.useEffect)(() => {
		setBedVolume(volume);
	}, [volume]);
	(0, import_react.useEffect)(() => {
		if (!now || !stingers) return;
		const date = new Date(now);
		if (date.getMinutes() !== 8) return;
		const key = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}-${date.getHours()}`;
		if (hourKey.current !== key && hourStinger()) hourKey.current = key;
	}, [now, stingers]);
	const featured = known ? wire.horizon[0] ?? null : wire.scored[0] ?? null;
	const noneNear = known && wire.scored.length > 0 && featured == null;
	const rest = wire.scored.filter((launch) => launch.id !== featured?.id);
	const shown = more ? rest : rest.slice(0, 4);
	const latest = bulletins[0];
	const report = !!(latest && dismissed !== latest.id && now > 0 && now - latest.at < 25e3);
	const upcoming = nextRing(wire.scored, leads, fired, now, clearOnly);
	const sky = wire.sky.data;
	const live = wire.feed.data?.source === "live" && !wire.feed.isPlaceholderData;
	const launchWhen = age(wire.feed.data?.updated ? Date.parse(wire.feed.data.updated) : 0, now);
	const skyWhen = sky ? age(wire.sky.dataUpdatedAt, now) : "";
	const fresh = !known ? live ? `The launch list was updated ${launchWhen || "recently"}. The sky forecast waits for your location.` : wire.feed.isPlaceholderData ? "The live launch list is still loading. Your location is needed before anything is called visible." : "The live launch list is unavailable, so this is the saved list. Your location is still needed." : live ? wire.feed.isFetching ? "The launch list is updating now." : `The launch list was updated ${launchWhen || "recently"}${skyWhen ? `, and the sky was updated ${skyWhen}` : wire.skyStatus === "missing" ? ", but the sky forecast failed" : ", and the sky forecast is still loading"}.` : wire.feed.isPlaceholderData ? "The live launch list is still loading." : "The live launch list is unavailable, so this is the saved list.";
	const radii = HORIZONS.includes(radiusMi) ? HORIZONS : [...HORIZONS, radiusMi].sort((a, b) => a - b);
	const asked = (0, import_react.useRef)(false);
	const locateToken = (0, import_react.useRef)(0);
	function locate() {
		unlockAudio();
		const token = ++locateToken.current;
		if (!navigator.geolocation) {
			setGpsNote("This browser cannot share your location. Pick a city instead.");
			return;
		}
		setFixing(true);
		setGpsNote("Finding your location.");
		navigator.geolocation.getCurrentPosition((position) => {
			if (token !== locateToken.current) return;
			const lat = position.coords.latitude;
			const lon = position.coords.longitude;
			(async () => {
				try {
					const place = await getPlace({ data: {
						lat,
						lon
					} });
					if (token !== locateToken.current) return;
					setLocation({
						id: "gps",
						label: place.label,
						detail: place.detail,
						lat,
						lon,
						source: "gps"
					});
					setGpsNote(`Your location is set to ${place.label}.`);
				} catch {
					if (token !== locateToken.current) return;
					setLocation({
						id: "gps",
						label: "Your location",
						detail: `${lat.toFixed(2)}, ${lon.toFixed(2)}`,
						lat,
						lon,
						source: "gps"
					});
					setGpsNote("Your location is set to these coordinates.");
				} finally {
					if (token === locateToken.current) setFixing(false);
				}
			})();
		}, () => {
			if (token !== locateToken.current) return;
			setFixing(false);
			setGpsNote("Location is blocked. Pick a city instead.");
		}, {
			enableHighAccuracy: false,
			timeout: 12e3,
			maximumAge: 6e4
		});
	}
	(0, import_react.useEffect)(() => {
		if (!ready || asked.current) return;
		asked.current = true;
		if (useDesk.getState().picked && useDesk.getState().location.source !== "unset") return;
		locate();
	}, [ready]);
	async function allowAlerts() {
		unlockAudio();
		if (typeof Notification === "undefined") return;
		const next = await Notification.requestPermission();
		setPermission(next);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-dvh overflow-x-clip bg-navy text-paper",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
				className: "bg-sun text-ink",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto max-w-xl px-3 pt-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex min-w-0 items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
								viewBox: "0 0 32 32",
								className: "size-10 shrink-0",
								"aria-hidden": true,
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
										width: "32",
										height: "32",
										fill: "#06204a"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("polygon", {
										points: "3,7 9,7 16,16 9,25 3,25 10,16",
										fill: "#ffd000"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("polygon", {
										points: "23,6 26.5,13 19.5,13",
										fill: "#f4f8fc"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
										x: "21.2",
										y: "12.4",
										width: "3.6",
										height: "6.2",
										fill: "#f4f8fc"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("polygon", {
										points: "21.2,18.4 23,23.5 24.8,18.4",
										fill: "#ffd000"
									})
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
									className: "truncate font-display text-4xl leading-none uppercase",
									children: "Sightline"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-0.5 text-sm leading-snug",
									children: "A local forecast for the next rocket launch."
								})]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "shrink-0 font-display text-xl leading-none tabular-nums",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("time", {
								dateTime: now ? new Date(now).toISOString() : void 0,
								children: now ? clock(new Date(now)) : "--:--"
							})
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-1 flex items-center gap-2 pb-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "min-w-0 flex-1 text-sm leading-normal",
							children: fresh
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							className: `inline-flex min-h-11 shrink-0 items-center gap-1 whitespace-nowrap px-1 font-display text-sm uppercase ${focus}`,
							"aria-pressed": music,
							onClick: () => {
								unlockAudio();
								setMusic(!music);
							},
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Radio, {
								className: "size-4 shrink-0",
								"aria-hidden": true
							}), music ? "Music is on" : "Play music"]
						})]
					})]
				})
			}),
			music ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "bg-sun text-ink",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto flex max-w-xl items-center gap-2 px-3 pb-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-display text-sm uppercase",
							children: "Quieter"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							className: "h-11 min-w-0 flex-1 accent-navy",
							type: "range",
							min: 0,
							max: 1,
							step: .05,
							value: volume,
							"aria-label": "Music volume",
							onChange: (event) => setVolume(Number(event.target.value))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-display text-sm uppercase",
							children: "Louder"
						})
					]
				})
			}) : null,
			report && latest ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "bg-alert text-paper",
				role: "status",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto flex max-w-xl items-start justify-between gap-3 px-3 py-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-display text-xl leading-tight uppercase",
							children: latest.title
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm leading-normal",
							children: latest.body
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: `min-h-11 shrink-0 font-display text-lg uppercase ${focus}`,
						onClick: () => setDismissed(latest.id),
						children: "Close"
					})]
				})
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
				className: "mx-auto grid w-full min-w-0 max-w-xl gap-3 px-3 py-3",
				children: [
					noneNear ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "bg-channel px-3 py-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "inline-block px-2 font-display text-6xl leading-none uppercase",
							children: "No"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-2 text-base leading-normal",
							children: [
								"No upcoming launch is close enough to see from ",
								location.label,
								". This forecast is not calling any of them visible from where you are."
							]
						})]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Answer, {
						now,
						launch: featured,
						known
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "block min-w-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-display text-sm tracking-wide text-muted uppercase",
									children: "Where are you?"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
									className: field,
									"aria-label": "Where are you?",
									value: location.source === "gps" ? "gps" : location.id,
									onChange: (event) => {
										const id = event.target.value;
										if (id === "gps" || id === "unset") return;
										const studio = STUDIOS.find((item) => item.id === id);
										if (!studio) return;
										locateToken.current += 1;
										setFixing(false);
										setLocation({
											...studio,
											source: "studio"
										});
									},
									children: [
										location.source === "gps" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "gps",
											children: location.label
										}) : null,
										location.source === "unset" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "unset",
											children: "Your location"
										}) : null,
										STUDIOS.map((studio) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: studio.id,
											children: studio.label
										}, studio.id))
									]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "block min-w-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-display text-sm tracking-wide text-muted uppercase",
									children: "How far will you travel?"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
									className: field,
									"aria-label": "How far will you travel?",
									value: String(radiusMi),
									onChange: (event) => setRadius(Number(event.target.value)),
									children: radii.map((miles) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
										value: miles,
										children: [miles.toLocaleString("en-US"), " miles"]
									}, miles))
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								className: locateBtn,
								onClick: locate,
								disabled: fixing,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LocateFixed, {
									className: "size-5 shrink-0",
									"aria-hidden": true
								}), fixing ? "Finding your location" : "Use my location"]
							})
						]
					}),
					gpsNote ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm leading-normal",
						children: gpsNote
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "bg-channel px-3 py-3 text-base leading-normal",
						children: known && sky ? `It is ${Math.round(sky.current.tempF)}° and ${skyWords(sky.current.code)}. ${windSentence(sky.current.windDeg, sky.current.windMph)} Cloud cover is ${Math.round(sky.current.cloud)}%.` : !known ? "The sky forecast starts after your location is set. Nothing is called visible before that." : wire.skyStatus === "missing" ? "The sky forecast is unavailable right now, so no launch is being called visible." : "The sky forecast is still loading, so no launch is being called visible yet."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-display text-sm tracking-wide text-muted uppercase",
							children: "Later launches"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
							className: "mt-1 divide-y divide-line border border-line",
							children: [shown.map((launch) => {
								const answer = plainAnswer(launch.call);
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
									className: "bg-channel px-3 py-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-between gap-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "min-w-0",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "truncate font-display text-lg uppercase",
												children: launch.mission
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-sm leading-normal text-muted",
												children: known ? `${shortWhen(launch.net, now > 0)}, ${formatMiles(launch.call.miles)} miles to the ${compassWord(launch.call.compass)}.` : `${shortWhen(launch.net, now > 0)}. Distance is not shown until your location is set.`
											})]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: `shrink-0 px-2 font-display text-lg uppercase ${badgeClass(launch.call.id)}`,
											children: !known ? "Wait" : launch.call.inRadius ? answer.word : "No"
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MissionFold, { launch })]
								}, launch.id);
							}), shown.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
								className: "bg-channel px-3 py-3 text-sm",
								children: "There is nothing else on the list."
							}) : null]
						}),
						rest.length > 4 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: `mt-1 inline-flex min-h-11 items-center font-display text-lg text-sun uppercase ${focus}`,
							onClick: () => setMore((value) => !value),
							children: more ? "Show fewer launches" : `Show all ${rest.length} launches`
						}) : null
					] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "border border-line",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							className: `flex min-h-11 w-full items-center justify-between px-3 font-display text-lg uppercase ${focus}`,
							"aria-expanded": reminders,
							onClick: () => setReminders((value) => !value),
							children: ["Reminders", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-sm normal-case text-sun",
								children: upcoming ? `Next is ${aboutWhen(Math.max(0, upcoming.at - now))}` : "None set"
							})]
						}), reminders ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid gap-3 border-t border-line p-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "flex flex-wrap gap-2",
									children: MARKS.map((minutes) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										"aria-pressed": leads.includes(minutes),
										className: leads.includes(minutes) ? on : off,
										onClick: () => toggleLead(minutes),
										children: markLabel(minutes)
									}, minutes))
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-wrap gap-2",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											className: permission === "granted" ? on : off,
											onClick: () => void allowAlerts(),
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "inline-flex items-center gap-2",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bell, {
													className: "size-5",
													"aria-hidden": true
												}), permission === "granted" ? "Alerts are on" : "Turn on alerts"]
											})
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											className: stingers ? on : off,
											"aria-pressed": stingers,
											onClick: () => setStingers(!stingers),
											children: stingers ? "Sound is on" : "Turn sound on"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											className: clearOnly ? on : off,
											"aria-pressed": clearOnly,
											onClick: () => setClearOnly(!clearOnly),
											children: clearOnly ? "Only if you can see it" : "Any launch in range"
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm leading-normal text-muted",
									children: upcoming ? `${upcoming.lead === 0 ? `Your next reminder is at the liftoff of ${upcoming.launch.mission}.` : `Your next reminder is ${markLabel(upcoming.lead).toLowerCase()} the liftoff of ${upcoming.launch.mission}.`} That is ${aboutWhen(Math.max(0, upcoming.at - now))} from now. Keep this page open so it can fire.` : "Choose a time below. This page has to stay open for a reminder to fire."
								}),
								bulletins[0] ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-sm leading-normal",
									children: [
										"Last reminder: ",
										bulletins[0].title,
										" ",
										bulletins[0].body
									]
								}) : null
							]
						}) : null]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm leading-normal text-muted",
						children: "Launch times come from The Space Devs when that list answers. Otherwise they come from RocketLaunch.Live. The sky comes from Open-Meteo. A yes or a no is based on distance, daylight, and clouds. It is not a plotted flight path."
					})
				]
			})
		]
	});
}
var SplitComponent = LaunchDesk;
//#endregion
export { SplitComponent as component };
