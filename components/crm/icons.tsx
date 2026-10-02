import type { SVGProps } from "react";

type P = SVGProps<SVGSVGElement>;
const base = { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.5, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": true } as const;

export const CHome = (p: P) => (<svg {...base} {...p}><path d="M4 11l8-7 8 7v9a1 1 0 0 1-1 1h-4v-6H9v6H5a1 1 0 0 1-1-1z" /></svg>);
export const CDeals = (p: P) => (<svg {...base} {...p}><rect x="3" y="4" width="5" height="16" rx="1" /><rect x="10" y="4" width="5" height="10" rx="1" /><rect x="17" y="4" width="4" height="13" rx="1" /></svg>);
export const CUsers = (p: P) => (<svg {...base} {...p}><circle cx="9" cy="8" r="3.5" /><path d="M2.5 20c.6-3.6 3.2-5.5 6.5-5.5s5.9 1.9 6.5 5.5M16 4.8a3.5 3.5 0 0 1 0 6.4M18 14.8c2 .6 3.2 2.3 3.5 5.2" /></svg>);
export const CCalendar = (p: P) => (<svg {...base} {...p}><rect x="3.5" y="5" width="17" height="15" rx="1.5" /><path d="M3.5 10h17M8 3v4M16 3v4" /></svg>);
export const CCheck = (p: P) => (<svg {...base} {...p}><rect x="3.5" y="3.5" width="17" height="17" rx="2" /><path d="M8 12.5l3 3 5-6" /></svg>);
export const CWallet = (p: P) => (<svg {...base} {...p}><path d="M4 7.5A2.5 2.5 0 0 1 6.5 5H19v14H6.5A2.5 2.5 0 0 1 4 16.5z" /><path d="M19 9h-4a2 2 0 0 0 0 4h4" /></svg>);
export const CChart = (p: P) => (<svg {...base} {...p}><path d="M4 20V4M4 20h16M8 16v-5M13 16V8M18 16v-8" /></svg>);
export const CWhats = (p: P) => (<svg {...base} {...p}><path d="M4 20l1.3-4.2A8 8 0 1 1 8.4 18.8z" /><path d="M9 9.5c.3 2 2.5 4.2 4.5 4.5l1.2-1.1-1.8-1-.8.7c-.8-.4-1.6-1.2-2-2l.7-.8-1-1.8z" /></svg>);
export const CClose = (p: P) => (<svg {...base} {...p}><path d="M6 6l12 12M18 6L6 18" /></svg>);
export const CLeft = (p: P) => (<svg {...base} {...p}><path d="M15 5l-7 7 7 7" /></svg>);
export const CRight = (p: P) => (<svg {...base} {...p}><path d="M9 5l7 7-7 7" /></svg>);
export const CDownload = (p: P) => (<svg {...base} {...p}><path d="M12 4v11M7 11l5 5 5-5M5 20h14" /></svg>);
