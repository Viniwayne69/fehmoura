"use client";

import { useEffect, useRef, type ElementType, type ReactNode } from "react";

type Props = { as?: ElementType; delay?: 1 | 2 | 3 | 4; className?: string; children: ReactNode; [key: string]: unknown };

/** Faz o conteúdo surgir suavemente quando entra na tela. */
export function Reveal({ as: Tag = "div", delay, className = "", children, ...rest }: Props) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("is-in");
          io.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <Tag ref={ref} className={`reveal ${className}`.trim()} data-delay={delay} {...rest}>
      {children}
    </Tag>
  );
}
