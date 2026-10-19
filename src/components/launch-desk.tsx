import { useQuery } from "@tanstack/react-query";
import { Bell, LocateFixed, Radio } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  BEDS,
  bulletinStinger,
  hourStinger,
  setBedTune,
  setBedVolume,
  startBed,
  stopBed,
  unlockAudio,
} from "@/lib/forecast/audio";
import {
  HORIZONS,
  MARKS,
  aboutWhen,
  badgeClass,
  bulletinCopy,
  clock,
  compassWord,
  countdown,
  formatMiles,
  longWhen,
  markLabel,
  nextRing,
  placeSentence,
  plainAnswer,
  regionPoint,
  ringsFor,
  shortWhen,
  skyWords,
  STUDIOS,
  viewingCall,
  windSentence,
} from "@/lib/forecast/logic";
import { useDesk } from "@/lib/forecast/store";
import { TAPE } from "@/lib/forecast/tape";
import type { ScoredLaunch } from "@/lib/forecast/types";
import { getBrief, getLaunches, getPlace, getSky } from "@/lib/forecast/wire";

const focus = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sun";
const on = `min-h-11 bg-sun px-3 font-display text-lg uppercase text-ink ${focus}`;
const off = `min-h-11 bg-channel px-3 font-display text-lg uppercase text-paper ${focus}`;
const field = `h-11 w-full min-w-0 max-w-full border border-line bg-channel px-2 font-display text-lg uppercase text-paper ${focus}`;
const locateBtn = `inline-flex min-h-11 w-full items-center justify-center gap-2 bg-sun px-3 font-display text-lg uppercase text-ink ${focus}`;

const seen = new Set<string>();

function forecastDays(days: { high: number; low: number; code: number; precip: number }[]) {
  return days
    .slice(0, 2)
    .map((day, index) => {
      const name = index === 0 ? "Today" : "Tomorrow";
      const rain = day.precip >= 20 ? `, with a ${Math.round(day.precip)} percent chance of rain` : "";
      return `${name}, the high is ${Math.round(day.high)} and the low is ${Math.round(day.low)}, and it looks ${skyWords(day.code)}${rain}`;
    })
    .join(". ");
}

function age(at: number, now: number) {
  if (!at || !now) return "";
  const seconds = Math.max(0, Math.round((now - at) / 1000));
  if (seconds < 5) return "just now";
  if (seconds < 60) {
    return seconds === 1 ? "1 second ago" : `${seconds} seconds ago`;
  }
  const minutes = Math.round(seconds / 60);
  if (minutes < 60) return minutes === 1 ? "1 minute ago" : `${minutes} minutes ago`;
  const hours = Math.round(minutes / 60);
  return hours === 1 ? "1 hour ago" : `${hours} hours ago`;
}

function useWire(now: number, mounted: boolean, known: boolean) {
  const location = useDesk((s) => s.location);
  const radiusMi = useDesk((s) => s.radiusMi);
  const feed = useQuery({
    queryKey: ["launches"],
    queryFn: () => getLaunches(),
    placeholderData: TAPE,
    staleTime: 15e3,
    refetchInterval: 6e4,
    refetchIntervalInBackground: true,
    enabled: mounted,
  });
  const sky = useQuery({
    queryKey: ["sky", location.lat.toFixed(2), location.lon.toFixed(2)],
    queryFn: () => getSky({ data: { lat: location.lat, lon: location.lon } }),
    staleTime: 3e4,
    refetchInterval: 12e4,
    refetchIntervalInBackground: true,
    enabled: mounted && known,
  });
  const skyStatus: "ready" | "missing" | "loading" = sky.data
    ? "ready"
    : sky.isError
      ? "missing"
      : "loading";
  const bucket = now > 0 ? Math.floor(now / 15e3) : 0;
  const scored = useMemo(() => {
    const cutoff = bucket > 0 ? bucket * 15e3 - 12e5 : 0;
    return (feed.data?.launches ?? [])
      .filter((launch) => new Date(launch.net).getTime() > cutoff)
      .map((launch) => ({
        ...launch,
        call: known
          ? viewingCall(launch, location.lat, location.lon, radiusMi, sky.data ?? null, skyStatus)
          : {
              ...viewingCall(launch, location.lat, location.lon, radiusMi, null, "loading"),
              miles: 0,
              inRadius: false,
              seeLikely: false,
              id: "pending" as const,
              cloud: null,
              precip: null,
            },
      }))
      .sort((a, b) => new Date(a.net).getTime() - new Date(b.net).getTime());
  }, [feed.data, known, location.lat, location.lon, radiusMi, sky.data, skyStatus, bucket]);
  return {
    feed,
    sky,
    skyStatus,
    scored,
    horizon: scored.filter((launch) => launch.call.inRadius),
    radiusMi,
  };
}

