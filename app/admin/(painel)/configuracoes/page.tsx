import { PasswordForm, SettingsForm } from "@/components/admin/SettingsForms";
import { createClient } from "@/lib/supabase/server";
import type { Settings } from "@/lib/types";

export const metadata = { title: "Configurações" };

export default async function ConfigAdmin() {
  const supabase = await createClient();
  const { data } = await supabase.from("settings").select("*").eq("id", 1).maybeSingle();
  return (
    <>
      <div className="adm-head">
        <div>
          <span className="eyebrow">Configurações</span>
          <h1>Ajustes do site</h1>
          <p>Links, contatos e o texto da página Sobre. Ao salvar, o site é atualizado na hora.</p>
        </div>
      </div>
      <div style={{ display: "grid", gap: 16 }}>
        <SettingsForm settings={(data ?? {}) as Settings} />
        <PasswordForm />
      </div>
    </>
  );
}
