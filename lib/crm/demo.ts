import { addDays, todayISO } from "./date";
import type { Contact, Deal, Payment, Task } from "./types";

/**
 * Dados FICTÍCIOS só para visualizar o CRM antes de ligar o banco.
 * Nomes, telefones e valores não são de pessoas reais.
 */
const T = todayISO();
const d = (n: number) => addDays(T, n);

export const demoContacts: Contact[] = [
  { id: "c1", name: "Mariana Alves", email: "mariana.alves@exemplo.com", phone: "5581999990001", city: "Recife", origin: "Site" },
  { id: "c2", name: "Rafael Costa", email: "rafael.costa@exemplo.com", phone: "5581999990002", city: "Olinda", origin: "Site" },
  { id: "c3", name: "Camila Souza", email: "camila.souza@exemplo.com", phone: "5581999990003", city: "Recife", origin: "Instagram" },
  { id: "c4", name: "Bruno Lima", email: "bruno.lima@exemplo.com", phone: "5581999990004", city: "Jaboatão dos Guararapes", origin: "Indicação" },
  { id: "c5", name: "Juliana Martins", email: "juliana.martins@exemplo.com", phone: "5581999990005", city: "Recife", origin: "Site" },
  { id: "c6", name: "Eduardo Pires", email: "eduardo.pires@exemplo.com", phone: "5581999990006", city: "Paulista", origin: "Instagram" },
  { id: "c7", name: "Patrícia Gomes", email: "patricia.gomes@exemplo.com", phone: "5581999990007", city: "Recife", origin: "Indicação" },
  { id: "c8", name: "Thiago Ramos", email: "thiago.ramos@exemplo.com", phone: "5581999990008", city: "Olinda", origin: "Site" },
  { id: "c9", name: "Larissa Prado", email: "larissa.prado@exemplo.com", phone: "5581999990009", city: "Recife", origin: "Site" },
  { id: "c10", name: "Bar Vinil (exemplo)", email: "contato@barvinil.exemplo.com", phone: "5581999990010", city: "Recife", origin: "Outro" },
  { id: "c11", name: "Fernanda Rocha", email: "fernanda.rocha@exemplo.com", phone: "5581999990011", city: "Recife", origin: "Indicação" },
  { id: "c12", name: "Diego Santos", email: "diego.santos@exemplo.com", phone: "5581999990012", city: "Camaragibe", origin: "Instagram" },
  { id: "c13", name: "Carlos Neves", email: "carlos.neves@exemplo.com", phone: "5581999990013", city: "Recife", origin: "Site" },
];

