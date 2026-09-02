// Reusable, provider-agnostic advertisement placement architecture.
//
// Nothing here connects to a real ad network yet — these are labeled,
// responsive placeholder slots so a real provider (Google AdSense, an
// affiliate link, a direct sponsor, or a referral/CPA offer) can be
// dropped in later without redesigning any page. Each type is
// independently swappable — replacing one provider never means
// touching the others.
//
// This is architecturally SEPARATE from the existing ad-gated unlock
// system (UnlockGate.jsx / AdGateModal.jsx), which is untouched and
// still handles "watch an ad to unlock X" — a reward interaction, not
// a passive display ad. See the note at the top of those two files.

const TYPE_CONFIG = {
  adsense: { label: "Advertisement" },
  sponsored: { label: "Sponsored" },
  affiliate: { label: "Affiliate" },
  referral: { label: "Offer" },
};

export default function AdSlot({ c, type = "adsense", placement = "" }) {
  const config = TYPE_CONFIG[type] || TYPE_CONFIG.adsense;
  // Affiliate/sponsored/referral slots get a distinct border so they
  // never look like FITRER's own buttons or controls — the person
  // interacting with one should always know it's not a site feature.
  const distinct = type !== "adsense";

  return (
    <div
      data-ad-type={type}
      data-ad-placement={placement}
      style={{
        border: `1px ${distinct ? "solid" : "dashed"} ${c.border}`,
        borderRadius: "12px",
        padding: "22px 18px",
        textAlign: "center",
        marginTop: "8px",
        marginBottom: "32px",
        color: c.textDim,
        fontSize: "11px",
        letterSpacing: "0.08em",
        textTransform: "uppercase",
        background: distinct ? c.surfaceAlt : "transparent",
      }}
    >
      {config.label}
    </div>
  );
}

// Convenience wrappers — same underlying slot, fixed type, so each
// monetization method stays independently swappable later without
// hunting through every usage in the codebase to change its type.
export function AffiliateSlot(props) {
  return <AdSlot {...props} type="affiliate" />;
}

export function SponsoredSlot(props) {
  return <AdSlot {...props} type="sponsored" />;
}

export function ReferralSlot(props) {
  return <AdSlot {...props} type="referral" />;
}