import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";

export interface RateLimitRule {
  bucket: string;
  max: number;
  windowSeconds: number;
  // What to do when the limiter itself is unavailable. Public, unauthenticated
  // endpoints fail closed -- better to reject than to hand out an unmetered
  // endpoint. Buckets that only throttle an already-authenticated admin fail
  // open, so a limiter outage cannot lock the owner out of their own site.
  failOpen?: boolean;
}

export const CONTACT_IP_LIMIT: RateLimitRule = { bucket: "contact_ip", max: 5, windowSeconds: 600 };
export const CONTACT_EMAIL_LIMIT: RateLimitRule = { bucket: "contact_email", max: 3, windowSeconds: 3600 };
export const LOGIN_LIMIT: RateLimitRule = { bucket: "admin_login", max: 8, windowSeconds: 900 };
export const ADMIN_WRITE_LIMIT: RateLimitRule = {
  bucket: "admin_write",
  max: 240,
  windowSeconds: 60,
  failOpen: true
};

// Shared sliding-window limiter backed by public.rate_limits. The previous
// implementation was an in-memory Map, so every serverless instance kept its
// own counters -- the real limit was 5x the instance count and reset on each
// cold start. The counter now lives in Postgres and the increment is atomic,
// so concurrent instances cannot race past the cap.
export async function isRateLimited(key: string, rule: RateLimitRule): Promise<boolean> {
  try {
    const supabase = createAdminClient();

    const { data, error } = await supabase.rpc("consume_rate_limit", {
      p_key: key,
      p_bucket: rule.bucket,
      p_max: rule.max,
      p_window_seconds: rule.windowSeconds
    });

    if (error) {
      console.error(`rate limit check failed (${rule.bucket})`, error.message);
      return rule.failOpen !== true;
    }

    return data === true;
  } catch (err) {
    // createAdminClient() throws outright when the service-role key is absent.
    // Let that surface as a limiter decision rather than an unhandled 500.
    console.error(`rate limit check threw (${rule.bucket})`, err);
    return rule.failOpen !== true;
  }
}
