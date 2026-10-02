import { MistWhen } from "./MistWhen";
import { Reveal } from "./Reveal";

export function PageHero({ eyebrow, title, lead, long }: { eyebrow: string; title: string; lead?: string; long?: boolean }) {
  return (
    <section className="page-hero">
      <MistWhen query="(min-width: 0px)" className="page-hero__mist" speed={0.6} opacity={0.8} />
      <Reveal className="wrap">
        <span className="eyebrow">{eyebrow}</span>
        <h1 className={`title${long ? " title--long" : ""}`}>{title}</h1>
        {lead && <p className="lead">{lead}</p>}
      </Reveal>
    </section>
  );
}
