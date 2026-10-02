import { redirect } from "next/navigation";
import { AdminNav } from "@/components/admin/AdminNav";
import { Logo } from "@/components/site/Logo";
import { signOut } from "@/lib/actions/admin";
import { createClient } from "@/lib/supabase/server";
import { isAdminEmail, isSupabaseConfigured } from "@/lib/supabase/env";

export const dynamic = "force-dynamic";

export default async function PainelLayout({ children }: { children: React.ReactNode }) {
  if (!isSupabaseConfigured) redirect("/admin/login");
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || !isAdminEmail(user.email)) redirect("/admin/login");

  const { count } = await supabase.from("leads").select("id", { count: "exact", head: true }).eq("status", "novo");
  const newLeads = count ?? 0;

  return (
    <div className="adm">
      <aside className="adm-side">
        <Logo />
        <AdminNav newLeads={newLeads} variant="side" />
        <div className="adm-side__foot">
          <span>{user.email}</span>
          <a href="/" target="_blank" rel="noopener noreferrer">Ver o site ↗</a>
          <form action={signOut}><button type="submit">Sair</button></form>
        </div>
      </aside>

      <div className="adm-topbar">
        <Logo />
        <form action={signOut}><button type="submit">Sair</button></form>
      </div>

      <main className="adm-main">{children}</main>
      <AdminNav newLeads={newLeads} variant="tabbar" />
    </div>
  );
}
