"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { deleteLead, setLeadStatus } from "@/lib/actions/admin";
import { LEAD_STATUS_LABEL } from "@/lib/constants";
import { longDate, shortDate, whatsappLink } from "@/lib/format";
import type { Lead, LeadStatus } from "@/lib/types";
import { Mail, Whatsapp } from "../icons";

const STATUSES = Object.keys(LEAD_STATUS_LABEL) as LeadStatus[];

export function LeadCard({ lead }: { lead: Lead }) {
  const router = useRouter();
  const [status, setStatus] = useState(lead.status);
  const [pending, startTransition] = useTransition();
  const firstName = lead.name.split(" ")[0];
  const wa = whatsappLink(
    lead.phone && lead.phone.replace(/\D/g, "").length <= 11 ? `55${lead.phone}` : lead.phone,
    `Oi, ${firstName}! Aqui é a Feh Moura, recebi o seu pedido pelo site.`,
  );

  function change(next: LeadStatus) {
    setStatus(next);
    startTransition(async () => {
      await setLeadStatus(lead.id, next);
      router.refresh();
    });
  }

  function remove() {
    if (!window.confirm(`Excluir o pedido de ${lead.name}?`)) return;
    startTransition(async () => {
      await deleteLead(lead.id);
      router.refresh();
    });
  }

  const facts = [
    ["Evento", lead.event_type],
    ["Data", lead.event_date ? shortDate(`${lead.event_date}T12:00:00Z`) : null],
    ["Cidade", lead.city],
    ["Telefone", lead.phone],
    ["E-mail", lead.email],
  ].filter(([, v]) => v);

  return (
    <article className="lead-card" style={{ opacity: pending ? 0.6 : 1 }}>
      <div className="lead-card__head">
        <div>
          <div className="lead-card__name">{lead.name}</div>
          <div className="lead-card__when">Recebido em {longDate(lead.created_at)}</div>
        </div>
        <select value={status} onChange={(e) => change(e.target.value as LeadStatus)} aria-label="Status do pedido">
          {STATUSES.map((s) => <option key={s} value={s}>{LEAD_STATUS_LABEL[s]}</option>)}
        </select>
      </div>
      <div className="lead-card__facts">
        {facts.map(([k, v]) => <span key={k}>{k}: <b>{v}</b></span>)}
      </div>
      {lead.message && <p className="lead-card__msg">{lead.message}</p>}
      <div className="lead-card__foot">
        <div className="adm-actions">
          {wa && <a className="adm-btn adm-btn--sm adm-btn--wa" href={wa} target="_blank" rel="noopener noreferrer"><Whatsapp /> Responder no WhatsApp</a>}
          <a className="adm-btn adm-btn--sm" href={`mailto:${lead.email}?subject=${encodeURIComponent("DJ Feh Moura | Seu pedido de contratação")}`}><Mail /> Responder por e-mail</a>
        </div>
        <button className="adm-btn adm-btn--sm adm-btn--danger" onClick={remove}>Excluir</button>
      </div>
    </article>
  );
}
