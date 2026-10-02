"use client";

import { useEffect, type ReactNode } from "react";
import { STAGE_LABEL } from "@/lib/crm/stages";
import type { StageId } from "@/lib/crm/types";
import { CClose } from "./icons";

export function PageHead({ eyebrow = "CRM", title, sub, children }: { eyebrow?: string; title: string; sub?: string; children?: ReactNode }) {
  return (
    <div className="adm-head">
      <div>
        <span className="eyebrow">{eyebrow}</span>
        <h1>{title}</h1>
        {sub && <p>{sub}</p>}
      </div>
      {children && <div className="adm-actions">{children}</div>}
    </div>
  );
}

export function Stat({ label, value, sub, hot }: { label: string; value: string; sub?: string; hot?: boolean }) {
  return (
    <div className={`adm-stat${hot ? " adm-stat--hot" : ""}`}>
      <span>{label}</span>
      <strong>{value}</strong>
      {sub && <small>{sub}</small>}
    </div>
  );
}

export function Modal({ title, onClose, children, wide }: { title: string; onClose: () => void; children: ReactNode; wide?: boolean }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  return (
    <div className="adm-modal-bg" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="adm-modal crm-modal" role="dialog" aria-modal="true" aria-label={title} style={wide ? { width: "min(860px, 100%)" } : undefined}>
        <button type="button" className="crm-modal__close" onClick={onClose} aria-label="Fechar"><CClose /></button>
        <h2>{title}</h2>
        {children}
      </div>
    </div>
  );
}

const STAGE_TAG: Record<StageId, string> = {
  novo: "tag tag--red",
  conversa: "tag",
  orcamento: "tag",
  reservada: "tag tag--green",
  realizado: "tag tag--dim",
  perdido: "tag tag--dim",
};

export function StageTag({ stage }: { stage: StageId }) {
  return <span className={STAGE_TAG[stage]}>{STAGE_LABEL[stage]}</span>;
}

export function initials(name: string) {
  return name
    .replace(/\(.*?\)/g, "")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("");
}
