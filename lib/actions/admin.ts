"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isAdminEmail, isSupabaseConfigured } from "@/lib/supabase/env";
import { localInputToIso } from "@/lib/format";
import type { EventStatus, LeadStatus, PhotoCategory } from "@/lib/types";

export type ActionResult = { ok: boolean; error?: string; message?: string };

const str = (f: FormData, k: string, max = 500) => String(f.get(k) ?? "").trim().slice(0, max);
const orNull = (v: string) => (v ? v : null);

async function requireAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || !isAdminEmail(user.email)) redirect("/admin/login");
  return supabase;
}

function refreshSite() {
  revalidatePath("/", "layout");
}

/* ------------------------------ Login ------------------------------ */
export async function signIn(_prev: ActionResult, form: FormData): Promise<ActionResult> {
  if (!isSupabaseConfigured) return { ok: false, error: "O banco de dados ainda não foi configurado. Veja o passo a passo no LEIA-ME." };
  const email = str(form, "email", 160);
  const password = String(form.get("password") ?? "");
  if (!isAdminEmail(email)) return { ok: false, error: "E-mail ou senha incorretos." };
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { ok: false, error: "E-mail ou senha incorretos." };
  redirect("/admin");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}

export async function requestPasswordReset(_prev: ActionResult, form: FormData): Promise<ActionResult> {
  if (!isSupabaseConfigured) return { ok: false, error: "O banco de dados ainda não foi configurado." };
  const email = str(form, "email", 160);
  if (!email) return { ok: false, error: "Digite o seu e-mail." };
  const h = await headers();
  const origin = h.get("origin") ?? `https://${h.get("host")}`;
  const supabase = await createClient();
  await supabase.auth.resetPasswordForEmail(email, { redirectTo: `${origin}/admin/auth/callback?next=/admin/configuracoes%23senha` });
  return { ok: true, message: "Se esse e-mail tiver acesso, enviamos um link para criar uma nova senha." };
}

export async function changePassword(_prev: ActionResult, form: FormData): Promise<ActionResult> {
  const supabase = await requireAdmin();
  const password = String(form.get("password") ?? "");
  const confirm = String(form.get("confirm") ?? "");
  if (password.length < 8) return { ok: false, error: "A senha precisa ter pelo menos 8 caracteres." };
  if (password !== confirm) return { ok: false, error: "As senhas não são iguais." };
  const { error } = await supabase.auth.updateUser({ password });
  if (error) return { ok: false, error: "Não foi possível trocar a senha. Tente de novo." };
  return { ok: true, message: "Senha atualizada." };
}

/* ------------------------------ Agenda ------------------------------ */
const EVENT_STATUSES: EventStatus[] = ["confirmado", "ultimos", "esgotado", "cancelado"];

