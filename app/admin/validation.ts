import "server-only";
import { safeExternalUrl } from "@/lib/safeUrl";

// Server Actions receive whatever the caller serialises: the TypeScript types
// on their parameters are erased at runtime and enforce nothing. Everything
// crossing that boundary is validated here.

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export const LIMITS = {
  shortText: 200,
  mediumText: 500,
  longText: 4000,
  tagName: 60,
  techTags: 24,
  siteTextValue: 4000
} as const;

export function assertUuid(value: unknown, field = "id"): string {
  if (typeof value !== "string" || !UUID_RE.test(value)) {
    throw new Error(`Invalid ${field}.`);
  }
  return value;
}

// The "up" | "down" union is compile-time only; without this an unexpected
// value silently fell through to the "down" branch.
export function assertDirection(value: unknown): "up" | "down" {
  if (value !== "up" && value !== "down") {
    throw new Error("Invalid direction.");
  }
  return value;
}

export function assertText(value: unknown, max: number, field: string): string {
  if (typeof value !== "string") {
    throw new Error(`${field} must be text.`);
  }
  if (value.length > max) {
    throw new Error(`${field} must be ${max} characters or fewer.`);
  }
  return value;
}

export function assertTechTags(value: unknown): string[] {
  if (!Array.isArray(value)) {
    throw new Error("Tech tags must be a list.");
  }
  if (value.length > LIMITS.techTags) {
    throw new Error(`At most ${LIMITS.techTags} tech tags.`);
  }
  return value.map((tag, i) => assertText(tag, LIMITS.tagName, `Tech tag ${i + 1}`));
}

// site_texts rows are keyed copy slots that the UI reads by name. Restricting
// updates to existing keys stops the action from being used to create
// arbitrary rows.
export function assertSiteTextKey(value: unknown): string {
  if (typeof value !== "string" || !/^[A-Za-z0-9_]{1,64}$/.test(value)) {
    throw new Error("Invalid site text key.");
  }
  return value;
}

const IMAGE_SIGNATURES: { type: string; matches: (b: Uint8Array) => boolean }[] = [
  { type: "image/png", matches: (b) => b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47 },
  { type: "image/jpeg", matches: (b) => b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff },
  {
    type: "image/webp",
    matches: (b) =>
      b[0] === 0x52 && b[1] === 0x49 && b[2] === 0x46 && b[3] === 0x46 &&
      b[8] === 0x57 && b[9] === 0x45 && b[10] === 0x42 && b[11] === 0x50
  }
];

// file.type is client-declared and is what Storage serves the file back as,
// so confirm the bytes actually match the claimed type before uploading.
export async function assertImageBytesMatchType(file: File, declaredType: string): Promise<void> {
  const header = new Uint8Array(await file.slice(0, 16).arrayBuffer());
  const signature = IMAGE_SIGNATURES.find((s) => s.type === declaredType);

  if (!signature || !signature.matches(header)) {
    throw new Error("File contents do not match its image type.");
  }
}

export interface ProjectUpdateFields {
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

// The caller controls which keys are present, so validate each one that is
// actually set rather than assuming the declared shape.
export function assertProjectFields(fields: unknown): ProjectUpdateFields {
  if (typeof fields !== "object" || fields === null) {
    throw new Error("Invalid project fields.");
  }

  const f = fields as Record<string, unknown>;
  const out: ProjectUpdateFields = {};

  const shortFields = ["titleDe", "titleEn", "roleDe", "roleEn", "yearDe", "yearEn"] as const;
  const mediumFields = ["blurbDe", "blurbEn"] as const;
  const longFields = ["long1De", "long1En", "long2De", "long2En"] as const;

  for (const k of shortFields) {
    if (f[k] !== undefined) out[k] = assertText(f[k], LIMITS.shortText, k);
  }
  for (const k of mediumFields) {
    if (f[k] !== undefined) out[k] = assertText(f[k], LIMITS.mediumText, k);
  }
  for (const k of longFields) {
    if (f[k] !== undefined) out[k] = assertText(f[k], LIMITS.longText, k);
  }

  if (f.techTags !== undefined) out.techTags = assertTechTags(f.techTags);
  if (f.inProgress !== undefined) out.inProgress = f.inProgress === true;

  if (f.repoUrl !== undefined) {
    const raw = assertText(f.repoUrl, LIMITS.shortText, "Repo URL").trim();
    if (raw === "") {
      out.repoUrl = "";
    } else {
      // Rendered into an <a href>: only http(s) may be stored, or a
      // javascript: value becomes stored XSS on the public site.
      const safe = safeExternalUrl(raw);
      if (!safe) {
        throw new Error("Repo link must be a valid http(s) URL.");
      }
      out.repoUrl = safe;
    }
  }

  return out;
}
