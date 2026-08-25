import sharp from "sharp";

// Server-only image normalization for uploads. Never import from a Client
// Component — sharp is a native module and must stay out of the browser bundle.
//
// Screenshots arrived as whatever the admin dragged in (a 900KB full-resolution
// PNG, in practice). Every cold image-optimizer request had to pull that whole
// file out of Supabase Storage before it could produce a single thumbnail, and
// that transfer is most of the delay before a screenshot appears. Re-encoding
// once at upload time turns it into ~50–100KB of WebP.

const SCREENSHOT_MAX_WIDTH = 1600;
const BRAND_LOGO_MAX_WIDTH = 256;

// Guards against decompression-bomb inputs (sharp's own default, made explicit).
const MAX_INPUT_PIXELS = 268402689;

export interface ProcessedImage {
  data: Buffer;
  contentType: "image/webp";
  extension: "webp";
  /** Inline base64 LQIP — a handful of bytes, shown while the real file loads. */
  blurDataUrl: string;
}

async function process(input: Buffer, maxWidth: number, quality: number): Promise<ProcessedImage> {
  // sharp throws on anything it can't decode, which double-checks the
  // client-declared MIME type against the actual bytes.
  const source = sharp(input, { limitInputPixels: MAX_INPUT_PIXELS })
    // Bake in EXIF orientation; the metadata is dropped below.
    .rotate();

  const data = await source
    .resize({ width: maxWidth, withoutEnlargement: true })
    .webp({ quality, effort: 5 })
    .toBuffer();

  const blur = await sharp(data).resize({ width: 16 }).webp({ quality: 40 }).toBuffer();

  return {
    data,
    contentType: "image/webp",
    extension: "webp",
    blurDataUrl: `data:image/webp;base64,${blur.toString("base64")}`
  };
}

export async function processScreenshot(input: Buffer): Promise<ProcessedImage> {
  return process(input, SCREENSHOT_MAX_WIDTH, 78);
}

export async function processBrandLogo(input: Buffer): Promise<ProcessedImage> {
  return process(input, BRAND_LOGO_MAX_WIDTH, 90);
}
