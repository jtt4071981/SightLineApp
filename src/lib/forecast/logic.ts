import type {
  Launch,
  LightId,
  ScoredLaunch,
  Sky,
  Studio,
  VehicleClass,
  ViewingCall,
} from "./types";

const COMPASS = [
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
  "NNW",
] as const;

const COMPASS_WORD: Record<string, string> = {
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
  NNW: "north-northwest",
};

const REACH: Record<VehicleClass, Record<LightId, number>> = {
  small: { night: 100, twilight: 50, day: 18 },
  medium: { night: 480, twilight: 240, day: 45 },
  heavy: { night: 750, twilight: 380, day: 80 },
};

export const STUDIOS: Studio[] = [
  { id: "cocoa", label: "Cocoa Beach", detail: "Florida", lat: 28.32, lon: -80.6076 },
  { id: "titusville", label: "Titusville", detail: "Florida", lat: 28.611, lon: -80.8076 },
  { id: "orlando", label: "Orlando", detail: "Florida", lat: 28.5383, lon: -81.3792 },
  { id: "lompoc", label: "Lompoc", detail: "California", lat: 34.6391, lon: -120.4579 },
  { id: "la", label: "Los Angeles", detail: "California", lat: 34.0522, lon: -118.2437 },
  { id: "brownsville", label: "Brownsville", detail: "Texas", lat: 25.9017, lon: -97.4975 },
  { id: "wallops", label: "Wallops Island", detail: "Virginia", lat: 37.84, lon: -75.488 },
  { id: "nyc", label: "New York", detail: "New York", lat: 40.7128, lon: -74.006 },
  { id: "london", label: "London", detail: "United Kingdom", lat: 51.5074, lon: -0.1278 },
  { id: "tokyo", label: "Tokyo", detail: "Japan", lat: 35.6762, lon: 139.6503 },
  { id: "gisborne", label: "Gisborne", detail: "New Zealand", lat: -38.6626, lon: 178.0176 },
];

/** A point inland enough to stand for the state or country, not the launch city. */
const REGIONS: Record<string, { kind: "State" | "Regional"; lat: number; lon: number }> = {
  Alabama: { kind: "State", lat: 32.8, lon: -86.8 },
  Alaska: { kind: "State", lat: 64.2, lon: -152.5 },
  Arizona: { kind: "State", lat: 34.3, lon: -111.7 },
  Arkansas: { kind: "State", lat: 34.9, lon: -92.4 },
  California: { kind: "State", lat: 37.2, lon: -119.5 },
  Colorado: { kind: "State", lat: 39.0, lon: -105.5 },
  Connecticut: { kind: "State", lat: 41.6, lon: -72.7 },
  Delaware: { kind: "State", lat: 39.0, lon: -75.5 },
  Florida: { kind: "State", lat: 27.8, lon: -81.7 },
  Georgia: { kind: "State", lat: 32.7, lon: -83.4 },
  Hawaii: { kind: "State", lat: 20.6, lon: -156.4 },
  Idaho: { kind: "State", lat: 44.4, lon: -114.6 },
  Illinois: { kind: "State", lat: 40.0, lon: -89.2 },
  Indiana: { kind: "State", lat: 39.9, lon: -86.3 },
  Iowa: { kind: "State", lat: 42.1, lon: -93.5 },
  Kansas: { kind: "State", lat: 38.5, lon: -98.3 },
  Kentucky: { kind: "State", lat: 37.5, lon: -85.3 },
  Louisiana: { kind: "State", lat: 31.1, lon: -92.0 },
  Maine: { kind: "State", lat: 45.4, lon: -69.2 },
  Maryland: { kind: "State", lat: 39.1, lon: -76.8 },
  Massachusetts: { kind: "State", lat: 42.3, lon: -71.8 },
  Michigan: { kind: "State", lat: 44.3, lon: -85.4 },
  Minnesota: { kind: "State", lat: 46.3, lon: -94.3 },
  Mississippi: { kind: "State", lat: 32.7, lon: -89.7 },
  Missouri: { kind: "State", lat: 38.4, lon: -92.5 },
  Montana: { kind: "State", lat: 47.0, lon: -109.6 },
  Nebraska: { kind: "State", lat: 41.5, lon: -99.8 },
  Nevada: { kind: "State", lat: 39.3, lon: -116.6 },
  "New Hampshire": { kind: "State", lat: 43.7, lon: -71.6 },
  "New Jersey": { kind: "State", lat: 40.2, lon: -74.7 },
  "New Mexico": { kind: "State", lat: 34.4, lon: -106.1 },
  "New York": { kind: "State", lat: 42.9, lon: -75.5 },
  "North Carolina": { kind: "State", lat: 35.6, lon: -79.4 },
  "North Dakota": { kind: "State", lat: 47.5, lon: -100.5 },
  Ohio: { kind: "State", lat: 40.3, lon: -82.8 },
  Oklahoma: { kind: "State", lat: 35.6, lon: -97.5 },
  Oregon: { kind: "State", lat: 43.9, lon: -120.6 },
  Pennsylvania: { kind: "State", lat: 40.9, lon: -77.8 },
  "Rhode Island": { kind: "State", lat: 41.7, lon: -71.6 },
  "South Carolina": { kind: "State", lat: 33.9, lon: -80.9 },
  "South Dakota": { kind: "State", lat: 44.4, lon: -100.2 },
  Tennessee: { kind: "State", lat: 35.8, lon: -86.3 },
  Texas: { kind: "State", lat: 31.5, lon: -99.3 },
  Utah: { kind: "State", lat: 39.3, lon: -111.7 },
  Vermont: { kind: "State", lat: 44.1, lon: -72.7 },
  Virginia: { kind: "State", lat: 37.5, lon: -78.5 },
  Washington: { kind: "State", lat: 47.4, lon: -120.5 },
  "West Virginia": { kind: "State", lat: 38.6, lon: -80.6 },
  Wisconsin: { kind: "State", lat: 44.6, lon: -89.8 },
  Wyoming: { kind: "State", lat: 43.0, lon: -107.6 },
  "United Kingdom": { kind: "Regional", lat: 54.0, lon: -2.5 },
  Japan: { kind: "Regional", lat: 36.2, lon: 138.2 },
  "New Zealand": { kind: "Regional", lat: -41.3, lon: 174.0 },
};

