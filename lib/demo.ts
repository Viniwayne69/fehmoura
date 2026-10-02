import type { DjEvent, Photo, Settings } from "./types";

/**
 * Conteúdo usado SOMENTE enquanto o Supabase não está configurado,
 * para o site poder ser visto localmente. Em produção tudo vem do painel.
 */
function inDays(days: number, hour = 23) {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() + days);
  d.setUTCHours(hour + 3, 0, 0, 0);
  return d.toISOString();
}

export const demoEvents: DjEvent[] = [
  { id: "d1", starts_at: inDays(10), title: "Techno Night", city: "São Paulo - SP", venue: null, ticket_url: "https://example.com/ingressos", status: "confirmado", published: true },
  { id: "d2", starts_at: inDays(23), title: "Casa da Praia", city: "Rio de Janeiro - RJ", venue: null, ticket_url: "https://example.com/ingressos", status: "confirmado", published: true },
  { id: "d3", starts_at: inDays(37), title: "Festival Groove", city: "Belo Horizonte - MG", venue: null, ticket_url: "https://example.com/ingressos", status: "ultimos", published: true },
  { id: "d4", starts_at: inDays(-20), title: "Noite House", city: "Recife - PE", venue: null, ticket_url: null, status: "confirmado", published: true },
];

const p = (id: string, url: string, alt: string, category: Photo["category"], featured: boolean, position: number): Photo => ({
  id, path: url, url, alt, category, featured, position, width: null, height: null,
});

export const demoPhotos: Photo[] = [
  p("p1", "/img/galeria-1.jpg", "Público dançando na pista durante o set", "clubes", true, 0),
  p("p2", "/img/galeria-2.jpg", "Feh Moura na cabine com a pista lotada", "clubes", true, 1),
  p("p3", "/img/galeria-3.jpg", "Controladora e mixer iluminados de vermelho", "clubes", true, 2),
  p("p4", "/img/hero.jpg", "Feh Moura tocando de costas para o público", "clubes", false, 3),
  p("p5", "/img/sobre.jpg", "Feh Moura de fones durante a apresentação", "clubes", false, 4),
];

export const demoSettings: Settings = {
  instagram: "https://www.instagram.com/fehmouura/",
  whatsapp: "5581995709892",
  email: null,
  spotify: null,
  youtube: null,
  soundcloud: null,
  bio: null,
  presskit_url: null,
};
