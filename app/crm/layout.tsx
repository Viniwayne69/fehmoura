import type { Metadata } from "next";
import "../admin/admin.css";
import "./crm.css";
import { CrmProvider } from "@/components/crm/CrmProvider";
import { CrmShell } from "@/components/crm/CrmShell";

export const metadata: Metadata = {
  title: { default: "CRM", template: "%s | CRM DJ Feh Moura" },
  robots: { index: false, follow: false },
};

export default function CrmLayout({ children }: { children: React.ReactNode }) {
  return (
    <CrmProvider>
      <CrmShell>{children}</CrmShell>
    </CrmProvider>
  );
}
