"use client";

import { useActionState } from "react";
import { sendContact, type ContactState } from "@/lib/actions/contact";
import { EVENT_TYPES } from "@/lib/constants";
import { ArrowRight } from "../icons";

type Props = { compact?: boolean; defaultType?: string };

export function ContactForm({ compact = false, defaultType }: Props) {
  const [state, action, pending] = useActionState<ContactState, FormData>(sendContact, { ok: false });
  const f = state.fields ?? {};

  if (state.ok) {
    return (
      <div className="form-success" role="status">
        <h3>Mensagem enviada</h3>
        <p>Obrigada pelo contato! A Feh vai responder em breve pelo e-mail ou WhatsApp que você deixou.</p>
      </div>
    );
  }

  return (
    <form action={action} className={`form${compact ? "" : " form--2"}`} noValidate>
      <div className="hp" aria-hidden>
        <label>Site<input name="website" tabIndex={-1} autoComplete="off" /></label>
      </div>

      <div className="field">
        <label htmlFor="c-name">Nome</label>
        <input id="c-name" name="name" required autoComplete="name" autoCapitalize="words" defaultValue={f.name} />
      </div>
      <div className="field">
        <label htmlFor="c-email">E-mail</label>
        <input id="c-email" name="email" type="email" inputMode="email" required autoComplete="email" autoCapitalize="none" autoCorrect="off" spellCheck={false} defaultValue={f.email} />
      </div>

      {!compact && (
        <>
          <div className="field">
            <label htmlFor="c-phone">WhatsApp</label>
            <input id="c-phone" name="phone" type="tel" inputMode="tel" autoComplete="tel" placeholder="(00) 00000-0000" defaultValue={f.phone} />
          </div>
          <div className="field">
            <label htmlFor="c-type">Tipo de evento</label>
            <select id="c-type" name="event_type" defaultValue={f.event_type || defaultType || ""}>
              <option value="">Selecione</option>
              {EVENT_TYPES.map((t) => <option key={t}>{t}</option>)}
            </select>
          </div>
          <div className="field">
            <label htmlFor="c-date">Data do evento</label>
            <input id="c-date" name="event_date" type="date" defaultValue={f.event_date} />
          </div>
          <div className="field">
            <label htmlFor="c-city">Cidade</label>
            <input id="c-city" name="city" autoComplete="address-level2" autoCapitalize="words" defaultValue={f.city} />
          </div>
        </>
      )}

      <div className="field full">
        <label htmlFor="c-msg">Mensagem</label>
        <textarea id="c-msg" name="message" autoCapitalize="sentences" rows={compact ? 3 : 5} defaultValue={f.message} />
      </div>

      <div className="full form__actions" style={{ justifyContent: "space-between", alignItems: "center", gap: 16 }}>
        <p className="form-error" role="alert">{state.error}</p>
        <button className="btn btn--solid" type="submit" disabled={pending}>
          {pending ? "Enviando" : "Enviar"} <ArrowRight />
        </button>
      </div>
    </form>
  );
}