export function regionPoint(detail: string) {
  const hit = REGIONS[detail];
  if (!hit) return null;
  return { name: detail, kind: hit.kind, lat: hit.lat, lon: hit.lon };
}

export const HORIZONS = [25, 50, 100, 250, 500, 1000, 2000];
export const MARKS = [1440, 360, 60, 30, 15, 5, 0];

export function milesBetween(lat1: number, lon1: number, lat2: number, lon2: number) {
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  return 7917.5226 * Math.asin(Math.min(1, Math.sqrt(a)));
}

export function bearing(lat1: number, lon1: number, lat2: number, lon2: number) {
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;
  const y = Math.sin(Δλ) * Math.cos(φ2);
  const x = Math.cos(φ1) * Math.sin(φ2) - Math.sin(φ1) * Math.cos(φ2) * Math.cos(Δλ);
  return ((Math.atan2(y, x) * 180) / Math.PI + 360) % 360;
}

export function compass16(deg: number) {
  const t = ((deg % 360) + 360) % 360;
  return COMPASS[Math.round(t / 22.5) % 16] ?? "N";
}

export function compassWord(point: string) {
  return COMPASS_WORD[point] ?? point.toLowerCase();
}

/** Solar elevation in degrees. Good enough for night / twilight / day. */
export function sunAltitude(lat: number, lon: number, when: Date) {
  const r = Math.PI / 180;
  const d = when.getTime() / 864e5 + 2440587.5 - 2451545;
  let L = (280.46 + 0.9856474 * d) % 360;
  const g = ((((357.528 + 0.9856003 * d) % 360) + 360) % 360) * r;
  let sun = L + 1.915 * Math.sin(g) + 0.02 * Math.sin(2 * g);
  sun = ((sun % 360) + 360) % 360;
  const λ = sun * r;
  const ε = (23.439 - 4e-7 * d) * r;
  const δ = Math.asin(Math.sin(ε) * Math.sin(λ));
  const ra = Math.atan2(Math.cos(ε) * Math.sin(λ), Math.cos(λ));
  let gmst = 280.46061837 + 360.98564736629 * d;
  gmst = ((gmst % 360) + 360) % 360;
  let h = gmst + lon;
  h = ((h % 360) + 360) % 360;
  const H = h * r - ra;
  const φ = lat * r;
  const sinAlt = Math.sin(φ) * Math.sin(δ) + Math.cos(φ) * Math.cos(δ) * Math.cos(H);
  return (Math.asin(Math.max(-1, Math.min(1, sinAlt))) * 180) / Math.PI;
}

