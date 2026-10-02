"use client";

import { useActionState, useState } from "react";
import { requestPasswordReset, signIn, type ActionResult } from "@/lib/actions/admin";

export function LoginForm() {
  const [mode, setMode] = useState<"login" | "reset">("login");
  const [loginState, loginAction, loggingIn] = useActionState<ActionResult, FormData>(signIn, { ok: false });
  const [resetState, resetAction, resetting] = useActionState<ActionResult, FormData>(requestPasswordReset, { ok: false });

  if (mode === "reset") {
    return (
      <>
        <h1>Nova senha</h1>
        <form action={resetAction} className="adm-form">
          <div className="adm-field">
            <label htmlFor="r-email">Seu e-mail de acesso</label>
            <input id="r-email" name="email" type="email" required autoComplete="email" />
          </div>
          {resetState.error && <p className="adm-msg adm-msg--err">{resetState.error}</p>}
          {resetState.ok && <p className="adm-msg adm-msg--ok">{resetState.message}</p>}
          <button className="adm-btn adm-btn--primary" disabled={resetting}>{resetting ? "Enviando" : "Enviar link"}</button>
        </form>
        <button className="adm-login__alt" onClick={() => setMode("login")}>Voltar para o login</button>
      </>
    );
  }

  return (
    <>
      <h1>Painel</h1>
      <form action={loginAction} className="adm-form">
        <div className="adm-field">
          <label htmlFor="l-email">E-mail</label>
          <input id="l-email" name="email" type="email" required autoComplete="email" />
        </div>
        <div className="adm-field">
          <label htmlFor="l-pass">Senha</label>
          <input id="l-pass" name="password" type="password" required autoComplete="current-password" />
        </div>
        {loginState.error && <p className="adm-msg adm-msg--err">{loginState.error}</p>}
        <button className="adm-btn adm-btn--primary" disabled={loggingIn}>{loggingIn ? "Entrando" : "Entrar"}</button>
      </form>
      <button className="adm-login__alt" onClick={() => setMode("reset")}>Esqueci minha senha</button>
    </>
  );
}
