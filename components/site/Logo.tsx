import Link from "next/link";

export function Logo() {
  return (
    <Link href="/" className="logo" aria-label="DJ Feh Moura, página inicial">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/img/logo.png" alt="DJ Feh Moura, open format DJ e party planner" width={381} height={65} className="logo__img" />
    </Link>
  );
}
