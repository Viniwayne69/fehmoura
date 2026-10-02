import type { EventStatus, LeadStatus, PhotoCategory } from "./types";

export const SITE_NAME = "DJ Feh Moura";
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://fehmoura.vercel.app";
export const SLOGAN = "Som, energia e a melhor noite da sua vida";

export const DEFAULT_BIO =
  "Feh Moura é DJ e apaixonada por música, toca Open Format DJ, Party Planner, funk, pop, house e música internacional, escolhendo cada música na hora certa de acordo com o clima da pista.";

export const EVENT_STATUS_LABEL: Record<EventStatus, string> = {
  confirmado: "Confirmado",
  ultimos: "Últimos ingressos",
  esgotado: "Esgotado",
  cancelado: "Cancelado",
};

export const PHOTO_CATEGORY_LABEL: Record<PhotoCategory, string> = {
  clubes: "Clubes",
  festivais: "Festivais",
  privados: "Privados",
};

export const LEAD_STATUS_LABEL: Record<LeadStatus, string> = {
  novo: "Novo",
  conversa: "Em conversa",
  fechado: "Fechado",
  recusado: "Recusado",
};

export const SERVICES = [
  { slug: "corporativo", icon: "wave", title: "Eventos corporativos" },
  { slug: "privada", icon: "glass", title: "Festas privadas" },
  { slug: "clube", icon: "headphones", title: "Clubes e festivais" },
  { slug: "personalizado", icon: "spark", title: "Experiências personalizadas" },
] as const;

export const EVENT_TYPES = [
  "Evento corporativo",
  "Festa privada",
  "Casamento",
  "Aniversário",
  "Clube ou casa noturna",
  "Festival",
  "Outro",
];
