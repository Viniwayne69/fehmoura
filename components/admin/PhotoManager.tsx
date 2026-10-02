"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, useTransition } from "react";
import { deletePhoto, registerPhoto, reorderPhotos, updatePhoto } from "@/lib/actions/admin";
import { PHOTO_CATEGORY_LABEL } from "@/lib/constants";
import { compressImage } from "@/lib/image";
import { createClient } from "@/lib/supabase/client";
import type { Photo, PhotoCategory } from "@/lib/types";
import { ArrowLeft, ArrowRight, IconStar, IconUpload } from "../icons";

const CATS = Object.keys(PHOTO_CATEGORY_LABEL) as PhotoCategory[];

export function PhotoManager({ photos: initial }: { photos: Photo[] }) {
  const router = useRouter();
  const [photos, setPhotos] = useState(initial);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [upload, setUpload] = useState<{ done: number; total: number } | null>(null);
  const [category, setCategory] = useState<PhotoCategory>("clubes");
  const [over, setOver] = useState(false);
  const [dragId, setDragId] = useState<string | null>(null);
  const [targetId, setTargetId] = useState<string | null>(null);
  const [, startTransition] = useTransition();
  const input = useRef<HTMLInputElement>(null);

  useEffect(() => setPhotos(initial), [initial]);

  const featuredCount = photos.filter((p) => p.featured).length;

  async function handleFiles(files: FileList | File[]) {
    const list = Array.from(files).filter((f) => f.type.startsWith("image/"));
    if (!list.length) return;
    const supabase = createClient();
    setMsg(null);
    setUpload({ done: 0, total: list.length });
    let failed = 0;
    for (const file of list) {
      try {
        const { blob, width, height } = await compressImage(file);
        const path = `fotos/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.webp`;
        const { error } = await supabase.storage.from("galeria").upload(path, blob, { contentType: "image/webp", cacheControl: "31536000" });
        if (error) throw error;
        const { data } = supabase.storage.from("galeria").getPublicUrl(path);
        const r = await registerPhoto({ path, url: data.publicUrl, width, height, category });
        if (!r.ok) throw new Error(r.error);
      } catch (e) {
        console.error(e);
        failed++;
      }
      setUpload((u) => (u ? { ...u, done: u.done + 1 } : u));
    }
    setUpload(null);
    setMsg(failed ? { ok: false, text: `${list.length - failed} enviada(s), ${failed} com erro. Tente de novo as que faltaram.` } : { ok: true, text: `${list.length} foto(s) publicada(s) na galeria.` });
    router.refresh();
  }

  function run(fn: () => Promise<{ ok: boolean; error?: string }>, okText?: string) {
    startTransition(async () => {
      const r = await fn();
      if (!r.ok) setMsg({ ok: false, text: r.error ?? "Algo deu errado." });
      else if (okText) setMsg({ ok: true, text: okText });
      router.refresh();
    });
  }

  function patch(id: string, p: Partial<Photo>) {
    setPhotos((list) => list.map((x) => (x.id === id ? { ...x, ...p } : x)));
  }

  function toggleFeatured(photo: Photo) {
    if (!photo.featured && featuredCount >= 3) {
      setMsg({ ok: false, text: "A home mostra no máximo 3 fotos em destaque. Tire a estrela de outra antes." });
      return;
    }
    patch(photo.id, { featured: !photo.featured });
    run(() => updatePhoto(photo.id, { featured: !photo.featured }));
  }

  function move(from: number, to: number) {
    if (to < 0 || to >= photos.length || from === to) return;
    const next = [...photos];
    const [item] = next.splice(from, 1);
    next.splice(to, 0, item);
    setPhotos(next);
    run(() => reorderPhotos(next.map((p) => p.id)));
  }

  function remove(photo: Photo) {
    if (!window.confirm("Excluir esta foto do site? Essa ação não pode ser desfeita.")) return;
    setPhotos((list) => list.filter((p) => p.id !== photo.id));
    run(() => deletePhoto(photo.id), "Foto excluída.");
  }

  return (
    <>
      <div className="adm-head">
        <div>
          <span className="eyebrow">Galeria</span>
          <h1>Fotos</h1>
          <p>Arraste para reordenar. A estrela escolhe as 3 fotos que aparecem na home ({featuredCount}/3).</p>
        </div>
        <div className="adm-field" style={{ minWidth: 200 }}>
          <label htmlFor="up-cat">Categoria das novas fotos</label>
          <select id="up-cat" value={category} onChange={(e) => setCategory(e.target.value as PhotoCategory)}>
            {CATS.map((c) => <option key={c} value={c}>{PHOTO_CATEGORY_LABEL[c]}</option>)}
          </select>
        </div>
      </div>

      <div
        className={`adm-drop${over ? " is-over" : ""}`}
        role="button"
        tabIndex={0}
        onClick={() => input.current?.click()}
        onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && input.current?.click()}
        onDragOver={(e) => { if (e.dataTransfer.types.includes("Files")) { e.preventDefault(); setOver(true); } }}
        onDragLeave={() => setOver(false)}
        onDrop={(e) => { if (e.dataTransfer.files.length) { e.preventDefault(); setOver(false); handleFiles(e.dataTransfer.files); } }}
      >
        <IconUpload />
        {upload ? (
          <>
            <strong>Enviando {upload.done + 1 > upload.total ? upload.total : upload.done + 1} de {upload.total}</strong>
            <div className="adm-progress"><i style={{ width: `${(upload.done / upload.total) * 100}%` }} /></div>
          </>
        ) : (
          <>
            <strong>Arraste as fotos aqui ou toque para escolher</strong>
            <small>Fotos do celular ou do computador. Elas são comprimidas automaticamente.</small>
          </>
        )}
        <input ref={input} type="file" accept="image/*" multiple hidden onChange={(e) => e.target.files && handleFiles(e.target.files)} />
      </div>

      {msg && <p className={`adm-msg ${msg.ok ? "adm-msg--ok" : "adm-msg--err"}`} style={{ marginBottom: 16 }}>{msg.text}</p>}

      {photos.length === 0 ? (
        <div className="adm-empty"><strong>Nenhuma foto ainda</strong>As fotos enviadas aparecem na galeria do site na hora.</div>
      ) : (
        <div className="adm-photos">
          {photos.map((photo, i) => (
            <div
              key={photo.id}
              className={`adm-photo${dragId === photo.id ? " is-dragging" : ""}${targetId === photo.id && dragId !== photo.id ? " is-target" : ""}`}
              draggable
              onDragStart={(e) => { setDragId(photo.id); e.dataTransfer.effectAllowed = "move"; }}
              onDragOver={(e) => { if (dragId) { e.preventDefault(); setTargetId(photo.id); } }}
              onDragEnd={() => { setDragId(null); setTargetId(null); }}
              onDrop={(e) => {
                e.preventDefault();
                if (dragId) move(photos.findIndex((p) => p.id === dragId), i);
                setDragId(null); setTargetId(null);
              }}
            >
              <div className="adm-photo__img">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={photo.url} alt={photo.alt} loading="lazy" />
                <button
                  className={`adm-btn adm-btn--sm adm-photo__star`}
                  style={{ background: "rgba(7,7,7,.75)", color: photo.featured ? "var(--red-hot)" : "var(--white)" }}
                  onClick={() => toggleFeatured(photo)}
                  aria-pressed={photo.featured}
                  title={photo.featured ? "Tirar dos destaques da home" : "Mostrar na home"}
                >
                  <IconStar filled={photo.featured} />
                </button>
              </div>
              <div className="adm-photo__body">
                <select
                  aria-label="Categoria"
                  value={photo.category}
                  onChange={(e) => {
                    const category = e.target.value as PhotoCategory;
                    patch(photo.id, { category });
                    run(() => updatePhoto(photo.id, { category }));
                  }}
                >
                  {CATS.map((c) => <option key={c} value={c}>{PHOTO_CATEGORY_LABEL[c]}</option>)}
                </select>
                <div className="adm-photo__row">
                  <button className="adm-btn adm-btn--sm" onClick={() => move(i, i - 1)} disabled={i === 0} aria-label="Mover para trás"><ArrowLeft /></button>
                  <button className="adm-btn adm-btn--sm" onClick={() => move(i, i + 1)} disabled={i === photos.length - 1} aria-label="Mover para frente"><ArrowRight /></button>
                  <button className="adm-btn adm-btn--sm adm-btn--danger" onClick={() => remove(photo)}>Excluir</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
