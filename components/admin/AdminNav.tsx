"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { IconCalendar, IconGear, IconHome, IconImage, IconInbox } from "../icons";

const ITEMS = [
  { href: "/admin", label: "Início", short: "Início", Icon: IconHome },
  { href: "/admin/agenda", label: "Agenda", short: "Agenda", Icon: IconCalendar },
  { href: "/admin/galeria", label: "Galeria", short: "Fotos", Icon: IconImage },
  { href: "/admin/pedidos", label: "Pedidos", short: "Pedidos", Icon: IconInbox },
  { href: "/admin/configuracoes", label: "Configurações", short: "Ajustes", Icon: IconGear },
];

export function AdminNav({ newLeads, variant }: { newLeads: number; variant: "side" | "tabbar" }) {
  const pathname = usePathname();
  const active = (href: string) => (href === "/admin" ? pathname === "/admin" : pathname.startsWith(href));

  if (variant === "tabbar") {
    return (
      <nav className="adm-tabbar" aria-label="Painel">
        {ITEMS.map(({ href, short, Icon }) => (
          <Link key={href} href={href} aria-current={active(href) ? "page" : undefined}>
            <Icon />
            {short}
            {href === "/admin/pedidos" && newLeads > 0 && <span className="adm-badge">{newLeads}</span>}
          </Link>
        ))}
      </nav>
    );
  }

  return (
    <nav className="adm-nav" aria-label="Painel">
      {ITEMS.map(({ href, label }) => (
        <Link key={href} href={href} aria-current={active(href) ? "page" : undefined}>
          {label}
          {href === "/admin/pedidos" && newLeads > 0 && <span className="adm-badge">{newLeads}</span>}
        </Link>
      ))}
    </nav>
  );
}
