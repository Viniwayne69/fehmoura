"use client";

import { useMemo, useState } from "react";
import {
  daysInMonth, fmtLong, isoOf, monthLabelShort, monthName, parts, weekday,
} from "@/lib/crm/date";
import { STAGE_LABEL } from "@/lib/crm/stages";
import type { Deal, SiteEvent, StageId } from "@/lib/crm/types";
import { useCrm } from "../CrmProvider";
import { DealModal } from "../DealModal";
import { CLeft, CRight } from "../icons";
import { PageHead, StageTag } from "../ui";

const SHOWN: StageId[] = ["conversa", "orcamento", "reservada", "realizado"];
const BUSY: StageId[] = ["conversa", "orcamento", "reservada"];
const WEEK = ["D", "S", "T", "Q", "Q", "S", "S"];

export function CalendarioView() {
  const { deals, siteEvents, contactOf, today } = useCrm();
  const start = parts(today);
  const [ym, setYm] = useState({ y: start.y, m: start.m });
  const [selected, setSelected] = useState<string>(today);
  const [openId, setOpenId] = useState<string | null>(null);

  const byDay = useMemo(() => {
    const map = new Map<string, Deal[]>();
    for (const d of deals) {
      if (!SHOWN.includes(d.stage)) continue;
      map.set(d.eventDate, [...(map.get(d.eventDate) ?? []), d]);
    }
    return map;
  }, [deals]);

  const eventsByDay = useMemo(() => {
    const map = new Map<string, SiteEvent[]>();
    for (const e of siteEvents) {
      if (e.status === "cancelado") continue;
      map.set(e.date, [...(map.get(e.date) ?? []), e]);
    }
    return map;
  }, [siteEvents]);
  const busyCount = (iso: string) => (byDay.get(iso) ?? []).filter((d) => BUSY.includes(d.stage)).length + (eventsByDay.get(iso) ?? []).length;

  const total = daysInMonth(ym.y, ym.m);
  const offset = weekday(isoOf(ym.y, ym.m, 1));
  const cells: (string | null)[] = [
    ...Array.from({ length: offset }, () => null),
    ...Array.from({ length: total }, (_, i) => isoOf(ym.y, ym.m, i + 1)),
  ];

  const go = (delta: number) => {
    setYm(({ y, m }) => {
      const n = m - 1 + delta;
      return { y: y + Math.floor(n / 12), m: ((n % 12) + 12) % 12 + 1 };
    });
  };

  const dayDeals = byDay.get(selected) ?? [];
  const dayEvents = eventsByDay.get(selected) ?? [];
  const conflict = busyCount(selected) > 1;

  return (
    <>
      <PageHead title="Calendário" sub="Datas de clientes e eventos do site. Dois compromissos no mesmo dia viram aviso." />

      <section className="adm-card crm-cal">
        <header className="crm-cal__head">
          <button type="button" className="adm-btn adm-btn--sm" onClick={() => go(-1)} aria-label="Mês anterior"><CLeft /></button>
          <h2>{monthName(ym.y, ym.m)}</h2>
          <button type="button" className="adm-btn adm-btn--sm" onClick={() => go(1)} aria-label="Próximo mês"><CRight /></button>
          <button type="button" className="adm-btn adm-btn--sm" onClick={() => { setYm({ y: start.y, m: start.m }); setSelected(today); }}>Hoje</button>
        </header>

        <div className="crm-cal__grid" role="grid" aria-label={monthName(ym.y, ym.m)}>
          {WEEK.map((w, i) => <div key={i} className="crm-cal__wd" role="columnheader">{w}</div>)}
          {cells.map((iso, i) => {
            if (!iso) return <div key={`b${i}`} className="crm-cal__cell is-blank" />;
            const items = byDay.get(iso) ?? [];
            const evs = eventsByDay.get(iso) ?? [];
            const count = items.length + evs.length;
            const busy = busyCount(iso) > 1;
            return (
              <button
                key={iso}
                type="button"
                role="gridcell"
                className={`crm-cal__cell${iso === today ? " is-today" : ""}${iso === selected ? " is-selected" : ""}${busy ? " is-conflict" : ""}`}
                onClick={() => setSelected(iso)}
                aria-label={`${fmtLong(iso)}${count ? `, ${count} compromisso(s)` : ""}${busy ? ", conflito de data" : ""}`}
              >
                <span className="crm-cal__num">{parts(iso).d}</span>
                <span className="crm-cal__chips">
                  {evs.slice(0, 2).map((e) => (
                    <i key={e.id} className="crm-chip crm-chip--evento" title={`${e.title}, evento no site`}>{e.title}</i>
                  ))}
                  {items.slice(0, Math.max(0, 2 - evs.length)).map((d) => (
                    <i key={d.id} className={`crm-chip crm-chip--${d.stage}`} title={`${contactOf(d.contactId)?.name}, ${STAGE_LABEL[d.stage]}`}>
                      {contactOf(d.contactId)?.name.split(" ")[0]}
                    </i>
                  ))}
                  {count > 2 && <i className="crm-chip crm-chip--more">+{count - 2}</i>}
                </span>
              </button>
            );
          })}
        </div>

        <ul className="crm-legend" aria-label="Legenda">
          <li><i className="crm-chip crm-chip--evento" />Evento no site</li>
          {SHOWN.map((s) => <li key={s}><i className={`crm-chip crm-chip--${s}`} />{STAGE_LABEL[s]}</li>)}
        </ul>
      </section>

      <section className="adm-card" style={{ marginTop: 16 }}>
        <h2>{fmtLong(selected)}</h2>
        {conflict && <p className="adm-msg adm-msg--err" style={{ marginBottom: 14 }}>Atenção: há mais de um compromisso nessa data. Confirme qual vai ficar com ela.</p>}
        {dayDeals.length || dayEvents.length ? (
          <ul className="adm-list crm-flush">
            {dayEvents.map((e) => (
              <li key={e.id} className="adm-row" style={{ gridTemplateColumns: "1fr auto" }}>
                <div>
                  <div className="adm-row__title">{e.title}</div>
                  <div className="adm-row__meta">{e.time ? `${e.time} · ` : ""}{[e.venue, e.city].filter(Boolean).join(", ")}</div>
                </div>
                <span className="tag tag--red">Evento no site</span>
              </li>
            ))}
            {dayDeals.map((d) => (
              <li key={d.id} className="adm-row crm-click" style={{ gridTemplateColumns: "1fr auto" }} onClick={() => setOpenId(d.id)}>
                <div>
                  <div className="adm-row__title">{contactOf(d.contactId)?.name}</div>
                  <div className="adm-row__meta">{d.eventType} · {d.startTime} · {d.venue}, {d.city}</div>
                </div>
                <StageTag stage={d.stage} />
              </li>
            ))}
          </ul>
        ) : (
          <div className="adm-empty"><strong>Dia livre</strong>Nada marcado nessa data ({monthLabelShort(parts(selected).m)}).</div>
        )}
      </section>

      {openId && <DealModal dealId={openId} onClose={() => setOpenId(null)} />}
    </>
  );
}
