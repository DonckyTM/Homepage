import type { NextRequest } from "next/server";

// Deriving the client IP from the *first* x-forwarded-for entry is wrong: that
// entry is whatever the client sent, so a rate limiter keyed on it is bypassed
// by rotating one header. Only trailing entries are appended by proxies we
// trust, and on Vercel x-vercel-forwarded-for is set by the edge and cannot be
// spoofed at all.
export function getClientIp(request: NextRequest): string {
  return getClientIpFromHeaders(request.headers);
}

// Server Actions get headers() rather than a NextRequest, so the logic lives
// here and both entry points share it.
export function getClientIpFromHeaders(headers: Headers): string {
  const vercel = headers.get("x-vercel-forwarded-for");
  if (vercel) {
    const parts = vercel.split(",").map((p) => p.trim()).filter(Boolean);
    if (parts.length > 0) return parts[parts.length - 1];
  }

  const forwarded = headers.get("x-forwarded-for");
  if (forwarded) {
    const parts = forwarded.split(",").map((p) => p.trim()).filter(Boolean);
    if (parts.length > 0) return parts[parts.length - 1];
  }

  return headers.get("x-real-ip")?.trim() || "unknown";
}
