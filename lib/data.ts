import "server-only";
import { cache } from "react";
import { createPublicClient } from "./supabase/server";
import { isSupabaseConfigured } from "./supabase/env";
import { demoEvents, demoPhotos, demoSettings } from "./demo";
import type { DjEvent, Photo, Settings } from "./types";

const nowIso = () => new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(); // evento some 6h depois de começar

export const getSettings = cache(async (): Promise<Settings> => {
  if (!isSupabaseConfigured) return demoSettings;
  const { data } = await createPublicClient().from("settings").select("*").eq("id", 1).maybeSingle();
  return { ...demoSettings, email: null, ...(data ?? {}) } as Settings;
});

export async function getUpcomingEvents(limit?: number): Promise<DjEvent[]> {
  if (!isSupabaseConfigured) {
    const list = demoEvents.filter((e) => e.starts_at >= nowIso()).sort((a, b) => a.starts_at.localeCompare(b.starts_at));
    return limit ? list.slice(0, limit) : list;
  }
  let q = createPublicClient()
    .from("events").select("*")
    .eq("published", true).neq("status", "cancelado")
    .gte("starts_at", nowIso())
    .order("starts_at", { ascending: true });
  if (limit) q = q.limit(limit);
  const { data } = await q;
  return (data ?? []) as DjEvent[];
}

export async function getPastEvents(limit = 30): Promise<DjEvent[]> {
  if (!isSupabaseConfigured) {
    return demoEvents.filter((e) => e.starts_at < nowIso()).sort((a, b) => b.starts_at.localeCompare(a.starts_at));
  }
  const { data } = await createPublicClient()
    .from("events").select("*")
    .eq("published", true).neq("status", "cancelado")
    .lt("starts_at", nowIso())
    .order("starts_at", { ascending: false })
    .limit(limit);
  return (data ?? []) as DjEvent[];
}

export async function getPhotos(opts: { featured?: boolean } = {}): Promise<Photo[]> {
  if (!isSupabaseConfigured) {
    return opts.featured ? demoPhotos.filter((p) => p.featured).slice(0, 3) : demoPhotos;
  }
  let q = createPublicClient().from("photos").select("*").order("position", { ascending: true });
  if (opts.featured) q = q.eq("featured", true).limit(3);
  const { data } = await q;
  const list = (data ?? []) as Photo[];
  // sem destaques escolhidos ainda: usa as três primeiras
  if (opts.featured && list.length === 0) {
    const { data: first } = await createPublicClient().from("photos").select("*").order("position").limit(3);
    return (first ?? []) as Photo[];
  }
  return list;
}
