"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import type { Photo } from "@/lib/types";
import { ArrowLeft, ArrowRight, Close } from "../icons";

type Props = { photos: Photo[]; variant: "strip" | "masonry" };

export function Gallery({ photos, variant }: Props) {
  const [index, setIndex] = useState<number | null>(null);
  const close = useCallback(() => setIndex(null), []);
  const go = useCallback(
    (dir: number) => setIndex((i) => (i === null ? i : (i + dir + photos.length) % photos.length)),
    [photos.length],
  );

  useEffect(() => {
    if (index === null) return;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [index, close, go]);

  const current = index !== null ? photos[index] : null;

  return (
    <>
      <div className={variant === "strip" ? "gallery-strip__grid" : "masonry"}>
        {photos.map((photo, i) => (
          <button key={photo.id} type="button" className="photo" onClick={() => setIndex(i)} aria-label={`Ampliar foto: ${photo.alt || "registro da pista"}`}>
            {variant === "strip" ? (
              <Image src={photo.url} alt={photo.alt} fill sizes="(max-width: 600px) 100vw, 30vw" />
            ) : (
              <Image
                src={photo.url}
                alt={photo.alt}
                width={photo.width ?? 1200}
                height={photo.height ?? 800}
                sizes="(max-width: 700px) 100vw, (max-width: 1100px) 50vw, 33vw"
              />
            )}
          </button>
        ))}
      </div>

      {current && (
        <div className="lightbox" role="dialog" aria-modal="true" aria-label="Foto ampliada" onClick={close}>
          <img src={current.url} alt={current.alt} onClick={(e) => e.stopPropagation()} />
          <button className="lightbox__btn lightbox__close" onClick={close} aria-label="Fechar"><Close /></button>
          {photos.length > 1 && (
            <>
              <button className="lightbox__btn lightbox__prev" onClick={(e) => { e.stopPropagation(); go(-1); }} aria-label="Foto anterior"><ArrowLeft /></button>
              <button className="lightbox__btn lightbox__next" onClick={(e) => { e.stopPropagation(); go(1); }} aria-label="Próxima foto"><ArrowRight /></button>
              <span className="lightbox__count">{(index ?? 0) + 1} / {photos.length}</span>
            </>
          )}
        </div>
      )}
    </>
  );
}
