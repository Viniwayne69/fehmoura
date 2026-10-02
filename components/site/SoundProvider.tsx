"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";

/**
 * Som do site. O player fica no layout, então não é recarregado ao trocar de página:
 * depois que a pessoa liga o som, a música segue tocando em todo o site.
 * (O navegador só libera som depois de um toque, por isso nunca começa sozinho.)
 */
type SoundCtx = {
  soundOn: boolean;
  toggle: () => void;
  /** posição atual da música em segundos, para o vídeo acompanhar */
  position: () => number;
};

const Ctx = createContext<SoundCtx | null>(null);

export function useSound() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useSound precisa estar dentro de SoundProvider");
  return ctx;
}

export function SoundProvider({ children }: { children: ReactNode }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [soundOn, setSoundOn] = useState(false);

  const toggle = useCallback(() => {
    const a = audioRef.current;
    if (!a) return;
    if (a.paused) {
      a.volume = 1;
      a.play().then(() => setSoundOn(true)).catch(() => setSoundOn(false));
    } else {
      a.pause();
      setSoundOn(false);
    }
  }, []);

  const position = useCallback(() => audioRef.current?.currentTime ?? 0, []);

  // se o navegador ou o sistema pausar a música (ligação, outro app), o botão acompanha
  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    const sync = () => setSoundOn(!a.paused);
    a.addEventListener("pause", sync);
    a.addEventListener("play", sync);
    return () => {
      a.removeEventListener("pause", sync);
      a.removeEventListener("play", sync);
    };
  }, []);

  const value = useMemo(() => ({ soundOn, toggle, position }), [soundOn, toggle, position]);

  return (
    <Ctx.Provider value={value}>
      {children}
      <audio ref={audioRef} src="/audio/hero.m4a" loop preload="none" />
    </Ctx.Provider>
  );
}
