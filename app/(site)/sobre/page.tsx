import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "@/components/icons";
import { PageHero } from "@/components/site/PageHero";
import { Reveal } from "@/components/site/Reveal";
import { DEFAULT_BIO } from "@/lib/constants";
import { getSettings } from "@/lib/data";
import { spotifyEmbed } from "@/lib/format";

export const metadata: Metadata = {
  title: "Sobre",
  description: "Conheça a história e o som da DJ Feh Moura, entre o eletrônico, o house e o groove da pista.",
  alternates: { canonical: "/sobre" },
};
export const revalidate = 300;

const DEFAULT_PARAGRAPHS = [
  DEFAULT_BIO,
  "Cada apresentação começa antes do primeiro play. Ela entende o momento, o espaço e as pessoas que vão estar ali para construir um set que conversa com a pista do início ao fim.",
  "Do clube ao evento corporativo, da festa privada ao festival, o objetivo é sempre o mesmo: fazer cada pessoa sentir a música e sair com vontade de voltar.",
];

const PILLARS = [
  { n: "01", t: "O som", d: "Eletrônico, house e groove costurados com transições suaves e muita personalidade." },
  { n: "02", t: "A leitura de pista", d: "Atenção total ao público para ajustar a energia no momento certo, sem perder o fio do set." },
  { n: "03", t: "A experiência", d: "Cada evento recebe um set pensado para ele, do primeiro convidado até a última música." },
];

export default async function SobrePage() {
  const settings = await getSettings();
  const paragraphs = settings.bio?.trim() ? settings.bio.split(/\n+/).filter(Boolean) : DEFAULT_PARAGRAPHS;
  const embed = spotifyEmbed(settings.spotify);

  return (
    <>
      <PageHero eyebrow="Sobre" title="Mais que música, é sobre pessoas" />

      <section className="section section--ink">
        <div className="wrap split">
          <Reveal className="about__media">
            <Image src="/img/hero.jpg" alt="Feh Moura de fones durante o set, de costas para a pista" fill unoptimized sizes="(max-width: 860px) 100vw, 45vw" />
          </Reveal>
          <Reveal className="prose" delay={1}>
            {paragraphs.map((p, i) => <p key={i}>{p}</p>)}
            <Link href="/contato" className="btn" style={{ marginTop: 16 }}>Contratar <ArrowRight /></Link>
          </Reveal>
        </div>
      </section>

      <section className="section section--tight section--ink">
        <div className="wrap">
          <Reveal as="blockquote" className="quote">
            A pista é onde as pessoas se encontram e a música é o que faz esse encontro acontecer
          </Reveal>
          <Reveal className="pillars" delay={1}>
            {PILLARS.map((p) => (
              <div key={p.n} className="pillar">
                <h3><b>{p.n}</b>{p.t}</h3>
                <p>{p.d}</p>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      {embed && (
        <section className="section section--tight section--carbon">
          <div className="wrap split" style={{ alignItems: "center" }}>
            <Reveal>
              <span className="eyebrow">Ouça</span>
              <h2 className="title title--sm">Aperte o play</h2>
              <p className="lead">Um pouco do que a Feh leva para a pista, direto do Spotify.</p>
            </Reveal>
            <Reveal delay={1}>
              <iframe className="embed" src={embed} height={352} loading="lazy" title="Spotify da DJ Feh Moura" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" />
            </Reveal>
          </div>
        </section>
      )}
    </>
  );
}
