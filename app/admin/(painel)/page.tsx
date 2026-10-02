import Link from "next/link";
import { EVENT_STATUS_LABEL, LEAD_STATUS_LABEL } from "@/lib/constants";
import { dayMonth, longDate, shortDate } from "@/lib/format";
import { createClient } from "@/lib/supabase/server";
import type { DjEvent, Lead } from "@/lib/types";

export const metadata = { title: "Início" };

export default async function PainelHome() {
  const supabase = await createClient();
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
  const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 1).toISOString();

  const [next, monthCount, newLeads, photos, recentLeads, upcoming] = await Promise.all([
    supabase.from("events").select("*").gte("starts_at", now.toISOString()).neq("status", "cancelado").order("starts_at").limit(1).maybeSingle(),
    supabase.from("events").select("id", { count: "exact", head: true }).gte("starts_at", monthStart).lt("starts_at", monthEnd),
    supabase.from("leads").select("id", { count: "exact", head: true }).eq("status", "novo"),
    supabase.from("photos").select("id", { count: "exact", head: true }),
    supabase.from("leads").select("*").order("created_at", { ascending: false }).limit(5),
    supabase.from("events").select("*").gte("starts_at", now.toISOString()).order("starts_at").limit(5),
  ]);

  const nextEvent = next.data as DjEvent | null;
  const leads = (recentLeads.data ?? []) as Lead[];
  const events = (upcoming.data ?? []) as DjEvent[];

  return (
    <>
      <div className="adm-head">
        <div>
          <span className="eyebrow">Painel</span>
          <h1>Olá, Feh</h1>
          <p>Tudo o que aparece no site começa aqui.</p>
        </div>
        <div className="adm-actions">
          <Link href="/admin/agenda?novo=1" className="adm-btn adm-btn--primary">+ Novo evento</Link>
          <Link href="/admin/pedidos" className="adm-btn">Ver pedidos</Link>
        </div>
      </div>

      <div className="adm-stats">
        <Link href="/admin/agenda" className="adm-stat">
          <span>Próximo evento</span>
          <strong>{nextEvent ? `${dayMonth(nextEvent.starts_at).day} ${dayMonth(nextEvent.starts_at).month}` : "—"}</strong>
          <small>{nextEvent ? `${nextEvent.title}, ${nextEvent.city}` : "Nenhum evento marcado"}</small>
        </Link>
        <Link href="/admin/agenda" className="adm-stat">
          <span>Eventos no mês</span>
          <strong>{monthCount.count ?? 0}</strong>
          <small>{now.toLocaleDateString("pt-BR", { month: "long", year: "numeric" })}</small>
        </Link>
        <Link href="/admin/pedidos?status=novo" className={`adm-stat${(newLeads.count ?? 0) > 0 ? " adm-stat--hot" : ""}`}>
          <span>Pedidos novos</span>
          <strong>{newLeads.count ?? 0}</strong>
          <small>aguardando resposta</small>
        </Link>
        <Link href="/admin/galeria" className="adm-stat">
          <span>Fotos na galeria</span>
          <strong>{photos.count ?? 0}</strong>
          <small>publicadas no site</small>
        </Link>
      </div>

      <div className="adm-grid-2">
        <section className="adm-card">
          <h2>Próximas datas</h2>
          {events.length ? (
            <ul className="adm-list" style={{ border: 0 }}>
              {events.map((e) => (
                <li key={e.id} className="adm-row" style={{ padding: "12px 0" }}>
                  <div className="adm-row__date"><b>{dayMonth(e.starts_at).day}</b><small>{dayMonth(e.starts_at).month}</small></div>
                  <div><div className="adm-row__title">{e.title}</div><div className="adm-row__meta">{e.city}</div></div>
                  <span className={`tag${e.status === "cancelado" ? " tag--dim" : " tag--red"}`}>{EVENT_STATUS_LABEL[e.status]}</span>
                </li>
              ))}
            </ul>
          ) : (
            <div className="adm-empty"><strong>Agenda vazia</strong>Cadastre a próxima data e ela aparece no site na hora.</div>
          )}
        </section>

        <section className="adm-card">
          <h2>Últimos pedidos</h2>
          {leads.length ? (
            <ul className="adm-list" style={{ border: 0 }}>
              {leads.map((l) => (
                <li key={l.id} className="adm-row" style={{ gridTemplateColumns: "1fr auto", padding: "12px 0" }}>
                  <div>
                    <div className="adm-row__title">{l.name}</div>
                    <div className="adm-row__meta">
                      {[l.event_type, l.event_date && shortDate(`${l.event_date}T12:00:00Z`), l.city].filter(Boolean).join(" · ") || longDate(l.created_at)}
                    </div>
                  </div>
                  <span className={`tag${l.status === "novo" ? " tag--red" : l.status === "fechado" ? " tag--green" : ""}`}>{LEAD_STATUS_LABEL[l.status]}</span>
                </li>
              ))}
            </ul>
          ) : (
            <div className="adm-empty"><strong>Nenhum pedido ainda</strong>Quando alguém preencher o formulário do site, aparece aqui.</div>
          )}
        </section>
      </div>
    </>
  );
}
