"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { SoundOff, SoundOn } from "../icons";
import { MistWhen } from "./MistWhen";
import { useSound } from "./SoundProvider";

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
  const { soundOn, toggle, position } = useSound();
  const soundRef = useRef(soundOn);
  soundRef.current = soundOn;
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
    const auto = !reduce;
    setCanAutoplay(auto);

    // garante o mudo antes de tentar tocar (necessário para o autoplay no iPhone)
    videos().forEach((v) => { v.muted = true; v.defaultMuted = true; });
    if (auto) playAll();

    // celular que bloqueou o autoplay: o primeiro toque em qualquer lugar inicia o vídeo (sem mudar nada na tela)
    const retry = () => {
      const main = mainRef.current;
      const box = sectionRef.current?.getBoundingClientRect();
      const visible = !!box && box.bottom > 0 && box.top < window.innerHeight;
      if (auto && visible && main && main.paused) playAll();
    };
    const kick = () => {
      retry();
      const main = mainRef.current;
      if (main && !main.paused) stop();
    };
    const evs = ["touchend", "pointerup", "click", "keydown"] as const;
    const stop = () => evs.forEach((e) => window.removeEventListener(e, kick));
    if (auto) evs.forEach((e) => window.addEventListener(e, kick, { passive: true }));
    // se o vídeo só ficar pronto depois (rede lenta), tenta de novo
    const main0 = mainRef.current;
    main0?.addEventListener("canplay", retry);
    document.addEventListener("visibilitychange", retry);

    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        const main = mainRef.current;
        if (!main) return;
        if (entry.isIntersecting) {
          // volta para a tela inicial com a música tocando: o vídeo acompanha o som
          if (soundRef.current && main.duration) main.currentTime = position() % main.duration;
          if (auto || soundRef.current) playAll();
        } else {
          videos().forEach((v) => v.pause());
        }
      },
      { threshold: 0.2 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      stop();
      main0?.removeEventListener("canplay", retry);
      document.removeEventListener("visibilitychange", retry);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function toggleSound() {
    const main = mainRef.current;
    // o vídeo fica sempre mudo; quem toca é o player do site (segue em todas as páginas)
    if (!soundOn && main && main.duration) main.currentTime = position() % main.duration;
    toggle();
    if (!soundOn) playAll();
  }

  const label = soundOn ? "Desligar som" : canAutoplay ? "Ativar som" : "Assistir com som";

  return (
    <div ref={sectionRef} className="hero__stage">
      <div className="hero__bg" aria-hidden>
        <video ref={bgRef} src={SRC} poster={POSTER} muted loop playsInline preload="metadata" tabIndex={-1} />
      </div>

      <MistWhen query="(min-width: 701px)" className="hero__mist" speed={0.6} opacity={0.85} />

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
