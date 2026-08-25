import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { isRateLimited, CONTACT_IP_LIMIT, CONTACT_EMAIL_LIMIT } from "@/lib/rateLimit";
import { getClientIp } from "@/lib/clientIp";

const NAME_MAX = 100;
const EMAIL_MAX = 254;
const MESSAGE_MAX = 2000;
// Generous ceiling on the raw payload so a huge body is rejected before it is
// parsed, rather than after.
const BODY_MAX_BYTES = 16 * 1024;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: NextRequest) {
  // Cheapest rejection first: a declared oversized body needs no DB round trip.
  const declaredLength = Number(request.headers.get("content-length") ?? "0");
  if (declaredLength > BODY_MAX_BYTES) {
    return NextResponse.json({ error: "invalid_body" }, { status: 413 });
  }

  const ip = getClientIp(request);
  if (await isRateLimited(`ip:${ip}`, CONTACT_IP_LIMIT)) {
    return NextResponse.json({ error: "rate_limited" }, { status: 429 });
  }

  const raw = await request.text();
  if (raw.length > BODY_MAX_BYTES) {
    return NextResponse.json({ error: "invalid_body" }, { status: 413 });
  }

  let body: unknown;
  try {
    body = JSON.parse(raw);
  } catch {
    return NextResponse.json({ error: "invalid_body" }, { status: 400 });
  }

  if (typeof body !== "object" || body === null) {
    return NextResponse.json({ error: "invalid_body" }, { status: 400 });
  }

  const { name, email, message } = body as Record<string, unknown>;

  if (typeof name !== "string" || typeof email !== "string" || typeof message !== "string") {
    return NextResponse.json({ error: "invalid_fields" }, { status: 400 });
  }

  const trimmedName = name.trim();
  const trimmedEmail = email.trim();
  const trimmedMessage = message.trim();

  if (!trimmedName || trimmedName.length > NAME_MAX) {
    return NextResponse.json({ error: "invalid_name" }, { status: 400 });
  }
  if (!trimmedEmail || trimmedEmail.length > EMAIL_MAX || !EMAIL_RE.test(trimmedEmail)) {
    return NextResponse.json({ error: "invalid_email" }, { status: 400 });
  }
  if (!trimmedMessage || trimmedMessage.length > MESSAGE_MAX) {
    return NextResponse.json({ error: "invalid_message" }, { status: 400 });
  }

  // Second bucket so one sender cannot flood the inbox from rotating IPs.
  // Checked after validation so the key is a well-formed address.
  if (await isRateLimited(`email:${trimmedEmail.toLowerCase()}`, CONTACT_EMAIL_LIMIT)) {
    return NextResponse.json({ error: "rate_limited" }, { status: 429 });
  }

  const supabase = createAdminClient();
  const { error } = await supabase.from("contact_submissions").insert({
    name: trimmedName,
    email: trimmedEmail,
    message: trimmedMessage
  });

  if (error) {
    return NextResponse.json({ error: "insert_failed" }, { status: 500 });
  }

  return NextResponse.json({ ok: true }, { status: 201 });
}
