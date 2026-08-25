// Scheme allow-list for any URL that reaches an href/src attribute.
//
// React escapes text children but does NOT sanitize attribute values, so a
// stored `javascript:` URL in an <a href> executes on click. Every externally
// supplied URL has to pass through here before it is rendered.
const ALLOWED_PROTOCOLS = new Set(["http:", "https:"]);

export function safeExternalUrl(raw: string | null | undefined): string | null {
  if (!raw) return null;

  const trimmed = raw.trim();
  if (!trimmed) return null;

  let parsed: URL;
  try {
    parsed = new URL(trimmed);
  } catch {
    // Relative or malformed — not a valid external link.
    return null;
  }

  if (!ALLOWED_PROTOCOLS.has(parsed.protocol)) return null;

  return parsed.toString();
}

export function isSafeExternalUrl(raw: string | null | undefined): boolean {
  return safeExternalUrl(raw) !== null;
}

// Storage object keys get interpolated into a public URL. They are
// server-generated today, but the columns holding them are writable, so
// reject anything that could climb out of its bucket or break the URL.
export function isSafeStoragePath(path: string): boolean {
  if (!path) return false;
  if (path.startsWith("/")) return false;
  if (path.includes("..")) return false;
  if (path.includes("\\")) return false;

  for (let i = 0; i < path.length; i++) {
    const code = path.charCodeAt(i);
    if (code < 0x20 || code === 0x7f) return false;
  }

  return true;
}
