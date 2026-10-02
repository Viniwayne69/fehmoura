"use client";

import { useState, type FormEvent } from "react";
import { whatsappLink } from "@/lib/format";
import { brl, fmtLong, fmtShort } from "@/lib/crm/date";
import { EVENT_TYPES_CRM, LOST_REASONS, STAGES } from "@/lib/crm/stages";
import type { Deal, StageId } from "@/lib/crm/types";
import { useCrm } from "./CrmProvider";
import { CWhats } from "./icons";
import { Modal, StageTag } from "./ui";

function whatsText(deal: Deal, name: string): string {
  const first = name.split(" ")[0];
  const when = fmtShort(deal.eventDate);
  switch (deal.stage) {
    case "novo":
      return `Oi ${first}! Aqui é a Feh Moura. Vi seu pedido pelo site para ${deal.eventType.toLowerCase()} no dia ${when}. Vamos conversar sobre o seu evento?`;
    case "conversa":
      return `Oi ${first}! Passando para alinhar os detalhes do seu ${deal.eventType.toLowerCase()} no dia ${when}. Posso te mandar a proposta?`;
    case "orcamento":
      return `Oi ${first}! Conseguiu ver o orçamento para o dia ${when}? Qualquer dúvida é só me chamar.`;
    case "reservada":
      return `Oi ${first}! Sua data de ${when} está reservada. Vamos combinar o repertório?`;
    case "realizado":
      return `Oi ${first}! Obrigada por ter me escolhido para o seu evento. Foi incrível!`;
    default:
      return `Oi ${first}! Tudo bem?`;
  }
}

