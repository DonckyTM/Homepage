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

export async function createHomeFactInline(labelDe: string, labelEn: string, valueDe: string, valueEn: string) {
  const supabase = await createClient();

  const { data: existing, error: fetchError } = await supabase
    .from("home_facts")
    .select("order")
    .order("order", { ascending: false })
    .limit(1);

  if (fetchError) {
    throw new Error(`Failed to load home_facts: ${fetchError.message}`);
  }

  const nextOrder = (existing?.[0]?.order ?? 0) + 1;

  const { error } = await supabase
    .from("home_facts")
    .insert({ label_de: labelDe, label_en: labelEn, value_de: valueDe, value_en: valueEn, order: nextOrder });

  if (error) {
    throw new Error(`Failed to create home fact: ${error.message}`);
  }

  refresh();
}

export async function updateHomeFactInline(
  id: string,
  labelDe: string,
  labelEn: string,
  valueDe: string,
  valueEn: string
) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("home_facts")
    .update({ label_de: labelDe, label_en: labelEn, value_de: valueDe, value_en: valueEn })
    .eq("id", id);

  if (error) {
    throw new Error(`Failed to update home fact: ${error.message}`);
  }

  refresh();
}

export async function deleteHomeFactInline(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("home_facts").delete().eq("id", id);

  if (error) {
    throw new Error(`Failed to delete home fact: ${error.message}`);
  }

  refresh();
}

export async function moveHomeFactInline(id: string, direction: "up" | "down") {
  const supabase = await createClient();
  const { data: rows, error: fetchError } = await supabase.from("home_facts").select("id, order").order("order");

  if (fetchError) {
    throw new Error(`Failed to load home_facts: ${fetchError.message}`);
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
    supabase.from("home_facts").update({ order: neighbor.order }).eq("id", current.id),
    supabase.from("home_facts").update({ order: current.order }).eq("id", neighbor.id)
  ]);

  if (error1 || error2) {
    throw new Error(`Failed to reorder home facts: ${(error1 ?? error2)?.message}`);
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

export async function createProjectInline(titleDe: string, titleEn: string, blurbDe: string, blurbEn: string) {
  const supabase = await createClient();

  const { data: existing, error: fetchError } = await supabase
    .from("projects")
    .select("order")
    .order("order", { ascending: false })
    .limit(1);

  if (fetchError) {
    throw new Error(`Failed to load projects: ${fetchError.message}`);
  }

  const nextOrder = (existing?.[0]?.order ?? 0) + 1;

  const { error } = await supabase.from("projects").insert({
    title_de: titleDe,
    title_en: titleEn,
    blurb_de: blurbDe,
    blurb_en: blurbEn,
    long1_de: "",
    long1_en: "",
    long2_de: "",
    long2_en: "",
    role_de: "",
    role_en: "",
    year_de: "",
    year_en: "",
    tech_tags: [],
    repo_url: null,
    in_progress: false,
    order: nextOrder
  });

  if (error) {
    throw new Error(`Failed to create project: ${error.message}`);
  }

  refresh();
}

interface ProjectUpdateFields {
  titleDe?: string;
  titleEn?: string;
  blurbDe?: string;
  blurbEn?: string;
  long1De?: string;
  long1En?: string;
  long2De?: string;
  long2En?: string;
  roleDe?: string;
  roleEn?: string;
  yearDe?: string;
  yearEn?: string;
  techTags?: string[];
  repoUrl?: string;
  inProgress?: boolean;
}

export async function updateProjectInline(id: string, fields: ProjectUpdateFields) {
  const supabase = await createClient();

  const update: Record<string, unknown> = {};
  if (fields.titleDe !== undefined) update.title_de = fields.titleDe;
  if (fields.titleEn !== undefined) update.title_en = fields.titleEn;
  if (fields.blurbDe !== undefined) update.blurb_de = fields.blurbDe;
  if (fields.blurbEn !== undefined) update.blurb_en = fields.blurbEn;
  if (fields.long1De !== undefined) update.long1_de = fields.long1De;
  if (fields.long1En !== undefined) update.long1_en = fields.long1En;
  if (fields.long2De !== undefined) update.long2_de = fields.long2De;
  if (fields.long2En !== undefined) update.long2_en = fields.long2En;
  if (fields.roleDe !== undefined) update.role_de = fields.roleDe;
  if (fields.roleEn !== undefined) update.role_en = fields.roleEn;
  if (fields.yearDe !== undefined) update.year_de = fields.yearDe;
  if (fields.yearEn !== undefined) update.year_en = fields.yearEn;
  if (fields.techTags !== undefined) update.tech_tags = fields.techTags;
  if (fields.repoUrl !== undefined) update.repo_url = fields.repoUrl === "" ? null : fields.repoUrl;
  if (fields.inProgress !== undefined) update.in_progress = fields.inProgress;

  const { error } = await supabase.from("projects").update(update).eq("id", id);

  if (error) {
    throw new Error(`Failed to update project: ${error.message}`);
  }

  refresh();
}

const SCREENSHOT_BUCKET = "project-screenshots";
const ALLOWED_SCREENSHOT_TYPES = new Set(["image/png", "image/jpeg", "image/webp"]);
const MAX_SCREENSHOT_BYTES = 5 * 1024 * 1024;

export async function uploadProjectScreenshotInline(id: string, formData: FormData) {
  const file = formData.get("file");
  if (!(file instanceof File)) {
    throw new Error("No file provided.");
  }
  if (!ALLOWED_SCREENSHOT_TYPES.has(file.type)) {
    throw new Error("Only PNG, JPEG, or WebP images are allowed.");
  }
  if (file.size > MAX_SCREENSHOT_BYTES) {
    throw new Error("Image must be 5MB or smaller.");
  }

  const supabase = await createClient();

  const { data: existing } = await supabase.from("projects").select("screenshot_path").eq("id", id).maybeSingle();

  const extension = file.type === "image/png" ? "png" : file.type === "image/webp" ? "webp" : "jpg";
  const path = `${id}/${Date.now()}.${extension}`;

  const { error: uploadError } = await supabase.storage
    .from(SCREENSHOT_BUCKET)
    .upload(path, file, { contentType: file.type, upsert: true });

  if (uploadError) {
    throw new Error(`Failed to upload screenshot: ${uploadError.message}`);
  }

  const { error } = await supabase.from("projects").update({ screenshot_path: path }).eq("id", id);

  if (error) {
    throw new Error(`Failed to save screenshot: ${error.message}`);
  }

  if (existing?.screenshot_path && existing.screenshot_path !== path) {
    await supabase.storage.from(SCREENSHOT_BUCKET).remove([existing.screenshot_path]);
  }

  refresh();
}

export async function deleteProjectInline(id: string) {
  const supabase = await createClient();

  const { data: existing } = await supabase.from("projects").select("screenshot_path").eq("id", id).maybeSingle();

  const { error } = await supabase.from("projects").delete().eq("id", id);

  if (error) {
    throw new Error(`Failed to delete project: ${error.message}`);
  }

  if (existing?.screenshot_path) {
    await supabase.storage.from(SCREENSHOT_BUCKET).remove([existing.screenshot_path]);
  }

  refresh();
}

export async function moveProjectInline(id: string, direction: "up" | "down") {
  const supabase = await createClient();
  const { data: rows, error: fetchError } = await supabase.from("projects").select("id, order").order("order");

  if (fetchError) {
    throw new Error(`Failed to load projects: ${fetchError.message}`);
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
    supabase.from("projects").update({ order: neighbor.order }).eq("id", current.id),
    supabase.from("projects").update({ order: current.order }).eq("id", neighbor.id)
  ]);

  if (error1 || error2) {
    throw new Error(`Failed to reorder projects: ${(error1 ?? error2)?.message}`);
  }

  refresh();
}

