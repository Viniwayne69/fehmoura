import type { Metadata } from "next";
import { Download } from "@/components/icons";
import { ContactChannels } from "@/components/site/ContactChannels";
import { ContactForm } from "@/components/site/ContactForm";
import { PageHero } from "@/components/site/PageHero";
import { Reveal } from "@/components/site/Reveal";
import { getSettings } from "@/lib/data";

export const metadata: Metadata = {
  title: "Contato",
  description: "Contrate a DJ Feh Moura para o seu evento. Fale por WhatsApp, Instagram ou pelo formulário.",
  alternates: { canonical: "/contato" },
};

const TYPE_BY_SLUG: Record<string, string> = {
  festas: "Festa particular",
  "open-format": "Festa particular",
  "party-planner": "Outro",
};

const FAQ = [
  {
    q: "Com quanto tempo de antecedência devo contratar?",
    a: "Quanto antes, melhor, principalmente para datas de fim de semana e fim de ano. Mande o pedido assim que tiver a data definida para garantir a agenda.",
  },
  {
    q: "A Feh leva o equipamento?",
    a: "Depende do evento e do local. Conte no formulário o que o espaço já oferece e ela indica o que precisa ser levado ou providenciado.",
  },
  {
    q: "Ela toca fora da cidade?",
    a: "Sim. Para eventos em outras cidades, o orçamento inclui deslocamento e hospedagem quando necessário.",
  },
  {
    q: "Dá para personalizar o set?",
    a: "Dá sim. Cada set é montado para o evento, levando em conta o público, o horário e o clima que você quer criar. Se houver músicas especiais, é só avisar.",
  },
  {
    q: "Como funciona o orçamento?",
    a: "Envie o tipo de evento, a data, a cidade e a duração desejada. Com essas informações a Feh responde com uma proposta sob medida.",
  },
];

export default async function ContatoPage({ searchParams }: { searchParams: Promise<{ tipo?: string }> }) {
  const [{ tipo }, settings] = await Promise.all([searchParams, getSettings()]);

  return (
    <>
      <PageHero eyebrow="Contato" title="Vamos conversar?" lead="Conte como é o seu evento e a Feh responde com uma proposta pensada para ele." />

      <section className="section section--ink">
        <div className="wrap contact-page">
          <Reveal>
            <span className="eyebrow">Canais</span>
            <h2 className="title title--sm">Fale direto</h2>
            <ContactChannels settings={settings} />
            {settings.presskit_url && (
              <a href={settings.presskit_url} className="btn btn--ghost" target="_blank" rel="noopener noreferrer">
                Baixar press kit <Download />
              </a>
            )}
          </Reveal>
          <Reveal delay={1}>
            <span className="eyebrow">Pedido de contratação</span>
            <h2 className="title title--sm" style={{ marginBottom: 32 }}>Conte sobre o evento</h2>
            <ContactForm defaultType={tipo ? TYPE_BY_SLUG[tipo] : undefined} />
          </Reveal>
        </div>
      </section>

      <section className="section section--tight section--ink">
        <div className="wrap split">
          <Reveal>
            <span className="eyebrow">Dúvidas</span>
            <h2 className="title title--sm">Perguntas frequentes</h2>
          </Reveal>
          <Reveal className="faq" delay={1}>
            {FAQ.map((f) => (
              <details key={f.q}>
                <summary>{f.q}</summary>
                <p>{f.a}</p>
              </details>
            ))}
          </Reveal>
        </div>
      </section>
    </>
  );
}
