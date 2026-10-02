"use client";

import { useActionState, useRef, useState } from "react";
import { changePassword, saveSettings, type ActionResult } from "@/lib/actions/admin";
import { createClient } from "@/lib/supabase/client";
import type { Settings } from "@/lib/types";

function Msg({ s }: { s: ActionResult }) {
  if (s.error) return <p className="adm-msg adm-msg--err full">{s.error}</p>;
  if (s.ok && s.message) return <p className="adm-msg adm-msg--ok full">{s.message}</p>;
  return null;
}

export function SettingsForm({ settings }: { settings: Partial<Settings> }) {
  const [state, action, pending] = useActionState<ActionResult, FormData>(saveSettings, { ok: false });
  const [presskit, setPresskit] = useState(settings.presskit_url ?? "");
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  async function uploadPresskit(file: File) {
    if (file.type !== "application/pdf") return alert("Envie um arquivo em PDF.");
    if (file.size > 20 * 1024 * 1024) return alert("O PDF precisa ter até 20 MB.");
    setUploading(true);
    const supabase = createClient();
    const path = `presskit/press-kit-dj-feh-moura-${Date.now()}.pdf`;
    const { error } = await supabase.storage.from("galeria").upload(path, file, { contentType: "application/pdf" });
    setUploading(false);
    if (error) return alert("Não foi possível enviar o PDF. Tente de novo.");
    setPresskit(supabase.storage.from("galeria").getPublicUrl(path).data.publicUrl);
  }

  return (
    <form action={action} className="adm-card">
      <h2>Contatos e redes</h2>
      <div className="adm-form">
        <div className="adm-field">
          <label htmlFor="s-wa">WhatsApp</label>
          <input id="s-wa" name="whatsapp" inputMode="tel" placeholder="5581999999999" defaultValue={settings.whatsapp ?? ""} />
          <small>Com 55 e DDD, só números.</small>
        </div>
        <div className="adm-field">
          <label htmlFor="s-email">E-mail para contato</label>
          <input id="s-email" name="email" type="email" placeholder="contato@..." defaultValue={settings.email ?? ""} />
          <small>Deixe vazio para não mostrar no site.</small>
        </div>
        <div className="adm-field">
          <label htmlFor="s-ig">Instagram</label>
          <input id="s-ig" name="instagram" type="url" placeholder="https://www.instagram.com/..." defaultValue={settings.instagram ?? ""} />
        </div>
        <div className="adm-field">
          <label htmlFor="s-sp">Spotify</label>
          <input id="s-sp" name="spotify" type="url" placeholder="https://open.spotify.com/..." defaultValue={settings.spotify ?? ""} />
          <small>Link de perfil ou playlist. Vira um player na página Sobre.</small>
        </div>
        <div className="adm-field">
          <label htmlFor="s-yt">YouTube</label>
          <input id="s-yt" name="youtube" type="url" placeholder="https://www.youtube.com/@..." defaultValue={settings.youtube ?? ""} />
        </div>
        <div className="adm-field">
          <label htmlFor="s-sc">SoundCloud</label>
          <input id="s-sc" name="soundcloud" type="url" placeholder="https://soundcloud.com/..." defaultValue={settings.soundcloud ?? ""} />
        </div>

        <div className="adm-field full">
          <label htmlFor="s-bio">Texto da página Sobre</label>
          <textarea id="s-bio" name="bio" rows={7} placeholder="Deixe vazio para usar o texto padrão. Cada parágrafo em uma linha." defaultValue={settings.bio ?? ""} />
          <small>O primeiro parágrafo também aparece na home.</small>
        </div>

        <div className="adm-field full">
          <label>Press kit em PDF</label>
          <input type="hidden" name="presskit_url" value={presskit} />
          <div className="adm-actions" style={{ alignItems: "center" }}>
            <button type="button" className="adm-btn adm-btn--sm" onClick={() => fileRef.current?.click()} disabled={uploading}>
              {uploading ? "Enviando" : presskit ? "Trocar PDF" : "Enviar PDF"}
            </button>
            {presskit && (
              <>
                <a href={presskit} target="_blank" rel="noopener noreferrer" className="adm-btn adm-btn--sm">Ver atual</a>
                <button type="button" className="adm-btn adm-btn--sm adm-btn--danger" onClick={() => setPresskit("")}>Remover</button>
              </>
            )}
          </div>
          <small>Aparece como botão &quot;Baixar press kit&quot; na página Contato. Clique em salvar depois de enviar.</small>
          <input ref={fileRef} type="file" accept="application/pdf" hidden onChange={(e) => e.target.files?.[0] && uploadPresskit(e.target.files[0])} />
        </div>

        <Msg s={state} />
        <div className="adm-form__foot full">
          <button className="adm-btn adm-btn--primary" disabled={pending || uploading}>{pending ? "Salvando" : "Salvar alterações"}</button>
        </div>
      </div>
    </form>
  );
}

export function PasswordForm() {
  const [state, action, pending] = useActionState<ActionResult, FormData>(changePassword, { ok: false });
  return (
    <form action={action} className="adm-card" id="senha">
      <h2>Trocar senha</h2>
      <div className="adm-form">
        <div className="adm-field">
          <label htmlFor="p-new">Nova senha</label>
          <input id="p-new" name="password" type="password" minLength={8} required autoComplete="new-password" />
        </div>
        <div className="adm-field">
          <label htmlFor="p-conf">Repita a nova senha</label>
          <input id="p-conf" name="confirm" type="password" minLength={8} required autoComplete="new-password" />
        </div>
        <Msg s={state} />
        <div className="adm-form__foot full">
          <button className="adm-btn" disabled={pending}>{pending ? "Salvando" : "Trocar senha"}</button>
        </div>
      </div>
    </form>
  );
}
