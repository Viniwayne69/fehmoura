"use client";

import { useState } from "react";
import { brl, fmtShort } from "@/lib/crm/date";
import { useCrm } from "../CrmProvider";
import { DealModal } from "../DealModal";
import { CDownload } from "../icons";
import { PageHead, Stat } from "../ui";

export function FinanceiroView() {
  const { deals, payments, paymentsOf, paidOf, contactOf, today } = useCrm();
  const [openId, setOpenId] = useState<string | null>(null);

  const rows = deals
    .filter((d) => d.stage === "reservada" || d.stage === "realizado")
    .map((d) => {
      const pays = paymentsOf(d.id);
      const total = pays.length ? pays.reduce((s, p) => s + p.amount, 0) : d.value;
      const paid = paidOf(d.id);
      const late = pays.some((p) => !p.paidAt && p.due < today);
      const status = total > 0 && paid >= total ? "Quitado" : late ? "Atrasado" : paid > 0 ? "Em dia" : "A receber";
      return { d, total, paid, left: total - paid, status, name: contactOf(d.contactId)?.name ?? "" };
    })
    .sort((a, b) => b.d.eventDate.localeCompare(a.d.eventDate));

  const agreed = rows.reduce((s, r) => s + r.total, 0);
  const received = rows.reduce((s, r) => s + r.paid, 0);
  const lateSum = payments.filter((p) => !p.paidAt && p.due < today).reduce((s, p) => s + p.amount, 0);

  function exportCsv() {
    const head = ["Cliente", "Tipo de evento", "Data", "Combinado", "Recebido", "Falta receber", "Situação"];
    const lines = rows.map((r) =>
      [r.name, r.d.eventType, r.d.eventDate.split("-").reverse().join("/"), r.total, r.paid, r.left, r.status]
        .map((v) => `"${String(v).replace(/"/g, '""')}"`)
        .join(";"),
    );
    const blob = new Blob(["﻿" + [head.join(";"), ...lines].join("\r\n")], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "financeiro-feh-moura.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <>
      <PageHead title="Financeiro" sub="Quanto foi combinado, quanto entrou e quanto falta, evento por evento.">
        <button type="button" className="adm-btn" onClick={exportCsv}><CDownload /> Exportar planilha</button>
      </PageHead>

      <div className="adm-stats">
        <Stat label="Combinado" value={brl(agreed)} sub={`${rows.length} eventos`} />
        <Stat label="Recebido" value={brl(received)} sub="pagamentos confirmados" />
        <Stat label="A receber" value={brl(agreed - received)} sub="sinais e restantes" />
        <Stat label="Atrasado" value={brl(lateSum)} sub={lateSum > 0 ? "cobrar o quanto antes" : "nada atrasado"} hot={lateSum > 0} />
      </div>

      <ul className="adm-list">
        {rows.map((r) => {
          const pct = r.total > 0 ? Math.round((r.paid / r.total) * 100) : 0;
          return (
            <li key={r.d.id} className="adm-row crm-click crm-row-fin" onClick={() => setOpenId(r.d.id)}>
              <div>
                <div className="adm-row__title">{r.name}</div>
                <div className="adm-row__meta">{r.d.eventType} · {fmtShort(r.d.eventDate)}</div>
              </div>
              <div className="crm-fin__bar" role="img" aria-label={`${pct}% recebido`}>
                <i style={{ width: `${pct}%` }} />
              </div>
              <div className="crm-fin__nums">
                <b>{brl(r.paid)} <small>de {brl(r.total)}</small></b>
                <small>{r.left > 0 ? `faltam ${brl(r.left)}` : "tudo recebido"}</small>
              </div>
              <span className={`tag${r.status === "Atrasado" ? " tag--red" : r.status === "Quitado" ? " tag--green" : ""}`}>{r.status}</span>
            </li>
          );
        })}
      </ul>

      {openId && <DealModal dealId={openId} onClose={() => setOpenId(null)} />}
    </>
  );
}