export function lightFromAltitude(alt: number): { id: LightId; label: string } {
  if (alt <= -6) return { id: "night", label: "Night sky" };
  if (alt <= 0) return { id: "twilight", label: "Twilight" };
  if (alt < 15) return { id: "day", label: "Low sun" };
  return { id: "day", label: "High sun" };
}

function rideWord(kind: VehicleClass) {
  if (kind === "heavy") return "heavy lifter";
  if (kind === "small") return "small ride";
  return "workhorse";
}

function parseStamp(stamp: string) {
  return /[zZ]|[+-]\d\d:\d\d$/.test(stamp)
    ? new Date(stamp).getTime()
    : new Date(`${stamp}Z`).getTime();
}

function nearestHour(sky: Sky, when: Date) {
  const target = when.getTime();
  let best: Sky["hourly"][number] | null = null;
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

export function formatMiles(miles: number) {
  if (!Number.isFinite(miles)) return "—";
  if (miles < 10) return miles.toFixed(1);
  return Math.round(miles).toLocaleString("en-US");
}

export function countdown(ms: number) {
  if (ms <= 0) return "LIFTOFF";
  const total = Math.floor(ms / 1000);
  const days = Math.floor(total / 86400);
  const hours = Math.floor((total % 86400) / 3600);
  const mins = Math.floor((total % 3600) / 60);
  const secs = total % 60;
  const pad = (n: number) => String(n).padStart(2, "0");
  return days > 0 ? `${days}D ${pad(hours)}H ${pad(mins)}M` : `${pad(hours)}H ${pad(mins)}M ${pad(secs)}S`;
}

export function aboutWhen(ms: number) {
  if (ms < 6e4) return "any minute";
  const hours = ms / 36e5;
  if (hours < 1) return `about ${Math.max(1, Math.round(ms / 6e4))} minutes`;
  if (hours < 36) return `about ${Math.round(hours)} hours`;
  const days = Math.round(hours / 24);
  return days === 1 ? "about a day" : `about ${days} days`;
}

export function clock(when: Date) {
  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
  }).format(when);
}

export function vanClock(now: number, offsetSeconds: number) {
  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
    timeZone: "UTC",
  }).format(new Date(now + offsetSeconds * 1000));
}

export function shortWhen(iso: string, local: boolean) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "TBD";
  return new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    hour: "numeric",
    minute: "2-digit",
    timeZone: local ? undefined : "UTC",
    timeZoneName: local ? undefined : "short",
  }).format(date);
}

export function longWhen(iso: string, local: boolean) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "Time TBD";
  return new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZone: local ? undefined : "UTC",
    timeZoneName: "short",
  }).format(date);
}

export function eightMark(now: number) {
  const date = new Date(now);
  if (date.getMinutes() === 8) return { onAir: true, ms: 0 };
  const next = new Date(date);
  next.setSeconds(0, 0);
  if (date.getMinutes() >= 8) next.setHours(date.getHours() + 1);
  next.setMinutes(8);
  return { onAir: false, ms: Math.max(0, next.getTime() - now) };
}

