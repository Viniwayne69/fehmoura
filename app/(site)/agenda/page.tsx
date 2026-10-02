import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "@/components/icons";
import { AgendaList } from "@/components/site/AgendaList";
import { PageHero } from "@/components/site/PageHero";
import { Reveal } from "@/components/site/Reveal";
import { SITE_URL } from "@/lib/constants";
import { getPastEvents, getUpcomingEvents } from "@/lib/data";
import { shortDate } from "@/lib/format";

export const metadata: Metadata = {
  title: "Agenda",
  description: "Próximas datas da DJ Feh Moura. Veja onde ela vai tocar e garanta o seu ingresso.",
  alternates: { canonical: "/agenda" },
};
export const revalidate = 300;

export default async function AgendaPage() {
  const [upcoming, past] = await Promise.all([getUpcomingEvents(), getPastEvents()]);

  const jsonLd = upcoming.map((e) => ({
    "@context": "https://schema.org",
    "@type": "MusicEvent",
    name: `DJ Feh Moura em ${e.title}`,
    startDate: e.starts_at,
    eventStatus: "https://schema.org/EventScheduled",
    location: { "@type": "Place", name: e.venue ?? e.title, address: e.city },
    performer: { "@type": "MusicGroup", name: "DJ Feh Moura", url: SITE_URL },
    ...(e.ticket_url ? { offers: { "@type": "Offer", url: e.ticket_url } } : {}),
  }));

  return (
    <>
      <PageHero eyebrow="Agenda" title="Próximos eventos" lead="Confira onde a Feh vai tocar e chegue cedo, que a pista enche rápido." />

      <section className="section section--ink">
        <div className="wrap">
          {upcoming.length > 0 ? (
            <Reveal><AgendaList events={upcoming} /></Reveal>
          ) : (
            <Reveal className="empty-agenda">
              <p>Novas datas em breve</p>
              <span>Enquanto isso, que tal levar a Feh para o seu evento?</span>
              <div style={{ marginTop: 24 }}>
                <Link href="/contato" className="btn">Contratar <ArrowRight /></Link>
              </div>
            </Reveal>
          )}

          {past.length > 0 && (
            <details className="past">
              <summary>Eventos passados ({past.length})</summary>
              <ul>
                {past.map((e) => (
                  <li key={e.id}>
                    <span>{shortDate(e.starts_at)}</span>
                    <span>{e.title}</span>
                    <span>{e.city}</span>
                  </li>
                ))}
              </ul>
            </details>
          )}
        </div>
      </section>
      {jsonLd.length > 0 && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />}
    </>
  );
}
