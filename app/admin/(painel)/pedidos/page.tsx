import Link from "next/link";
import { LeadCard } from "@/components/admin/LeadCard";
import { LEAD_STATUS_LABEL } from "@/lib/constants";
import { createClient } from "@/lib/supabase/server";
import type { Lead, LeadStatus } from "@/lib/types";

export const metadata = { title: "Pedidos" };

const TABS: (LeadStatus | "todos")[] = ["todos", "novo", "conversa", "fechado", "recusado"];

export default async function PedidosAdmin({ searchParams }: { searchParams: Promise<{ status?: string }> }) {
  const { status } = await searchParams;
  const current = (TABS as string[]).includes(status ?? "") ? (status as LeadStatus | "todos") : "todos";
  const supabase = await createClient();
  let q = supabase.from("leads").select("*").order("created_at", { ascending: false }).limit(200);
  if (current !== "todos") q = q.eq("status", current);
  const { data } = await q;
  const leads = (data ?? []) as Lead[];

  return (
    <>
      <div className="adm-head">
        <div>
          <span className="eyebrow">Pedidos</span>
          <h1>Contratações</h1>
          <p>Tudo o que chega pelo formulário do site. Mude o status para acompanhar cada conversa.</p>
        </div>
      </div>

      <nav className="adm-tabs" aria-label="Filtrar pedidos">
        {TABS.map((t) => (
          <Link key={t} href={t === "todos" ? "/admin/pedidos" : `/admin/pedidos?status=${t}`} aria-current={current === t ? "page" : undefined}>
            {t === "todos" ? "Todos" : LEAD_STATUS_LABEL[t]}
          </Link>
        ))}
      </nav>

      {leads.length === 0 ? (
        <div className="adm-empty"><strong>Nada por aqui</strong>Quando alguém preencher o formulário do site, o pedido aparece nesta lista.</div>
      ) : (
        leads.map((l) => <LeadCard key={l.id} lead={l} />)
      )}
    </>
  );
}
