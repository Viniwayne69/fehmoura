import type { SVGProps } from "react";

type P = SVGProps<SVGSVGElement>;
const base = { fill: "none", stroke: "currentColor", strokeWidth: 1.4, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": true } as const;

export const ArrowRight = (p: P) => (
  <svg viewBox="0 0 24 24" {...base} {...p}><path d="M4 12h15M13 6l6 6-6 6" /></svg>
);
export const ArrowLeft = (p: P) => (
  <svg viewBox="0 0 24 24" {...base} {...p}><path d="M20 12H5M11 6l-6 6 6 6" /></svg>
);
export const ArrowDown = (p: P) => (
  <svg viewBox="0 0 24 24" {...base} {...p}><path d="M12 4v15M6 13l6 6 6-6" /></svg>
);
export const Close = (p: P) => (
  <svg viewBox="0 0 24 24" {...base} {...p}><path d="M5 5l14 14M19 5L5 19" /></svg>
);
export const Instagram = (p: P) => (
  <svg viewBox="0 0 24 24" {...base} strokeWidth={1.6} {...p}>
    <rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4.2" /><circle cx="17.4" cy="6.6" r=".9" fill="currentColor" stroke="none" />
  </svg>
);
export const Youtube = (p: P) => (
  <svg viewBox="0 0 24 24" aria-hidden {...p}>
    <path fill="currentColor" d="M22.5 7.2a2.8 2.8 0 0 0-2-2C18.8 4.7 12 4.7 12 4.7s-6.8 0-8.5.5a2.8 2.8 0 0 0-2 2A29 29 0 0 0 1 12a29 29 0 0 0 .5 4.8 2.8 2.8 0 0 0 2 2c1.7.5 8.5.5 8.5.5s6.8 0 8.5-.5a2.8 2.8 0 0 0 2-2A29 29 0 0 0 23 12a29 29 0 0 0-.5-4.8ZM9.8 15.1V8.9l5.6 3.1-5.6 3.1Z" />
  </svg>
);
export const Spotify = (p: P) => (
  <svg viewBox="0 0 24 24" aria-hidden {...p}>
    <path fill="currentColor" d="M12 1.5a10.5 10.5 0 1 0 0 21 10.5 10.5 0 0 0 0-21Zm4.8 15.2a.7.7 0 0 1-.9.2c-2.5-1.5-5.6-1.9-9.3-1a.7.7 0 1 1-.3-1.3c4-.9 7.5-.5 10.3 1.2.3.2.4.6.2.9Zm1.3-2.9a.9.9 0 0 1-1.2.3c-2.8-1.7-7.2-2.3-10.5-1.3a.9.9 0 1 1-.5-1.7c3.8-1.1 8.6-.6 11.9 1.5.4.2.5.8.3 1.2Zm.1-3c-3.4-2-9-2.2-12.2-1.2a1 1 0 1 1-.6-2c3.7-1.1 9.9-.9 13.8 1.4a1 1 0 0 1-1 1.8Z" />
  </svg>
);
export const Whatsapp = (p: P) => (
  <svg viewBox="0 0 24 24" aria-hidden {...p}>
    <path fill="currentColor" d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2c-1.6 0-3.1-.4-4.4-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.3-.4.7-1.4.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 2.9 2.9 0 0 0-.9 2.2 5 5 0 0 0 1.1 2.7 11.4 11.4 0 0 0 4.4 3.9c1.6.7 2.3.8 3.1.6.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2-.1-.1-.3-.2-.6-.3Z" />
  </svg>
);
export const Mail = (p: P) => (
  <svg viewBox="0 0 24 24" {...base} {...p}><rect x="3" y="5" width="18" height="14" rx="1.5" /><path d="m3.5 6 8.5 7 8.5-7" /></svg>
);
export const Download = (p: P) => (
  <svg viewBox="0 0 24 24" {...base} {...p}><path d="M12 4v11M7 10l5 5 5-5M5 20h14" /></svg>
);
export const Spark = (p: P) => (
  <svg viewBox="0 0 24 24" aria-hidden {...p}><path fill="currentColor" d="M12 0c.4 6.6 5.4 11.6 12 12-6.6.4-11.6 5.4-12 12-.4-6.6-5.4-11.6-12-12C6.6 11.6 11.6 6.6 12 0Z" /></svg>
);

/* Ícones dos serviços */
export const IconWave = (p: P) => (
  <svg viewBox="0 0 32 32" {...base} {...p}><path d="M4 13v6M8 10v12M12 6v20M16 11v10M20 4v24M24 9v14M28 13v6" /></svg>
);
export const IconGlass = (p: P) => (
  <svg viewBox="0 0 32 32" {...base} {...p}><path d="M7 5h18l-9 12zM16 17v10M10 27h12M9.5 8.5h13" /></svg>
);
export const IconHeadphones = (p: P) => (
  <svg viewBox="0 0 32 32" {...base} {...p}><path d="M5 20v-4a11 11 0 0 1 22 0v4" /><rect x="4" y="18" width="6" height="9" rx="2" /><rect x="22" y="18" width="6" height="9" rx="2" /></svg>
);
export const IconSpark = (p: P) => (
  <svg viewBox="0 0 32 32" {...base} {...p}><path d="M16 3v26M3 16h26M6.8 6.8l18.4 18.4M25.2 6.8 6.8 25.2" /></svg>
);

export const serviceIcons = { wave: IconWave, glass: IconGlass, headphones: IconHeadphones, spark: IconSpark };

/* Ícones do painel */
export const IconHome = (p: P) => (
  <svg viewBox="0 0 24 24" {...base} {...p}><path d="M4 11 12 4l8 7v9h-5v-6H9v6H4z" /></svg>
);
export const IconCalendar = (p: P) => (
  <svg viewBox="0 0 24 24" {...base} {...p}><rect x="3.5" y="5" width="17" height="15" rx="1" /><path d="M3.5 10h17M8 3v4M16 3v4" /></svg>
);
export const IconImage = (p: P) => (
  <svg viewBox="0 0 24 24" {...base} {...p}><rect x="3.5" y="4.5" width="17" height="15" rx="1" /><circle cx="9" cy="10" r="1.6" /><path d="m4 17 5-4.5 4 3.5 3-2.5 4 3.5" /></svg>
);
export const IconInbox = (p: P) => (
  <svg viewBox="0 0 24 24" {...base} {...p}><path d="M3.5 13.5 6 5h12l2.5 8.5V19h-17z" /><path d="M3.5 13.5H9l1 2h4l1-2h5.5" /></svg>
);
export const IconGear = (p: P) => (
  <svg viewBox="0 0 24 24" {...base} {...p}><circle cx="12" cy="12" r="3" /><path d="M12 2.5v3M12 18.5v3M2.5 12h3M18.5 12h3M5.3 5.3l2.1 2.1M16.6 16.6l2.1 2.1M5.3 18.7l2.1-2.1M16.6 7.4l2.1-2.1" /></svg>
);
export const IconUpload = (p: P) => (
  <svg viewBox="0 0 24 24" {...base} {...p}><path d="M12 16V4M7 9l5-5 5 5M4 20h16" /></svg>
);
export const IconStar = ({ filled, ...p }: P & { filled?: boolean }) => (
  <svg viewBox="0 0 24 24" {...base} fill={filled ? "currentColor" : "none"} {...p}><path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z" /></svg>
);

/* Som do vídeo */
export const SoundOn = (p: P) => (
  <svg viewBox="0 0 24 24" {...base} {...p}><path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z" /><path d="M15.5 9a4 4 0 0 1 0 6M18 6.5a7.5 7.5 0 0 1 0 11" /></svg>
);
export const SoundOff = (p: P) => (
  <svg viewBox="0 0 24 24" {...base} {...p}><path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z" /><path d="m16 9.5 5 5M21 9.5l-5 5" /></svg>
);