export const demoDeals: Deal[] = [
  {
    id: "d1", contactId: "c1", stage: "novo", eventType: "Aniversário", eventDate: d(21), startTime: "21:00", hours: 5,
    venue: "Salão de festas (a definir)", city: "Recife", guests: 80, value: 0, isPublic: false, origin: "Site",
    message: "Oi Feh! Quero fazer meu aniversário de 30 anos com pista de dança. Pode me passar valores?",
    lostReason: null, createdAt: T, history: [{ at: T, text: "Pedido recebido pelo formulário do site" }],
  },
  {
    id: "d2", contactId: "c2", stage: "novo", eventType: "Casamento", eventDate: d(90), startTime: "20:00", hours: 6,
    venue: "Espaço Jardim", city: "Olinda", guests: 150, value: 0, isPublic: false, origin: "Site",
    message: "Estamos procurando DJ para a festa do nosso casamento. Queremos funk, pop e house.",
    lostReason: null, createdAt: d(-1), history: [{ at: d(-1), text: "Pedido recebido pelo formulário do site" }],
  },
  {
    id: "d3", contactId: "c3", stage: "conversa", eventType: "Formatura", eventDate: d(35), startTime: "22:00", hours: 5,
    venue: "Clube Social", city: "Recife", guests: 200, value: 0, isPublic: false, origin: "Instagram",
    message: "Oi! Vi seu trabalho no Instagram, vocês fazem formatura?",
    lostReason: null, createdAt: d(-3),
    history: [
      { at: d(-3), text: "Contato criado pelo Instagram" },
      { at: d(-2), text: "Respondeu no WhatsApp e pediu proposta" },
    ],
  },
  {
    id: "d4", contactId: "c4", stage: "conversa", eventType: "Aniversário", eventDate: d(28), startTime: "20:00", hours: 4,
    venue: "Casa do cliente", city: "Jaboatão dos Guararapes", guests: 60, value: 0, isPublic: false, origin: "Indicação",
    message: "A Patrícia me indicou você. Quero um som animado para os 40 anos.",
    lostReason: null, createdAt: d(-5), history: [{ at: d(-5), text: "Indicação recebida" }, { at: d(-4), text: "Conversa iniciada no WhatsApp" }],
  },
  {
    id: "d5", contactId: "c5", stage: "orcamento", eventType: "Casamento", eventDate: d(60), startTime: "19:30", hours: 6,
    venue: "Fazenda Santa Luz", city: "Gravatá", guests: 170, value: 4500, isPublic: false, origin: "Site",
    message: "Queremos uma pista cheia do começo ao fim. Funk, pop e música internacional.",
    lostReason: null, createdAt: d(-8),
    history: [{ at: d(-8), text: "Pedido recebido pelo formulário do site" }, { at: d(-6), text: "Orçamento de R$ 4.500 enviado" }],
  },
  {
    id: "d6", contactId: "c6", stage: "orcamento", eventType: "Festa particular", eventDate: d(14), startTime: "21:00", hours: 4,
    venue: "Cobertura do cliente", city: "Paulista", guests: 70, value: 2500, isPublic: false, origin: "Instagram",
    message: "Festa de confraternização com os amigos.",
    lostReason: null, createdAt: d(-4), history: [{ at: d(-4), text: "Contato criado pelo Instagram" }, { at: d(-2), text: "Orçamento de R$ 2.500 enviado" }],
  },
  {
    id: "d7", contactId: "c7", stage: "reservada", eventType: "Casamento", eventDate: d(14), startTime: "19:00", hours: 6,
    venue: "Espaço Mar Azul", city: "Recife", guests: 180, value: 5000, isPublic: false, origin: "Indicação",
    message: "Casamento à noite, com pista de dança liberada depois do jantar.",
    lostReason: null, createdAt: d(-30),
    history: [{ at: d(-30), text: "Pedido recebido" }, { at: d(-24), text: "Orçamento aceito" }, { at: d(-10), text: "Sinal de R$ 2.500 recebido, data reservada" }],
  },
  {
    id: "d8", contactId: "c8", stage: "reservada", eventType: "Aniversário", eventDate: d(7), startTime: "21:00", hours: 5,
    venue: "Salão Brisa", city: "Olinda", guests: 90, value: 2800, isPublic: false, origin: "Site",
    message: "Aniversário de 40 anos, quero muito funk e pop.",
    lostReason: null, createdAt: d(-20),
    history: [{ at: d(-20), text: "Pedido recebido pelo formulário do site" }, { at: d(-12), text: "Sinal de R$ 1.400 recebido, data reservada" }],
  },
  {
    id: "d9", contactId: "c9", stage: "reservada", eventType: "Formatura", eventDate: d(45), startTime: "22:00", hours: 5,
    venue: "Clube Atlântico", city: "Recife", guests: 250, value: 3800, isPublic: false, origin: "Site",
    message: "Baile de formatura da turma.",
    lostReason: null, createdAt: d(-26), history: [{ at: d(-26), text: "Pedido recebido" }, { at: T, text: "Sinal de R$ 1.900 recebido, data reservada" }],
  },
  {
    id: "d10", contactId: "c10", stage: "reservada", eventType: "Evento no bar ou clube", eventDate: d(10), startTime: "22:00", hours: 4,
    venue: "Bar Vinil (exemplo)", city: "Recife", guests: null, value: 1800, isPublic: true, origin: "Outro",
    message: "Noite Open Format aberta ao público.",
    lostReason: null, createdAt: d(-18), history: [{ at: d(-18), text: "Evento criado na Agenda do site" }, { at: d(-17), text: "Data reservada" }],
  },
  {
    id: "d11", contactId: "c11", stage: "realizado", eventType: "Casamento", eventDate: d(-12), startTime: "20:00", hours: 6,
    venue: "Espaço Jardim", city: "Recife", guests: 160, value: 4800, isPublic: false, origin: "Indicação",
    message: "Casamento com pista cheia.",
    lostReason: null, createdAt: d(-60),
    history: [{ at: d(-60), text: "Pedido recebido" }, { at: d(-40), text: "Sinal de R$ 2.400 recebido" }, { at: d(-12), text: "Evento realizado" }],
  },
  {
    id: "d12", contactId: "c12", stage: "realizado", eventType: "Aniversário", eventDate: d(-30), startTime: "21:00", hours: 5,
    venue: "Salão Orla", city: "Camaragibe", guests: 100, value: 2600, isPublic: false, origin: "Instagram",
    message: "Aniversário de 35 anos.",
    lostReason: null, createdAt: d(-55), history: [{ at: d(-55), text: "Contato criado pelo Instagram" }, { at: d(-30), text: "Evento realizado e financeiro quitado" }],
  },
  {
    id: "d13", contactId: "c13", stage: "perdido", eventType: "Formatura", eventDate: d(50), startTime: "22:00", hours: 5,
    venue: "Clube Social", city: "Recife", guests: 220, value: 0, isPublic: false, origin: "Site",
    message: "Queria uma proposta para a formatura.",
    lostReason: "Preço acima do orçamento", createdAt: d(-14),
    history: [{ at: d(-14), text: "Pedido recebido pelo formulário do site" }, { at: d(-7), text: "Marcado como perdido" }],
  },
];

