"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

function refresh() {
  revalidatePath("/admin/about-facts");
  revalidatePath("/");
}

export async function createAboutFact(formData: FormData) {
  const label_de = formData.get("label_de") as string;
  const label_en = formData.get("label_en") as string;
  const value_de = formData.get("value_de") as string;
  const value_en = formData.get("value_en") as string;

  const supabase = await createClient();

  const { data: existing, error: fetchError } = await supabase
    .from("about_facts")
    .select("order")
    .order("order", { ascending: false })
    .limit(1);

  if (fetchError) {
    throw new Error(`Failed to load about_facts: ${fetchError.message}`);
  }

  const nextOrder = (existing?.[0]?.order ?? 0) + 1;

  const { error } = await supabase
    .from("about_facts")
    .insert({ label_de, label_en, value_de, value_en, order: nextOrder });

  if (error) {
    throw new Error(`Failed to create about fact: ${error.message}`);
  }

  refresh();
}

export async function updateAboutFact(formData: FormData) {
  const id = formData.get("id") as string;
  const label_de = formData.get("label_de") as string;
  const label_en = formData.get("label_en") as string;
  const value_de = formData.get("value_de") as string;
  const value_en = formData.get("value_en") as string;

  const supabase = await createClient();
  const { error } = await supabase
    .from("about_facts")
    .update({ label_de, label_en, value_de, value_en })
    .eq("id", id);

  if (error) {
    throw new Error(`Failed to update about fact: ${error.message}`);
  }

  refresh();
}

export async function deleteAboutFact(formData: FormData) {
  const id = formData.get("id") as string;

  const supabase = await createClient();
  const { error } = await supabase.from("about_facts").delete().eq("id", id);

  if (error) {
    throw new Error(`Failed to delete about fact: ${error.message}`);
  }

  refresh();
}

export async function moveAboutFact(formData: FormData) {
  const id = formData.get("id") as string;
  const direction = formData.get("direction") as "up" | "down";

  const supabase = await createClient();
  const { data: rows, error: fetchError } = await supabase
    .from("about_facts")
    .select("id, order")
    .order("order");

  if (fetchError) {
    throw new Error(`Failed to load about_facts: ${fetchError.message}`);
  }

  const list = rows ?? [];
  const index = list.findIndex((row) => row.id === id);
  const swapIndex = direction === "up" ? index - 1 : index + 1;

  if (index === -1 || swapIndex < 0 || swapIndex >= list.length) {
    return;
  }

  const current = list[index];
  const neighbor = list[swapIndex];

  const [{ error: error1 }, { error: error2 }] = await Promise.all([
    supabase.from("about_facts").update({ order: neighbor.order }).eq("id", current.id),
    supabase.from("about_facts").update({ order: current.order }).eq("id", neighbor.id)
  ]);

  if (error1 || error2) {
    throw new Error(`Failed to reorder about facts: ${(error1 ?? error2)?.message}`);
  }

  refresh();
}
