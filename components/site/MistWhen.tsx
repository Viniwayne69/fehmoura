"use client";

import { useEffect, useState } from "react";
import { MistBackground } from "./MistBackground";

/**
 * Mostra a névoa só quando a tela bate com a regra (ex.: "(max-width: 700px)").
 * Fora da regra o efeito nem é montado, então a placa de vídeo não trabalha à toa.
 */
export function MistWhen({
  query,
  className,
  speed,
  opacity,
}: {
  query: string;
  className?: string;
  speed?: number;
  opacity?: number;
}) {
  const [on, setOn] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(query);
    const update = () => setOn(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, [query]);

  if (!on) return null;
  return <MistBackground className={className} speed={speed} opacity={opacity} />;
}