export async function saveEvent(_prev: ActionResult, form: FormData): Promise<ActionResult> {
  const supabase = await requireAdmin();
  const id = str(form, "id", 60);
  const when = str(form, "starts_at", 20);
  const title = str(form, "title", 140);
  const city = str(form, "city", 120);
  const status = str(form, "status", 20) as EventStatus;
  const ticket = str(form, "ticket_url", 500);

  if (!when) return { ok: false, error: "Informe a data e o horário." };
  if (!title) return { ok: false, error: "Informe o nome do evento." };
  if (!city) return { ok: false, error: "Informe a cidade." };
  if (ticket && !/^https?:\/\//i.test(ticket)) return { ok: false, error: "O link de ingressos precisa começar com https://" };

  const row = {
    starts_at: localInputToIso(when),
    title,
    city,
    venue: orNull(str(form, "venue", 140)),
    ticket_url: orNull(ticket),
    status: EVENT_STATUSES.includes(status) ? status : "confirmado",
    published: form.get("published") === "on",
  };

  const { error } = id
    ? await supabase.from("events").update(row).eq("id", id)
    : await supabase.from("events").insert(row);
  if (error) return { ok: false, error: "Não foi possível salvar. Tente de novo." };

  refreshSite();
  return { ok: true, message: id ? "Evento atualizado." : "Evento criado e publicado." };
}

export async function deleteEvent(id: string): Promise<ActionResult> {
  const supabase = await requireAdmin();
  const { error } = await supabase.from("events").delete().eq("id", id);
  if (error) return { ok: false, error: "Não foi possível excluir." };
  refreshSite();
  return { ok: true };
}

/* ------------------------------ Galeria ------------------------------ */
export async function registerPhoto(input: { path: string; url: string; width: number; height: number; category: PhotoCategory }): Promise<ActionResult> {
  const supabase = await requireAdmin();
  const { data: last } = await supabase.from("photos").select("position").order("position", { ascending: false }).limit(1).maybeSingle();
  const { error } = await supabase.from("photos").insert({
    path: input.path,
    url: input.url,
    width: input.width,
    height: input.height,
    category: input.category,
    alt: "Registro da DJ Feh Moura na pista",
    position: (last?.position ?? -1) + 1,
  });
  if (error) return { ok: false, error: "A foto foi enviada, mas não conseguimos registrá-la." };
  refreshSite();
  return { ok: true };
}

export async function updatePhoto(id: string, patch: { alt?: string; category?: PhotoCategory; featured?: boolean }): Promise<ActionResult> {
  const supabase = await requireAdmin();
  if (patch.featured) {
    const { count } = await supabase.from("photos").select("id", { count: "exact", head: true }).eq("featured", true).neq("id", id);
    if ((count ?? 0) >= 3) return { ok: false, error: "A home mostra no máximo 3 fotos em destaque. Tire o destaque de outra antes." };
  }
  const { error } = await supabase.from("photos").update(patch).eq("id", id);
  if (error) return { ok: false, error: "Não foi possível salvar." };
  refreshSite();
  return { ok: true };
}

export async function reorderPhotos(ids: string[]): Promise<ActionResult> {
  const supabase = await requireAdmin();
  const results = await Promise.all(ids.map((id, position) => supabase.from("photos").update({ position }).eq("id", id)));
  if (results.some((r) => r.error)) return { ok: false, error: "Não foi possível salvar a nova ordem." };
  refreshSite();
  return { ok: true };
}

export async function deletePhoto(id: string): Promise<ActionResult> {
  const supabase = await requireAdmin();
  const { data } = await supabase.from("photos").select("path").eq("id", id).maybeSingle();
  if (data?.path) await supabase.storage.from("galeria").remove([data.path]);
  const { error } = await supabase.from("photos").delete().eq("id", id);
  if (error) return { ok: false, error: "Não foi possível excluir." };
  refreshSite();
  return { ok: true };
}

/* ------------------------------ Pedidos ------------------------------ */
const LEAD_STATUSES: LeadStatus[] = ["novo", "conversa", "fechado", "recusado"];

export async function setLeadStatus(id: string, status: LeadStatus): Promise<ActionResult> {
  const supabase = await requireAdmin();
  if (!LEAD_STATUSES.includes(status)) return { ok: false, error: "Status inválido." };
  const { error } = await supabase.from("leads").update({ status }).eq("id", id);
  if (error) return { ok: false, error: "Não foi possível atualizar." };
  revalidatePath("/admin", "layout");
  return { ok: true };
}

export async function deleteLead(id: string): Promise<ActionResult> {
  const supabase = await requireAdmin();
  const { error } = await supabase.from("leads").delete().eq("id", id);
  if (error) return { ok: false, error: "Não foi possível excluir." };
  revalidatePath("/admin", "layout");
  return { ok: true };
}

/* --------------------------- Configurações --------------------------- */
export async function saveSettings(_prev: ActionResult, form: FormData): Promise<ActionResult> {
  const supabase = await requireAdmin();
  const urls = ["instagram", "spotify", "youtube", "soundcloud", "presskit_url"] as const;
  const row: Record<string, string | null> = {};
  for (const k of urls) {
    const v = str(form, k, 500);
    if (v && !/^https?:\/\//i.test(v)) return { ok: false, error: "Os links precisam começar com https://" };
    row[k] = orNull(v);
  }
  const email = str(form, "email", 160);
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { ok: false, error: "O e-mail parece incompleto." };
  row.email = orNull(email);
  row.whatsapp = orNull(str(form, "whatsapp", 30).replace(/\D/g, ""));
  row.bio = orNull(str(form, "bio", 4000));

  const { error } = await supabase.from("settings").update({ ...row, updated_at: new Date().toISOString() }).eq("id", 1);
  if (error) return { ok: false, error: "Não foi possível salvar." };
  refreshSite();
  return { ok: true, message: "Alterações salvas e publicadas no site." };
}
