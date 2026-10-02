/**
 * Datas do CRM trabalham com texto AAAA-MM-DD e contas em UTC.
 * Assim o resultado é o mesmo no servidor e no navegador, sem surpresa de fuso.
 */
const TZ = "America/Sao_Paulo";
const MONTHS_SHORT = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];
const MONTHS = ["janeiro", "fevereiro", "março", "abril", "maio", "junho", "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"];
const WEEKDAYS = ["domingo", "segunda-feira", "terça-feira", "quarta-feira", "quinta-feira", "sexta-feira", "sábado"];

export function todayISO(): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: TZ, year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date());
}

export function parts(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  return { y, m, d };
}

export function addDays(iso: string, n: number): string {
  const { y, m, d } = parts(iso);
  return new Date(Date.UTC(y, m - 1, d + n)).toISOString().slice(0, 10);
}

export function diffDays(from: string, to: string): number {
  const a = parts(from);
  const b = parts(to);
  return Math.round((Date.UTC(b.y, b.m - 1, b.d) - Date.UTC(a.y, a.m - 1, a.d)) / 86400000);
}

export function weekday(iso: string): number {
  const { y, m, d } = parts(iso);
  return new Date(Date.UTC(y, m - 1, d)).getUTCDay();
}

export function isoOf(y: number, m: number, d: number): string {
  return `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
}

export function daysInMonth(y: number, m: number): number {
  return new Date(Date.UTC(y, m, 0)).getUTCDate();
}

export const dayNum = (iso: string) => String(parts(iso).d);
export const monthShort = (iso: string) => MONTHS_SHORT[parts(iso).m - 1];
export const fmtShort = (iso: string) => `${parts(iso).d} ${monthShort(iso)}`;
export const fmtLong = (iso: string) => {
  const { m, d } = parts(iso);
  return `${WEEKDAYS[weekday(iso)]}, ${d} de ${MONTHS[m - 1]}`;
};
export const monthName = (y: number, m: number) => `${MONTHS[m - 1]} de ${y}`;
export const monthLabelShort = (m: number) => MONTHS_SHORT[m - 1];
export const monthKey = (iso: string) => iso.slice(0, 7);

/** "Hoje", "Amanhã", "Atrasada há 2 dias" ou "12 out" */
export function relativeDay(iso: string, today: string): string {
  const n = diffDays(today, iso);
  if (n === 0) return "Hoje";
  if (n === 1) return "Amanhã";
  if (n === -1) return "Ontem";
  if (n < 0) return `Há ${-n} dias`;
  if (n <= 6) return `Em ${n} dias`;
  return fmtShort(iso);
}

export function brl(n: number): string {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 }).format(n);
}
