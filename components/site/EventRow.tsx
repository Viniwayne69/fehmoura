import { EVENT_STATUS_LABEL } from "@/lib/constants";
import { dayMonth } from "@/lib/format";
import type { DjEvent } from "@/lib/types";

export function EventRow({ event }: { event: DjEvent }) {
  const d = dayMonth(event.starts_at);
  return (
    <li className="event">
      <time className="event__date" dateTime={event.starts_at}>
        <span className="event__day">{d.day}</span>
        <span className="event__month">{d.month}</span>
      </time>
      <div>
        <div className="event__city">{event.city}</div>
        <div className="event__title">{event.title}</div>
      </div>
      <span className={`event__status event__status--${event.status}`}>{EVENT_STATUS_LABEL[event.status]}</span>
    </li>
  );
}