export async function createMilestoneInline(
  titleDe: string,
  titleEn: string,
  noteDe: string,
  noteEn: string,
  dateDe: string,
  dateEn: string
) {
  const supabase = await createClient();

  const { data: existing, error: fetchError } = await supabase
    .from("milestones")
    .select("order")
    .order("order", { ascending: false })
    .limit(1);

  if (fetchError) {
    throw new Error(`Failed to load milestones: ${fetchError.message}`);
  }

  const nextOrder = (existing?.[0]?.order ?? 0) + 1;

  const { error } = await supabase.from("milestones").insert({
    title_de: titleDe,
    title_en: titleEn,
    note_de: noteDe,
    note_en: noteEn,
    date_de: dateDe,
    date_en: dateEn,
    done: false,
    order: nextOrder
  });

  if (error) {
    throw new Error(`Failed to create milestone: ${error.message}`);
  }

  refresh();
}

export async function updateMilestoneInline(
  id: string,
  titleDe: string,
  titleEn: string,
  noteDe: string,
  noteEn: string,
  dateDe: string,
  dateEn: string
) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("milestones")
    .update({ title_de: titleDe, title_en: titleEn, note_de: noteDe, note_en: noteEn, date_de: dateDe, date_en: dateEn })
    .eq("id", id);

  if (error) {
    throw new Error(`Failed to update milestone: ${error.message}`);
  }

  refresh();
}

export async function toggleMilestoneDoneInline(id: string, done: boolean) {
  const supabase = await createClient();
  const { error } = await supabase.from("milestones").update({ done }).eq("id", id);

  if (error) {
    throw new Error(`Failed to update milestone: ${error.message}`);
  }

  refresh();
}

export async function deleteMilestoneInline(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("milestones").delete().eq("id", id);

  if (error) {
    throw new Error(`Failed to delete milestone: ${error.message}`);
  }

  refresh();
}

export async function moveMilestoneInline(id: string, direction: "up" | "down") {
  const supabase = await createClient();
  const { data: rows, error: fetchError } = await supabase.from("milestones").select("id, order").order("order");

  if (fetchError) {
    throw new Error(`Failed to load milestones: ${fetchError.message}`);
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
    supabase.from("milestones").update({ order: neighbor.order }).eq("id", current.id),
    supabase.from("milestones").update({ order: current.order }).eq("id", neighbor.id)
  ]);

  if (error1 || error2) {
    throw new Error(`Failed to reorder milestones: ${(error1 ?? error2)?.message}`);
  }

  refresh();
}