function useDueBulletins(ready: boolean, now: number, scored: ScoredLaunch[], skyLoading: boolean) {
  useEffect(() => {
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
          if (typeof Notification !== "undefined" && Notification.permission === "granted") {
            try {
              new Notification(note.title, { body: note.body });
            } catch {
              /* banner optional */
            }
          }
          document.title = note.title;
          window.setTimeout(() => {
            if (document.title === note.title) document.title = "Sightline";
          }, 2e4);
          sent += 1;
          break;
        }
      }
    }
  }, [ready, now, scored, skyLoading]);
}

function missionFacts(launch: ScoredLaunch) {
  const facts = [
    `${launch.provider} is flying this mission on a ${launch.vehicle}.`,
    `The rocket leaves from ${launch.padName}${launch.location ? ` at ${launch.location}` : ""}.`,
  ];
  if (launch.missionType && launch.missionType !== "Unknown") {
    facts.push(`The published mission type is ${launch.missionType}.`);
  }
  return facts;
}

function MissionFold({ launch }: { launch: ScoredLaunch }) {
  const [open, setOpen] = useState(false);
  const notes = useQuery({
    queryKey: ["brief", launch.id, launch.mission],
    queryFn: () => getBrief({ data: { id: launch.id, mission: launch.mission, provider: launch.provider } }),
    enabled: open,
    staleTime: 10 * 60 * 1000,
  });
  const summary =
    launch.summary && launch.summary !== "Details TBD."
      ? launch.summary
      : `${launch.provider} has not published a description of this mission yet.`;
  return (
    <div className="mt-3 border border-line">
      <button
        type="button"
        className={`flex min-h-11 w-full items-center justify-between gap-3 px-3 text-left font-display text-lg uppercase ${focus}`}
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        About this mission
        <span className="shrink-0 text-sun">{open ? "Hide" : "Show"}</span>
      </button>
      {open ? (
        <div className="grid gap-2 border-t border-line px-3 py-3 text-sm leading-normal">
          <p>{summary}</p>
          {missionFacts(launch).map((fact) => (
            <p key={fact}>{fact}</p>
          ))}
          <h3 className="pt-1 font-display text-base uppercase">Recent headlines</h3>
          {notes.isPending ? <p className="text-muted">Looking up recent headlines.</p> : null}
          {notes.isError ? <p className="text-muted">Recent headlines are unavailable right now.</p> : null}
          {notes.data && notes.data.length === 0 ? (
            <p className="text-muted">No recent headlines turned up for this mission.</p>
          ) : null}
          {notes.data && notes.data.length > 0 ? (
            <ul className="grid gap-2">
              {notes.data.map((note) => (
                <li key={note.href}>
                  <a className="text-sun underline underline-offset-2" href={note.href} target="_blank" rel="noreferrer">
                    {note.title}
                  </a>
                  {note.source ? <span className="text-muted"> {note.source}.</span> : null}
                </li>
              ))}
            </ul>
          ) : null}
          {launch.url ? (
            <p>
              <a className="text-sun underline underline-offset-2" href={launch.url} target="_blank" rel="noreferrer">
                Read the launch record.
              </a>
            </p>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

function Answer({
  now,
  launch,
  known,
}: {
  now: number;
  launch: ScoredLaunch | null;
  known: boolean;
}) {
  if (!launch) {
    return (
      <section className="border-2 border-sun bg-channel px-3 py-3 text-center">
        <p className="font-display text-6xl leading-none uppercase">None</p>
        <p className="mt-2 text-base leading-normal">There are no launches on the live list.</p>
      </section>
    );
  }
  const answer = plainAnswer(launch.call);
  const remain = now > 0 ? new Date(launch.net).getTime() - now : 0;
  return (
    <section className="border-2 border-sun bg-channel px-3 py-3 text-center">
      <p className={`inline-block max-w-full px-2 font-display text-6xl leading-none whitespace-nowrap uppercase sm:text-7xl ${badgeClass(known && launch.call.inRadius ? launch.call.id : "pending")}`}>
        {!known ? "Wait" : launch.call.inRadius ? answer.word : "No"}
      </p>
      <p className="mt-2 text-base leading-normal">
        {!known
          ? "This will not call a launch visible until it has your location and the cloud forecast for liftoff."
          : launch.call.inRadius
            ? answer.command
            : "This launch is too far from you to see. It is not being called visible."}
      </p>
      <h2 className="mt-2 font-display text-3xl leading-none uppercase">{launch.mission}</h2>
      <p className="mt-1 text-sm leading-normal text-muted">
        {launch.vehicle}
        {launch.location ? ` from ${launch.location}` : ""}.
      </p>
      <p className="mt-3 text-sm leading-normal text-muted">Time until liftoff</p>
      <p className="font-display text-5xl leading-none text-sun tabular-nums sm:text-6xl">
        {now > 0 ? countdown(remain) : "——"}
      </p>
      {known ? <p className="mt-2 text-base leading-normal">{placeSentence(launch.call)}</p> : null}
      <p className="text-sm leading-normal text-muted">
        Liftoff is {longWhen(launch.net, now > 0)}. The published status is {launch.status}.
        {launch.call.cloud == null ? "" : ` Cloud cover at liftoff is ${Math.round(launch.call.cloud)}%.`}
        {launch.probability == null ? "" : ` The published chance of launching is ${launch.probability}%.`}
      </p>
      <MissionFold launch={launch} />
    </section>
  );
}

export function LaunchDesk() {
  const [now, setNow] = useState(0);
  const [ready, setReady] = useState(false);
  const [fixing, setFixing] = useState(false);
  const [more, setMore] = useState(false);
  const [reminders, setReminders] = useState(false);
  const [dismissed, setDismissed] = useState<string | null>(null);
  const [permission, setPermission] = useState("missing");
  const location = useDesk((s) => s.location);
  const setLocation = useDesk((s) => s.setLocation);
  const picked = useDesk((s) => s.picked);
  const known = picked && location.source !== "unset";
  const region = known ? regionPoint(location.detail) : null;
  const regionSky = useQuery({
    queryKey: ["sky", "region", region?.name ?? "none"],
    queryFn: () => getSky({ data: { lat: region!.lat, lon: region!.lon } }),
    enabled: ready && !!region,
    staleTime: 3e4,
    refetchInterval: 12e4,
    refetchIntervalInBackground: true,
  });
  const radiusMi = useDesk((s) => s.radiusMi);
  const setRadius = useDesk((s) => s.setRadius);
  const gpsNote = useDesk((s) => s.gpsNote);
  const setGpsNote = useDesk((s) => s.setGpsNote);
  const music = useDesk((s) => s.music);
  const setMusic = useDesk((s) => s.setMusic);
  const tune = useDesk((s) => s.tune);
  const setTune = useDesk((s) => s.setTune);
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
  const hourKey = useRef<string | null>(null);
  useDueBulletins(ready, now, wire.scored, wire.skyStatus === "loading" || !known);
  useEffect(() => {
    const stop = useDesk.persist.onFinishHydration(() => {
      if (!useDesk.getState().picked) {
        useDesk.setState({
          location: {
            id: "unset",
            label: "Your location",
            detail: "Not set yet",
            lat: 0,
            lon: 0,
            source: "unset",
          },
          picked: false,
        });
      }
      setReady(true);
    });
    void useDesk.persist.rehydrate();
    return stop;
  }, []);
  useEffect(() => {
    const tick = () => setNow(Date.now());
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, []);
  useEffect(() => {
    if (typeof Notification !== "undefined") setPermission(Notification.permission);
  }, []);
  useEffect(() => {
    const once = () => unlockAudio();
    window.addEventListener("pointerdown", once, { once: true });
    return () => window.removeEventListener("pointerdown", once);
  }, []);
  useEffect(() => {
    if (!music) {
      stopBed();
      return;
    }
    setBedTune(useDesk.getState().tune);
    startBed(useDesk.getState().volume);
    return () => stopBed();
  }, [music, tune]);
  useEffect(() => {
    setBedVolume(volume);
  }, [volume]);
  useEffect(() => {
    if (!now || !stingers) return;
    const date = new Date(now);
    if (date.getMinutes() !== 8) return;
    const key = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}-${date.getHours()}`;
    if (hourKey.current !== key && hourStinger()) hourKey.current = key;
  }, [now, stingers]);

  const featured = known ? (wire.horizon[0] ?? null) : (wire.scored[0] ?? null);
  const noneNear = known && wire.scored.length > 0 && featured == null;
  const rest = wire.scored.filter((launch) => launch.id !== featured?.id);
  const shown = more ? rest : rest.slice(0, 4);
  const latest = bulletins[0];
  const report = !!(latest && dismissed !== latest.id && now > 0 && now - latest.at < 25e3);
  const upcoming = nextRing(wire.scored, leads, fired, now, clearOnly);
  const sky = wire.sky.data;
  const visMiles = sky ? Math.max(0, Math.round(sky.current.visibilityM / 1609.344)) : 0;
  const localOutlook = sky?.daily?.length ? ` ${forecastDays(sky.daily)}.` : "";
  const regionOutlook = region && regionSky.data?.daily?.length ? ` ${region.kind} forecast for ${region.name}. ${forecastDays(regionSky.data.daily)}.` : "";
  const regionWait =
    region && !regionOutlook
      ? regionSky.isError
        ? ` The ${region.kind.toLowerCase()} forecast for ${region.name} is unavailable.`
        : ` The ${region.kind.toLowerCase()} forecast for ${region.name} is still coming in.`
      : "";
  const crawl = !known
    ? "Standing by for your location. Local and state forecasts stay off this crawl until then."
    : sky
      ? `Local forecast for ${location.label}. Currently ${Math.round(sky.current.tempF)} degrees and ${skyWords(sky.current.code)}. ${windSentence(sky.current.windDeg, sky.current.windMph)} Cloud cover is ${Math.round(sky.current.cloud)} percent. Visibility is ${visMiles} ${visMiles === 1 ? "mile" : "miles"}. ${sky.current.isDay ? "It is daytime." : "It is nighttime."}${localOutlook}${regionOutlook}${regionWait}`
      : wire.skyStatus === "missing"
        ? `The sky forecast for ${location.label} is unavailable right now.`
        : `Standing by for the sky over ${location.label}. Local conditions are still coming in.`;
  const live = wire.feed.data?.source === "live" && !wire.feed.isPlaceholderData;
  const launchWhen = age(wire.feed.data?.updated ? Date.parse(wire.feed.data.updated) : 0, now);
  const skyWhen = sky ? age(wire.sky.dataUpdatedAt, now) : "";
  const fresh = !known
    ? live
      ? `The launch list was updated ${launchWhen || "recently"}. The sky forecast waits for your location.`
      : wire.feed.isPlaceholderData
        ? "The live launch list is still loading. Your location is needed before anything is called visible."
        : "The live launch list is unavailable, so this is the saved list. Your location is still needed."
    : live
      ? wire.feed.isFetching
        ? "The launch list is updating now."
        : `The launch list was updated ${launchWhen || "recently"}${
            skyWhen
              ? `, and the sky was updated ${skyWhen}`
              : wire.skyStatus === "missing"
                ? ", but the sky forecast failed"
                : ", and the sky forecast is still loading"
          }.`
      : wire.feed.isPlaceholderData
        ? "The live launch list is still loading."
        : "The live launch list is unavailable, so this is the saved list.";
  const radii = HORIZONS.includes(radiusMi) ? HORIZONS : [...HORIZONS, radiusMi].sort((a, b) => a - b);

  const asked = useRef(false);
  const locateToken = useRef(0);

  function locate() {
    unlockAudio();
    const token = ++locateToken.current;
    if (!navigator.geolocation) {
      setGpsNote("This browser cannot share your location. Pick a city instead.");
      return;
    }
    setFixing(true);
    setGpsNote("Finding your location.");
    navigator.geolocation.getCurrentPosition(
      (position) => {
        if (token !== locateToken.current) return;
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        void (async () => {
          try {
            const place = await getPlace({ data: { lat, lon } });
            if (token !== locateToken.current) return;
            setLocation({ id: "gps", label: place.label, detail: place.detail, lat, lon, source: "gps" });
            setGpsNote(`Your location is set to ${place.label}.`);
          } catch {
            if (token !== locateToken.current) return;
            setLocation({
              id: "gps",
              label: "Your location",
              detail: `${lat.toFixed(2)}, ${lon.toFixed(2)}`,
              lat,
              lon,
              source: "gps",
            });
            setGpsNote("Your location is set to these coordinates.");
          } finally {
            if (token === locateToken.current) setFixing(false);
          }
        })();
      },
      () => {
        if (token !== locateToken.current) return;
        setFixing(false);
        setGpsNote("Location is blocked. Pick a city instead.");
      },
      { enableHighAccuracy: false, timeout: 12000, maximumAge: 6e4 },
    );
  }

  useEffect(() => {
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

  return (
    <div className="min-h-dvh overflow-x-clip bg-navy pb-16 text-paper">
      <div className="scan-overlay pointer-events-none fixed inset-0 z-30" aria-hidden />
      <div className="mx-auto w-full max-w-xl">
      <header className="border-b-4 border-ice bg-navy text-paper">
        <div className="flex items-stretch justify-between">
          <p className="bg-sun px-3 py-1 font-display text-lg tracking-wide text-ink uppercase">Local forecast</p>
          <p className="bg-ice px-3 py-1 font-display text-lg text-ink tabular-nums">
            <time dateTime={now ? new Date(now).toISOString() : undefined}>{now ? clock(new Date(now)) : "--:--:--"}</time>
          </p>
        </div>
        <div className="flex flex-col items-center px-3 py-3 text-center">
          <svg viewBox="0 0 32 32" className="size-10 shrink-0" aria-hidden>
            <rect width="32" height="32" fill="#041833" />
            <polygon points="3,7 9,7 16,16 9,25 3,25 10,16" fill="#ffd000" />
            <polygon points="23,6 26.5,13 19.5,13" fill="#4fd2ff" />
            <rect x="21.2" y="12.4" width="3.6" height="6.2" fill="#4fd2ff" />
            <polygon points="21.2,18.4 23,23.5 24.8,18.4" fill="#ffd000" />
          </svg>
          <h1 className="mt-1 font-display text-4xl leading-none tracking-wide text-sun uppercase">Sightline</h1>
          <p className="mt-1 max-w-sm text-sm leading-snug">A local forecast for the next rocket launch.</p>
          <p className="mt-2 text-sm leading-normal">{fresh}</p>
          <label className="mt-2 block w-full min-w-0">
            <span className="font-display text-sm tracking-wide text-ice uppercase">Music</span>
            <span className="mt-1 flex items-center gap-2">
              <Radio className="size-5 shrink-0 text-ice" aria-hidden />
              <select
                className={field}
                aria-label="Music"
                value={music ? tune : "off"}
                onChange={(event) => {
                  const id = event.target.value;
                  unlockAudio();
                  if (id === "off") {
                    setMusic(false);
                    return;
                  }
                  setTune(id);
                  setBedTune(id);
                  setMusic(true);
                }}
              >
                <option value="off">Music off</option>
                {BEDS.map((bed) => (
                  <option key={bed.id} value={bed.id}>
                    {bed.label}
                  </option>
                ))}
              </select>
            </span>
          </label>
          {music ? (
            <div className="mt-2 flex w-full items-center gap-2">
              <span className="font-display text-sm text-ice uppercase">Quieter</span>
              <input
                className="h-11 min-w-0 flex-1 accent-ice"
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={volume}
                aria-label="Music volume"
                onChange={(event) => setVolume(Number(event.target.value))}
              />
              <span className="font-display text-sm text-ice uppercase">Louder</span>
            </div>
          ) : null}
        </div>
      </header>
      {report && latest ? (
        <div className="bg-alert text-paper" role="status">
          <div className="mx-auto flex max-w-xl items-start justify-between gap-3 px-3 py-3">
            <div className="min-w-0">
              <p className="font-display text-xl leading-tight uppercase">{latest.title}</p>
              <p className="text-sm leading-normal">{latest.body}</p>
            </div>
            <button type="button" className={`min-h-11 shrink-0 font-display text-lg uppercase ${focus}`} onClick={() => setDismissed(latest.id)}>
              Close
            </button>
          </div>
        </div>
      ) : null}
      <main className="grid w-full min-w-0 gap-3 px-3 py-3">
        {noneNear ? (
          <section className="border-2 border-sun bg-channel px-3 py-3 text-center">
            <p className="inline-block px-2 font-display text-6xl leading-none uppercase">No</p>
            <p className="mt-2 text-base leading-normal">
              No upcoming launch is close enough to see from {location.label}. This forecast is not calling any of them
              visible from where you are.
            </p>
          </section>
        ) : (
          <Answer now={now} launch={featured} known={known} />
        )}
        <div className="grid gap-2">
          <label className="block min-w-0">
            <span className="font-display text-sm tracking-wide text-muted uppercase">Where are you?</span>
            <select
              className={field}
              aria-label="Where are you?"
              value={location.source === "gps" ? "gps" : location.id}
              onChange={(event) => {
                const id = event.target.value;
                if (id === "gps" || id === "unset") return;
                const studio = STUDIOS.find((item) => item.id === id);
                if (!studio) return;
                locateToken.current += 1;
                setFixing(false);
                setLocation({ ...studio, source: "studio" });
              }}
            >
              {location.source === "gps" ? <option value="gps">{location.label}</option> : null}
              {location.source === "unset" ? <option value="unset">Your location</option> : null}
              {STUDIOS.map((studio) => (
                <option key={studio.id} value={studio.id}>
                  {studio.label}
                </option>
              ))}
            </select>
          </label>
          <label className="block min-w-0">
            <span className="font-display text-sm tracking-wide text-muted uppercase">How far will you travel?</span>
            <select
              className={field}
              aria-label="How far will you travel?"
              value={String(radiusMi)}
              onChange={(event) => setRadius(Number(event.target.value))}
            >
              {radii.map((miles) => (
                <option key={miles} value={miles}>
                  {miles.toLocaleString("en-US")} miles
                </option>
              ))}
            </select>
          </label>
          <button type="button" className={locateBtn} onClick={locate} disabled={fixing}>
            <LocateFixed className="size-5 shrink-0" aria-hidden />
            {fixing ? "Finding your location" : "Use my location"}
          </button>
        </div>
        {gpsNote ? <p className="text-sm leading-normal">{gpsNote}</p> : null}
        <section className="border-2 border-sun">
          <h2 className="bg-sun px-3 py-1 font-display text-lg tracking-wide text-ink uppercase">Current conditions</h2>
          <p className="bg-channel px-3 py-3 text-center text-base leading-normal">
          {known && sky
            ? `It is ${Math.round(sky.current.tempF)}° and ${skyWords(sky.current.code)}. ${windSentence(sky.current.windDeg, sky.current.windMph)} Cloud cover is ${Math.round(sky.current.cloud)}%.`
            : !known
              ? "The sky forecast starts after your location is set. Nothing is called visible before that."
              : wire.skyStatus === "missing"
                ? "The sky forecast is unavailable right now, so no launch is being called visible."
                : "The sky forecast is still loading, so no launch is being called visible yet."}
          </p>
        </section>
        <section>
          <h2 className="bg-sun px-3 py-1 font-display text-lg tracking-wide text-ink uppercase">Later launches</h2>
          <ul className="divide-y divide-line border-x border-b border-line">
            {shown.map((launch) => {
              const answer = plainAnswer(launch.call);
              return (
                <li key={launch.id} className="bg-channel px-3 py-2">
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate font-display text-lg uppercase">{launch.mission}</p>
                      <p className="text-sm leading-normal text-muted">
                        {known
                          ? `${shortWhen(launch.net, now > 0)}, ${formatMiles(launch.call.miles)} miles to the ${compassWord(launch.call.compass)}.`
                          : `${shortWhen(launch.net, now > 0)}. Distance is not shown until your location is set.`}
                      </p>
                    </div>
                    <p className={`shrink-0 px-2 font-display text-lg uppercase ${badgeClass(launch.call.id)}`}>
                      {!known ? "Wait" : launch.call.inRadius ? answer.word : "No"}
                    </p>
                  </div>
                  <MissionFold launch={launch} />
                </li>
              );
            })}
            {shown.length === 0 ? <li className="bg-channel px-3 py-3 text-sm">There is nothing else on the list.</li> : null}
          </ul>
          {rest.length > 4 ? (
            <button type="button" className={`mt-1 inline-flex min-h-11 items-center font-display text-lg text-sun uppercase ${focus}`} onClick={() => setMore((value) => !value)}>
              {more ? "Show fewer launches" : `Show all ${rest.length} launches`}
            </button>
          ) : null}
        </section>
        <section className="border border-line">
          <button
            type="button"
            className={`flex min-h-11 w-full items-center justify-between px-3 font-display text-lg uppercase ${focus}`}
            aria-expanded={reminders}
            onClick={() => setReminders((value) => !value)}
          >
            Reminders
            <span className="text-sm normal-case text-sun">
              {upcoming ? `Next is ${aboutWhen(Math.max(0, upcoming.at - now))}` : "None set"}
            </span>
          </button>
          {reminders ? (
            <div className="grid gap-3 border-t border-line p-3">
              <div className="flex flex-wrap gap-2">
                {MARKS.map((minutes) => (
                  <button
                    key={minutes}
                    type="button"
                    aria-pressed={leads.includes(minutes)}
                    className={leads.includes(minutes) ? on : off}
                    onClick={() => toggleLead(minutes)}
                  >
                    {markLabel(minutes)}
                  </button>
                ))}
              </div>
              <div className="flex flex-wrap gap-2">
                <button type="button" className={permission === "granted" ? on : off} onClick={() => void allowAlerts()}>
                  <span className="inline-flex items-center gap-2">
                    <Bell className="size-5" aria-hidden />
                    {permission === "granted" ? "Alerts are on" : "Turn on alerts"}
                  </span>
                </button>
                <button type="button" className={stingers ? on : off} aria-pressed={stingers} onClick={() => setStingers(!stingers)}>
                  {stingers ? "Sound is on" : "Turn sound on"}
                </button>
                <button type="button" className={clearOnly ? on : off} aria-pressed={clearOnly} onClick={() => setClearOnly(!clearOnly)}>
                  {clearOnly ? "Only if you can see it" : "Any launch in range"}
                </button>
              </div>
              <p className="text-sm leading-normal text-muted">
                {upcoming
                  ? `${
                      upcoming.lead === 0
                        ? `Your next reminder is at the liftoff of ${upcoming.launch.mission}.`
                        : `Your next reminder is ${markLabel(upcoming.lead).toLowerCase()} the liftoff of ${upcoming.launch.mission}.`
                    } That is ${aboutWhen(Math.max(0, upcoming.at - now))} from now. Keep this page open so it can fire.`
                  : "Choose a time below. This page has to stay open for a reminder to fire."}
              </p>
              {bulletins[0] ? (
                <p className="text-sm leading-normal">
                  Last reminder: {bulletins[0].title} {bulletins[0].body}
                </p>
              ) : null}
            </div>
          ) : null}
        </section>
        <p className="text-sm leading-normal text-muted">
          Launch times come from The Space Devs when that list answers. Otherwise they come from RocketLaunch.Live. The
          sky comes from Open-Meteo. A yes or a no is based on distance, daylight, and clouds. It is not a plotted
          flight path.
        </p>
      </main>
      </div>
      <footer
        className="fixed inset-x-0 bottom-0 z-20 flex items-stretch border-t-4 border-ice bg-[#041833] text-sun"
        aria-label="Local weather crawl"
      >
        <p className="flex shrink-0 items-center bg-ice px-3 font-display text-sm tracking-wide text-ink uppercase">
          Currently
        </p>
        <div className="min-w-0 flex-1 overflow-hidden">
          <p className="ticker-track py-2 font-display text-lg tracking-wide uppercase">
            <span className="px-4">{crawl}</span>
            <span className="ticker-copy px-4" aria-hidden>
              {crawl}
            </span>
          </p>
        </div>
      </footer>
    </div>
  );
}
