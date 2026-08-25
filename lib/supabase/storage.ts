const SCREENSHOT_BUCKET = "project-screenshots";
const BRAND_ASSETS_BUCKET = "brand-assets";

// Bucket is public-read, so the URL can be built from the public env var
// without an authenticated client — safe to call from client components too.
export function getScreenshotUrl(path: string | null): string | null {
  if (!path) return null;
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!base) return null;
  return `${base}/storage/v1/object/public/${SCREENSHOT_BUCKET}/${path}`;
}

export function getBrandLogoUrl(path: string | null): string | null {
  if (!path) return null;
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!base) return null;
  return `${base}/storage/v1/object/public/${BRAND_ASSETS_BUCKET}/${path}`;
}
