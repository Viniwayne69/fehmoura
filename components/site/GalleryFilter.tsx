"use client";

import { useMemo, useState } from "react";
import { PHOTO_CATEGORY_LABEL } from "@/lib/constants";
import type { Photo, PhotoCategory } from "@/lib/types";
import { Gallery } from "./Gallery";

export function GalleryFilter({ photos }: { photos: Photo[] }) {
  const [cat, setCat] = useState<PhotoCategory | "todas">("todas");
  const cats = useMemo(() => Array.from(new Set(photos.map((p) => p.category))), [photos]);
  const list = cat === "todas" ? photos : photos.filter((p) => p.category === cat);

  return (
    <>
      {cats.length > 1 && (
        <div className="filters" role="group" aria-label="Filtrar fotos">
          <button className="chip" aria-pressed={cat === "todas"} onClick={() => setCat("todas")}>Todas</button>
          {cats.map((c) => (
            <button key={c} className="chip" aria-pressed={cat === c} onClick={() => setCat(c)}>{PHOTO_CATEGORY_LABEL[c]}</button>
          ))}
        </div>
      )}
      <Gallery key={cat} photos={list} variant="masonry" />
    </>
  );
}
