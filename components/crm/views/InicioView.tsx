"use client";

import Link from "next/link";
import { useState } from "react";
import { whatsappLink } from "@/lib/format";
import { brl, dayNum, monthShort, monthKey, relativeDay } from "@/lib/crm/date";
import { useCrm } from "../CrmProvider";
import { DealModal, NewDealModal } from "../DealModal";
import { CWhats } from "../icons";
import { PageHead, Stat } from "../ui";

export function InicioView() {
  const { deals, payments, tasks, today, contactOf, dealOf, toggleTask } = useCrm();
  const [openId, setOpenId] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);

  const newLeads = deals.filter((d) => d.stage === "novo");
  const upcoming = deals
    .filter((d) => d.stage === "reservada" && d.eventDate >= today)
    .sort((a, b) => a.eventDate.localeCompare(b.eventDate));
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
        <button type="button" className="adm-btn adm-btn--primary" onClick={() => setCreating(true)}>+ Novo negócio</button>
        <Link href="/crm/negocios" className="adm-btn">Ver funil</Link>
      </PageHead>

      <div className="adm-stats">
        <Stat label="Leads novos" value={String(newLeads.length)} sub="aguardando resposta" hot={newLeads.length > 0} />
        <Stat label="Próximo evento" value={next ? `${dayNum(next.eventDate)} ${monthShort(next.eventDate)}` : "—"} sub={next ? `${next.eventType}, ${next.city}` : "Nenhuma data reservada"} />
        <Stat label="A receber" value={brl(toReceive)} sub={late.length ? `${late.length} atrasado${late.length > 1 ? "s" : ""}` : "tudo em dia"} hot={late.length > 0} />
        <Stat label="Recebido no mês" value={brl(receivedMonth)} sub="pagamentos confirmados" />
      </div>

      <div className="adm-grid-2">
        <section className="adm-card">
          <h2>Próximos eventos</h2>
          {upcoming.length ? (
            <ul className="adm-list crm-flush">
              {upcoming.slice(0, 5).map((d) => (
                <li key={d.id} className="adm-row crm-click" onClick={() => setOpenId(d.id)}>
                  <div className="adm-row__date"><b>{dayNum(d.eventDate)}</b><small>{monthShort(d.eventDate).toUpperCase()}</small></div>
                  <div>
                    <div className="adm-row__title">{contactOf(d.contactId)?.name}</div>
                    <div className="adm-row__meta">{d.eventType} · {d.venue}</div>
                  </div>
                  <span className={`tag${d.isPublic ? " tag--red" : ""}`}>{d.isPublic ? "Público" : "Particular"}</span>
                </li>
              ))}
            </ul>
          ) : (
            <div className="adm-empty"><strong>Nenhuma data reservada</strong>Quando um cliente pagar o sinal, a data aparece aqui.</div>
          )}
        </section>

        <section className="adm-card">
          <h2>Leads novos</h2>
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
            <div className="adm-empty"><strong>Nenhum lead novo</strong>Quando alguém preencher o formulário do site, aparece aqui.</div>
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
