"use client";

import { useState, type DragEvent } from "react";
import { brl, fmtShort } from "@/lib/crm/date";
import { STAGES } from "@/lib/crm/stages";
import type { Deal, StageId } from "@/lib/crm/types";
import { useCrm } from "../CrmProvider";
import { DealModal, NewDealModal } from "../DealModal";
import { CLeft, CRight } from "../icons";
import { PageHead, StageTag } from "../ui";

export function ClientesView() {
  const { deals, contactOf, moveDeal, today } = useCrm();
  const [mode, setMode] = useState<"quadro" | "lista">("quadro");
  const [query, setQuery] = useState("");
  const [openId, setOpenId] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [dragging, setDragging] = useState<string | null>(null);
  const [over, setOver] = useState<StageId | null>(null);

  const q = query.trim().toLowerCase();
  const filtered = deals.filter((d) => {
    if (!q) return true;
    const c = contactOf(d.contactId);
    return [c?.name, d.eventType, d.city, d.venue].some((v) => v?.toLowerCase().includes(q));
  });

  const stageIndex = (s: StageId) => STAGES.findIndex((x) => x.id === s);
  const shift = (d: Deal, delta: number) => {
    const next = STAGES[stageIndex(d.stage) + delta];
    if (next) moveDeal(d.id, next.id);
  };

  function onDrop(e: DragEvent<HTMLElement>, stage: StageId) {
    e.preventDefault();
    const id = e.dataTransfer.getData("text/plain") || dragging;
    if (id) moveDeal(id, stage);
    setDragging(null);
    setOver(null);
  }

  return (
    <>
      <PageHead title="Clientes" sub="Arraste os cartões entre as etapas ou use as setas.">
        <button type="button" className="adm-btn adm-btn--primary" onClick={() => setCreating(true)}>+ Novo cliente</button>
      </PageHead>

      <div className="crm-toolbar">
        <div className="adm-tabs" role="tablist" style={{ marginBottom: 0, borderBottom: 0 }}>
          <button type="button" role="tab" aria-selected={mode === "quadro"} onClick={() => setMode("quadro")}>Quadro</button>
          <button type="button" role="tab" aria-selected={mode === "lista"} onClick={() => setMode("lista")}>Lista</button>
        </div>
        <div className="adm-field crm-search">
          <input type="search" placeholder="Buscar cliente, cidade ou tipo" value={query} onChange={(e) => setQuery(e.target.value)} aria-label="Buscar clientes" />
        </div>
      </div>

      {mode === "quadro" ? (
        <div className="crm-board" role="list">
          {STAGES.map((s) => {
            const list = filtered.filter((d) => d.stage === s.id);
            const sum = list.reduce((acc, d) => acc + d.value, 0);
            return (
              <section
                key={s.id}
                role="listitem"
                className={`crm-col${over === s.id ? " is-over" : ""}`}
                onDragOver={(e) => { e.preventDefault(); setOver(s.id); }}
                onDragLeave={() => setOver((o) => (o === s.id ? null : o))}
                onDrop={(e) => onDrop(e, s.id)}
              >
                <header title={s.hint}>
                  <h2>{s.label}</h2>
                  <span>{list.length}</span>
                </header>
                {sum > 0 && <small className="crm-col__sum">{brl(sum)}</small>}
                <div className="crm-col__list">
                  {list.map((d) => {
                    const c = contactOf(d.contactId);
                    return (
                      <article
                        key={d.id}
                        className={`crm-card${dragging === d.id ? " is-dragging" : ""}`}
                        draggable
                        onDragStart={(e) => { e.dataTransfer.setData("text/plain", d.id); e.dataTransfer.effectAllowed = "move"; setDragging(d.id); }}
                        onDragEnd={() => { setDragging(null); setOver(null); }}
                        onClick={() => setOpenId(d.id)}
                      >
                        <b>{c?.name}</b>
                        <span>{d.eventType}</span>
                        <small>{fmtShort(d.eventDate)} · {d.city}</small>
                        <div className="crm-card__foot">
                          <em>{d.value > 0 ? brl(d.value) : "A orçar"}</em>
                          <div className="crm-card__arrows" onClick={(e) => e.stopPropagation()}>
                            <button type="button" aria-label="Etapa anterior" disabled={stageIndex(d.stage) === 0} onClick={() => shift(d, -1)}><CLeft /></button>
                            <button type="button" aria-label="Próxima etapa" disabled={stageIndex(d.stage) === STAGES.length - 1} onClick={() => shift(d, 1)}><CRight /></button>
                          </div>
                        </div>
                        {d.stage === "reservada" && d.eventDate < today && <small className="is-late">Data passou</small>}
                      </article>
                    );
                  })}
                  {list.length === 0 && <p className="crm-col__empty">Nenhum cliente</p>}
                </div>
              </section>
            );
          })}
        </div>
      ) : (
        <ul className="adm-list">
          {[...filtered].sort((a, b) => a.eventDate.localeCompare(b.eventDate)).map((d) => (
            <li key={d.id} className="adm-row crm-click crm-row-deal" onClick={() => setOpenId(d.id)}>
              <div>
                <div className="adm-row__title">{contactOf(d.contactId)?.name}</div>
                <div className="adm-row__meta">{d.eventType} · {fmtShort(d.eventDate)} · {d.city}</div>
              </div>
              <span className="crm-row-deal__value">{d.value > 0 ? brl(d.value) : "A orçar"}</span>
              <StageTag stage={d.stage} />
            </li>
          ))}
        </ul>
      )}

      {openId && <DealModal dealId={openId} onClose={() => setOpenId(null)} />}
      {creating && <NewDealModal onClose={() => setCreating(false)} />}
    </>
  );
}
