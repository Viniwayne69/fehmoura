"use client";

import { useState, type FormEvent } from "react";
import { relativeDay } from "@/lib/crm/date";
import { useCrm } from "../CrmProvider";
import { DealModal } from "../DealModal";
import { PageHead } from "../ui";

type Filter = "pendentes" | "feitas" | "todas";

export function TarefasView() {
  const { tasks, today, toggleTask, addTask, dealOf, contactOf } = useCrm();
  const [filter, setFilter] = useState<Filter>("pendentes");
  const [openId, setOpenId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [due, setDue] = useState(today);

  const list = tasks
    .filter((t) => (filter === "todas" ? true : filter === "feitas" ? t.done : !t.done))
    .sort((a, b) => Number(a.done) - Number(b.done) || a.due.localeCompare(b.due));

  function submit(e: FormEvent) {
    e.preventDefault();
    const text = title.trim();
    if (!text) return;
    addTask(text, due || today, null);
    setTitle("");
  }

  return (
    <>
      <PageHead title="Tarefas" sub="Lembretes ligados aos seus clientes." />

      <form className="adm-card crm-newtask" onSubmit={submit}>
        <div className="adm-field">
          <label htmlFor="t-title">Nova tarefa</label>
          <input id="t-title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Ex.: Enviar orçamento para o Bruno" />
        </div>
        <div className="adm-field">
          <label htmlFor="t-due">Prazo</label>
          <input id="t-due" type="date" value={due} onChange={(e) => setDue(e.target.value)} />
        </div>
        <button type="submit" className="adm-btn adm-btn--primary">Adicionar</button>
      </form>

      <div className="adm-tabs" role="tablist" style={{ marginTop: 24 }}>
        {(["pendentes", "feitas", "todas"] as Filter[]).map((f) => (
          <button key={f} type="button" role="tab" aria-selected={filter === f} onClick={() => setFilter(f)}>
            {f === "pendentes" ? "Pendentes" : f === "feitas" ? "Concluídas" : "Todas"}
          </button>
        ))}
      </div>

      {list.length ? (
        <ul className="adm-list">
          {list.map((t) => {
            const deal = t.dealId ? dealOf(t.dealId) : undefined;
            const who = deal ? contactOf(deal.contactId)?.name : undefined;
            const late = !t.done && t.due < today;
            return (
              <li key={t.id} className="adm-row crm-row-task" style={{ gridTemplateColumns: "1fr auto" }}>
                <label className="adm-check">
                  <input type="checkbox" checked={t.done} onChange={() => toggleTask(t.id)} />
                  <span className={t.done ? "is-done" : ""}>
                    {t.title}
                    {deal && who && (
                      <button type="button" className="crm-link" onClick={() => setOpenId(deal.id)}>{who}</button>
                    )}
                  </span>
                </label>
                <span className={`tag${late ? " tag--red" : t.done ? " tag--dim" : ""}`}>{t.done ? "Feita" : late ? "Atrasada" : relativeDay(t.due, today)}</span>
              </li>
            );
          })}
        </ul>
      ) : (
        <div className="adm-empty"><strong>Nada por aqui</strong>{filter === "pendentes" ? "Nenhuma tarefa pendente." : "Nenhuma tarefa nessa lista."}</div>
      )}

      {openId && <DealModal dealId={openId} onClose={() => setOpenId(null)} />}
    </>
  );
}
