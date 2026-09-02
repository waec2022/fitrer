// Reusable, provider-agnostic advertisement placement architecture.
//
// Nothing here connects to a real ad network yet — these are labeled,
// responsive placeholder slots so a real provider (Google AdSense,
// Monetag, Adsterra, PropellerAds, an affiliate link, a direct
// sponsor, or a referral/CPA offer) can be dropped in later without
// redesigning any page. Each type is independently swappable —
// replacing one provider never means touching the others. See
// src/monetization/monetizationConfig.js for the per-provider and
// per-page controls.
//
// This is architecturally SEPARATE from the existing ad-gated unlock
// system (UnlockGate.jsx / AdGateModal.jsx), which is untouched and
// still handles "watch an ad to unlock X" — a reward interaction, not
// a passive display ad. See the note at the top of those two files.

import { SHOW_DEV_PLACEHOLDERS, isProviderLive } from "../monetization/monetizationConfig.js";

const TYPE_CONFIG = {
  adsense: { label: "Google AdSense" },
  monetag: { label: "Monetag" },
  adsterra: { label: "Adsterra" },
  propellerads: { label: "PropellerAds" },
  sponsored: { label: "Sponsored" },
  affiliate: { label: "Affiliate" },
  referral: { label: "Offer" },
};

const DISPLAY_TYPES = ["adsense", "monetag", "adsterra", "propellerads"];

export default function AdSlot({ c, type = "adsense", placement = "", slotId = "" }) {
  const isDisplay = DISPLAY_TYPES.includes(type);
  const live = isDisplay && isProviderLive(type);

  // A display type that is genuinely live (approved + real code
  // wired in) renders that provider's real markup here. No provider
  // is live yet in this project, so this branch is unreachable today —
  // it exists so the real integration has an exact, obvious place to
  // go later, without a placeholder ever being mistaken for it.
  if (live) {
    return (
      <div data-ad-type={type} data-ad-placement={placement} data-slot-id={slotId}>
        {/* Real, approved ad markup for this provider goes here. */}
      </div>
    );
  }

  if (isDisplay && !SHOW_DEV_PLACEHOLDERS) return null;

  const config = TYPE_CONFIG[type] || TYPE_CONFIG.adsense;
  // Affiliate/sponsored/referral slots get a distinct border so they
  // never look like FITRER's own buttons or controls — the person
  // interacting with one should always know it's not a site feature.
  const distinct = type !== "adsense";

  return (
    <div
      data-ad-type={type}
      data-ad-placement={placement}
      data-slot-id={slotId}
      data-dev-placeholder={isDisplay ? "true" : undefined}
      style={{
        border: `1px ${distinct ? "solid" : "dashed"} ${isDisplay ? "#E5484D" : c.border}`,
        borderRadius: "12px",
        padding: "18px 18px",
        textAlign: "center",
        marginTop: "8px",
        marginBottom: "32px",
        color: c.textDim,
        background: distinct ? c.surfaceAlt : "transparent",
      }}
    >
      {isDisplay && (
        <div style={{ fontSize: "9.5px", fontWeight: 800, letterSpacing: "0.1em", color: "#E5484D", marginBottom: "6px" }}>
          DEVELOPMENT PLACEHOLDER — NOT A REAL AD
        </div>
      )}
      <div style={{ fontSize: "11px", letterSpacing: "0.08em", textTransform: "uppercase" }}>
        {config.label}{isDisplay ? " — not connected" : ""}
      </div>
    </div>
  );
}

// Convenience wrappers — same underlying slot, fixed type, so each
// monetization method stays independently swappable later without
// hunting through every usage in the codebase to change its type.
export function AdSenseSlot(props) {
  return <AdSlot {...props} type="adsense" />;
}

export function MonetagSlot(props) {
  return <AdSlot {...props} type="monetag" />;
}

export function AdsterraSlot(props) {
  return <AdSlot {...props} type="adsterra" />;
}

export function PropellerAdsSlot(props) {
  return <AdSlot {...props} type="propellerads" />;
}

export function AffiliateSlot(props) {
  return <AdSlot {...props} type="affiliate" />;
}

export function SponsoredSlot(props) {
  return <AdSlot {...props} type="sponsored" />;
}

export function ReferralSlot(props) {
  return <AdSlot {...props} type="referral" />;
}