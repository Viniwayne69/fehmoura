"use client";

import { useRouter } from "next/navigation";
import { useActionState, useEffect, useState, useTransition } from "react";
import { deleteEvent, saveEvent, type ActionResult } from "@/lib/actions/admin";
import { EVENT_STATUS_LABEL } from "@/lib/constants";
import { dayMonth, isoToLocalInput } from "@/lib/format";
import type { DjEvent, EventStatus } from "@/lib/types";

const STATUSES = Object.keys(EVENT_STATUS_LABEL) as EventStatus[];

export function EventManager({ events, openNew }: { events: DjEvent[]; openNew: boolean }) {
  const router = useRouter();
  const [tab, setTab] = useState<"proximos" | "passados">("proximos");
  const [editing, setEditing] = useState<DjEvent | "new" | null>(openNew ? "new" : null);
  const [flash, setFlash] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const cutoff = new Date(Date.now() - 6 * 3600 * 1000).toISOString();
  const upcoming = events.filter((e) => e.starts_at >= cutoff);
  const past = events.filter((e) => e.starts_at < cutoff).reverse();
  const list = tab === "proximos" ? upcoming : past;

  function remove(e: DjEvent) {
    if (!window.confirm(`Excluir "${e.title}" de ${dayMonth(e.starts_at).day}/${dayMonth(e.starts_at).month}? Essa ação não pode ser desfeita.`)) return;
    startTransition(async () => {
      const r = await deleteEvent(e.id);
      setFlash(r.ok ? "Evento excluído." : r.error ?? "Erro ao excluir.");
      router.refresh();
    });
  }

  return (
    <>
      <div className="adm-head">
        <div>
          <span className="eyebrow">Agenda</span>
          <h1>Eventos</h1>
          <p>O que estiver marcado como visível aparece no site automaticamente.</p>
        </div>
        <button className="adm-btn adm-btn--primary" onClick={() => setEditing("new")}>+ Novo evento</button>
      </div>

      {flash && <p className="adm-msg adm-msg--ok" style={{ marginBottom: 16 }}>{flash}</p>}

      <div className="adm-tabs" role="tablist">
        <button role="tab" aria-selected={tab === "proximos"} onClick={() => setTab("proximos")}>Próximos ({upcoming.length})</button>
        <button role="tab" aria-selected={tab === "passados"} onClick={() => setTab("passados")}>Passados ({past.length})</button>
      </div>

      {list.length === 0 ? (
        <div className="adm-empty">
          <strong>{tab === "proximos" ? "Nenhuma data marcada" : "Nenhum evento passado"}</strong>
          {tab === "proximos" && "Enquanto não houver datas, o site mostra o aviso \"Novas datas em breve\"."}
        </div>
      ) : (
        <ul className="adm-list" style={{ opacity: pending ? 0.6 : 1 }}>
          {list.map((e) => {
            const d = dayMonth(e.starts_at);
            return (
              <li key={e.id} className="adm-row">
                <div className="adm-row__date"><b>{d.day}</b><small>{d.month} · {d.time}</small></div>
                <div>
                  <div className="adm-row__title">{e.title}</div>
                  <div className="adm-row__meta">{[e.city, e.venue].filter(Boolean).join(" · ")}</div>
                  <div style={{ display: "flex", gap: 6, marginTop: 8, flexWrap: "wrap" }}>
                    <span className={`tag${e.status === "cancelado" ? " tag--dim" : " tag--red"}`}>{EVENT_STATUS_LABEL[e.status]}</span>
                    {!e.published && <span className="tag tag--dim">Oculto do site</span>}
                  </div>
                </div>
                <div className="adm-actions">
                  <button className="adm-btn adm-btn--sm" onClick={() => setEditing(e)}>Editar</button>
                  <button className="adm-btn adm-btn--sm adm-btn--danger" onClick={() => remove(e)}>Excluir</button>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      {editing && (
        <EventModal
          event={editing === "new" ? null : editing}
          onClose={() => setEditing(null)}
          onSaved={(msg) => { setEditing(null); setFlash(msg); router.refresh(); }}
        />
      )}
    </>
  );
}

function EventModal({ event, onClose, onSaved }: { event: DjEvent | null; onClose: () => void; onSaved: (msg: string) => void }) {
  const [state, action, pending] = useActionState<ActionResult, FormData>(saveEvent, { ok: false });

  useEffect(() => {
    if (state.ok) onSaved(state.message ?? "Salvo.");
  }, [state, onSaved]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="adm-modal-bg" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="adm-modal" role="dialog" aria-modal="true" aria-labelledby="ev-title">
        <h2 id="ev-title">{event ? "Editar evento" : "Novo evento"}</h2>
        <form action={action} className="adm-form">
          {event && <input type="hidden" name="id" value={event.id} />}
          <div className="adm-field">
            <label htmlFor="ev-when">Data e horário</label>
            <input id="ev-when" name="starts_at" type="datetime-local" required defaultValue={event ? isoToLocalInput(event.starts_at) : ""} />
          </div>
          <div className="adm-field">
            <label htmlFor="ev-status">Status</label>
            <select id="ev-status" name="status" defaultValue={event?.status ?? "confirmado"}>
              {STATUSES.map((s) => <option key={s} value={s}>{EVENT_STATUS_LABEL[s]}</option>)}
            </select>
          </div>
          <div className="adm-field full">
            <label htmlFor="ev-name">Nome do evento</label>
            <input id="ev-name" name="title" required placeholder="Ex.: Techno Night" defaultValue={event?.title} />
          </div>
          <div className="adm-field">
            <label htmlFor="ev-city">Cidade e estado</label>
            <input id="ev-city" name="city" required placeholder="Ex.: São Paulo - SP" defaultValue={event?.city} />
          </div>
          <div className="adm-field">
            <label htmlFor="ev-venue">Local ou casa <small>(opcional)</small></label>
            <input id="ev-venue" name="venue" placeholder="Ex.: Club Noir" defaultValue={event?.venue ?? ""} />
          </div>
          <div className="adm-field full">
            <label htmlFor="ev-ticket">Link de ingressos <small>(opcional)</small></label>
            <input id="ev-ticket" name="ticket_url" type="url" placeholder="https://" defaultValue={event?.ticket_url ?? ""} />
          </div>
          <label className="adm-check full">
            <input type="checkbox" name="published" defaultChecked={event ? event.published : true} />
            Mostrar no site
          </label>
          {state.error && <p className="adm-msg adm-msg--err full">{state.error}</p>}
          <div className="adm-form__foot full">
            <button type="button" className="adm-btn" onClick={onClose}>Cancelar</button>
            <button type="submit" className="adm-btn adm-btn--primary" disabled={pending}>{pending ? "Salvando" : "Salvar evento"}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
