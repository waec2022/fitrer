import { useState } from "react";
import { STICKY_BANNER_PAGES } from "./monetizationConfig.js";

const BANNER_HEIGHT = 52;

export default function StickyAdSlot({ c, page }) {
  const [dismissed, setDismissed] = useState(false);
  const enabled = STICKY_BANNER_PAGES[page];

  if (!enabled || dismissed) return null;

  return (
    <>
      {/* Spacer — reserves real space in the page's own scroll flow so
          the fixed banner below never overlaps content underneath it. */}
      <div style={{ height: `${BANNER_HEIGHT}px` }} />
      <div
        style={{
          position: "fixed",
          left: 0,
          right: 0,
          bottom: 0,
          height: `${BANNER_HEIGHT}px`,
          background: c.surface,
          borderTop: `1px solid ${c.border}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 16px",
          zIndex: 40,
        }}
      >
        <span style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: c.textDim }}>
          Advertisement
        </span>
        <button
          onClick={() => setDismissed(true)}
          aria-label="Dismiss advertisement"
          style={{ background: "none", border: "none", color: c.textDim, fontSize: "18px", lineHeight: 1, cursor: "pointer", padding: "6px 8px" }}
        >
          ×
        </button>
      </div>
    </>
  );
}