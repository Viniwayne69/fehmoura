"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { Logo } from "@/components/site/Logo";
import { useCrm } from "./CrmProvider";
import { CCalendar, CCheck, CChart, CDeals, CHome, CUsers, CWallet } from "./icons";

const ITEMS = [
  { href: "/crm", label: "Início", Icon: CHome },
  { href: "/crm/negocios", label: "Negócios", Icon: CDeals },
  { href: "/crm/contatos", label: "Contatos", Icon: CUsers },
  { href: "/crm/calendario", label: "Calendário", Icon: CCalendar },
  { href: "/crm/tarefas", label: "Tarefas", Icon: CCheck },
  { href: "/crm/financeiro", label: "Financeiro", Icon: CWallet },
  { href: "/crm/metricas", label: "Métricas", Icon: CChart },
];

export function CrmShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { deals, tasks, today } = useCrm();
  const active = (href: string) => (href === "/crm" ? pathname === "/crm" : pathname.startsWith(href));
  const newLeads = deals.filter((d) => d.stage === "novo").length;
  const lateTasks = tasks.filter((t) => !t.done && t.due <= today).length;
  const badge = (href: string) => (href.endsWith("/negocios") ? newLeads : href.endsWith("/tarefas") ? lateTasks : 0);

  return (
    <div className="adm crm">
      <aside className="adm-side">
        <Logo />
        <nav className="adm-nav" aria-label="CRM">
          {ITEMS.map(({ href, label }) => (
            <Link key={href} href={href} aria-current={active(href) ? "page" : undefined}>
              {label}
              {badge(href) > 0 && <span className="adm-badge">{badge(href)}</span>}
            </Link>
          ))}
        </nav>
        <div className="adm-side__foot">
          <span>Modo demonstração</span>
          <a href="/" target="_blank" rel="noopener noreferrer">Ver o site ↗</a>
        </div>
      </aside>

      <div className="adm-topbar">
        <Logo />
        <a href="/" style={{ color: "var(--muted)", fontSize: 12 }}>Ver o site ↗</a>
      </div>

      <main className="adm-main">
        <div className="crm-demo" role="note">
          <b>Modo demonstração.</b> Os dados abaixo são fictícios e nada é salvo. Mexa à vontade para ver como o CRM funciona.
        </div>
        {children}
      </main>

      <nav className="crm-tabbar" aria-label="CRM">
        {ITEMS.map(({ href, label, Icon }) => (
          <Link key={href} href={href} aria-current={active(href) ? "page" : undefined}>
            <Icon />
            {label}
            {badge(href) > 0 && <span className="adm-badge">{badge(href)}</span>}
          </Link>
        ))}
      </nav>
    </div>
  );
}
