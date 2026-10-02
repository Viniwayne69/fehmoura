"use server";

import { createPublicClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";

export type ContactState = { ok: boolean; error?: string; fields?: Record<string, string> };

const clean = (v: FormDataEntryValue | null, max = 500) => String(v ?? "").trim().slice(0, max);

export async function sendContact(_prev: ContactState, form: FormData): Promise<ContactState> {
  // campo invisível: robôs preenchem, pessoas não
  if (clean(form.get("website"))) return { ok: true };

  const data = {
    name: clean(form.get("name"), 120),
    email: clean(form.get("email"), 160),
    phone: clean(form.get("phone"), 40) || null,
    event_type: clean(form.get("event_type"), 80) || null,
    event_date: clean(form.get("event_date"), 10) || null,
    city: clean(form.get("city"), 120) || null,
    message: clean(form.get("message"), 3000) || null,
  };

  const fields = Object.fromEntries(Object.entries(data).map(([k, v]) => [k, v ?? ""]));
  if (data.name.length < 2) return { ok: false, error: "Conta pra gente o seu nome.", fields };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) return { ok: false, error: "Esse e-mail parece incompleto.", fields };
  if (data.event_date && !/^\d{4}-\d{2}-\d{2}$/.test(data.event_date)) data.event_date = null;

  if (isSupabaseConfigured) {
    const { error } = await createPublicClient().from("leads").insert(data);
    if (error) {
      console.error("[contato] erro ao salvar pedido", error);
      return { ok: false, error: "Não conseguimos enviar agora. Tente de novo ou chame no WhatsApp.", fields };
    }
  } else {
    console.info("[contato] modo demonstração, pedido recebido:", data);
  }

  await notifyByEmail(data).catch((e) => console.error("[contato] erro ao enviar e-mail", e));
  return { ok: true };
}

async function notifyByEmail(d: Record<string, string | null>) {
  const key = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  if (!key || !to) return;
  const rows = [
    ["Nome", d.name], ["E-mail", d.email], ["Telefone", d.phone], ["Tipo de evento", d.event_type],
    ["Data", d.event_date], ["Cidade", d.city], ["Mensagem", d.message],
  ].filter(([, v]) => v);
  const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]!);
  await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: "Site DJ Feh Moura <onboarding@resend.dev>",
      to: [to],
      reply_to: d.email,
      subject: `Novo pedido de contratação: ${d.name}`,
      html: `<h2>Novo pedido pelo site</h2><table>${rows.map(([k, v]) => `<tr><td><b>${k}</b></td><td>${esc(v!)}</td></tr>`).join("")}</table>`,
    }),
  });
}
