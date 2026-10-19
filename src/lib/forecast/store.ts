import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Bulletin, Channel, VanLocation } from "./types";

type DeskState = {
  channel: Channel;
  location: VanLocation;
  radiusMi: number;
  leads: number[];
  clearOnly: boolean;
  music: boolean;
  tune: string;
  volume: number;
  stingers: boolean;
  bulletins: Bulletin[];
  fired: string[];
  gpsNote: string | null;
  picked: boolean;
  setChannel: (channel: Channel) => void;
  setLocation: (location: VanLocation) => void;
  setRadius: (radiusMi: number) => void;
  toggleLead: (minutes: number) => void;
  addLead: (minutes: number) => void;
  removeLead: (minutes: number) => void;
  setClearOnly: (clearOnly: boolean) => void;
  setMusic: (music: boolean) => void;
  setTune: (tune: string) => void;
  setVolume: (volume: number) => void;
  setStingers: (stingers: boolean) => void;
  setGpsNote: (gpsNote: string | null) => void;
  pushBulletin: (bulletin: { title: string; body: string }) => void;
  markFired: (key: string) => void;
};

const starter: VanLocation = {
  id: "unset",
  label: "Your location",
  detail: "Not set yet",
  lat: 0,
  lon: 0,
  source: "unset",
};

export const useDesk = create<DeskState>()(
  persist(
    (set) => ({
      channel: "local",
      location: starter,
      radiusMi: 500,
      leads: [60, 15, 0],
      clearOnly: true,
      music: false,
      tune: "local",
      volume: 0.45,
      stingers: true,
      bulletins: [],
      fired: [],
      gpsNote: null,
      picked: false,
      setChannel: (channel) => set({ channel }),
      setLocation: (location) => set({ location, picked: true, gpsNote: null }),
      setRadius: (radiusMi) => set({ radiusMi }),
      toggleLead: (minutes) =>
        set((state) => ({
          leads: state.leads.includes(minutes)
            ? state.leads.filter((lead) => lead !== minutes)
            : [...state.leads, minutes].sort((a, b) => b - a),
        })),
      addLead: (minutes) =>
        set((state) => {
          const next = Math.round(minutes);
          if (!Number.isFinite(next) || next < 1 || next > 2880 || state.leads.includes(next)) {
            return state;
          }
          return { leads: [...state.leads, next].sort((a, b) => b - a) };
        }),
      removeLead: (minutes) =>
        set((state) => ({ leads: state.leads.filter((lead) => lead !== minutes) })),
      setClearOnly: (clearOnly) => set({ clearOnly }),
      setMusic: (music) => set({ music }),
      setTune: (tune) => set({ tune }),
      setVolume: (volume) => set({ volume: Math.min(1, Math.max(0, volume)) }),
      setStingers: (stingers) => set({ stingers }),
      setGpsNote: (gpsNote) => set({ gpsNote }),
      pushBulletin: (bulletin) =>
        set((state) => ({
          bulletins: [
            { ...bulletin, id: crypto.randomUUID(), at: Date.now() },
            ...state.bulletins,
          ].slice(0, 8),
        })),
      markFired: (key) =>
        set((state) => ({
          fired: state.fired.includes(key) ? state.fired : [...state.fired, key].slice(-200),
        })),
    }),
    {
      name: "sightline",
      skipHydration: true,
      partialize: (state) => ({
        channel: state.channel,
        location: state.location,
        radiusMi: state.radiusMi,
        leads: state.leads,
        clearOnly: state.clearOnly,
        tune: state.tune,
        volume: state.volume,
        stingers: state.stingers,
        bulletins: state.bulletins,
        fired: state.fired,
        picked: state.picked,
      }),
    },
  ),
);
