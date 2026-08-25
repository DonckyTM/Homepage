// Screenshot delivery settings, shared by the <Image> components and by the
// preload link in app/page.tsx so both request the exact same byte range.
//
// Project screenshots render in two places at nearly the same size: the card
// grid (~460 CSS px) and the project modal (~620 CSS px). Letting next/image
// build a full srcset meant the modal fetched a different variant than the card
// had already downloaded, so opening a project started a second cold request.
// Pinning both to one width means one optimizer run, one download, one cache
// entry — and the modal opens from cache.
//
// 1200 covers every real case: 620 CSS px at 2x DPR, and a full-width card on
// a 3x phone. It must stay a member of images.deviceSizes (next.config.mjs),
// otherwise the optimizer rejects the request.
export const SCREENSHOT_WIDTH = 1200;
export const SCREENSHOT_QUALITY = 75;

interface LoaderArgs {
  src: string;
}

// width/quality from next/image are deliberately ignored — see above.
export function screenshotLoader({ src }: LoaderArgs): string {
  return `/_next/image?url=${encodeURIComponent(src)}&w=${SCREENSHOT_WIDTH}&q=${SCREENSHOT_QUALITY}`;
}

// Layout hint for the browser. It does not affect which file is requested (the
// loader above pins that) — it only has to describe the real rendered box, and
// is shared by the card grid and the modal because they render at the same size.
export const SCREENSHOT_SIZES = "(max-width: 720px) 100vw, 620px";
