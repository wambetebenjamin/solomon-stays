import type { HotelSettings, Room } from "@/lib/types";

/**
 * Vercel KV access with a deterministic in memory fallback.
 * The dashboard is fully usable without KV configured (demo mode),
 * and persists edits to KV when KV_REST_API_URL and KV_REST_API_TOKEN exist.
 */

const hasKv = () => Boolean(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN);

type KvClient = {
  get: <T = unknown>(key: string) => Promise<T | null>;
  set: (key: string, value: unknown) => Promise<unknown>;
};

const memory = new Map<string, unknown>();

async function client(): Promise<KvClient | null> {
  if (!hasKv()) return null;
  try {
    const mod = await import("@vercel/kv");
    return mod.kv as unknown as KvClient;
  } catch {
    return null;
  }
}

export async function kvGet<T>(key: string, fallback: T): Promise<T> {
  const store = await client();
  if (!store) {
    return (memory.get(key) as T | undefined) ?? fallback;
  }
  try {
    const value = await store.get<T>(key);
    return value ?? fallback;
  } catch {
    return fallback;
  }
}

export async function kvSet(key: string, value: unknown): Promise<void> {
  memory.set(key, value);
  const store = await client();
  if (!store) return;
  try {
    await store.set(key, value);
  } catch {
    // KV is optional in demo mode, the in memory copy remains authoritative.
  }
}

export const KV_KEYS = {
  settings: "solomon_stays:settings",
  rooms: "solomon_stays:rooms",
  roomStatus: (id: string) => `solomon_stays:room:${id}`,
  schedules: "solomon_stays:report-schedules",
  contacts: "solomon_stays:contact-log",
};

export async function loadSettings(fallback: HotelSettings): Promise<HotelSettings> {
  return kvGet<HotelSettings>(KV_KEYS.settings, fallback);
}

export async function saveSettings(settings: HotelSettings): Promise<HotelSettings> {
  await kvSet(KV_KEYS.settings, settings);
  return settings;
}

export async function loadRooms(fallback: Room[]): Promise<Room[]> {
  return kvGet<Room[]>(KV_KEYS.rooms, fallback);
}

export async function saveRooms(rooms: Room[]): Promise<Room[]> {
  await kvSet(KV_KEYS.rooms, rooms);
  return rooms;
}
