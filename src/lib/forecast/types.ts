export type VehicleClass = "small" | "medium" | "heavy";

export type Launch = {
  id: string;
  name: string;
  provider: string;
  vehicle: string;
  vehicleClass: VehicleClass;
  mission: string;
  missionType: string;
  summary: string;
  status: string;
  net: string;
  windowStart: string;
  windowEnd: string;
  precision: string;
  padName: string;
  location: string;
  lat: number;
  lon: number;
  image: string | null;
  probability: number | null;
  url: string;
};

export type Feed = {
  updated: string;
  source: "live" | "tape";
  launches: Launch[];
};

export type SkyHour = { time: string; cloud: number; precip: number };

export type SkyDay = { time: string; high: number; low: number; code: number; precip: number };

export type Sky = {
  current: {
    tempF: number;
    code: number;
    windDeg: number;
    windMph: number;
    cloud: number;
    visibilityM: number;
    isDay: boolean;
  };
  utcOffsetSeconds: number;
  tzAbbrev: string;
  hourly: SkyHour[];
  daily: SkyDay[];
};

export type LightId = "night" | "twilight" | "day";

export type CallId =
  | "range"
  | "pending"
  | "deck"
  | "marginal"
  | "daywash"
  | "fringe"
  | "clear";

export type ViewingCall = {
  miles: number;
  compass: string;
  look: string;
  light: LightId;
  lightLabel: string;
  inRadius: boolean;
  maxMi: number;
  id: CallId;
  kicker: string;
  line: string;
  cloud: number | null;
  precip: number | null;
  seeLikely: boolean;
};

export type ScoredLaunch = Launch & { call: ViewingCall };

export type Studio = {
  id: string;
  label: string;
  detail: string;
  lat: number;
  lon: number;
};

export type VanLocation = Studio & { source: "studio" | "gps" | "unset" };

export type Bulletin = { id: string; at: number; title: string; body: string };

export type PlaceName = { label: string; detail: string };

export type Channel = "local" | "board" | "alerts";
