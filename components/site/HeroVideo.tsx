"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { SoundOff, SoundOn } from "../icons";
import { MistBackground } from "./MistBackground";

const SRC = "/video/hero.mp4";
const POSTER = "/video/hero-poster.jpg";

/**
 * Vídeo da tela inicial.
 * Celular: o vídeo vertical aparece no tamanho original, com o texto por cima.
 * PC: texto à esquerda, vídeo inteiro à direita e o mesmo vídeo desfocado no fundo.
 * Começa sem som (regra dos navegadores) e pausa quando sai da tela.
 */
export function HeroVideo({ children }: { children: ReactNode }) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const mainRef = useRef<HTMLVideoElement>(null);
  const bgRef = useRef<HTMLVideoElement>(null);
  const [soundOn, setSoundOn] = useState(false);
  const [canAutoplay, setCanAutoplay] = useState(true);

  const videos = () => [mainRef.current, bgRef.current].filter(Boolean) as HTMLVideoElement[];
  const isDesktop = () => window.matchMedia("(min-width: 701px)").matches;

  function playAll() {
    for (const v of videos()) {
      if (v === bgRef.current && !isDesktop()) continue;
      v.play().catch(() => {});
    }
  }

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const conn = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    const auto = !reduce && !conn?.saveData;
    setCanAutoplay(auto);

    // garante o mudo antes de tentar tocar (necessário para o autoplay no iPhone)
    videos().forEach((v) => { v.muted = true; v.defaultMuted = true; });
    if (auto) playAll();

    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        const main = mainRef.current;
        if (!main) return;
        if (entry.isIntersecting) {
          if (auto || !main.muted) playAll();
        } else {
          videos().forEach((v) => v.pause());
        }
      },
      { threshold: 0.2 },
    );
    io.observe(el);
    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function toggleSound() {
    const main = mainRef.current;
    if (!main) return;
    const next = !soundOn;
    main.muted = !next;
    if (next) {
      main.volume = 1;
      if (main.paused) playAll();
    }
    setSoundOn(next);
  }

  const label = soundOn ? "Desligar som" : canAutoplay ? "Ativar som" : "Assistir com som";

  return (
    <div ref={sectionRef} className="hero__stage">
      <div className="hero__bg" aria-hidden>
        <video ref={bgRef} src={SRC} poster={POSTER} muted loop playsInline preload="metadata" tabIndex={-1} />
      </div>

      <MistBackground className="hero__mist" speed={0.6} opacity={0.85} />

      <div className="wrap hero__layout">
        <div className="hero__content">{children}</div>

        <div className="hero__frame">
          <video
            ref={mainRef}
            src={SRC}
            poster={POSTER}
            muted
            loop
            playsInline
            autoPlay={canAutoplay}
            preload="auto"
            aria-label="Vídeo de um set da DJ Feh Moura com a pista lotada"
          />
          <button
            type="button"
            className={`sound-btn${soundOn ? " is-on" : ""}`}
            onClick={toggleSound}
            aria-pressed={soundOn}
          >
            {soundOn ? <SoundOn /> : <SoundOff />}
            <span>{label}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
