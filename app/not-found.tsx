import Link from "next/link";
import { ArrowRight } from "@/components/icons";

export default function NotFound() {
  return (
    <main className="notfound">
      <div>
        <div className="notfound__code" aria-hidden>404</div>
        <h1 className="title">Essa faixa não está no set</h1>
        <p className="lead">A página que você procurou não existe ou mudou de lugar.</p>
        <Link href="/" className="btn">Voltar para a pista <ArrowRight /></Link>
      </div>
    </main>
  );
}
