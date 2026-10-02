import { Reveal } from "./Reveal";

export function PageHero({ eyebrow, title, lead }: { eyebrow: string; title: string; lead?: string }) {
  return (
    <section className="page-hero">
      <Reveal className="wrap">
        <span className="eyebrow">{eyebrow}</span>
        <h1 className="title">{title}</h1>
        {lead && <p className="lead">{lead}</p>}
      </Reveal>
    </section>
  );
}
