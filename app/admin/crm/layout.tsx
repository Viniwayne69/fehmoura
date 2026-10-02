import type { Metadata } from "next";
import "./crm.css";
import { CrmProvider } from "@/components/crm/CrmProvider";
import { CrmShell } from "@/components/crm/CrmShell";

export const metadata: Metadata = { title: "CRM" };

export default function CrmLayout({ children }: { children: React.ReactNode }) {
  return (
    <CrmProvider>
      <CrmShell>{children}</CrmShell>
    </CrmProvider>
  );
}
