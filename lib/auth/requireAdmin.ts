import "server-only";
import { createClient } from "@/lib/supabase/server";
import { isRateLimited, ADMIN_WRITE_LIMIT } from "@/lib/rateLimit";

export class UnauthorizedError extends Error {
  constructor(message = "Not authorized.") {
    super(message);
    this.name = "UnauthorizedError";
  }
}

// Server Actions are public HTTP endpoints: their action IDs are global and
// dispatched by POST to *any* route, so the /admin middleware matcher never
// sees them. Every action -- and every service-role read -- must therefore
// authorize its own caller instead of relying on middleware.
//
// getUser() (not getSession()) is deliberate: it revalidates the JWT against
// the auth server rather than trusting a cookie payload.
export async function requireAdmin({ rateLimit = true }: { rateLimit?: boolean } = {}) {
  const supabase = await createClient();

  const {
    data: { user },
    error
  } = await supabase.auth.getUser();

  if (error || !user) {
    throw new UnauthorizedError();
  }

  // Being logged in is not the same as being an admin. public.admins is
  // deny-all under RLS, so membership is checked through the same
  // security-definer function the RLS policies use -- one source of truth,
  // and it also covers service-role code paths that bypass RLS entirely.
  const { data: isAdmin, error: adminError } = await supabase.rpc("is_admin");

  if (adminError || isAdmin !== true) {
    throw new UnauthorizedError();
  }

  if (rateLimit && (await isRateLimited(`user:${user.id}`, ADMIN_WRITE_LIMIT))) {
    throw new Error("Too many changes in a short time. Please wait a moment.");
  }

  return user;
}
