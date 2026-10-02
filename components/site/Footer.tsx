import Link from "next/link";
import type { Settings } from "@/lib/types";
import { MistWhen } from "./MistWhen";
import { Socials } from "./Socials";

export function Footer({ settings }: { settings: Settings }) {
  return (
    <footer className="footer">
      <MistWhen query="(min-width: 0px)" className="footer__mist" speed={0.6} opacity={0.8} />
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
