"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

function refresh() {
  revalidatePath("/admin/about-stack");
  revalidatePath("/");
}

export async function createStackTag(formData: FormData) {
  const name = formData.get("name") as string;
  const iconRaw = formData.get("icon") as string;
  const icon = iconRaw.trim() === "" ? null : iconRaw;

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

  const { error } = await supabase.from("about_stack").insert({ name, icon, order: nextOrder });

  if (error) {
    throw new Error(`Failed to create stack tag: ${error.message}`);
  }

  refresh();
}

export async function updateStackTag(formData: FormData) {
  const id = formData.get("id") as string;
  const name = formData.get("name") as string;
  const iconRaw = formData.get("icon") as string;
  const icon = iconRaw.trim() === "" ? null : iconRaw;

  const supabase = await createClient();
  const { error } = await supabase.from("about_stack").update({ name, icon }).eq("id", id);

  if (error) {
    throw new Error(`Failed to update stack tag: ${error.message}`);
  }

  refresh();
}

export async function deleteStackTag(formData: FormData) {
  const id = formData.get("id") as string;

  const supabase = await createClient();
  const { error } = await supabase.from("about_stack").delete().eq("id", id);

  if (error) {
    throw new Error(`Failed to delete stack tag: ${error.message}`);
  }

  refresh();
}

export async function moveStackTag(formData: FormData) {
  const id = formData.get("id") as string;
  const direction = formData.get("direction") as "up" | "down";

  const supabase = await createClient();
  const { data: rows, error: fetchError } = await supabase
    .from("about_stack")
    .select("id, order")
    .order("order");

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