export const demoPayments: Payment[] = [
  { id: "p1", dealId: "d7", kind: "Sinal", amount: 2500, due: d(-10), paidAt: d(-10) },
  { id: "p2", dealId: "d7", kind: "Restante", amount: 2500, due: d(7), paidAt: null },
  { id: "p3", dealId: "d8", kind: "Sinal", amount: 1400, due: d(-12), paidAt: d(-12) },
  { id: "p4", dealId: "d8", kind: "Restante", amount: 1400, due: d(5), paidAt: null },
  { id: "p5", dealId: "d9", kind: "Sinal", amount: 1900, due: T, paidAt: T },
  { id: "p6", dealId: "d9", kind: "Restante", amount: 1900, due: d(40), paidAt: null },
  { id: "p7", dealId: "d10", kind: "Cachê", amount: 1800, due: d(11), paidAt: null },
  { id: "p8", dealId: "d11", kind: "Sinal", amount: 2400, due: d(-40), paidAt: d(-40) },
  { id: "p9", dealId: "d11", kind: "Restante", amount: 2400, due: d(-10), paidAt: null },
  { id: "p10", dealId: "d12", kind: "Sinal", amount: 1300, due: d(-50), paidAt: d(-50) },
  { id: "p11", dealId: "d12", kind: "Restante", amount: 1300, due: d(-30), paidAt: d(-30) },
];

export const demoTasks: Task[] = [
  { id: "t1", title: "Responder Mariana Alves (lead novo)", due: T, done: false, dealId: "d1" },
  { id: "t2", title: "Enviar orçamento para Camila Souza", due: d(1), done: false, dealId: "d3" },
  { id: "t3", title: "Cobrar o restante da Fernanda Rocha", due: d(-2), done: false, dealId: "d11" },
  { id: "t4", title: "Confirmar repertório com Patrícia Gomes", due: d(5), done: false, dealId: "d7" },
  { id: "t5", title: "Combinar passagem de som no Bar Vinil", due: d(8), done: false, dealId: "d10" },
  { id: "t6", title: "Postar as fotos do casamento da Fernanda", due: d(-9), done: true, dealId: "d11" },
];

/** Séries de exemplo dos 5 meses anteriores (o mês atual é calculado com os dados acima). */
export const demoPastMonths = { requests: [4, 6, 5, 8, 7], revenue: [3200, 5400, 4100, 7800, 6200] };
