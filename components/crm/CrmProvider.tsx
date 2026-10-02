"use client";

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import { demoContacts, demoDeals, demoPayments, demoSiteEvents, demoTasks } from "@/lib/crm/demo";
import { todayISO } from "@/lib/crm/date";
import { STAGE_LABEL } from "@/lib/crm/stages";
import type { Contact, Deal, Payment, SiteEvent, StageId, Task } from "@/lib/crm/types";

type NewDeal = { name: string; phone: string; email: string; eventType: string; eventDate: string; city: string };

export type EventInput = Omit<SiteEvent, "id">;

type Crm = {
  today: string;
  contacts: Contact[];
  deals: Deal[];
  payments: Payment[];
  tasks: Task[];
  siteEvents: SiteEvent[];
  contactOf: (id: string) => Contact | undefined;
  dealOf: (id: string) => Deal | undefined;
  paymentsOf: (dealId: string) => Payment[];
  paidOf: (dealId: string) => number;
  moveDeal: (id: string, stage: StageId) => void;
  setLostReason: (id: string, reason: string) => void;
  togglePaid: (paymentId: string) => void;
  toggleTask: (id: string) => void;
  addTask: (title: string, due: string, dealId: string | null) => void;
  addDeal: (data: NewDeal) => void;
  saveEvent: (data: EventInput, id?: string) => void;
  removeEvent: (id: string) => void;
  toggleEventPublished: (id: string) => void;
};

const Ctx = createContext<Crm | null>(null);

export function useCrm(): Crm {
  const v = useContext(Ctx);
  if (!v) throw new Error("useCrm precisa estar dentro de CrmProvider");
  return v;
}

/** Estado do CRM de demonstração: vive só na memória do navegador, nada é salvo. */
export function CrmProvider({ children }: { children: ReactNode }) {
  const [today] = useState(todayISO);
  const [contacts, setContacts] = useState<Contact[]>(demoContacts);
  const [deals, setDeals] = useState<Deal[]>(demoDeals);
  const [payments, setPayments] = useState<Payment[]>(demoPayments);
  const [tasks, setTasks] = useState<Task[]>(demoTasks);
  const [siteEvents, setSiteEvents] = useState<SiteEvent[]>(demoSiteEvents);

  const contactOf = useCallback((id: string) => contacts.find((c) => c.id === id), [contacts]);
  const dealOf = useCallback((id: string) => deals.find((x) => x.id === id), [deals]);
  const paymentsOf = useCallback((dealId: string) => payments.filter((p) => p.dealId === dealId), [payments]);
  const paidOf = useCallback(
    (dealId: string) => payments.filter((p) => p.dealId === dealId && p.paidAt).reduce((s, p) => s + p.amount, 0),
    [payments],
  );

  const moveDeal = useCallback((id: string, stage: StageId) => {
    setDeals((all) =>
      all.map((x) =>
        x.id === id && x.stage !== stage
          ? {
              ...x,
              stage,
              lostReason: stage === "perdido" ? x.lostReason ?? "Outro motivo" : null,
              history: [...x.history, { at: todayISO(), text: `Movido para "${STAGE_LABEL[stage]}"` }],
            }
          : x,
      ),
    );
  }, []);

  const setLostReason = useCallback((id: string, reason: string) => {
    setDeals((all) => all.map((x) => (x.id === id ? { ...x, lostReason: reason } : x)));
  }, []);

  const togglePaid = useCallback((paymentId: string) => {
    setPayments((all) => all.map((p) => (p.id === paymentId ? { ...p, paidAt: p.paidAt ? null : todayISO() } : p)));
  }, []);

  const toggleTask = useCallback((id: string) => {
    setTasks((all) => all.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
  }, []);

  const addTask = useCallback((title: string, due: string, dealId: string | null) => {
    setTasks((all) => [{ id: `t${Date.now()}`, title, due, done: false, dealId }, ...all]);
  }, []);

  const addDeal = useCallback((data: NewDeal) => {
    const stamp = Date.now();
    const contactId = `c${stamp}`;
    setContacts((all) => [
      { id: contactId, name: data.name, email: data.email, phone: data.phone, city: data.city, origin: "Outro" },
      ...all,
    ]);
    setDeals((all) => [
      {
        id: `d${stamp}`, contactId, stage: "novo", eventType: data.eventType, eventDate: data.eventDate, startTime: "21:00", hours: 4,
        venue: "A definir", city: data.city, guests: null, value: 0, origin: "Outro", message: "",
        lostReason: null, createdAt: todayISO(), history: [{ at: todayISO(), text: "Cliente criado manualmente" }],
      },
      ...all,
    ]);
  }, []);

  const saveEvent = useCallback((data: EventInput, id?: string) => {
    setSiteEvents((all) => (id ? all.map((e) => (e.id === id ? { ...data, id } : e)) : [{ ...data, id: `e${Date.now()}` }, ...all]));
  }, []);

  const removeEvent = useCallback((id: string) => {
    setSiteEvents((all) => all.filter((e) => e.id !== id));
  }, []);

  const toggleEventPublished = useCallback((id: string) => {
    setSiteEvents((all) => all.map((e) => (e.id === id ? { ...e, published: !e.published } : e)));
  }, []);

  const value = useMemo<Crm>(
    () => ({
      today, contacts, deals, payments, tasks, siteEvents, contactOf, dealOf, paymentsOf, paidOf,
      moveDeal, setLostReason, togglePaid, toggleTask, addTask, addDeal, saveEvent, removeEvent, toggleEventPublished,
    }),
    [today, contacts, deals, payments, tasks, siteEvents, contactOf, dealOf, paymentsOf, paidOf, moveDeal, setLostReason, togglePaid, toggleTask, addTask, addDeal, saveEvent, removeEvent, toggleEventPublished],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
