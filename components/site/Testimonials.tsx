import { Reveal } from "./Reveal";

/** Elogios reais recebidos pela Feh, exatamente como foram escritos. */
const FEATURED = "foi o puro chique do chique meu deus, melhor set da minha vida disparadooo.";
const OTHERS = [
  "Oi diva só para dizer que você foi incrível e pfvr volte sempre pro vinil pois a cidade não tinha uma festinha legal há meses.",
  "Você fez um ótimo trabalho, meus parabéns, sucesso.",
  "A melhor DJ da cringe",
];

export function Testimonials() {
  return (
    <section className="section section--tight section--ink" aria-labelledby="depoimentos-title">
      <div className="wrap testimonials">
        <Reveal className="testimonials__head">
          <span className="eyebrow">Depoimentos</span>
          <h2 id="depoimentos-title" className="title title--sm">Quem viveu a noite</h2>
        </Reveal>

        <Reveal as="figure" delay={1} className="testimonials__featured">
          <blockquote>{FEATURED}</blockquote>
        </Reveal>

        <ul className="testimonials__grid">
          {OTHERS.map((t, i) => (
            <Reveal as="li" key={t} delay={(Math.min(i + 1, 4) as 1 | 2 | 3 | 4)} className="testimonial">
              <blockquote>{t}</blockquote>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
