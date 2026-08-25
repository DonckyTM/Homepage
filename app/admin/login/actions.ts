"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getClientIpFromHeaders } from "@/lib/clientIp";
import { isRateLimited, LOGIN_LIMIT } from "@/lib/rateLimit";

export interface LoginState {
  error: string | null;
}

// Sign-in runs server-side so it can be rate limited. Doing it in the browser
// left the only throttle to Supabase's own defaults, with nothing per-IP.
export async function signInAction(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { error: "Invalid email or password." };
  }

  const ip = getClientIpFromHeaders(await headers());

  // Two buckets: one stops a single host spraying many accounts, the other
  // stops a distributed guess at one account.
  const limited =
    (await isRateLimited(`ip:${ip}`, LOGIN_LIMIT)) ||
    (await isRateLimited(`email:${email.toLowerCase()}`, LOGIN_LIMIT));

  if (limited) {
    return { error: "Too many login attempts. Please try again later." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    // One generic message: the underlying text can disclose account state
    // ("Email not confirmed", "Email logins are disabled").
    return { error: "Invalid email or password." };
  }

  redirect("/admin");
}
