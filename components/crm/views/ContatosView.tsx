"use client";

import { useState } from "react";
import { whatsappLink } from "@/lib/format";
import { brl, fmtShort } from "@/lib/crm/date";
import { useCrm } from "../CrmProvider";
import { DealModal } from "../DealModal";
import { CWhats } from "../icons";
import { Modal, PageHead, StageTag } from "../ui";

export function ContatosView() {
  const { contacts, deals, paidOf } = useCrm();
  const [query, setQuery] = useState("");
  const [contactId, setContactId] = useState<string | null>(null);
  const [dealId, setDealId] = useState<string | null>(null);

  const q = query.trim().toLowerCase();
  const list = contacts.filter((c) => !q || [c.name, c.city, c.email].some((v) => v.toLowerCase().includes(q)));
  const dealsOf = (id: string) => deals.filter((d) => d.contactId === id);
  const spentOf = (id: string) => dealsOf(id).reduce((s, d) => s + paidOf(d.id), 0);
  const selected = contacts.find((c) => c.id === contactId);

  return (
    <>
      <PageHead title="Contatos" sub={`${contacts.length} pessoas e empresas, com o histórico de cada uma.`} />

      <div className="crm-toolbar">
        <div className="adm-field crm-search">
          <input type="search" placeholder="Buscar por nome, cidade ou e-mail" value={query} onChange={(e) => setQuery(e.target.value)} aria-label="Buscar contatos" />
        </div>
      </div>

      <ul className="adm-list">
        {list.map((c) => {
          const n = dealsOf(c.id).length;
          const spent = spentOf(c.id);
          return (
            <li key={c.id} className="adm-row crm-click crm-row-contact" onClick={() => setContactId(c.id)}>
              <div>
                <div className="adm-row__title">{c.name}</div>
                <div className="adm-row__meta">{c.city} · {c.origin}</div>
              </div>
              <div className="crm-row-contact__nums">
                <b>{n} {n === 1 ? "pedido" : "pedidos"}</b>
                <small>{spent > 0 ? `${brl(spent)} recebidos` : "sem pagamentos"}</small>
              </div>
            </li>
          );
        })}
        {list.length === 0 && <li className="adm-empty" style={{ border: 0 }}><strong>Nenhum contato encontrado</strong>Tente outra busca.</li>}
      </ul>

      {selected && !dealId && (
        <Modal title={selected.name} onClose={() => setContactId(null)}>
          <dl className="crm-dl">
            <div><dt>WhatsApp</dt><dd>{selected.phone.replace(/^55(\d{2})(\d{5})(\d{4})$/, "($1) $2-$3")}</dd></div>
            <div><dt>E-mail</dt><dd>{selected.email}</dd></div>
            <div><dt>Cidade</dt><dd>{selected.city}</dd></div>
            <div><dt>Origem</dt><dd>{selected.origin}</dd></div>
          </dl>
          {whatsappLink(selected.phone, `Oi ${selected.name.split(" ")[0]}! Tudo bem?`) && (
            <a href={whatsappLink(selected.phone, `Oi ${selected.name.split(" ")[0]}! Tudo bem?`) ?? "#"} target="_blank" rel="noopener noreferrer" className="adm-btn adm-btn--wa adm-btn--sm" style={{ marginBottom: 8 }}>
              <CWhats /> Chamar no WhatsApp
            </a>
          )}
          <h3 className="crm-h3">Histórico de pedidos</h3>
          <ul className="adm-list crm-flush">
            {dealsOf(selected.id).map((d) => (
              <li key={d.id} className="adm-row crm-click" style={{ gridTemplateColumns: "1fr auto" }} onClick={() => setDealId(d.id)}>
                <div>
                  <div className="adm-row__title">{d.eventType}</div>
                  <div className="adm-row__meta">{fmtShort(d.eventDate)} · {d.city}{d.value > 0 ? ` · ${brl(d.value)}` : ""}</div>
                </div>
                <StageTag stage={d.stage} />
              </li>
            ))}
          </ul>
        </Modal>
      )}
      {dealId && <DealModal dealId={dealId} onClose={() => setDealId(null)} />}
    </>
  );
}
