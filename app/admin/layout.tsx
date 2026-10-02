import type { Metadata } from "next";
import "./admin.css";

export const metadata: Metadata = {
  title: { default: "Painel", template: "%s | Painel DJ Feh Moura" },
  robots: { index: false, follow: false },
};

export default function AdminRoot({ children }: { children: React.ReactNode }) {
  return children;
}
