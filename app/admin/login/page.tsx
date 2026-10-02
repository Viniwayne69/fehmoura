import type { Metadata } from "next";
import { LoginForm } from "@/components/admin/LoginForm";
import { Logo } from "@/components/site/Logo";
import { isSupabaseConfigured } from "@/lib/supabase/env";

export const metadata: Metadata = { title: "Entrar" };

export default function LoginPage() {
  return (
    <main className="adm-login">
      <div className="adm-login__box">
        <Logo />
        <LoginForm />
        {!isSupabaseConfigured && (
          <p className="adm-demo">
            O painel ainda não está conectado ao banco de dados. Siga o passo a passo do arquivo LEIA-ME.md para ativar o login.
          </p>
        )}
      </div>
    </main>
  );
}
