import Link from "next/link";

export function Logo() {
  return (
    <Link href="/" className="logo" aria-label="DJ Feh Moura, página inicial">
      <span className="logo__dj">DJ</span>
      <span className="logo__name">Feh Moura</span>
    </Link>
  );
}
