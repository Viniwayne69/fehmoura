"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { whatsappLink } from "@/lib/format";
import { brl, dayNum, monthShort, monthKey, relativeDay } from "@/lib/crm/date";
import { useCrm } from "../CrmProvider";
import { DealModal, NewDealModal } from "../DealModal";
import { CWhats } from "../icons";
import { PageHead, Stat } from "../ui";

type Upcoming = {
  key: string; date: string; title: string; meta: string; city: string; kind: "cliente" | "site"; dealId: string | null;
};

export function InicioView() {
  const router = useRouter();
  const { deals, payments, tasks, siteEvents, today, contactOf, dealOf, toggleTask } = useCrm();
  const [openId, setOpenId] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);

  const newLeads = deals.filter((d) => d.stage === "novo");
  const upcoming: Upcoming[] = [
    ...deals
      .filter((d) => d.stage === "reservada" && d.eventDate >= today)
      .map((d): Upcoming => ({
        key: d.id, date: d.eventDate, title: contactOf(d.contactId)?.name ?? "", meta: `${d.eventType} · ${d.venue}`,
        city: d.city, kind: "cliente", dealId: d.id,
      })),
    ...siteEvents
      .filter((e) => e.published && e.status !== "cancelado" && e.date >= today)
      .map((e): Upcoming => ({
        key: e.id, date: e.date, title: e.title, meta: [e.venue, e.city].filter(Boolean).join(" · "),
        city: e.city, kind: "site", dealId: null,
      })),
  ].sort((a, b) => a.date.localeCompare(b.date));
  const next = upcoming[0];
  const unpaid = payments.filter((p) => !p.paidAt);
  const toReceive = unpaid.reduce((s, p) => s + p.amount, 0);
  const late = unpaid.filter((p) => p.due < today);
  const receivedMonth = payments
    .filter((p) => p.paidAt && monthKey(p.paidAt) === monthKey(today))
    .reduce((s, p) => s + p.amount, 0);
  const dueTasks = tasks.filter((t) => !t.done && t.due <= today).sort((a, b) => a.due.localeCompare(b.due));
  const soonPays = [...unpaid].sort((a, b) => a.due.localeCompare(b.due)).slice(0, 4);

  return (
    <>
      <PageHead title="Olá, Feh" sub="Seus pedidos, eventos e recebimentos em um só lugar.">
        <button type="button" className="adm-btn adm-btn--primary" onClick={() => setCreating(true)}>+ Novo cliente</button>
        <Link href="/crm/clientes" className="adm-btn">Ver funil</Link>
      </PageHead>

      <div className="adm-stats">
        <Stat label="Clientes novos" value={String(newLeads.length)} sub="aguardando resposta" hot={newLeads.length > 0} />
        <Stat label="Próximo evento" value={next ? `${dayNum(next.date)} ${monthShort(next.date)}` : "—"} sub={next ? `${next.title}, ${next.city}` : "Nenhuma data marcada"} />
        <Stat label="A receber" value={brl(toReceive)} sub={late.length ? `${late.length} atrasado${late.length > 1 ? "s" : ""}` : "tudo em dia"} hot={late.length > 0} />
        <Stat label="Recebido no mês" value={brl(receivedMonth)} sub="pagamentos confirmados" />
      </div>

      <div className="adm-grid-2">
        <section className="adm-card">
          <h2>Próximos eventos</h2>
          {upcoming.length ? (
            <ul className="adm-list crm-flush">
              {upcoming.slice(0, 5).map((u) => (
                <li
                  key={u.key}
                  className="adm-row crm-click"
                  onClick={() => (u.dealId ? setOpenId(u.dealId) : router.push("/crm/eventos"))}
                >
                  <div className="adm-row__date"><b>{dayNum(u.date)}</b><small>{monthShort(u.date).toUpperCase()}</small></div>
                  <div>
                    <div className="adm-row__title">{u.title}</div>
                    <div className="adm-row__meta">{u.meta}</div>
                  </div>
                  <span className={`tag${u.kind === "site" ? " tag--red" : ""}`}>{u.kind === "site" ? "No site" : "Cliente"}</span>
                </li>
              ))}
            </ul>
          ) : (
            <div className="adm-empty"><strong>Nenhuma data marcada</strong>Eventos do site e datas reservadas por clientes aparecem aqui.</div>
          )}
        </section>

        <section className="adm-card">
          <h2>Clientes novos</h2>
          {newLeads.length ? (
            <ul className="adm-list crm-flush">
              {newLeads.map((d) => {
                const c = contactOf(d.contactId);
                const wa = whatsappLink(c?.phone, `Oi ${c?.name.split(" ")[0]}! Aqui é a Feh Moura. Vi seu pedido pelo site. Vamos conversar sobre o seu evento?`);
                return (
                  <li key={d.id} className="adm-row crm-click" style={{ gridTemplateColumns: "1fr auto" }} onClick={() => setOpenId(d.id)}>
                    <div>
                      <div className="adm-row__title">{c?.name}</div>
                      <div className="adm-row__meta">{d.eventType} · {relativeDay(d.eventDate, today)} · {d.city}</div>
                    </div>
                    {wa && (
                      <a href={wa} target="_blank" rel="noopener noreferrer" className="adm-btn adm-btn--wa adm-btn--sm" onClick={(e) => e.stopPropagation()} aria-label={`Responder ${c?.name} no WhatsApp`}>
                        <CWhats />
                      </a>
                    )}
                  </li>
                );
              })}
            </ul>
          ) : (
            <div className="adm-empty"><strong>Nenhum cliente novo</strong>Quando alguém preencher o formulário do site, aparece aqui.</div>
          )}
        </section>

        <section className="adm-card">
          <h2>Tarefas de hoje e atrasadas</h2>
          {dueTasks.length ? (
            <ul className="crm-tasks">
              {dueTasks.map((t) => (
                <li key={t.id}>
                  <label className="adm-check">
                    <input type="checkbox" checked={t.done} onChange={() => toggleTask(t.id)} />
                    <span>{t.title}</span>
                  </label>
                  <small className={t.due < today ? "is-late" : ""}>{relativeDay(t.due, today)}</small>
                </li>
              ))}
            </ul>
          ) : (
            <div className="adm-empty"><strong>Tudo em dia</strong>Nenhuma tarefa para hoje.</div>
          )}
        </section>

        <section className="adm-card">
          <h2>Próximos recebimentos</h2>
          {soonPays.length ? (
            <ul className="crm-tasks">
              {soonPays.map((p) => {
                const deal = dealOf(p.dealId);
                const isLate = p.due < today;
                return (
                  <li key={p.id}>
                    <div>
                      <span>{contactOf(deal?.contactId ?? "")?.name} · {p.kind}</span>
                      <small className={isLate ? "is-late" : ""} style={{ display: "block" }}>
                        {isLate ? "Atrasado, venceu " : "Vence "}{relativeDay(p.due, today).toLowerCase()}
                      </small>
                    </div>
                    <strong style={{ fontWeight: 400 }}>{brl(p.amount)}</strong>
                  </li>
                );
              })}
            </ul>
          ) : (
            <div className="adm-empty"><strong>Nada a receber</strong>Todos os pagamentos estão quitados.</div>
          )}
        </section>
      </div>

      {openId && <DealModal dealId={openId} onClose={() => setOpenId(null)} />}
      {creating && <NewDealModal onClose={() => setCreating(false)} />}
    </>
  );
}
