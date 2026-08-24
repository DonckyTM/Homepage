"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

function refresh() {
  revalidatePath("/admin");
  revalidatePath("/");
}

export async function updateSiteTextInline(key: string, valueDe: string, valueEn: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("site_texts")
    .update({ value_de: valueDe, value_en: valueEn })
    .eq("key", key);

  if (error) {
    throw new Error(`Failed to update site text "${key}": ${error.message}`);
  }

  refresh();
}

export async function createAboutFactInline(labelDe: string, labelEn: string, valueDe: string, valueEn: string) {
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
    .insert({ label_de: labelDe, label_en: labelEn, value_de: valueDe, value_en: valueEn, order: nextOrder });

  if (error) {
    throw new Error(`Failed to create about fact: ${error.message}`);
  }

  refresh();
}

export async function updateAboutFactInline(
  id: string,
  labelDe: string,
  labelEn: string,
  valueDe: string,
  valueEn: string
) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("about_facts")
    .update({ label_de: labelDe, label_en: labelEn, value_de: valueDe, value_en: valueEn })
    .eq("id", id);

  if (error) {
    throw new Error(`Failed to update about fact: ${error.message}`);
  }

  refresh();
}

export async function deleteAboutFactInline(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("about_facts").delete().eq("id", id);

  if (error) {
    throw new Error(`Failed to delete about fact: ${error.message}`);
  }

  refresh();
}

export async function moveAboutFactInline(id: string, direction: "up" | "down") {
  const supabase = await createClient();
  const { data: rows, error: fetchError } = await supabase.from("about_facts").select("id, order").order("order");

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

export async function createStackTagInline(name: string, icon: string) {
  const supabase = await createClient();

  const { data: existing, error: fetchError } = await supabase
    .from("about_stack")
    .select("order")
    .order("order", { ascending: false })
    .limit(1);

  if (fetchError) {
    throw new Error(`Failed to load about_stack: ${fetchError.message}`);
  }

  const nextOrder = (existing?.[0]?.order ?? 0) + 1;

  const { error } = await supabase
    .from("about_stack")
    .insert({ name, icon: icon.trim() === "" ? null : icon, order: nextOrder });

  if (error) {
    throw new Error(`Failed to create stack tag: ${error.message}`);
  }

  refresh();
}

export async function updateStackTagInline(id: string, name: string, icon: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("about_stack")
    .update({ name, icon: icon.trim() === "" ? null : icon })
    .eq("id", id);

  if (error) {
    throw new Error(`Failed to update stack tag: ${error.message}`);
  }

  refresh();
}

export async function deleteStackTagInline(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("about_stack").delete().eq("id", id);

  if (error) {
    throw new Error(`Failed to delete stack tag: ${error.message}`);
  }

  refresh();
}

export async function moveStackTagInline(id: string, direction: "up" | "down") {
  const supabase = await createClient();
  const { data: rows, error: fetchError } = await supabase.from("about_stack").select("id, order").order("order");

  if (fetchError) {
    throw new Error(`Failed to load about_stack: ${fetchError.message}`);
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
    supabase.from("about_stack").update({ order: neighbor.order }).eq("id", current.id),
    supabase.from("about_stack").update({ order: current.order }).eq("id", neighbor.id)
  ]);

  if (error1 || error2) {
    throw new Error(`Failed to reorder stack tags: ${(error1 ?? error2)?.message}`);
  }

  refresh();
}
