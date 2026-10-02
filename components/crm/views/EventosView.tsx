"use client";

import { useState, type FormEvent } from "react";
import { dayNum, monthShort } from "@/lib/crm/date";
import type { SiteEvent, SiteEventStatus } from "@/lib/crm/types";
import { useCrm } from "../CrmProvider";
import { Modal, PageHead } from "../ui";

const STATUS_LABEL: Record<SiteEventStatus, string> = {
  confirmado: "Confirmado",
  ultimos: "Últimos ingressos",
  esgotado: "Esgotado",
  cancelado: "Cancelado",
};
const STATUSES = Object.keys(STATUS_LABEL) as SiteEventStatus[];

export function EventosView() {
  const { siteEvents, today, removeEvent, toggleEventPublished } = useCrm();
  const [tab, setTab] = useState<"proximos" | "passados">("proximos");
  const [editing, setEditing] = useState<SiteEvent | "new" | null>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);

  const upcoming = siteEvents.filter((e) => e.date >= today).sort((a, b) => a.date.localeCompare(b.date));
  const past = siteEvents.filter((e) => e.date < today).sort((a, b) => b.date.localeCompare(a.date));
  const list = tab === "proximos" ? upcoming : past;

  return (
    <>
      <PageHead title="Eventos" sub="Os eventos que aparecem no site, em “Próximos eventos”. Nada a ver com clientes: é só a agenda pública.">
        <button type="button" className="adm-btn adm-btn--primary" onClick={() => setEditing("new")}>+ Novo evento</button>
      </PageHead>

      <div className="adm-tabs" role="tablist">
        <button role="tab" aria-selected={tab === "proximos"} onClick={() => setTab("proximos")}>Próximos ({upcoming.length})</button>
        <button role="tab" aria-selected={tab === "passados"} onClick={() => setTab("passados")}>Passados ({past.length})</button>
      </div>

      {list.length === 0 ? (
        <div className="adm-empty">
          <strong>{tab === "proximos" ? "Nenhuma data marcada" : "Nenhum evento passado"}</strong>
          {tab === "proximos" && "Enquanto não houver datas, o site mostra o aviso “Novas datas em breve”."}
        </div>
      ) : (
        <ul className="adm-list">
          {list.map((e) => (
            <li key={e.id} className="adm-row crm-event">
              <div className="adm-row__date"><b>{dayNum(e.date)}</b><small>{monthShort(e.date).toUpperCase()}{e.time ? ` · ${e.time}` : ""}</small></div>
              <div>
                <div className="adm-row__title">{e.title}</div>
                <div className="adm-row__meta">{[e.venue, e.city].filter(Boolean).join(" · ")}</div>
                <div className="crm-event__tags">
                  <span className={`tag${e.status === "cancelado" ? " tag--dim" : " tag--red"}`}>{STATUS_LABEL[e.status]}</span>
                  {e.ticketUrl && <span className="tag tag--dim">Com link de ingressos</span>}
                </div>
              </div>
              <div className="adm-actions">
                <label className="crm-switch" title={e.published ? "Aparece no site" : "Escondido do site"}>
                  <input type="checkbox" checked={e.published} onChange={() => toggleEventPublished(e.id)} />
                  <span>{e.published ? "No site" : "Oculto"}</span>
                </label>
                <button type="button" className="adm-btn adm-btn--sm" onClick={() => setEditing(e)}>Editar</button>
                {confirmId === e.id ? (
                  <button type="button" className="adm-btn adm-btn--sm adm-btn--danger" onClick={() => { removeEvent(e.id); setConfirmId(null); }}>Confirmar</button>
                ) : (
                  <button type="button" className="adm-btn adm-btn--sm adm-btn--danger" onClick={() => setConfirmId(e.id)} onBlur={() => setConfirmId(null)}>Excluir</button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}

      {editing && <EventModal event={editing === "new" ? null : editing} onClose={() => setEditing(null)} />}
    </>
  );
}

function EventModal({ event, onClose }: { event: SiteEvent | null; onClose: () => void }) {
  const { saveEvent, today } = useCrm();
  const [error, setError] = useState("");

  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const title = String(f.get("title") ?? "").trim();
    const date = String(f.get("date") ?? "");
    const city = String(f.get("city") ?? "").trim();
    if (!title) return setError("Informe o nome do evento.");
    if (!date) return setError("Informe a data.");
    if (!city) return setError("Informe a cidade.");
    saveEvent(
      {
        title, date, city,
        time: String(f.get("time") ?? ""),
        venue: String(f.get("venue") ?? "").trim(),
        ticketUrl: String(f.get("ticket") ?? "").trim(),
        status: (String(f.get("status")) as SiteEventStatus) || "confirmado",
        published: event ? event.published : true,
      },
      event?.id,
    );
    onClose();
  }

  return (
    <Modal title={event ? "Editar evento" : "Novo evento"} onClose={onClose}>
      <form className="adm-form" onSubmit={submit} noValidate>
        <div className="adm-field full"><label htmlFor="e-title">Nome do evento</label><input id="e-title" name="title" autoFocus placeholder="Ex.: Noite Open Format" defaultValue={event?.title} /></div>
        <div className="adm-field"><label htmlFor="e-date">Data</label><input id="e-date" name="date" type="date" defaultValue={event?.date ?? today} /></div>
        <div className="adm-field"><label htmlFor="e-time">Horário <small>(opcional)</small></label><input id="e-time" name="time" type="time" defaultValue={event?.time ?? ""} /></div>
        <div className="adm-field"><label htmlFor="e-city">Cidade e estado</label><input id="e-city" name="city" placeholder="Ex.: Recife - PE" defaultValue={event?.city} /></div>
        <div className="adm-field"><label htmlFor="e-venue">Local ou casa <small>(opcional)</small></label><input id="e-venue" name="venue" defaultValue={event?.venue} /></div>
        <div className="adm-field"><label htmlFor="e-status">Situação</label>
          <select id="e-status" name="status" defaultValue={event?.status ?? "confirmado"}>{STATUSES.map((s) => <option key={s} value={s}>{STATUS_LABEL[s]}</option>)}</select>
        </div>
        <div className="adm-field"><label htmlFor="e-ticket">Link de ingressos <small>(opcional)</small></label><input id="e-ticket" name="ticket" type="url" placeholder="https://" defaultValue={event?.ticketUrl} /></div>
        {error && <p className="adm-msg adm-msg--err full">{error}</p>}
        <div className="adm-form__foot full">
          <button type="button" className="adm-btn" onClick={onClose}>Cancelar</button>
          <button type="submit" className="adm-btn adm-btn--primary">{event ? "Salvar" : "Publicar no site"}</button>
        </div>
      </form>
    </Modal>
  );
}
