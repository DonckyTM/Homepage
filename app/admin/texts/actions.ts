"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function updateSiteText(formData: FormData) {
  const key = formData.get("key") as string;
  const value_de = formData.get("value_de") as string;
  const value_en = formData.get("value_en") as string;

  const supabase = await createClient();
  const { error } = await supabase
    .from("site_texts")
    .update({ value_de, value_en })
    .eq("key", key);

  if (error) {
    throw new Error(`Failed to update site text "${key}": ${error.message}`);
  }

  revalidatePath("/admin/texts");
  revalidatePath("/");
}
