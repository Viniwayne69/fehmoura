export type StageId = "novo" | "conversa" | "orcamento" | "reservada" | "realizado" | "perdido";

export type Origin = "Site" | "Indicação" | "Instagram" | "Outro";

export type Contact = {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  origin: Origin;
};

export type Payment = {
  id: string;
  dealId: string;
  kind: string;
  amount: number;
  /** vencimento, AAAA-MM-DD */
  due: string;
  /** data do pagamento, AAAA-MM-DD, ou null se ainda não pagou */
  paidAt: string | null;
};

export type HistoryItem = { at: string; text: string };

export type Deal = {
  id: string;
  contactId: string;
  stage: StageId;
  eventType: string;
  /** AAAA-MM-DD */
  eventDate: string;
  startTime: string;
  hours: number;
  venue: string;
  city: string;
  guests: number | null;
  /** valor combinado, em reais (0 enquanto não houver orçamento) */
  value: number;
  /** aparece na agenda pública do site */
  isPublic: boolean;
  origin: Origin;
  message: string;
  lostReason: string | null;
  /** AAAA-MM-DD */
  createdAt: string;
  history: HistoryItem[];
};

export type Task = {
  id: string;
  title: string;
  /** AAAA-MM-DD */
  due: string;
  done: boolean;
  dealId: string | null;
};
