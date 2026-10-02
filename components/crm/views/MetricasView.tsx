"use client";

import { demoPastMonths } from "@/lib/crm/demo";
import { brl, monthKey, monthLabelShort, parts } from "@/lib/crm/date";
import { STAGES } from "@/lib/crm/stages";
import { useCrm } from "../CrmProvider";
import { PageHead, Stat } from "../ui";

type Datum = { label: string; value: number; display: string; hot?: boolean };

function BarsV({ title, sub, data }: { title: string; sub: string; data: Datum[] }) {
  const max = Math.max(...data.map((d) => d.value), 1);
  return (
    <figure className="adm-card crm-chart">
      <figcaption><h2>{title}</h2><small>{sub}</small></figcaption>
      <div className="crm-vbars" role="img" aria-label={`${title}: ${data.map((d) => `${d.label} ${d.display}`).join(", ")}`}>
        {data.map((d) => (
          <div key={d.label} className="crm-vbar" title={`${d.label}: ${d.display}`}>
            <span className="crm-vbar__val">{d.display}</span>
            <div className="crm-vbar__track"><i className={d.hot ? "is-hot" : ""} style={{ height: `${Math.max(2, (d.value / max) * 100)}%` }} /></div>
            <span className="crm-vbar__label">{d.label}</span>
          </div>
        ))}
      </div>
    </figure>
  );
}

function BarsH({ title, sub, data, empty }: { title: string; sub: string; data: Datum[]; empty?: string }) {
  const max = Math.max(...data.map((d) => d.value), 1);
  return (
    <figure className="adm-card crm-chart">
      <figcaption><h2>{title}</h2><small>{sub}</small></figcaption>
      {data.length ? (
        <ul className="crm-hbars" aria-label={title}>
          {data.map((d) => (
            <li key={d.label} title={`${d.label}: ${d.display}`}>
              <span className="crm-hbar__label">{d.label}</span>
              <div className="crm-hbar__track"><i style={{ width: `${Math.max(2, (d.value / max) * 100)}%` }} /></div>
              <b>{d.display}</b>
            </li>
          ))}
        </ul>
      ) : (
        <p className="crm-muted">{empty ?? "Sem dados ainda."}</p>
      )}
    </figure>
  );
}

const countBy = <T,>(items: T[], key: (t: T) => string) => {
  const m = new Map<string, number>();
  for (const i of items) m.set(key(i), (m.get(key(i)) ?? 0) + 1);
  return [...m.entries()].sort((a, b) => b[1] - a[1]);
};

export function MetricasView() {
  const { deals, payments, today } = useCrm();
  const cur = monthKey(today);
  const curMonth = parts(today).m;

  const requestsNow = deals.filter((d) => monthKey(d.createdAt) === cur).length;
  const revenueNow = payments.filter((p) => p.paidAt && monthKey(p.paidAt) === cur).reduce((s, p) => s + p.amount, 0);

  const labels = Array.from({ length: 6 }, (_, i) => monthLabelShort(((curMonth - 1 - (5 - i)) % 12 + 12) % 12 + 1));
  const requests: Datum[] = [...demoPastMonths.requests, requestsNow].map((v, i) => ({ label: labels[i], value: v, display: String(v), hot: i === 5 }));
  const revenue: Datum[] = [...demoPastMonths.revenue, revenueNow].map((v, i) => ({ label: labels[i], value: v, display: brl(v), hot: i === 5 }));

  const closed = deals.filter((d) => d.stage === "reservada" || d.stage === "realizado");
  const rate = deals.length ? Math.round((closed.length / deals.length) * 100) : 0;
  const ticket = closed.length ? closed.reduce((s, d) => s + d.value, 0) / closed.length : 0;

  const funnel: Datum[] = STAGES.map((s) => {
    const n = deals.filter((d) => d.stage === s.id).length;
    return { label: s.label, value: n, display: String(n) };
  });
  const byType: Datum[] = countBy(deals, (d) => d.eventType).map(([label, value]) => ({ label, value, display: String(value) }));
  const byOrigin: Datum[] = countBy(deals, (d) => d.origin).map(([label, value]) => ({ label, value, display: String(value) }));
  const lost: Datum[] = countBy(deals.filter((d) => d.stage === "perdido"), (d) => d.lostReason ?? "Sem motivo").map(([label, value]) => ({ label, value, display: String(value) }));

  return (
    <>
      <PageHead title="Métricas" sub="Os números do seu negócio, atualizados conforme você usa o CRM." />

      <div className="adm-stats">
        <Stat label="Pedidos no mês" value={String(requestsNow)} sub="novos negócios criados" />
        <Stat label="Taxa de fechamento" value={`${rate}%`} sub={`${closed.length} de ${deals.length} pedidos`} />
        <Stat label="Ticket médio" value={brl(ticket)} sub="por evento fechado" />
        <Stat label="Resposta média" value="38 min" sub="valor de exemplo" />
      </div>

      <div className="adm-grid-2">
        <BarsV title="Pedidos por mês" sub="últimos 6 meses" data={requests} />
        <BarsV title="Faturamento por mês" sub="valores recebidos, últimos 6 meses" data={revenue} />
        <BarsH title="Funil" sub="negócios em cada etapa" data={funnel} />
        <BarsH title="Tipos de evento" sub="quantidade de negócios" data={byType} />
        <BarsH title="Origem dos pedidos" sub="de onde o cliente veio" data={byOrigin} />
        <BarsH title="Motivos de perda" sub="por que alguns pedidos não fecharam" data={lost} empty="Nenhum negócio perdido." />
      </div>
    </>
  );
}
