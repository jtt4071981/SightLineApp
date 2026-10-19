import { a as string, i as object, t as number } from "../_libs/zod.mjs";
import { n as TSS_SERVER_FUNCTION, t as createServerFn } from "./ssr.mjs";
import { b as vehicleClassOf, i as TAPE } from "./tape-BM1iAg_i.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/wire-BVxcGa0H.js
var createServerRpc = (serverFnMeta, splitImportFn) => {
	const url = "/_serverFn/" + serverFnMeta.id;
	return Object.assign(splitImportFn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var coords = object({
	lat: number().min(-90).max(90),
	lon: number().min(-180).max(180)
});
var HEADERS = {
	Accept: "application/json",
	"User-Agent": "Sightline/1.0 (local rocket viewing forecast)"
};
var launchMemo = null;
var launchFlight = null;
var nextLaunchTry = 0;
var skyMemo = /* @__PURE__ */ new Map();
var skyFlight = /* @__PURE__ */ new Map();
var placeCache = /* @__PURE__ */ new Map();
/** Launch Library 2 allows 15 calls an hour. Share one live list for 5 minutes. */
var LAUNCH_FRESH_MS = 3e5;
/** Backup list can refresh a little faster. It does not spend the Launch Library budget. */
var ALT_FRESH_MS = 18e4;
/** Sky can refresh faster. Overlapping polls still share one call. */
var SKY_FRESH_MS = 9e4;
function asRecord(value) {
	return value && typeof value === "object" ? value : null;
}
function text(value, fallback = "") {
	return typeof value === "string" && value.trim() ? value.trim() : fallback;
}
function num(value) {
	if (typeof value === "number" && Number.isFinite(value)) return value;
	if (typeof value === "string" && value.trim() !== "" && Number.isFinite(Number(value))) return Number(value);
	return null;
}
function probabilityOf(value) {
	const parsed = num(value);
	if (parsed == null || parsed < 0 || parsed > 100) return null;
	return parsed;
}
function imageOf(value) {
	const direct = text(value);
	if (direct) return direct;
	const record = asRecord(value);
	if (!record) return null;
	return text(record.image_url) || text(record.thumbnail_url) || text(record.url) || null;
}
/** LL2 status.name is the human label (Go for Launch, On Hold, Scrubbed, …). */
function humanStatus(row) {
	const status = asRecord(row.status);
	const name = text(status?.name) || text(status?.abbrev) || (typeof row.status === "string" ? row.status.trim() : "") || "TBD";
	const reason = text(row.holdreason) || text(row.failreason);
	if (!reason || name.toLowerCase().includes(reason.toLowerCase())) return name;
	return `${name} · ${reason.length > 96 ? `${reason.slice(0, 93).trimEnd()}…` : reason}`;
}
function mapLaunch(raw) {
	const row = asRecord(raw);
	if (!row) return null;
	const pad = asRecord(row.pad);
	const lat = num(pad?.latitude);
	const lon = num(pad?.longitude);
	if (lat == null || lon == null) return null;
	const mission = asRecord(row.mission);
	const provider = asRecord(row.launch_service_provider);
	const config = asRecord(asRecord(row.rocket)?.configuration);
	const precision = asRecord(row.net_precision);
	const place = asRecord(pad?.location);
	const vehicle = text(config?.full_name, text(config?.name, "Unknown vehicle"));
	let summary = text(mission?.description, "Details TBD.").replace(/\s+/g, " ");
	if (summary.length > 340) summary = `${summary.slice(0, 337).trimEnd()}…`;
	return {
		id: text(row.id, vehicle),
		name: text(row.name, vehicle),
		provider: text(provider?.name, "Unknown provider"),
		vehicle,
		vehicleClass: vehicleClassOf(vehicle),
		mission: text(mission?.name, text(row.name, "Unknown payload")),
		missionType: text(mission?.type, "Unknown"),
		summary,
		status: humanStatus(row),
		net: text(row.net),
		windowStart: text(row.window_start, text(row.net)),
		windowEnd: text(row.window_end, text(row.net)),
		precision: text(precision?.name) || text(precision?.abbrev) || "Unknown",
		padName: text(pad?.name, "Pad"),
		location: text(place?.name),
		lat,
		lon,
		image: imageOf(row.image),
		probability: probabilityOf(row.probability),
		url: text(row.url)
	};
}
async function readLaunches() {
	const response = await fetch("https://ll.thespacedevs.com/2.3.0/launches/upcoming/?limit=30", {
		headers: HEADERS,
		cache: "no-store",
		signal: AbortSignal.timeout(12e3)
	});
	if (response.status === 429) {
		const header = Number(response.headers.get("retry-after"));
		let wait = Number.isFinite(header) && header > 0 ? header * 1e3 : 0;
		if (!wait) {
			const match = text(asRecord(await response.json().catch(() => null))?.detail).match(/(\d+)\s*second/);
			wait = match ? Number(match[1]) * 1e3 : 3e5;
		}
		nextLaunchTry = Date.now() + wait;
		return null;
	}
	if (!response.ok) throw new Error(`wire ${response.status}`);
	const body = asRecord(await response.json());
	const rows = Array.isArray(body?.results) ? body.results : null;
	if (!rows) throw new Error("wire shape");
	const launches = rows.map(mapLaunch).filter((launch) => !!launch?.net);
	if (launches.length === 0) throw new Error("empty wire");
	return {
		updated: (/* @__PURE__ */ new Date()).toISOString(),
		source: "live",
		launches
	};
}
function savedList() {
	return {
		...TAPE,
		updated: TAPE.updated,
		source: "tape"
	};
}
var PAD_FIX = [
	{
		test: /4e|vandenberg/,
		lat: 34.632,
		lon: -120.611
	},
	{
		test: /slc-40|complex 40/,
		lat: 28.56194122,
		lon: -80.57735736
	},
	{
		test: /39a|kennedy/,
		lat: 28.60822681,
		lon: -80.604333
	},
	{
		test: /slc-41|complex 41/,
		lat: 28.58341025,
		lon: -80.58303644
	},
	{
		test: /starbase|boca chica/,
		lat: 25.9972,
		lon: -97.1564
	},
	{
		test: /wallops/,
		lat: 37.833,
		lon: -75.488
	},
	{
		test: /wenchang|commercial lc-2|\blc-2\b/,
		lat: 19.59755,
		lon: 110.936481
	},
	{
		test: /jiuquan/,
		lat: 40.891596,
		lon: 100.217289
	},
	{
		test: /xichang/,
		lat: 28.246,
		lon: 102.027
	},
	{
		test: /slp|second launch pad/,
		lat: 13.7199,
		lon: 80.2304
	},
	{
		test: /satish|sriharikota|first launch pad/,
		lat: 13.733,
		lon: 80.235
	},
	{
		test: /tanegashima|yoshinobu/,
		lat: 30.400938,
		lon: 130.97564
	},
	{
		test: /baikonur/,
		lat: 45.996034,
		lon: 63.564003
	},
	{
		test: /guiana|kourou|ariane/,
		lat: 5.256319,
		lon: -52.786838
	},
	{
		test: /mahia/,
		lat: -39.261,
		lon: 177.865
	}
];
function padFix(padName, locationName) {
	const blob = `${padName} ${locationName}`.toLowerCase();
	return PAD_FIX.find((pad) => pad.test.test(blob)) ?? null;
}
async function readAltLaunches() {
	const response = await fetch("https://fdo.rocketlaunch.live/json/launches/next/5", {
		headers: HEADERS,
		cache: "no-store",
		signal: AbortSignal.timeout(12e3)
	});
	if (!response.ok) throw new Error(`alt ${response.status}`);
	const envelope = asRecord(asRecord(await response.json())?.response);
	const rows = Array.isArray(envelope?.result) ? envelope.result : null;
	if (!rows) return null;
	const launches = [];
	for (const raw of rows) {
		const row = asRecord(raw);
		if (!row) continue;
		const vehicle = asRecord(row.vehicle);
		const provider = asRecord(row.provider);
		const pad = asRecord(row.pad);
		const place = asRecord(pad?.location);
		const padName = text(pad?.name, "Pad");
		const location = text(place?.name);
		const fix = padFix(padName, location);
		const net = text(row.t0) || text(row.win_open);
		if (!fix || !net) continue;
		const vehicleName = text(vehicle?.name, "Unknown vehicle");
		const mission = text(row.name, vehicleName);
		const precise = Boolean(text(row.t0));
		launches.push({
			id: text(row.id, mission),
			name: mission,
			provider: text(provider?.name, "Unknown provider"),
			vehicle: vehicleName,
			vehicleClass: vehicleClassOf(vehicleName),
			mission: mission === "TBD" ? `${text(provider?.name, "Launch")} mission` : mission,
			missionType: "Unknown",
			summary: text(row.launch_description, "Details TBD.").replace(/\s+/g, " ").slice(0, 340),
			status: precise ? "Scheduled" : "Time not firm",
			net,
			windowStart: text(row.win_open, net),
			windowEnd: text(row.win_close, text(row.win_open, net)),
			precision: precise ? "Minute" : "Window",
			padName,
			location,
			lat: fix.lat,
			lon: fix.lon,
			image: null,
			probability: null,
			url: text(row.slug) ? `https://rocketlaunch.live/launch/${text(row.slug)}` : "https://rocketlaunch.live"
		});
	}
	if (launches.length === 0) return null;
	return {
		updated: (/* @__PURE__ */ new Date()).toISOString(),
		source: "live",
		launches
	};
}
async function pullWire() {
	if (launchMemo && Date.now() - launchMemo.at < launchMemo.freshMs) return launchMemo.feed;
	if (launchFlight) return launchFlight;
	launchFlight = (async () => {
		if (Date.now() >= nextLaunchTry) try {
			const feed = await readLaunches();
			if (feed) {
				launchMemo = {
					at: Date.now(),
					freshMs: LAUNCH_FRESH_MS,
					feed
				};
				return feed;
			}
		} catch {
			nextLaunchTry = Date.now() + 6e4;
		}
		try {
			const alt = await readAltLaunches();
			if (alt) {
				launchMemo = {
					at: Date.now(),
					freshMs: ALT_FRESH_MS,
					feed: alt
				};
				return alt;
			}
		} catch {}
		if (launchMemo && Date.now() - launchMemo.at < 216e5) return launchMemo.feed;
		return savedList();
	})().finally(() => {
		launchFlight = null;
	});
	return launchFlight;
}
function localToUtc(stamp, offsetSeconds) {
	const utc = Date.parse(`${stamp}Z`) - offsetSeconds * 1e3;
	return Number.isFinite(utc) ? new Date(utc).toISOString() : stamp;
}
async function readSky(lat, lon) {
	const params = new URLSearchParams({
		latitude: String(lat),
		longitude: String(lon),
		current: "temperature_2m,weather_code,cloud_cover,wind_speed_10m,wind_direction_10m,visibility,is_day",
		hourly: "cloud_cover,precipitation_probability",
		forecast_days: "16",
		temperature_unit: "fahrenheit",
		wind_speed_unit: "mph",
		timezone: "auto"
	});
	const response = await fetch(`https://api.open-meteo.com/v1/forecast?${params}`, {
		headers: HEADERS,
		cache: "no-store",
		signal: AbortSignal.timeout(12e3)
	});
	if (!response.ok) throw new Error(`sky ${response.status}`);
	const body = asRecord(await response.json());
	const current = asRecord(body?.current);
	const hourly = asRecord(body?.hourly);
	if (!current || !hourly) throw new Error("sky shape");
	const offset = num(body?.utc_offset_seconds) ?? 0;
	const times = Array.isArray(hourly.time) ? hourly.time : [];
	const clouds = Array.isArray(hourly.cloud_cover) ? hourly.cloud_cover : [];
	const precips = Array.isArray(hourly.precipitation_probability) ? hourly.precipitation_probability : [];
	return {
		current: {
			tempF: num(current.temperature_2m) ?? 0,
			code: num(current.weather_code) ?? 0,
			windDeg: num(current.wind_direction_10m) ?? 0,
			windMph: num(current.wind_speed_10m) ?? 0,
			cloud: num(current.cloud_cover) ?? 0,
			visibilityM: num(current.visibility) ?? 1e4,
			isDay: current.is_day === 1 || current.is_day === true
		},
		utcOffsetSeconds: offset,
		tzAbbrev: text(body?.timezone_abbreviation, "local"),
		hourly: times.map((stamp, i) => ({
			time: typeof stamp === "string" ? localToUtc(stamp, offset) : "",
			cloud: num(clouds[i]) ?? 0,
			precip: num(precips[i]) ?? 0
		}))
	};
}
async function pullSky(lat, lon) {
	const key = `${lat.toFixed(2)},${lon.toFixed(2)}`;
	const hit = skyMemo.get(key);
	if (hit && Date.now() - hit.at < SKY_FRESH_MS) return hit.sky;
	const pending = skyFlight.get(key);
	if (pending) return pending;
	const flight = readSky(lat, lon).then((sky) => {
		skyMemo.set(key, {
			at: Date.now(),
			sky
		});
		return sky;
	}).finally(() => {
		skyFlight.delete(key);
	});
	skyFlight.set(key, flight);
	return flight;
}
async function pullPlace(lat, lon) {
	const key = `${lat.toFixed(2)},${lon.toFixed(2)}`;
	const hit = placeCache.get(key);
	if (hit) return hit;
	const params = new URLSearchParams({
		lat: String(lat),
		lon: String(lon),
		format: "json",
		zoom: "10"
	});
	const response = await fetch(`https://nominatim.openstreetmap.org/reverse?${params}`, {
		headers: {
			...HEADERS,
			"Accept-Language": "en"
		},
		signal: AbortSignal.timeout(8e3)
	});
	if (!response.ok) throw new Error(`place ${response.status}`);
	const address = asRecord(asRecord(await response.json())?.address);
	const place = {
		label: text(address?.city) || text(address?.town) || text(address?.village) || text(address?.hamlet) || text(address?.county) || "Your sky",
		detail: text(address?.state) || text(address?.country) || `${lat.toFixed(2)}, ${lon.toFixed(2)}`
	};
	placeCache.set(key, place);
	return place;
}
var briefInput = object({
	id: string().min(1).max(80),
	mission: string().min(1).max(180),
	provider: string().max(160)
});
var briefCache = /* @__PURE__ */ new Map();
var BRIEF_FRESH_MS = 12e5;
function decodeXml(value) {
	return value.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1").replace(/&/g, "&").replace(/</g, "<").replace(/>/g, ">").replace(/"/g, "\"").replace(/&#39;|'/g, "'").replace(/\s+/g, " ").trim();
}
function headlinesFromRss(xml) {
	const headlines = [];
	for (const item of xml.match(/<item\b[\s\S]*?<\/item>/g) ?? []) {
		if (headlines.length >= 3) break;
		const title = decodeXml(item.match(/<title>([\s\S]*?)<\/title>/)?.[1] ?? "");
		const href = decodeXml(item.match(/<link>([\s\S]*?)<\/link>/)?.[1] ?? "");
		const source = decodeXml(item.match(/<source\b[^>]*>([\s\S]*?)<\/source>/)?.[1] ?? "");
		const titled = source && title.endsWith(` - ${source}`) ? title.slice(0, -(source.length + 3)).trim() : title;
		if (!titled || !href.startsWith("https://")) continue;
		headlines.push({
			title: titled,
			href,
			source
		});
	}
	return headlines;
}
async function pullBrief(id, mission, provider) {
	const key = `v2:${id}`;
	const hit = briefCache.get(key);
	if (hit && Date.now() - hit.at < BRIEF_FRESH_MS) return hit.headlines;
	const query = [
		mission,
		provider,
		"rocket launch"
	].filter(Boolean).join(" ");
	const url = `https://news.google.com/rss/search?q=${encodeURIComponent(query)}&hl=en-US&gl=US&ceid=US:en`;
	try {
		const response = await fetch(url, {
			headers: {
				Accept: "application/rss+xml, application/xml, text/xml",
				"User-Agent": HEADERS["User-Agent"]
			},
			cache: "no-store",
			signal: AbortSignal.timeout(8e3)
		});
		if (!response.ok) return hit?.headlines ?? [];
		const headlines = headlinesFromRss(await response.text());
		briefCache.set(key, {
			at: Date.now(),
			headlines
		});
		return headlines;
	} catch {
		return hit?.headlines ?? [];
	}
}
var getLaunches_createServerFn_handler = createServerRpc({
	id: "c552040674b8cd2bbe85c0f1ea66011ba0c525b907afa824376b2ea169fc795e",
	name: "getLaunches",
	filename: "src/lib/forecast/wire.ts"
}, (opts) => getLaunches.__executeServer(opts));
var getLaunches = createServerFn({ method: "GET" }).handler(getLaunches_createServerFn_handler, async () => pullWire());
var getBrief_createServerFn_handler = createServerRpc({
	id: "ce9ac5c0768b5f3b4feb598f37a05a72e1fb3dcdb76e7c0e784978f439b27293",
	name: "getBrief",
	filename: "src/lib/forecast/wire.ts"
}, (opts) => getBrief.__executeServer(opts));
var getBrief = createServerFn({ method: "GET" }).validator(briefInput).handler(getBrief_createServerFn_handler, async ({ data }) => pullBrief(data.id, data.mission, data.provider));
var getSky_createServerFn_handler = createServerRpc({
	id: "0a15e7bdc0d3468e1217855fdb886ddacaea9505c98f6d38ced39ee1d5e640c1",
	name: "getSky",
	filename: "src/lib/forecast/wire.ts"
}, (opts) => getSky.__executeServer(opts));
var getSky = createServerFn({ method: "GET" }).validator(coords).handler(getSky_createServerFn_handler, async ({ data }) => pullSky(data.lat, data.lon));
var getPlace_createServerFn_handler = createServerRpc({
	id: "744661e3fada5ca36d2c6fe3388ec9c66f46b7fdbc66c4b9f8557254ecbc2633",
	name: "getPlace",
	filename: "src/lib/forecast/wire.ts"
}, (opts) => getPlace.__executeServer(opts));
var getPlace = createServerFn({ method: "GET" }).validator(coords).handler(getPlace_createServerFn_handler, async ({ data }) => pullPlace(data.lat, data.lon));
//#endregion
export { getBrief_createServerFn_handler, getLaunches_createServerFn_handler, getPlace_createServerFn_handler, getSky_createServerFn_handler };