export function mmss(ms: number) {
  const total = Math.max(0, Math.floor(ms / 1000));
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export function markLabel(minutes: number) {
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

export function windSentence(deg: number, mph: number) {
  const words = [
    "the north",
    "the northeast",
    "the east",
    "the southeast",
    "the south",
    "the southwest",
    "the west",
    "the northwest",
  ];
  const point = words[Math.round((((deg % 360) + 360) % 360) / 45) % 8];
  const speed = Math.round(mph);
  return `The wind is from ${point} at ${speed} ${speed === 1 ? "mile" : "miles"} per hour.`;
}

export function skyWords(code: number) {
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

export function greeting(now: number) {
  const hour = new Date(now).getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

export function overheadRead(cloud: number, code: number) {
  if (code >= 51 || cloud >= 80) {
    return {
      kicker: "Deck is in",
      line: "Not a stretch for horizon watching. The overhead is shut.",
    };
  }
  if (cloud >= 45) {
    return { kicker: "Broken", line: "Gaps overhead. You might catch pieces of a plume." };
  }
  return { kicker: "Window open", line: "The overhead sky is cooperating right now." };
}

export function vehicleClassOf(name: string): VehicleClass {
  const n = name.toLowerCase();
  if (
    /falcon heavy|vulcan|new glenn|starship|ariane 6|ariane 64|long march 5|cz-5|angara|delta iv|sls|super heavy/.test(
      n,
    )
  ) {
    return "heavy";
  }
  if (
    /electron|sslv|alpha|firefly|terran|launcherone|astra|rocket 3|spectrum|rs1|skyrora|eris|pegasus|vector/.test(
      n,
    )
  ) {
    return "small";
  }
  return "medium";
}

export function viewingCall(
  launch: Launch,
  lat: number,
  lon: number,
  radiusMi: number,
  sky: Sky | null,
  skyStatus: "ready" | "missing" | "loading",
): ViewingCall {
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
    maxMi: reach,
  };
  if (miles > reach * 1.12) {
    return {
      ...base,
      id: "range",
      kicker: "Out of range",
      line: `A ${light.label.toLowerCase()} ${ride} can show out to about ${maxShown} miles. You're ${shown} out — this one's a replay, not a horizon.`,
      cloud: null,
      precip: null,
      seeLikely: false,
    };
  }
  if (skyStatus === "loading") {
    return {
      ...base,
      id: "pending",
      kicker: "Calling the sky",
      line: `${look}, ${shown} miles out. The van is still reading the clouds for T-0.`,
      cloud: null,
      precip: null,
      seeLikely: false,
    };
  }
  const hour = sky ? nearestHour(sky, when) : null;
  if (!hour) {
    const fringe = miles > reach * 0.72;
    return {
      ...base,
      id: "pending",
      kicker: "Reel short",
      line: `Geometry likes a ${light.label.toLowerCase()} look (${look.toLowerCase()}, ${shown} mi, good out to ~${maxShown}). The weather reel runs 16 days, so the deck isn't called yet.`,
      cloud: null,
      precip: null,
      seeLikely: false,
    };
  }
  const cloud = hour.cloud;
  const precip = hour.precip;
  const shut = cloud >= 80 || precip >= 55;
  const broken = cloud >= 40 || precip >= 30;
  const edge = miles > reach * 0.72;
  const deck = `Clouds near ${Math.round(cloud)}% at T-0${precip >= 20 ? `, rain chance ${Math.round(precip)}%` : ""}.`;
  if (shut) {
    return {
      ...base,
      id: "deck",
      kicker: "Deck is in",
      line: `${deck} Lawn chairs stay in the garage. You'll hear about this one before you see it.`,
      cloud,
      precip,
      seeLikely: false,
    };
  }
  if (light.id === "day") {
    return broken || edge
      ? {
          ...base,
          id: "marginal",
          kicker: "Hard look",
          line: `Sun's up and ${deck.toLowerCase()} ${look}, ${shown} miles. Possible if you're close and stubborn.`,
          cloud,
          precip,
          seeLikely: false,
        }
      : {
          ...base,
          id: "daywash",
          kicker: "Daylight look",
          line: `The plume has to punch through a blue sky. You're close (${shown} mi). ${look} — you may still catch the stack.`,
          cloud,
          precip,
          seeLikely: true,
        };
  }
  if (broken) {
    return {
      ...base,
      id: "marginal",
      kicker: "Broken deck",
      line: `${deck} It may flicker through. ${look}, ${shown} miles, and don't trust a single gap.`,
      cloud,
      precip,
      seeLikely: false,
    };
  }
  if (edge) {
    return {
      ...base,
      id: "fringe",
      kicker: "On the fringe",
      line: `You're near the edge of a ${light.label.toLowerCase()} circle (about ${maxShown} mi for this ${ride}). Dark yard, clear horizon. ${look}.`,
      cloud,
      precip,
      seeLikely: true,
    };
  }
  const line =
    light.id === "twilight"
      ? `Twilight launch — the plume likes this light. ${look}, ${shown} miles. Step outside.`
      : `Night sky, and it's playing along. ${look}, about ${shown} miles. This one should paint the horizon.`;
  return {
    ...base,
    id: "clear",
    kicker: "Clear view",
    line,
    cloud,
    precip,
    seeLikely: true,
  };
}

export function plainAnswer(call: ViewingCall): {
  word: "Yes" | "Maybe" | "No" | "Wait";
  command: string;
} {
  const look = `Look ${compassWord(call.compass)}.`;
  if (call.id === "clear") {
    return { word: "Yes", command: `${look} You should be able to see this launch from where you are.` };
  }
  if (call.id === "fringe") {
    return { word: "Maybe", command: `${look} You are near the edge of where this rocket is usually visible.` };
  }
  if (call.id === "daywash") {
    return { word: "Maybe", command: `${look} Daylight will make the plume hard to see.` };
  }
  if (call.id === "marginal") {
    return { word: "Maybe", command: `${look} Clouds may hide the plume.` };
  }
  if (call.id === "deck") {
    return { word: "No", command: "The clouds are too thick. You will hear the launch before you see it." };
  }
  if (call.id === "range") {
    return { word: "No", command: "This launch is too far away to see from here." };
  }
  if (call.kicker === "Reel short") {
    return {
      word: "Wait",
      command: "The weather forecast does not cover liftoff yet, but the distance still counts.",
    };
  }
  return { word: "Wait", command: "The cloud forecast for liftoff is still loading." };
}

export function placeSentence(call: ViewingCall) {
  return `It is ${formatMiles(call.miles)} miles ${compassWord(call.compass)} of you.`;
}

export function ringsFor(call: ViewingCall, clearOnly: boolean) {
  if (!call.inRadius || call.id === "range" || call.kicker === "Calling the sky") return false;
  return !clearOnly || call.seeLikely;
}

export function bulletinCopy(launch: ScoredLaunch, lead: number) {
  const answer = plainAnswer(launch.call);
  return {
    title: `Sightline. ${markLabel(lead)}.`,
    body: `${launch.mission} is on a ${launch.vehicle}. ${placeSentence(launch.call)} ${answer.command}`,
  };
}

export function bestSeat(
  lat: number,
  lon: number,
  studioId: string,
  launches: Launch[],
  now: number,
) {
  const pick = (fromLat: number, fromLon: number) => {
    let best: { score: number; launch: Launch; miles: number; light: string } | null = null;
    for (const launch of launches) {
      if (/scrub|fail/i.test(launch.status)) continue;
      const net = new Date(launch.net).getTime();
      if (!Number.isFinite(net) || net < now || net > now + 2592e5) continue;
      const miles = milesBetween(fromLat, fromLon, launch.lat, launch.lon);
      if (miles > 220) continue;
      const light = lightFromAltitude(sunAltitude(fromLat, fromLon, new Date(net)));
      const score =
        (light.id === "night" ? 420 : light.id === "twilight" ? 260 : 70) - miles - (net - now) / 36e5;
      if (!best || score > best.score) best = { score, launch, miles, light: light.label };
    }
    return best;
  };
  const here = pick(lat, lon);
  let elsewhere: (ReturnType<typeof pick> & { studio: Studio }) | null = null;
  for (const studio of STUDIOS) {
    const scored = pick(studio.lat, studio.lon);
    if (scored && (!elsewhere || scored.score > elsewhere.score)) {
      elsewhere = { studio, ...scored };
    }
  }
  if (!elsewhere || elsewhere.studio.id === studioId || (here && here.score >= elsewhere.score - 40)) {
    return null;
  }
  return {
    studio: elsewhere.studio,
    launch: elsewhere.launch,
    miles: elsewhere.miles,
    light: elsewhere.light,
  };
}

export function nextRing(
  scored: ScoredLaunch[],
  leads: number[],
  fired: string[],
  now: number,
  clearOnly: boolean,
) {
  if (now <= 0) return null;
  let best: { at: number; launch: ScoredLaunch; lead: number } | null = null;
  for (const launch of scored) {
    if (!ringsFor(launch.call, clearOnly)) continue;
    const net = new Date(launch.net).getTime();
    for (const lead of leads) {
      if (fired.includes(`${launch.id}:${lead}`)) continue;
      const at = net - lead * 6e4;
      if (at < now - 3e3) continue;
      if (!best || at < best.at) best = { at, launch, lead };
    }
  }
  return best;
}

export function badgeClass(id: ViewingCall["id"]) {
  if (id === "clear" || id === "fringe" || id === "daywash") return "bg-sun text-ink";
  if (id === "deck") return "bg-alert text-paper";
  if (id === "marginal") return "bg-paper text-ink";
  return "border border-line bg-navy text-paper";
}
