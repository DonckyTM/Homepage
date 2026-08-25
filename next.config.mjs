/** @type {import('next').NextConfig} */

// The CSP is set per-request in middleware.ts because it carries a nonce.
// Everything here is static and identical on every response.
const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // Redundant with the CSP's frame-ancestors 'none', kept for older browsers.
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), interest-cohort=()" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "X-DNS-Prefetch-Control", value: "on" }
];

const nextConfig = {
  poweredByHeader: false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        // Pinned to this project. A "*.supabase.co" wildcard would let the
        // image optimiser fetch and re-serve objects from any Supabase
        // project on the internet.
        hostname: "lryiyomuurzzktsyuheh.supabase.co",
        pathname: "/storage/v1/object/public/**"
      }
    ],
    // Screenshot paths are unique per upload and never rewritten (see
    // app/admin/actions.ts), so an optimized variant stays valid forever. The
    // 4h default meant the optimizer periodically re-fetched and re-encoded the
    // source from Supabase, which is exactly the multi-second stall we're
    // removing. Editing a screenshot produces a new path, hence a new URL.
    minimumCacheTTL: 31536000
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  }
};

export default nextConfig;
