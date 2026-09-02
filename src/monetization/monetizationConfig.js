// Central monetization configuration.
//
// Nothing in this file connects to a real advertising network. Every
// provider below is currently disabled — this is the placement
// architecture only, built so a real, approved provider can be wired
// in later by editing exactly one place, not by hunting through every
// page's JSX.

// Automatically true during `npm run dev`, automatically false in a
// production build (`npm run build`) — via Vite's built-in import.meta.env.DEV.
// This is deliberate: a manually-set flag can be forgotten before
// deploying, but this can't be, since it's tied to the build itself.
// Only flip FORCE_DEV_PLACEHOLDERS if you specifically want to preview
// placeholder layout inside a production build for testing — leave it
// false for a real deployment.
const FORCE_DEV_PLACEHOLDERS = false;
export const SHOW_DEV_PLACEHOLDERS = FORCE_DEV_PLACEHOLDERS || import.meta.env.DEV;

// Master per-provider switches. Two separate flags, on purpose:
// - `enabled`: you want this provider active.
// - `hasRealCode`: real, approved code for it actually exists in
//   AdSlot.jsx.
// A slot only ever renders as "live" when BOTH are true. This stops a
// slot from silently going blank in production because `enabled` was
// flipped on before the real code was actually added — the two-step
// gate makes that mistake structurally impossible, not just unlikely.
//
// What each provider will need before `hasRealCode` can honestly be
// set to true (nothing below is a real credential — these are notes
// on what to obtain, not values to fill in):
// - adsense: an approved AdSense Publisher ID + ad unit slot ID, from
//   your AdSense dashboard once the account is approved.
// - monetag: an approved Zone ID / ad tag, from your Monetag dashboard.
// - adsterra: an approved ad unit code, from your Adsterra dashboard.
// - propellerads: an approved zone ID / ad code, from your
//   PropellerAds dashboard.
export const PROVIDERS = {
  adsense: { name: "Google AdSense", enabled: false, hasRealCode: false },
  monetag: { name: "Monetag", enabled: false, hasRealCode: false },
  adsterra: { name: "Adsterra", enabled: false, hasRealCode: false },
  propellerads: { name: "PropellerAds", enabled: false, hasRealCode: false },
};

export function isProviderEnabled(providerId) {
  return !!PROVIDERS[providerId]?.enabled;
}

// The real production gate — true only once a provider is both
// enabled AND has real code wired in.
export function isProviderLive(providerId) {
  const p = PROVIDERS[providerId];
  return !!(p?.enabled && p?.hasRealCode);
}

// Page-by-page placement map. Each entry is a list of the ad slots
// configured for that page — not every page needs every channel, and
// this is exactly where that's decided, in one place. `page` keys
// match FITRER's internal view names.
export const PAGE_PLACEMENTS = {
  home: [
    { id: "AD_HOME_TOP", kind: "display", provider: "adsense" },
    { id: "AFF_HOME_RECOMMENDED", kind: "affiliate" },
  ],
  templates: [
    { id: "AD_TEMPLATES_BETWEEN_GROUPS", kind: "display", provider: "monetag" },
    { id: "AFF_TEMPLATES_DESIGN_TOOLS", kind: "affiliate" },
  ],
  editor: [], // template editor — keep clear of the editing surface
  cv: [
    { id: "AD_CV_AFTER_DOWNLOAD", kind: "display", provider: "adsense" },
    { id: "AFF_CV_CAREER_TOOLS", kind: "affiliate" },
  ],
  letter: [
    { id: "AD_LETTER_AFTER_DOWNLOAD", kind: "display", provider: "adsense" },
    { id: "AFF_LETTER_BUSINESS_TOOLS", kind: "affiliate" },
  ],
  "pdf-to-images": [{ id: "AD_PDF_AFTER_CONVERSION", kind: "display", provider: "adsterra" }],
  "images-to-pdf": [{ id: "AD_IMG2PDF_AFTER_CONVERSION", kind: "display", provider: "adsterra" }],
  "text-in-image": [
    { id: "AD_TEXTIMG_AFTER_DOWNLOAD", kind: "display", provider: "propellerads" },
    { id: "AFF_TEXTIMG_RECOMMENDED", kind: "affiliate" },
  ],
  password: [], // keep advertising minimal here, by design — never beside security controls
};

// Sticky bottom banner: explicitly opt-in per page, and explicitly
// OFF wherever an active editor's controls live, so it can never cover
// Download/Export/Add Section or similar.
export const STICKY_BANNER_PAGES = {
  home: true,
  templates: true,
  editor: false,
  cv: false,
  letter: false,
  "pdf-to-images": true,
  "images-to-pdf": true,
  "text-in-image": false,
  password: false,
};