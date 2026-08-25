import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const SUPABASE_ORIGIN = "https://lryiyomuurzzktsyuheh.supabase.co";

// Per-request nonce for the CSP. Next.js detects a nonce in the script-src
// directive and propagates it to its own inline bootstrap scripts, so no
// 'unsafe-inline' is needed for scripts.
function buildCsp(nonce: string): string {
  return [
    "default-src 'self'",
    // React's dev build needs eval() for its debugging features; the
    // production build never does, so the relaxation is scoped to dev only.
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'${
      process.env.NODE_ENV === "production" ? "" : " 'unsafe-eval'"
    }`,
    // 'unsafe-inline' is deliberate for styles only: the components use inline
    // style={{...}} attributes, and CSP3 offers no nonce path for style
    // *attributes*. Scripts -- the actual XSS vector -- get no such escape.
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    `img-src 'self' blob: data: ${SUPABASE_ORIGIN}`,
    `connect-src 'self' ${SUPABASE_ORIGIN}`,
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "object-src 'none'",
    "upgrade-insecure-requests"
  ].join("; ");
}

async function guardAdminRoute(request: NextRequest, response: NextResponse) {
  let result = response;

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          result = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) => result.cookies.set(name, value, options));
        }
      }
    }
  );

  const {
    data: { user }
  } = await supabase.auth.getUser();

  const isLoginRoute = request.nextUrl.pathname === "/admin/login";

  if (!user && !isLoginRoute) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin/login";
    return { redirect: NextResponse.redirect(url), response: result };
  }

  if (user && isLoginRoute) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin";
    return { redirect: NextResponse.redirect(url), response: result };
  }

  return { redirect: null, response: result };
}

export async function middleware(request: NextRequest) {
  const nonce = Buffer.from(crypto.randomUUID()).toString("base64");
  const csp = buildCsp(nonce);

  // Forward the nonce to the render so Server Components can read it.
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-nonce", nonce);
  requestHeaders.set("content-security-policy", csp);

  let response = NextResponse.next({ request: { headers: requestHeaders } });

  // The matcher now covers every route so the CSP is applied site-wide, but
  // the session check must stay scoped to /admin -- otherwise every anonymous
  // visitor to "/" would be redirected to the login page.
  if (request.nextUrl.pathname.startsWith("/admin")) {
    const { redirect, response: refreshed } = await guardAdminRoute(request, response);
    if (redirect) {
      redirect.headers.set("content-security-policy", csp);
      return redirect;
    }
    response = refreshed;
  }

  response.headers.set("content-security-policy", csp);
  return response;
}

export const config = {
  matcher: [
    // Everything except static assets and the image optimiser, which do not
    // need a CSP and would only add latency.
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|gif|webp|svg|ico|woff|woff2)$).*)"
  ]
};
