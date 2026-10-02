import type { ReactNode } from "react";

/** Moldura da foto do hero: mantém a imagem inteira, sem cortes nem zoom. */
export function HeroParallax({ children }: { children: ReactNode }) {
  return <div className="hero__media">{children}</div>;
}
