export type EventStatus = "confirmado" | "ultimos" | "esgotado" | "cancelado";
export type PhotoCategory = "clubes" | "festivais" | "privados";
export type LeadStatus = "novo" | "conversa" | "fechado" | "recusado";

export type DjEvent = {
  id: string;
  starts_at: string;
  title: string;
  city: string;
  venue: string | null;
  ticket_url: string | null;
  status: EventStatus;
  published: boolean;
};

export type Photo = {
  id: string;
  path: string;
  url: string;
  alt: string;
  category: PhotoCategory;
  featured: boolean;
  position: number;
  width: number | null;
  height: number | null;
};

export type Lead = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  event_type: string | null;
  event_date: string | null;
  city: string | null;
  message: string | null;
  status: LeadStatus;
  created_at: string;
};

export type Settings = {
  instagram: string | null;
  whatsapp: string | null;
  email: string | null;
  spotify: string | null;
  youtube: string | null;
  soundcloud: string | null;
  bio: string | null;
  presskit_url: string | null;
};
