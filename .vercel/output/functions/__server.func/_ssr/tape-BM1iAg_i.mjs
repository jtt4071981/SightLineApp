//#region node_modules/.nitro/vite/services/ssr/assets/tape-BM1iAg_i.js
var COMPASS = [
	"N",
	"NNE",
	"NE",
	"ENE",
	"E",
	"ESE",
	"SE",
	"SSE",
	"S",
	"SSW",
	"SW",
	"WSW",
	"W",
	"WNW",
	"NW",
	"NNW"
];
var COMPASS_WORD = {
	N: "north",
	NNE: "north-northeast",
	NE: "northeast",
	ENE: "east-northeast",
	E: "east",
	ESE: "east-southeast",
	SE: "southeast",
	SSE: "south-southeast",
	S: "south",
	SSW: "south-southwest",
	SW: "southwest",
	WSW: "west-southwest",
	W: "west",
	WNW: "west-northwest",
	NW: "northwest",
	NNW: "north-northwest"
};
var REACH = {
	small: {
		night: 100,
		twilight: 50,
		day: 18
	},
	medium: {
		night: 480,
		twilight: 240,
		day: 45
	},
	heavy: {
		night: 750,
		twilight: 380,
		day: 80
	}
};
var STUDIOS = [
	{
		id: "cocoa",
		label: "Cocoa Beach",
		detail: "Florida",
		lat: 28.32,
		lon: -80.6076
	},
	{
		id: "titusville",
		label: "Titusville",
		detail: "Florida",
		lat: 28.611,
		lon: -80.8076
	},
	{
		id: "orlando",
		label: "Orlando",
		detail: "Florida",
		lat: 28.5383,
		lon: -81.3792
	},
	{
		id: "lompoc",
		label: "Lompoc",
		detail: "California",
		lat: 34.6391,
		lon: -120.4579
	},
	{
		id: "la",
		label: "Los Angeles",
		detail: "California",
		lat: 34.0522,
		lon: -118.2437
	},
	{
		id: "brownsville",
		label: "Brownsville",
		detail: "Texas",
		lat: 25.9017,
		lon: -97.4975
	},
	{
		id: "wallops",
		label: "Wallops Island",
		detail: "Virginia",
		lat: 37.84,
		lon: -75.488
	},
	{
		id: "nyc",
		label: "New York",
		detail: "New York",
		lat: 40.7128,
		lon: -74.006
	},
	{
		id: "london",
		label: "London",
		detail: "United Kingdom",
		lat: 51.5074,
		lon: -.1278
	},
	{
		id: "tokyo",
		label: "Tokyo",
		detail: "Japan",
		lat: 35.6762,
		lon: 139.6503
	},
	{
		id: "gisborne",
		label: "Gisborne",
		detail: "New Zealand",
		lat: -38.6626,
		lon: 178.0176
	}
];
var HORIZONS = [
	25,
	50,
	100,
	250,
	500,
	1e3,
	2e3
];
var MARKS = [
	1440,
	360,
	60,
	30,
	15,
	5,
	0
];
function milesBetween(lat1, lon1, lat2, lon2) {
	const dLat = (lat2 - lat1) * Math.PI / 180;
	const dLon = (lon2 - lon1) * Math.PI / 180;
	const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) ** 2;
	return 7917.5226 * Math.asin(Math.min(1, Math.sqrt(a)));
}
function bearing(lat1, lon1, lat2, lon2) {
	const φ1 = lat1 * Math.PI / 180;
	const φ2 = lat2 * Math.PI / 180;
	const Δλ = (lon2 - lon1) * Math.PI / 180;
	const y = Math.sin(Δλ) * Math.cos(φ2);
	const x = Math.cos(φ1) * Math.sin(φ2) - Math.sin(φ1) * Math.cos(φ2) * Math.cos(Δλ);
	return (Math.atan2(y, x) * 180 / Math.PI + 360) % 360;
}
function compass16(deg) {
	const t = (deg % 360 + 360) % 360;
	return COMPASS[Math.round(t / 22.5) % 16] ?? "N";
}
function compassWord(point) {
	return COMPASS_WORD[point] ?? point.toLowerCase();
}
/** Solar elevation in degrees. Good enough for night / twilight / day. */
function sunAltitude(lat, lon, when) {
	const r = Math.PI / 180;
	const d = when.getTime() / 864e5 + 2440587.5 - 2451545;
	let L = (280.46 + .9856474 * d) % 360;
	const g = ((357.528 + .9856003 * d) % 360 + 360) % 360 * r;
	let sun = L + 1.915 * Math.sin(g) + .02 * Math.sin(2 * g);
	sun = (sun % 360 + 360) % 360;
	const λ = sun * r;
	const ε = (23.439 - 4e-7 * d) * r;
	const δ = Math.asin(Math.sin(ε) * Math.sin(λ));
	const ra = Math.atan2(Math.cos(ε) * Math.sin(λ), Math.cos(λ));
	let gmst = 280.46061837 + 360.98564736629 * d;
	gmst = (gmst % 360 + 360) % 360;
	let h = gmst + lon;
	h = (h % 360 + 360) % 360;
	const H = h * r - ra;
	const φ = lat * r;
	const sinAlt = Math.sin(φ) * Math.sin(δ) + Math.cos(φ) * Math.cos(δ) * Math.cos(H);
	return Math.asin(Math.max(-1, Math.min(1, sinAlt))) * 180 / Math.PI;
}
function lightFromAltitude(alt) {
	if (alt <= -6) return {
		id: "night",
		label: "Night sky"
	};
	if (alt <= 0) return {
		id: "twilight",
		label: "Twilight"
	};
	if (alt < 15) return {
		id: "day",
		label: "Low sun"
	};
	return {
		id: "day",
		label: "High sun"
	};
}
function rideWord(kind) {
	if (kind === "heavy") return "heavy lifter";
	if (kind === "small") return "small ride";
	return "workhorse";
}
function parseStamp(stamp) {
	return /[zZ]|[+-]\d\d:\d\d$/.test(stamp) ? new Date(stamp).getTime() : (/* @__PURE__ */ new Date(`${stamp}Z`)).getTime();
}
function nearestHour(sky, when) {
	const target = when.getTime();
	let best = null;
	let gap = Infinity;
	for (const hour of sky.hourly) {
		const t = parseStamp(hour.time);
		if (!Number.isFinite(t)) continue;
		const d = Math.abs(t - target);
		if (d < gap) {
			gap = d;
			best = hour;
		}
	}
	if (!best || gap > 54e5) return null;
	return best;
}
function formatMiles(miles) {
	if (!Number.isFinite(miles)) return "—";
	if (miles < 10) return miles.toFixed(1);
	return Math.round(miles).toLocaleString("en-US");
}
function countdown(ms) {
	if (ms <= 0) return "LIFTOFF";
	const total = Math.floor(ms / 1e3);
	const days = Math.floor(total / 86400);
	const hours = Math.floor(total % 86400 / 3600);
	const mins = Math.floor(total % 3600 / 60);
	const secs = total % 60;
	const pad = (n) => String(n).padStart(2, "0");
	return days > 0 ? `${days}D ${pad(hours)}H ${pad(mins)}M` : `${pad(hours)}H ${pad(mins)}M ${pad(secs)}S`;
}
function aboutWhen(ms) {
	if (ms < 6e4) return "any minute";
	const hours = ms / 36e5;
	if (hours < 1) return `about ${Math.max(1, Math.round(ms / 6e4))} minutes`;
	if (hours < 36) return `about ${Math.round(hours)} hours`;
	const days = Math.round(hours / 24);
	return days === 1 ? "about a day" : `about ${days} days`;
}
function clock(when) {
	return new Intl.DateTimeFormat("en-US", {
		hour: "numeric",
		minute: "2-digit",
		second: "2-digit"
	}).format(when);
}
function shortWhen(iso, local) {
	const date = new Date(iso);
	if (Number.isNaN(date.getTime())) return "TBD";
	return new Intl.DateTimeFormat("en-US", {
		weekday: "short",
		hour: "numeric",
		minute: "2-digit",
		timeZone: local ? void 0 : "UTC",
		timeZoneName: local ? void 0 : "short"
	}).format(date);
}
function longWhen(iso, local) {
	const date = new Date(iso);
	if (Number.isNaN(date.getTime())) return "Time TBD";
	return new Intl.DateTimeFormat("en-US", {
		weekday: "short",
		month: "short",
		day: "numeric",
		hour: "numeric",
		minute: "2-digit",
		timeZone: local ? void 0 : "UTC",
		timeZoneName: "short"
	}).format(date);
}
function markLabel(minutes) {
	if (minutes === 0) return "At liftoff";
	if (minutes % 1440 === 0) {
		const days = minutes / 1440;
		return days === 1 ? "1 day before" : `${days} days before`;
	}
	if (minutes % 60 === 0) {
		const hours = minutes / 60;
		return hours === 1 ? "1 hour before" : `${hours} hours before`;
	}
	return minutes === 1 ? "1 minute before" : `${minutes} minutes before`;
}
function windSentence(deg, mph) {
	const point = [
		"the north",
		"the northeast",
		"the east",
		"the southeast",
		"the south",
		"the southwest",
		"the west",
		"the northwest"
	][Math.round((deg % 360 + 360) % 360 / 45) % 8];
	const speed = Math.round(mph);
	return `The wind is from ${point} at ${speed} ${speed === 1 ? "mile" : "miles"} per hour.`;
}
function skyWords(code) {
	if (code === 0) return "clear";
	if (code === 1) return "mostly clear";
	if (code === 2) return "partly cloudy";
	if (code === 3) return "overcast";
	if (code === 45 || code === 48) return "foggy";
	if (code >= 51 && code <= 57) return "drizzling";
	if (code >= 61 && code <= 67) return "raining";
	if (code >= 71 && code <= 77) return "snowing";
	if (code >= 80 && code <= 82) return "showery";
	if (code >= 85 && code <= 86) return "snowing";
	if (code >= 95) return "stormy";
	return "mixed";
}
function vehicleClassOf(name) {
	const n = name.toLowerCase();
	if (/falcon heavy|vulcan|new glenn|starship|ariane 6|ariane 64|long march 5|cz-5|angara|delta iv|sls|super heavy/.test(n)) return "heavy";
	if (/electron|sslv|alpha|firefly|terran|launcherone|astra|rocket 3|spectrum|rs1|skyrora|eris|pegasus|vector/.test(n)) return "small";
	return "medium";
}
function viewingCall(launch, lat, lon, radiusMi, sky, skyStatus) {
	const miles = milesBetween(lat, lon, launch.lat, launch.lon);
	const compass = compass16(bearing(lat, lon, launch.lat, launch.lon));
	const look = `Look ${compassWord(compass)}`;
	const when = new Date(launch.net);
	const alt = Number.isNaN(when.getTime()) ? 0 : sunAltitude(lat, lon, when);
	const light = lightFromAltitude(alt);
	let reach = REACH[launch.vehicleClass][light.id];
	if (light.id === "day" && alt < 12) reach *= 1.35;
	const maxShown = Math.round(reach);
	const inRadius = miles <= radiusMi;
	const shown = formatMiles(miles);
	const ride = rideWord(launch.vehicleClass);
	const base = {
		miles,
		compass,
		look,
		light: light.id,
		lightLabel: light.label,
		inRadius,
		maxMi: reach
	};
	if (miles > reach * 1.12) return {
		...base,
		id: "range",
		kicker: "Out of range",
		line: `A ${light.label.toLowerCase()} ${ride} can show out to about ${maxShown} miles. You're ${shown} out — this one's a replay, not a horizon.`,
		cloud: null,
		precip: null,
		seeLikely: false
	};
	if (skyStatus === "loading") return {
		...base,
		id: "pending",
		kicker: "Calling the sky",
		line: `${look}, ${shown} miles out. The van is still reading the clouds for T-0.`,
		cloud: null,
		precip: null,
		seeLikely: false
	};
	const hour = sky ? nearestHour(sky, when) : null;
	if (!hour) {
		reach * .72;
		return {
			...base,
			id: "pending",
			kicker: "Reel short",
			line: `Geometry likes a ${light.label.toLowerCase()} look (${look.toLowerCase()}, ${shown} mi, good out to ~${maxShown}). The weather reel runs 16 days, so the deck isn't called yet.`,
			cloud: null,
			precip: null,
			seeLikely: false
		};
	}
	const cloud = hour.cloud;
	const precip = hour.precip;
	const shut = cloud >= 80 || precip >= 55;
	const broken = cloud >= 40 || precip >= 30;
	const edge = miles > reach * .72;
	const deck = `Clouds near ${Math.round(cloud)}% at T-0${precip >= 20 ? `, rain chance ${Math.round(precip)}%` : ""}.`;
	if (shut) return {
		...base,
		id: "deck",
		kicker: "Deck is in",
		line: `${deck} Lawn chairs stay in the garage. You'll hear about this one before you see it.`,
		cloud,
		precip,
		seeLikely: false
	};
	if (light.id === "day") return broken || edge ? {
		...base,
		id: "marginal",
		kicker: "Hard look",
		line: `Sun's up and ${deck.toLowerCase()} ${look}, ${shown} miles. Possible if you're close and stubborn.`,
		cloud,
		precip,
		seeLikely: false
	} : {
		...base,
		id: "daywash",
		kicker: "Daylight look",
		line: `The plume has to punch through a blue sky. You're close (${shown} mi). ${look} — you may still catch the stack.`,
		cloud,
		precip,
		seeLikely: true
	};
	if (broken) return {
		...base,
		id: "marginal",
		kicker: "Broken deck",
		line: `${deck} It may flicker through. ${look}, ${shown} miles, and don't trust a single gap.`,
		cloud,
		precip,
		seeLikely: false
	};
	if (edge) return {
		...base,
		id: "fringe",
		kicker: "On the fringe",
		line: `You're near the edge of a ${light.label.toLowerCase()} circle (about ${maxShown} mi for this ${ride}). Dark yard, clear horizon. ${look}.`,
		cloud,
		precip,
		seeLikely: true
	};
	const line = light.id === "twilight" ? `Twilight launch — the plume likes this light. ${look}, ${shown} miles. Step outside.` : `Night sky, and it's playing along. ${look}, about ${shown} miles. This one should paint the horizon.`;
	return {
		...base,
		id: "clear",
		kicker: "Clear view",
		line,
		cloud,
		precip,
		seeLikely: true
	};
}
function plainAnswer(call) {
	const look = `Look ${compassWord(call.compass)}.`;
	if (call.id === "clear") return {
		word: "Yes",
		command: `${look} You should be able to see this launch from where you are.`
	};
	if (call.id === "fringe") return {
		word: "Maybe",
		command: `${look} You are near the edge of where this rocket is usually visible.`
	};
	if (call.id === "daywash") return {
		word: "Maybe",
		command: `${look} Daylight will make the plume hard to see.`
	};
	if (call.id === "marginal") return {
		word: "Maybe",
		command: `${look} Clouds may hide the plume.`
	};
	if (call.id === "deck") return {
		word: "No",
		command: "The clouds are too thick. You will hear the launch before you see it."
	};
	if (call.id === "range") return {
		word: "No",
		command: "This launch is too far away to see from here."
	};
	if (call.kicker === "Reel short") return {
		word: "Wait",
		command: "The weather forecast does not cover liftoff yet, but the distance still counts."
	};
	return {
		word: "Wait",
		command: "The cloud forecast for liftoff is still loading."
	};
}
function placeSentence(call) {
	return `It is ${formatMiles(call.miles)} miles ${compassWord(call.compass)} of you.`;
}
function ringsFor(call, clearOnly) {
	if (!call.inRadius || call.id === "range" || call.kicker === "Calling the sky") return false;
	return !clearOnly || call.seeLikely;
}
function bulletinCopy(launch, lead) {
	const answer = plainAnswer(launch.call);
	return {
		title: `Sightline. ${markLabel(lead)}.`,
		body: `${launch.mission} is on a ${launch.vehicle}. ${placeSentence(launch.call)} ${answer.command}`
	};
}
function nextRing(scored, leads, fired, now, clearOnly) {
	if (now <= 0) return null;
	let best = null;
	for (const launch of scored) {
		if (!ringsFor(launch.call, clearOnly)) continue;
		const net = new Date(launch.net).getTime();
		for (const lead of leads) {
			if (fired.includes(`${launch.id}:${lead}`)) continue;
			const at = net - lead * 6e4;
			if (at < now - 3e3) continue;
			if (!best || at < best.at) best = {
				at,
				launch,
				lead
			};
		}
	}
	return best;
}
function badgeClass(id) {
	if (id === "clear" || id === "fringe" || id === "daywash") return "bg-sun text-ink";
	if (id === "deck") return "bg-alert text-paper";
	if (id === "marginal") return "bg-paper text-ink";
	return "border border-line bg-navy text-paper";
}
var TAPE = {
	"updated": "2026-10-09T09:25:42Z",
	"source": "tape",
	"launches": [
		{
			"id": "a1bb0984-19d4-4b47-9bba-706d225573e2",
			"name": "Long March 12 | Unknown Payload",
			"provider": "China Aerospace Science and Technology Corporation",
			"vehicle": "Long March 12",
			"vehicleClass": "medium",
			"mission": "Unknown Payload",
			"missionType": "Unknown",
			"summary": "Details TBD.",
			"status": "Go for Launch",
			"net": "2026-10-09T19:25:00Z",
			"windowStart": "2026-10-09T19:20:00Z",
			"windowEnd": "2026-10-09T19:49:00Z",
			"precision": "Hour",
			"padName": "Commercial LC-2",
			"location": "Wenchang Space Launch Site, People's Republic of China",
			"lat": 19.59755,
			"lon": 110.936481,
			"image": "https://thespacedevs-prod.nyc3.digitaloceanspaces.com/media/images/cz-12_on_its_la_image_20241128132937.jpg",
			"probability": null,
			"url": "https://ll.thespacedevs.com/2.2.0/launch/a1bb0984-19d4-4b47-9bba-706d225573e2/"
		},
		{
			"id": "da43dc2c-00af-4cc1-8ef1-90a60b2eb9e5",
			"name": "Falcon 9 Block 5 | SDA Tranche 1 Transport Layer A",
			"provider": "SpaceX",
			"vehicle": "Falcon 9 Block 5",
			"vehicleClass": "medium",
			"mission": "SDA Tranche 1 Transport Layer A",
			"missionType": "Government/Top Secret",
			"summary": "Tranche 1 Transport Layer A is one of six missions by the United States Space Force Space Development Agency (SDA) for the Proliferated Warfighter Space Architecture (PWSA) Tranche 1 Transport Layer constellation, which will provide assured, resilient, low-latency military data and connectivity worldwide to the full range of warfighter…",
			"status": "Go for Launch",
			"net": "2026-10-10T07:29:00Z",
			"windowStart": "2026-10-10T07:29:00Z",
			"windowEnd": "2026-10-10T07:29:00Z",
			"precision": "Minute",
			"padName": "Space Launch Complex 4E",
			"location": "Vandenberg SFB, CA, USA",
			"lat": 34.632,
			"lon": -120.611,
			"image": "https://thespacedevs-prod.nyc3.digitaloceanspaces.com/media/images/falcon_9_image_20230807133459.jpeg",
			"probability": null,
			"url": "https://ll.thespacedevs.com/2.2.0/launch/da43dc2c-00af-4cc1-8ef1-90a60b2eb9e5/"
		},
		{
			"id": "97c6f5e1-299e-4652-b72d-9618ac047076",
			"name": "Falcon 9 Block 5 | Starlink Group 15-25",
			"provider": "SpaceX",
			"vehicle": "Falcon 9 Block 5",
			"vehicleClass": "medium",
			"mission": "Starlink Group 15-25",
			"missionType": "Communications",
			"summary": "A batch of 27 satellites for the Starlink mega-constellation - SpaceX's project for space-based Internet communication system.",
			"status": "Go for Launch",
			"net": "2026-10-12T23:00:00Z",
			"windowStart": "2026-10-12T23:00:00Z",
			"windowEnd": "2026-10-13T03:00:00Z",
			"precision": "Minute",
			"padName": "Space Launch Complex 4E",
			"location": "Vandenberg SFB, CA, USA",
			"lat": 34.632,
			"lon": -120.611,
			"image": "https://thespacedevs-prod.nyc3.digitaloceanspaces.com/media/images/falcon2520925_image_20221009234147.png",
			"probability": null,
			"url": "https://ll.thespacedevs.com/2.2.0/launch/97c6f5e1-299e-4652-b72d-9618ac047076/"
		},
		{
			"id": "bf2c3027-a314-403e-a416-2bfd5d165ad1",
			"name": "Falcon 9 Block 5 | Dragon CRS-2 SpX-35",
			"provider": "SpaceX",
			"vehicle": "Falcon 9 Block 5",
			"vehicleClass": "medium",
			"mission": "Dragon CRS-2 SpX-35",
			"missionType": "Resupply",
			"summary": "35th commercial resupply services mission to the International Space Station operated by SpaceX. The flight will be conducted under the second Commercial Resupply Services contract with NASA.\r \r Cargo Dragon 2 brings supplies and payloads, including critical materials to directly support science and research investigations that occur o…",
			"status": "Go for Launch",
			"net": "2026-10-13T10:33:44Z",
			"windowStart": "2026-10-13T10:33:44Z",
			"windowEnd": "2026-10-13T10:33:44Z",
			"precision": "Second",
			"padName": "Space Launch Complex 40",
			"location": "Cape Canaveral SFS, FL, USA",
			"lat": 28.56194122,
			"lon": -80.57735736,
			"image": "https://thespacedevs-prod.nyc3.digitaloceanspaces.com/media/images/falcon2520925_image_20210520085648.jpeg",
			"probability": null,
			"url": "https://ll.thespacedevs.com/2.2.0/launch/bf2c3027-a314-403e-a416-2bfd5d165ad1/"
		},
		{
			"id": "df88cfbf-f504-4e11-8370-e33dd6280b5b",
			"name": "Falcon 9 Block 5 | USSF-481",
			"provider": "SpaceX",
			"vehicle": "Falcon 9 Block 5",
			"vehicleClass": "medium",
			"mission": "USSF-481",
			"missionType": "Government/Top Secret",
			"summary": "A classified mission for the United States Space Force. It is possibly a batch of classified LEO satellites based on SpaceX’s Starshield satellite bus, based on locations of ascent rocket stage drop zones being fits with previous SDA Transport Layer launches.",
			"status": "Go for Launch",
			"net": "2026-10-15T23:44:00Z",
			"windowStart": "2026-10-15T23:44:00Z",
			"windowEnd": "2026-10-16T03:44:00Z",
			"precision": "Minute",
			"padName": "Space Launch Complex 4E",
			"location": "Vandenberg SFB, CA, USA",
			"lat": 34.632,
			"lon": -120.611,
			"image": "https://thespacedevs-prod.nyc3.digitaloceanspaces.com/media/images/falcon_9_liftof_image_20260816171423.jpg",
			"probability": null,
			"url": "https://ll.thespacedevs.com/2.2.0/launch/df88cfbf-f504-4e11-8370-e33dd6280b5b/"
		},
		{
			"id": "69ebbcd2-b257-4070-9ef9-21e7d1f8a883",
			"name": "H3-24 | Martian Moon eXplorer (MMX)",
			"provider": "Mitsubishi Heavy Industries",
			"vehicle": "H3-24",
			"vehicleClass": "medium",
			"mission": "Martian Moon eXplorer (MMX)",
			"missionType": "Planetary Science",
			"summary": "MMX is a Japanese scientific mission to land on Phobos, one of the two moons of Mars, to collect samples before bringing them back to Earth.\r \r The mission includes a small French/German rover to explore the surface of Phobos.",
			"status": "Go for Launch",
			"net": "2026-10-19T19:41:03Z",
			"windowStart": "2026-10-19T19:41:03Z",
			"windowEnd": "2026-10-19T19:41:03Z",
			"precision": "Second",
			"padName": "Yoshinobu Launch Complex LP-2",
			"location": "Tanegashima Space Center, Japan",
			"lat": 30.400938,
			"lon": 130.97564,
			"image": "https://thespacedevs-prod.nyc3.digitaloceanspaces.com/media/images/h3-24_liftoff__image_20251028184029.jpeg",
			"probability": null,
			"url": "https://ll.thespacedevs.com/2.2.0/launch/69ebbcd2-b257-4070-9ef9-21e7d1f8a883/"
		},
		{
			"id": "ef9850ad-1096-425b-9d27-f7bbd186e61a",
			"name": "Vulcan VC6L | Amazon Leo (LV-01)",
			"provider": "United Launch Alliance",
			"vehicle": "Vulcan VC6L",
			"vehicleClass": "heavy",
			"mission": "Amazon Leo (LV-01)",
			"missionType": "Communications",
			"summary": "Amazon Leo, formerly known as Project Kuiper, is a mega constellation of satellites in Low Earth Orbit that will offer broadband internet access, this constellation will be managed by Kuiper Systems LLC, a subsidiary of Amazon. This constellation is planned to be composed of 3,276 satellites. The satellites are projected to be placed i…",
			"status": "To Be Determined",
			"net": "2026-10-29T00:00:00Z",
			"windowStart": "2026-10-29T00:00:00Z",
			"windowEnd": "2026-10-29T00:00:00Z",
			"precision": "Day",
			"padName": "Space Launch Complex 41",
			"location": "Cape Canaveral SFS, FL, USA",
			"lat": 28.58341025,
			"lon": -80.58303644,
			"image": "https://thespacedevs-prod.nyc3.digitaloceanspaces.com/media/images/vulcan_vc6l_image_20220406123130.jpg",
			"probability": null,
			"url": "https://ll.thespacedevs.com/2.2.0/launch/ef9850ad-1096-425b-9d27-f7bbd186e61a/"
		},
		{
			"id": "7bdc412b-c965-4517-a131-f57a01189803",
			"name": "Ariane 64 Block 2 | Amazon Leo (LE-04)",
			"provider": "Arianespace",
			"vehicle": "Ariane 64 Block 2",
			"vehicleClass": "heavy",
			"mission": "Amazon Leo (LE-04)",
			"missionType": "Communications",
			"summary": "Amazon Leo, formerly known as Project Kuiper, is a mega constellation of satellites in Low Earth Orbit that will offer broadband internet access, this constellation will be managed by Kuiper Systems LLC, a subsidiary of Amazon. This constellation is planned to be composed of 3,276 satellites. The satellites are projected to be placed i…",
			"status": "To Be Determined",
			"net": "2026-10-31T00:00:00Z",
			"windowStart": "2026-10-31T00:00:00Z",
			"windowEnd": "2026-10-31T00:00:00Z",
			"precision": "Month",
			"padName": "Ariane Launch Area 4",
			"location": "Guiana Space Centre, French Guiana",
			"lat": 5.256319,
			"lon": -52.786838,
			"image": "https://thespacedevs-prod.nyc3.digitaloceanspaces.com/media/images/ariane_64_lifto_image_20260618063419.jpg",
			"probability": null,
			"url": "https://ll.thespacedevs.com/2.2.0/launch/7bdc412b-c965-4517-a131-f57a01189803/"
		},
		{
			"id": "3b430f81-0ff1-4d85-8a1a-cef0de326198",
			"name": "Falcon 9 Block 5 | Bandwagon 5 (Dedicated Mid-Inclination Rideshare)",
			"provider": "SpaceX",
			"vehicle": "Falcon 9 Block 5",
			"vehicleClass": "medium",
			"mission": "Bandwagon 5 (Dedicated Mid-Inclination Rideshare)",
			"missionType": "Dedicated Rideshare",
			"summary": "Dedicated rideshare flight to a mid-inclination orbit with dozens of small microsatellites and nanosatellites for commercial and government customers.",
			"status": "To Be Determined",
			"net": "2026-10-31T00:00:00Z",
			"windowStart": "2026-10-31T00:00:00Z",
			"windowEnd": "2026-10-31T00:00:00Z",
			"precision": "Month",
			"padName": "Space Launch Complex 40",
			"location": "Cape Canaveral SFS, FL, USA",
			"lat": 28.56194122,
			"lon": -80.57735736,
			"image": "https://thespacedevs-prod.nyc3.digitaloceanspaces.com/media/images/falcon_9_liftof_image_20251102082912.jpg",
			"probability": null,
			"url": "https://ll.thespacedevs.com/2.2.0/launch/3b430f81-0ff1-4d85-8a1a-cef0de326198/"
		},
		{
			"id": "20d5676e-111b-40e3-8923-b218c3665ca2",
			"name": "GSLV Mk II | IRNSS-1L (NVS-03)",
			"provider": "Indian Space Research Organization",
			"vehicle": "GSLV Mk. II",
			"vehicleClass": "medium",
			"mission": "IRNSS-1L (NVS-03)",
			"missionType": "Navigation",
			"summary": "This is a replacement satellite for the Indian Regional Navigation Satellite System. The constellation will provide India with an alternative to GPS and will be used for military and civilian use. Located at a geosynchronous orbit, the system will be operated by the Indian government.",
			"status": "To Be Determined",
			"net": "2026-10-31T00:00:00Z",
			"windowStart": "2026-10-31T00:00:00Z",
			"windowEnd": "2026-10-31T00:00:00Z",
			"precision": "Month",
			"padName": "Satish Dhawan Space Centre Second Launch Pad",
			"location": "Satish Dhawan Space Centre, India",
			"lat": 13.7199,
			"lon": 80.2304,
			"image": "https://thespacedevs-prod.nyc3.digitaloceanspaces.com/media/images/gslv2520mk252_image_20240101090337.jpg",
			"probability": null,
			"url": "https://ll.thespacedevs.com/2.2.0/launch/20d5676e-111b-40e3-8923-b218c3665ca2/"
		},
		{
			"id": "dc570565-4dcf-4ab9-8174-bf88efef477f",
			"name": "Long March 12A | Flight 2",
			"provider": "China Aerospace Science and Technology Corporation",
			"vehicle": "Long March 12A",
			"vehicleClass": "medium",
			"mission": "Flight 2",
			"missionType": "Test Flight",
			"summary": "Second test launch of CASC/SAST’s Long March 12A rocket. Payload identities are TBD.",
			"status": "To Be Determined",
			"net": "2026-10-31T00:00:00Z",
			"windowStart": "2026-10-31T00:00:00Z",
			"windowEnd": "2026-10-31T00:00:00Z",
			"precision": "Month",
			"padName": "Long March 12 series Pad",
			"location": "Jiuquan Satellite Launch Center, People's Republic of China",
			"lat": 40.891596,
			"lon": 100.217289,
			"image": "https://thespacedevs-prod.nyc3.digitaloceanspaces.com/media/images/long_march_12a__image_20251224005749.jpg",
			"probability": null,
			"url": "https://ll.thespacedevs.com/2.2.0/launch/dc570565-4dcf-4ab9-8174-bf88efef477f/"
		},
		{
			"id": "e59ff9a4-f72f-4841-8546-3c94346ecdba",
			"name": "SSLV | AayulSAT-1A & others",
			"provider": "Indian Space Research Organization",
			"vehicle": "SSLV",
			"vehicleClass": "small",
			"mission": "AayulSAT-1A & others",
			"missionType": "Technology",
			"summary": "Ride-share launch of multiple satellites, including the in-orbit refueling demonstration satellite AayulSAT-1A from OrbitAID Aerospace. Other payload's identities TBD.",
			"status": "To Be Determined",
			"net": "2026-10-31T00:00:00Z",
			"windowStart": "2026-10-31T00:00:00Z",
			"windowEnd": "2026-10-31T00:00:00Z",
			"precision": "Month",
			"padName": "Satish Dhawan Space Centre First Launch Pad",
			"location": "Satish Dhawan Space Centre, India",
			"lat": 13.733,
			"lon": 80.235,
			"image": "https://thespacedevs-prod.nyc3.digitaloceanspaces.com/media/images/sslv_image_20220912001724.jpeg",
			"probability": null,
			"url": "https://ll.thespacedevs.com/2.2.0/launch/e59ff9a4-f72f-4841-8546-3c94346ecdba/"
		},
		{
			"id": "8dd5de11-831b-445f-86f0-bffefe0550d9",
			"name": "Soyuz 2.1b | Progress MS-36 (97P)",
			"provider": "Russian Federal Space Agency (ROSCOSMOS)",
			"vehicle": "Soyuz 2.1b",
			"vehicleClass": "medium",
			"mission": "Progress MS-36 (97P)",
			"missionType": "Resupply",
			"summary": "Progress resupply mission to the International Space Station.",
			"status": "To Be Confirmed",
			"net": "2026-11-24T05:03:00Z",
			"windowStart": "2026-11-24T05:03:00Z",
			"windowEnd": "2026-11-24T05:03:00Z",
			"precision": "Minute",
			"padName": "31/6",
			"location": "Baikonur Cosmodrome, Republic of Kazakhstan",
			"lat": 45.996034,
			"lon": 63.564003,
			"image": "https://thespacedevs-prod.nyc3.digitaloceanspaces.com/media/images/soyuz_2.1b_image_20230802085331.jpg",
			"probability": null,
			"url": "https://ll.thespacedevs.com/2.2.0/launch/8dd5de11-831b-445f-86f0-bffefe0550d9/"
		},
		{
			"id": "22e117bf-041c-49d5-9d09-7b180036e143",
			"name": "Ariane 62 | Metop-SG B1",
			"provider": "Arianespace",
			"vehicle": "Ariane 62",
			"vehicleClass": "heavy",
			"mission": "Metop-SG B1",
			"missionType": "Earth Science",
			"summary": "Second of EUMETSAT's second generation of Metop weather satellites.",
			"status": "To Be Determined",
			"net": "2026-11-30T00:00:00Z",
			"windowStart": "2026-11-30T00:00:00Z",
			"windowEnd": "2026-11-30T00:00:00Z",
			"precision": "Month",
			"padName": "Ariane Launch Area 4",
			"location": "Guiana Space Centre, French Guiana",
			"lat": 5.256319,
			"lon": -52.786838,
			"image": "https://thespacedevs-prod.nyc3.digitaloceanspaces.com/media/images/ariane_62_lifto_image_20240711132056.jpeg",
			"probability": null,
			"url": "https://ll.thespacedevs.com/2.2.0/launch/22e117bf-041c-49d5-9d09-7b180036e143/"
		},
		{
			"id": "d74afbc7-0de5-491c-be05-4e9c31f736ac",
			"name": "Falcon 9 Block 5 | Cygnus CRS-2 NG-25",
			"provider": "SpaceX",
			"vehicle": "Falcon 9 Block 5",
			"vehicleClass": "medium",
			"mission": "Cygnus CRS-2 NG-25",
			"missionType": "Resupply",
			"summary": "This is the 25th flight of the Orbital ATK's uncrewed resupply spacecraft Cygnus and its 24th flight to the International Space Station under the Commercial Resupply Services contract with NASA.",
			"status": "To Be Determined",
			"net": "2026-11-30T00:00:00Z",
			"windowStart": "2026-11-30T00:00:00Z",
			"windowEnd": "2026-11-30T00:00:00Z",
			"precision": "Month",
			"padName": "Space Launch Complex 40",
			"location": "Cape Canaveral SFS, FL, USA",
			"lat": 28.56194122,
			"lon": -80.57735736,
			"image": "https://thespacedevs-prod.nyc3.digitaloceanspaces.com/media/images/falcon_9_image_20230807133459.jpeg",
			"probability": null,
			"url": "https://ll.thespacedevs.com/2.2.0/launch/d74afbc7-0de5-491c-be05-4e9c31f736ac/"
		},
		{
			"id": "dfac5ab7-7017-454f-b6cf-eeed277a97b5",
			"name": "LVM-3 | Gaganyaan-1",
			"provider": "Indian Space Research Organization",
			"vehicle": "Launch Vehicle Mark-3 (GSLV Mk III)",
			"vehicleClass": "medium",
			"mission": "Gaganyaan-1",
			"missionType": "Test Flight",
			"summary": "First uncrewed orbital test flight of the Gaganyaan capsule.",
			"status": "To Be Determined",
			"net": "2026-11-30T00:00:00Z",
			"windowStart": "2026-11-30T00:00:00Z",
			"windowEnd": "2026-11-30T00:00:00Z",
			"precision": "Month",
			"padName": "Satish Dhawan Space Centre Second Launch Pad",
			"location": "Satish Dhawan Space Centre, India",
			"lat": 13.7199,
			"lon": 80.2304,
			"image": "https://thespacedevs-prod.nyc3.digitaloceanspaces.com/media/images/gslv2520mk2520iii_image_20190604000938.jpg",
			"probability": null,
			"url": "https://ll.thespacedevs.com/2.2.0/launch/dfac5ab7-7017-454f-b6cf-eeed277a97b5/"
		},
		{
			"id": "b5a9bccb-30d7-4af6-8ad1-fabb563be53c",
			"name": "PSLV-XL | TDS-01",
			"provider": "Indian Space Research Organization",
			"vehicle": "PSLV XL",
			"vehicleClass": "medium",
			"mission": "TDS-01",
			"missionType": "Technology",
			"summary": "TDS-01 (Technology Demonstration Satellite-01) is an Indian geostationary orbit technology demonstration satellite carrying payloads for the Indian Space Research Organisation (ISRO)’s Institute of Plasma Research, Gandhinagar and the CSIR-CEERI, Pilani. \r \r Payloads to be tested included an internally developed 300 mN electric powered…",
			"status": "To Be Determined",
			"net": "2026-11-30T00:00:00Z",
			"windowStart": "2026-11-30T00:00:00Z",
			"windowEnd": "2026-11-30T00:00:00Z",
			"precision": "Month",
			"padName": "Satish Dhawan Space Centre First Launch Pad",
			"location": "Satish Dhawan Space Centre, India",
			"lat": 13.733,
			"lon": 80.235,
			"image": "https://thespacedevs-prod.nyc3.digitaloceanspaces.com/media/images/pslv_image_20190224012254.jpeg",
			"probability": null,
			"url": "https://ll.thespacedevs.com/2.2.0/launch/b5a9bccb-30d7-4af6-8ad1-fabb563be53c/"
		},
		{
			"id": "71df1dd0-d658-4762-b0bc-0fca6886aea7",
			"name": "Falcon 9 Block 5 | SDA Tranche 2 Transport Layer D",
			"provider": "SpaceX",
			"vehicle": "Falcon 9 Block 5",
			"vehicleClass": "medium",
			"mission": "SDA Tranche 2 Transport Layer D",
			"missionType": "Government/Top Secret",
			"summary": "Classified mission launched by the Space Development Agency (SDA) for Tranche 2 Transport Layer.",
			"status": "To Be Determined",
			"net": "2026-12-31T00:00:00Z",
			"windowStart": "2026-12-31T00:00:00Z",
			"windowEnd": "2026-12-31T00:00:00Z",
			"precision": "Month",
			"padName": "Unknown Pad",
			"location": "Cape Canaveral SFS, FL, USA",
			"lat": 28.458,
			"lon": -80.528,
			"image": "https://thespacedevs-prod.nyc3.digitaloceanspaces.com/media/images/falcon_9_image_20230807133459.jpeg",
			"probability": null,
			"url": "https://ll.thespacedevs.com/2.2.0/launch/71df1dd0-d658-4762-b0bc-0fca6886aea7/"
		},
		{
			"id": "71ed4649-8d71-42e8-8548-d42ffa2c5a6e",
			"name": "Falcon 9 Block 5 | SDA Tranche 2 Transport Layer E",
			"provider": "SpaceX",
			"vehicle": "Falcon 9 Block 5",
			"vehicleClass": "medium",
			"mission": "SDA Tranche 2 Transport Layer E",
			"missionType": "Government/Top Secret",
			"summary": "Classified mission launched by the Space Development Agency (SDA) for Tranche 2 Transport Layer.",
			"status": "To Be Determined",
			"net": "2026-12-31T00:00:00Z",
			"windowStart": "2026-12-31T00:00:00Z",
			"windowEnd": "2026-12-31T00:00:00Z",
			"precision": "Month",
			"padName": "Space Launch Complex 4E",
			"location": "Vandenberg SFB, CA, USA",
			"lat": 34.632,
			"lon": -120.611,
			"image": "https://thespacedevs-prod.nyc3.digitaloceanspaces.com/media/images/falcon_9_image_20230807133459.jpeg",
			"probability": null,
			"url": "https://ll.thespacedevs.com/2.2.0/launch/71ed4649-8d71-42e8-8548-d42ffa2c5a6e/"
		},
		{
			"id": "ce1317de-ec94-4479-9b28-38ebf11f13ae",
			"name": "Falcon 9 Block 5 | Telesat Lightspeed 1",
			"provider": "SpaceX",
			"vehicle": "Falcon 9 Block 5",
			"vehicleClass": "medium",
			"mission": "Telesat Lightspeed 1",
			"missionType": "Communications",
			"summary": "Up to 18 satellites manufactured by MDA for Canadian satellite operator Telesat's Lightspeed constellation.",
			"status": "To Be Determined",
			"net": "2026-12-31T00:00:00Z",
			"windowStart": "2026-12-31T00:00:00Z",
			"windowEnd": "2026-12-31T00:00:00Z",
			"precision": "Month",
			"padName": "Unknown Pad",
			"location": "Cape Canaveral SFS, FL, USA",
			"lat": 28.458,
			"lon": -80.528,
			"image": "https://thespacedevs-prod.nyc3.digitaloceanspaces.com/media/images/falcon_9_image_20230807133459.jpeg",
			"probability": null,
			"url": "https://ll.thespacedevs.com/2.2.0/launch/ce1317de-ec94-4479-9b28-38ebf11f13ae/"
		},
		{
			"id": "d3bd7fb2-fac6-49fc-ae52-cee07d2fde67",
			"name": "Falcon Heavy | Griffin Mission One",
			"provider": "SpaceX",
			"vehicle": "Falcon Heavy",
			"vehicleClass": "heavy",
			"mission": "Griffin Mission One",
			"missionType": "Lunar Exploration",
			"summary": "Demonstration flight of the Astrobotic Griffin lander and its engines, initially contracted for the cancelled NASA VIPER (Volatiles Investigating Polar Exploration Rover) mission. The vacated payload spot will now host the FLIP (FLEX Lunar Innovation Platform) lunar rover from Astrolab.",
			"status": "To Be Determined",
			"net": "2026-12-31T00:00:00Z",
			"windowStart": "2026-12-31T00:00:00Z",
			"windowEnd": "2026-12-31T00:00:00Z",
			"precision": "Month",
			"padName": "Launch Complex 39A",
			"location": "Kennedy Space Center, FL, USA",
			"lat": 28.60822681,
			"lon": -80.60428186,
			"image": "https://thespacedevs-prod.nyc3.digitaloceanspaces.com/media/images/falcon_heavy_image_20220129192819.jpeg",
			"probability": null,
			"url": "https://ll.thespacedevs.com/2.2.0/launch/d3bd7fb2-fac6-49fc-ae52-cee07d2fde67/"
		},
		{
			"id": "0cf92611-82a8-4095-a0b4-dda2e74b1fff",
			"name": "LVM-3 | GSAT-32 (GSAT-N3)",
			"provider": "Indian Space Research Organization",
			"vehicle": "Launch Vehicle Mark-3 (GSLV Mk III)",
			"vehicleClass": "medium",
			"mission": "GSAT-32 (GSAT-N3)",
			"missionType": "Communications",
			"summary": "GSAT-32 is a geostationary communications satellite for the Indian Space Research Organization (ISRO). The spacecraft is a replacement for GSAT-6A that failed before reaching geostationary orbit after launch in 2018.",
			"status": "To Be Determined",
			"net": "2026-12-31T00:00:00Z",
			"windowStart": "2026-12-31T00:00:00Z",
			"windowEnd": "2026-12-31T00:00:00Z",
			"precision": "Month",
			"padName": "Satish Dhawan Space Centre Second Launch Pad",
			"location": "Satish Dhawan Space Centre, India",
			"lat": 13.7199,
			"lon": 80.2304,
			"image": "https://thespacedevs-prod.nyc3.digitaloceanspaces.com/media/images/gslv2520mk2520iii_image_20190604000938.jpg",
			"probability": null,
			"url": "https://ll.thespacedevs.com/2.2.0/launch/0cf92611-82a8-4095-a0b4-dda2e74b1fff/"
		},
		{
			"id": "0b85fcca-5252-48d7-9ccb-c10b1da9d183",
			"name": "Ariane 62 | Galileo L15 (FOC FM28 & FM31)",
			"provider": "Arianespace",
			"vehicle": "Ariane 62",
			"vehicleClass": "heavy",
			"mission": "Galileo L15 (FOC FM28 & FM31)",
			"missionType": "Navigation",
			"summary": "Payload consists of two satellites for Europe's Galileo navigation system.",
			"status": "To Be Determined",
			"net": "2026-12-31T00:00:00Z",
			"windowStart": "2026-12-31T00:00:00Z",
			"windowEnd": "2026-12-31T00:00:00Z",
			"precision": "Quarter 4",
			"padName": "Ariane Launch Area 4",
			"location": "Guiana Space Centre, French Guiana",
			"lat": 5.256319,
			"lon": -52.786838,
			"image": "https://thespacedevs-prod.nyc3.digitaloceanspaces.com/media/images/ariane_62_lifto_image_20240711132056.jpeg",
			"probability": null,
			"url": "https://ll.thespacedevs.com/2.2.0/launch/0b85fcca-5252-48d7-9ccb-c10b1da9d183/"
		},
		{
			"id": "8bf5f61e-a7e1-41e6-aede-7b87e4beebab",
			"name": "Falcon 9 Block 5 | CHORUS",
			"provider": "SpaceX",
			"vehicle": "Falcon 9 Block 5",
			"vehicleClass": "medium",
			"mission": "CHORUS",
			"missionType": "Earth Science",
			"summary": "CHORUS is MDA's next generation Earth observation constellation, consisting of 2 radar satellites (C-band SAR and X-band SAR), in a 53.5 degree 600 km altitude LEO, with the X-band trailing the C-band by 60 minutes. A collaborative multi-sensor constellation, CHORUS will bring together diverse and unique imagery and data sources and pr…",
			"status": "To Be Determined",
			"net": "2026-12-31T00:00:00Z",
			"windowStart": "2026-12-31T00:00:00Z",
			"windowEnd": "2026-12-31T00:00:00Z",
			"precision": "Quarter 4",
			"padName": "Unknown Pad",
			"location": "Cape Canaveral SFS, FL, USA",
			"lat": 28.458,
			"lon": -80.528,
			"image": "https://thespacedevs-prod.nyc3.digitaloceanspaces.com/media/images/falcon_9_image_20230807133459.jpeg",
			"probability": null,
			"url": "https://ll.thespacedevs.com/2.2.0/launch/8bf5f61e-a7e1-41e6-aede-7b87e4beebab/"
		}
	]
};
//#endregion
export { windSentence as S, ringsFor as _, aboutWhen as a, vehicleClassOf as b, clock as c, formatMiles as d, longWhen as f, plainAnswer as g, placeSentence as h, TAPE as i, compassWord as l, nextRing as m, MARKS as n, badgeClass as o, markLabel as p, STUDIOS as r, bulletinCopy as s, HORIZONS as t, countdown as u, shortWhen as v, viewingCall as x, skyWords as y };