export function DealModal({ dealId, onClose }: { dealId: string; onClose: () => void }) {
  const { dealOf, contactOf, paymentsOf, paidOf, moveDeal, setPublic, setLostReason, togglePaid, today } = useCrm();
  const deal = dealOf(dealId);
  const contact = deal ? contactOf(deal.contactId) : undefined;
  if (!deal || !contact) return null;

  const pays = paymentsOf(deal.id);
  const paid = paidOf(deal.id);
  const total = pays.length ? pays.reduce((s, p) => s + p.amount, 0) : deal.value;
  const wa = whatsappLink(contact.phone, whatsText(deal, contact.name));

  return (
    <Modal title={contact.name} onClose={onClose} wide>
      <div className="crm-modal__tags">
        <StageTag stage={deal.stage} />
        <span className={`tag${deal.isPublic ? " tag--red" : ""}`}>{deal.isPublic ? "Público no site" : "Evento particular"}</span>
      </div>

      <div className="crm-detail">
        <section>
          <h3>Evento</h3>
          <dl>
            <div><dt>Tipo</dt><dd>{deal.eventType}</dd></div>
            <div><dt>Data</dt><dd>{fmtLong(deal.eventDate)}</dd></div>
            <div><dt>Horário</dt><dd>{deal.startTime}, por {deal.hours}h</dd></div>
            <div><dt>Local</dt><dd>{deal.venue}</dd></div>
            <div><dt>Cidade</dt><dd>{deal.city}</dd></div>
            <div><dt>Convidados</dt><dd>{deal.guests ?? "Não informado"}</dd></div>
          </dl>
        </section>
        <section>
          <h3>Contato</h3>
          <dl>
            <div><dt>WhatsApp</dt><dd>{contact.phone.replace(/^55(\d{2})(\d{5})(\d{4})$/, "($1) $2-$3")}</dd></div>
            <div><dt>E-mail</dt><dd>{contact.email}</dd></div>
            <div><dt>Cidade</dt><dd>{contact.city}</dd></div>
            <div><dt>Origem</dt><dd>{deal.origin}</dd></div>
          </dl>
          {wa && (
            <a href={wa} target="_blank" rel="noopener noreferrer" className="adm-btn adm-btn--wa adm-btn--sm" style={{ marginTop: 14 }}>
              <CWhats /> Responder no WhatsApp
            </a>
          )}
        </section>
      </div>

      {deal.message && (
        <>
          <h3 className="crm-h3">Mensagem do cliente</h3>
          <p className="lead-card__msg">{deal.message}</p>
        </>
      )}

      <h3 className="crm-h3">Dinheiro</h3>
      {total > 0 ? (
        <>
          <div className="crm-money">
            <div><span>Combinado</span><strong>{brl(total)}</strong></div>
            <div><span>Recebido</span><strong>{brl(paid)}</strong></div>
            <div><span>Falta receber</span><strong className={total - paid > 0 ? "is-due" : ""}>{brl(total - paid)}</strong></div>
          </div>
          <ul className="crm-pays">
            {pays.map((p) => {
              const late = !p.paidAt && p.due < today;
              return (
                <li key={p.id}>
                  <div>
                    <b>{p.kind}</b>
                    <small>{brl(p.amount)} · vence {fmtShort(p.due)}{late ? " · atrasado" : ""}</small>
                  </div>
                  <button type="button" className={`adm-btn adm-btn--sm${p.paidAt ? "" : late ? " adm-btn--danger" : ""}`} onClick={() => togglePaid(p.id)}>
                    {p.paidAt ? `Pago em ${fmtShort(p.paidAt)}` : "Marcar como pago"}
                  </button>
                </li>
              );
            })}
          </ul>
        </>
      ) : (
        <p className="crm-muted">Ainda sem valor combinado. Quando o orçamento for enviado, ele aparece aqui.</p>
      )}

      <h3 className="crm-h3">Etapa e opções</h3>
      <div className="adm-form">
        <div className="adm-field">
          <label htmlFor="deal-stage">Etapa do funil</label>
          <select id="deal-stage" value={deal.stage} onChange={(e) => moveDeal(deal.id, e.target.value as StageId)}>
            {STAGES.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
          </select>
        </div>
        {deal.stage === "perdido" && (
          <div className="adm-field">
            <label htmlFor="deal-lost">Motivo da perda</label>
            <select id="deal-lost" value={deal.lostReason ?? ""} onChange={(e) => setLostReason(deal.id, e.target.value)}>
              {LOST_REASONS.map((r) => <option key={r}>{r}</option>)}
            </select>
          </div>
        )}
        <label className="adm-check full">
          <input type="checkbox" checked={deal.isPublic} onChange={(e) => setPublic(deal.id, e.target.checked)} />
          Mostrar na agenda pública do site
        </label>
      </div>

      <h3 className="crm-h3">Histórico</h3>
      <ol className="crm-timeline">
        {[...deal.history].reverse().map((h, i) => (
          <li key={i}><time>{fmtShort(h.at)}</time><span>{h.text}</span></li>
        ))}
      </ol>
    </Modal>
  );
}

export function NewDealModal({ onClose }: { onClose: () => void }) {
  const { addDeal, today } = useCrm();
  const [error, setError] = useState("");

  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const name = String(f.get("name") ?? "").trim();
    if (name.length < 2) { setError("Informe o nome do cliente."); return; }
    addDeal({
      name,
      phone: String(f.get("phone") ?? "").replace(/\D/g, "") || "",
      email: String(f.get("email") ?? "").trim(),
      eventType: String(f.get("type") ?? EVENT_TYPES_CRM[0]),
      eventDate: String(f.get("date") ?? "") || today,
      city: String(f.get("city") ?? "").trim() || "A definir",
    });
    onClose();
  }

  return (
    <Modal title="Novo negócio" onClose={onClose}>
      <form className="adm-form" onSubmit={submit} noValidate>
        <div className="adm-field full"><label htmlFor="n-name">Nome do cliente</label><input id="n-name" name="name" autoFocus /></div>
        <div className="adm-field"><label htmlFor="n-phone">WhatsApp</label><input id="n-phone" name="phone" type="tel" placeholder="5581999990000" /></div>
        <div className="adm-field"><label htmlFor="n-email">E-mail</label><input id="n-email" name="email" type="email" /></div>
        <div className="adm-field">
          <label htmlFor="n-type">Tipo de evento</label>
          <select id="n-type" name="type">{EVENT_TYPES_CRM.map((t) => <option key={t}>{t}</option>)}</select>
        </div>
        <div className="adm-field"><label htmlFor="n-date">Data do evento</label><input id="n-date" name="date" type="date" defaultValue={today} /></div>
        <div className="adm-field full"><label htmlFor="n-city">Cidade</label><input id="n-city" name="city" /></div>
        {error && <p className="adm-msg adm-msg--err full">{error}</p>}
        <div className="adm-form__foot full">
          <button type="button" className="adm-btn" onClick={onClose}>Cancelar</button>
          <button type="submit" className="adm-btn adm-btn--primary">Criar negócio</button>
        </div>
      </form>
    </Modal>
  );
}
