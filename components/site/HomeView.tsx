import Image from "next/image";
import Link from "next/link";
import { DEFAULT_BIO, SERVICES } from "@/lib/constants";
import type { DjEvent, Photo, Settings } from "@/lib/types";
import { ArrowRight, serviceIcons } from "../icons";
import { ContactChannels } from "./ContactChannels";
import { ContactForm } from "./ContactForm";
import { EventRow } from "./EventRow";
import { Gallery } from "./Gallery";
import { HeroVideo } from "./HeroVideo";
import { MistWhen } from "./MistWhen";
import { Reveal } from "./Reveal";

type Props = { events: DjEvent[]; photos: Photo[]; settings: Settings };

function Letters({ text, start = 0 }: { text: string; start?: number }) {
  return (
    <>
      {Array.from(text).map((ch, i) => (
        <span key={i} className="ch" style={{ animationDelay: `${0.15 + (start + i) * 0.045}s` }}>
          {ch === " " ? " " : ch}
        </span>
      ))}
    </>
  );
}

export function HomeView({ events, photos, settings }: Props) {
  const bio = settings.bio?.split("\n").find(Boolean) ?? DEFAULT_BIO;

  return (
    <>
      {/* ---------- HERO ---------- */}
      <section className="hero" aria-label="Apresentação">
        <HeroVideo>
          <h1 className="hero__title" aria-label="DJ Feh Moura">
            <span className="line" aria-hidden><Letters text="Feh Moura" /></span>
          </h1>
          <p className="hero__slogan">Som, energia e a melhor noite da sua vida</p>
          <hr className="red-rule" />
          <div className="hero__cta">
            <Link href="/contato" className="btn">Contratar <ArrowRight /></Link>
          </div>
        </HeroVideo>
      </section>

      {/* ---------- SOBRE ---------- */}
      <section id="sobre" className="section section--ink section--mist">
        <MistWhen query="(max-width: 700px)" className="about__mist" speed={0.6} opacity={0.6} />
        <div className="wrap about">
          <Reveal className="about__media">
            <Image src="/img/hero.jpg" alt="Feh Moura de fones durante o set, de costas para a pista" fill unoptimized sizes="(max-width: 860px) 100vw, 50vw" />
          </Reveal>
          <Reveal className="about__text" delay={1}>
            <span className="eyebrow">Sobre</span>
            <h2 className="title">Mais que música, é sobre pessoas</h2>
            <p className="lead">{bio}</p>
            <Link href="/sobre" className="btn">Saiba mais <ArrowRight /></Link>
          </Reveal>
        </div>
      </section>

      {/* ---------- SERVIÇOS + GALERIA ---------- */}
      <section className="section section--tight section--ink">
        <div className="wrap">
          <div className="services">
            <Reveal className="services__intro">
              <span className="eyebrow">Serviços</span>
              <h2 className="title title--sm">Vibrações da pista</h2>
              <p className="lead">Sets personalizados para cada evento, com a energia certa para transformar o seu momento em algo inesquecível.</p>
              <Link href="/contato" className="btn">Contratar <ArrowRight /></Link>
            </Reveal>
            <Reveal className="services__grid" delay={1}>
              {SERVICES.map((s) => {
                const Icon = serviceIcons[s.icon];
                return (
                  <Link key={s.slug} href={`/contato?tipo=${s.slug}`} className="service">
                    <Icon />
                    <span>{s.title}</span>
                  </Link>
                );
              })}
            </Reveal>
          </div>

          {photos.length > 0 && (
            <>
              <hr className="divider" style={{ margin: "clamp(48px, 6vw, 72px) 0" }} />
              <div className="gallery-strip">
                <Reveal className="gallery-strip__intro">
                  <span className="eyebrow">Galeria</span>
                  <h2 className="title title--sm">Registros da pista</h2>
                  <Link href="/galeria" className="link-arrow">Ver todas as fotos <ArrowRight /></Link>
                </Reveal>
                <Reveal delay={1}>
                  <Gallery photos={photos} variant="strip" />
                </Reveal>
              </div>
            </>
          )}
        </div>
      </section>

      {/* ---------- AGENDA ---------- */}
      <section className="section section--tight section--carbon">
        <div className="wrap agenda">
          <Reveal className="agenda__intro">
            <span className="eyebrow">Agenda</span>
            <h2 className="title title--sm">Próximos eventos</h2>
          </Reveal>
          <Reveal delay={1} className="agenda__list">
            {events.length > 0 ? (
              <ul className="events">
                {events.map((e) => <EventRow key={e.id} event={e} />)}
              </ul>
            ) : (
              <div className="empty-agenda">
                <p>Novas datas em breve</p>
                <span>Quer a Feh no seu evento? Fale com a gente e garanta a sua data.</span>
              </div>
            )}
          </Reveal>
          <Reveal delay={2} className="agenda__cta">
            {events.length > 0 ? (
              <Link href="/agenda" className="btn">Ver todos os eventos <ArrowRight /></Link>
            ) : (
              <Link href="/contato" className="btn">Contratar <ArrowRight /></Link>
            )}
          </Reveal>
        </div>
      </section>

      {/* ---------- CONTATO ---------- */}
      <section className="section section--tight contact" id="contato">
        <div className="contact__bg" aria-hidden>
          <Image src="/img/contato-bg.jpg" alt="" fill sizes="100vw" />
        </div>
        <div className="wrap contact__grid">
          <Reveal>
            <span className="eyebrow">Contato</span>
            <h2 className="title title--sm">Vamos conversar?</h2>
            <p className="lead">Para contratar, tirar dúvidas ou falar sobre projetos, entre em contato.</p>
            <ContactChannels settings={settings} />
          </Reveal>
          <Reveal delay={1} className="contact__form-wrap">
            <span className="eyebrow">Pedido de contratação</span>
            <h2 className="title title--sm" style={{ marginBottom: 32 }}>Conte sobre o evento</h2>
            <ContactForm />
          </Reveal>
        </div>
      </section>
    </>
  );
}
