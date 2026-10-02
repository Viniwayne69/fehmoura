"use client";

import { useMemo, useState } from "react";
import { EVENT_STATUS_LABEL } from "@/lib/constants";
import { dayMonth, googleCalendarLink } from "@/lib/format";
import type { DjEvent } from "@/lib/types";
import { ArrowRight } from "../icons";

export function AgendaList({ events }: { events: DjEvent[] }) {
  const [city, setCity] = useState<string>("todas");
  const cities = useMemo(() => Array.from(new Set(events.map((e) => e.city))), [events]);
  const list = city === "todas" ? events : events.filter((e) => e.city === city);

  return (
    <>
      {cities.length > 1 && (
        <div className="filters" role="group" aria-label="Filtrar por cidade">
          <button className="chip" aria-pressed={city === "todas"} onClick={() => setCity("todas")}>Todas as cidades</button>
          {cities.map((c) => (
            <button key={c} className="chip" aria-pressed={city === c} onClick={() => setCity(c)}>{c}</button>
          ))}
        </div>
      )}
      <ul className="events" style={{ borderTop: "1px solid var(--line)" }}>
        {list.map((e) => {
          const d = dayMonth(e.starts_at);
          return (
            <li key={e.id} className="event-card">
              <time className="event__date" dateTime={e.starts_at}>
                <span className="event__day">{d.day}</span>
                <span className="event__month">{d.month} · {d.time}</span>
              </time>
              <div>
                <div className="event__city">{e.city}</div>
                <h3 className="event-card__title">{e.title}</h3>
                {e.venue && <div className="event-card__meta">{e.venue}</div>}
              </div>
              <div className="event-card__actions">
                <span className={`event__status event__status--${e.status}`}>{EVENT_STATUS_LABEL[e.status]}</span>
                {e.ticket_url && e.status !== "esgotado" ? (
                  <a className="btn" href={e.ticket_url} target="_blank" rel="noopener noreferrer">Ingressos <ArrowRight /></a>
                ) : null}
                <a className="event-card__cal" href={googleCalendarLink(e)} target="_blank" rel="noopener noreferrer">Adicionar ao calendário</a>
              </div>
            </li>
          );
        })}
      </ul>
    </>
  );
}
