import Link from "next/link";
import type { Settings } from "@/lib/types";
import { Socials } from "./Socials";

export function Footer({ settings }: { settings: Settings }) {
  return (
    <footer className="footer">
      <div className="wrap">
        <div className="footer__top">
          <span className="footer__name">DJ Feh Moura</span>
          <p className="footer__motto" aria-label="Som, energia e conexão">
            Som<i aria-hidden>/</i>Energia<i aria-hidden>/</i>Conexão
          </p>
          <Socials settings={settings} />
        </div>
        <div className="footer__bottom">
          <span>© {new Date().getFullYear()} DJ Feh Moura. Todos os direitos reservados.</span>
          <Link href="/contato">Contratação e imprensa</Link>
        </div>
      </div>
    </footer>
  );
}
