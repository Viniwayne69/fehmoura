import { PhotoManager } from "@/components/admin/PhotoManager";
import { createClient } from "@/lib/supabase/server";
import type { Photo } from "@/lib/types";

export const metadata = { title: "Galeria" };

export default async function GaleriaAdmin() {
  const supabase = await createClient();
  const { data } = await supabase.from("photos").select("*").order("position", { ascending: true });
  return <PhotoManager photos={(data ?? []) as Photo[]} />;
}
