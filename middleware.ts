import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const SUPABASE_ORIGIN = "https://lryiyomuurzzktsyuheh.supabase.co";

// Next.js only threads a CSP nonce into the HTML it renders for THAT request.
// Statically generated pages (prerendered at build time / revalidated in the
// background, with no request in scope) get no nonce baked into their inline
// hydration scripts at all -- so a nonce that changes every request can never
// match them. Serving a nonce-strict script-src to a static route blocks
// every script on the page, including its own hydration payload: confirmed by
// loading the built app and watching Next's own chunks and __next_f bootstrap
// scripts get rejected by the browser.
//
// "/" and "/admin/login" are prerendered (see the "next build" route summary
// -- both list as "○ Static"); "/admin", "/admin/contact" and the API route
// read cookies()/are Route Handlers, which forces per-request rendering, so a
// nonce is safe there. If a future change makes an /admin page static, the
// build's route summary will start listing it as "○" -- that is the signal
// to add it to STATIC_ROUTES below, or the CSP will silently break it exactly
// like this did for /admin/login.
const STATIC_ROUTES = new Set(["/", "/admin/login"]);

function buildCsp(nonce: string | null): string {
  const isDevEval = process.env.NODE_ENV !== "production" ? " 'unsafe-eval'" : "";

  const scriptSrc = nonce
    ? `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'${isDevEval}`
    // No nonce available for a statically rendered page (see above): 'self'
    // still blocks third-party/attacker-hosted script sources, which is the
    // main script-src threat model for a page with no dangerouslySetInnerHTML
    // and no attacker-controlled <script> content anywhere in this app.
    : `script-src 'self' 'unsafe-inline'${isDevEval}`;

  return [
    "default-src 'self'",
    scriptSrc,
    // 'unsafe-inline' is deliberate for styles: the components use inline
    // style={{...}} attributes, and CSP3 offers no nonce path for style
    // *attributes*.
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
  const isStatic = STATIC_ROUTES.has(request.nextUrl.pathname);
  const nonce = isStatic ? null : Buffer.from(crypto.randomUUID()).toString("base64");
  const csp = buildCsp(nonce);

  const requestHeaders = new Headers(request.headers);
  if (nonce) {
    // Forward the nonce to the render so Server Components can read it.
    requestHeaders.set("x-nonce", nonce);
  }
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
