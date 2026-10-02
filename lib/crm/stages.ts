import type { StageId } from "./types";

export const STAGES: { id: StageId; label: string; hint: string }[] = [
  { id: "novo", label: "Cliente novo", hint: "Chegou pelo formulário e ainda não foi respondido" },
  { id: "conversa", label: "Em conversa", hint: "Alinhando detalhes do evento" },
  { id: "orcamento", label: "Orçamento enviado", hint: "Valor passado ao cliente" },
  { id: "reservada", label: "Data reservada", hint: "Aceitou e pagou o sinal. A data está bloqueada" },
  { id: "realizado", label: "Evento realizado", hint: "Falta só fechar o financeiro" },
  { id: "perdido", label: "Perdido", hint: "Não fechou. Registrar o motivo" },
];

export const STAGE_LABEL = Object.fromEntries(STAGES.map((s) => [s.id, s.label])) as Record<StageId, string>;

export const EVENT_TYPES_CRM = ["Aniversário", "Casamento", "Formatura", "Festa particular", "Evento no bar ou clube", "Outro"];
export const LOST_REASONS = ["Preço acima do orçamento", "Data ocupada", "Escolheu outro profissional", "Cliente sumiu", "Evento cancelado", "Outro motivo"];
