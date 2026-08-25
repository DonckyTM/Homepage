/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**"
      }
    ],
    // Screenshot paths are unique per upload and never rewritten (see
    // app/admin/actions.ts), so an optimized variant stays valid forever. The
    // 4h default meant the optimizer periodically re-fetched and re-encoded the
    // source from Supabase, which is exactly the multi-second stall we're
    // removing. Editing a screenshot produces a new path, hence a new URL.
    minimumCacheTTL: 31536000
  }
};

export default nextConfig;
