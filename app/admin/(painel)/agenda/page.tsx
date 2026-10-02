import { EventManager } from "@/components/admin/EventManager";
import { createClient } from "@/lib/supabase/server";
import type { DjEvent } from "@/lib/types";

export const metadata = { title: "Agenda" };

export default async function AgendaAdmin({ searchParams }: { searchParams: Promise<{ novo?: string }> }) {
  const { novo } = await searchParams;
  const supabase = await createClient();
  const { data } = await supabase.from("events").select("*").order("starts_at", { ascending: true });
  return <EventManager events={(data ?? []) as DjEvent[]} openNew={novo === "1"} />;
}
