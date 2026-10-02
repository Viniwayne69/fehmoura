const TZ = "America/Sao_Paulo";
const MONTHS = ["JAN", "FEV", "MAR", "ABR", "MAI", "JUN", "JUL", "AGO", "SET", "OUT", "NOV", "DEZ"];

function parts(iso: string) {
  const d = new Date(iso);
  const f = new Intl.DateTimeFormat("pt-BR", {
    timeZone: TZ, day: "2-digit", month: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit", hour12: false,
  }).formatToParts(d);
  const get = (t: string) => f.find((p) => p.type === t)?.value ?? "";
  return { day: get("day"), month: Number(get("month")), year: get("year"), hour: get("hour"), minute: get("minute") };
}

export function dayMonth(iso: string) {
  const p = parts(iso);
  return { day: p.day, month: MONTHS[p.month - 1], year: p.year, time: `${p.hour}h${p.minute === "00" ? "" : p.minute}` };
}

export function longDate(iso: string) {
  return new Intl.DateTimeFormat("pt-BR", { timeZone: TZ, dateStyle: "long", timeStyle: "short" }).format(new Date(iso));
}

export function shortDate(iso: string) {
  return new Intl.DateTimeFormat("pt-BR", { timeZone: TZ, dateStyle: "short" }).format(new Date(iso));
}

/** Converte "2026-10-12T23:00" digitado no painel (horário de Brasília) para ISO UTC. */
export function localInputToIso(value: string) {
  return new Date(`${value}:00-03:00`).toISOString();
}

/** Converte ISO para o formato do <input type="datetime-local"> em horário de Brasília. */
export function isoToLocalInput(iso: string) {
  const p = parts(iso);
  return `${p.year}-${String(p.month).padStart(2, "0")}-${p.day}T${p.hour}:${p.minute}`;
}

export function whatsappLink(number: string | null | undefined, text?: string) {
  const digits = (number ?? "").replace(/\D/g, "");
  if (!digits) return null;
  return `https://wa.me/${digits}${text ? `?text=${encodeURIComponent(text)}` : ""}`;
}

export function instagramHandle(url: string | null | undefined) {
  if (!url) return null;
  const m = url.match(/instagram\.com\/([^/?#]+)/i);
  return m ? `@${m[1]}` : url;
}

export function googleCalendarLink(e: { title: string; starts_at: string; venue: string | null; city: string }) {
  const start = new Date(e.starts_at);
  const end = new Date(start.getTime() + 4 * 60 * 60 * 1000);
  const fmt = (d: Date) => d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: `DJ Feh Moura — ${e.title}`,
    dates: `${fmt(start)}/${fmt(end)}`,
    location: [e.venue, e.city].filter(Boolean).join(", "),
  });
  return `https://calendar.google.com/calendar/render?${params}`;
}

export function spotifyEmbed(url: string | null | undefined) {
  if (!url) return null;
  const m = url.match(/open\.spotify\.com\/(?:intl-[a-z]+\/)?(artist|playlist|album|track|show|episode)\/([A-Za-z0-9]+)/);
  return m ? `https://open.spotify.com/embed/${m[1]}/${m[2]}?theme=0` : null;
}
