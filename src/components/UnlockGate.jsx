// This is the "reward" ad type in FITRER's monetization architecture —
// "watch an ad to unlock X" (premium templates, fonts, HD export, bulk
// generation). It is intentionally separate from AdSlot.jsx (passive
// display/affiliate/sponsored/referral placements) — different
// interaction, different purpose, kept as its own system on purpose.
// No real ad/reward provider is connected yet; this shows a
// placeholder and calls onUnlock() once the wait completes.
import { useEffect, useRef, useState } from "react";

export default function UnlockGate({ c, accent, title, message, onUnlock, onClose }) {
  const [ready, setReady] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    timerRef.current = setTimeout(() => setReady(true), 3000);
    return () => clearTimeout(timerRef.current);
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.55)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 100,
        padding: "20px",
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: c.surface,
          border: `1px solid ${c.border}`,
          borderRadius: "16px",
          padding: "22px",
          maxWidth: "360px",
          width: "100%",
        }}
      >
        <div style={{ fontSize: "26px", marginBottom: "6px" }}>👑</div>
        <h3 style={{ margin: "0 0 4px", fontSize: "16px", fontWeight: 800, color: c.text }}>{title}</h3>
        <p style={{ margin: "0 0 16px", fontSize: "13px", color: c.textDim }}>{message}</p>

        <div
          style={{
            border: `1px dashed ${c.border}`,
            borderRadius: "10px",
            padding: "28px 12px",
            textAlign: "center",
            fontSize: "12px",
            color: c.placeholder,
            marginBottom: "16px",
            background: c.surfaceAlt,
          }}
        >
          Advertisement
        </div>

        <button
          onClick={() => ready && onUnlock()}
          disabled={!ready}
          style={{
            width: "100%",
            border: "none",
            borderRadius: "10px",
            padding: "13px",
            fontSize: "14.5px",
            fontWeight: 700,
            color: "#FFFFFF",
            background: ready ? accent : c.border,
            cursor: ready ? "pointer" : "default",
          }}
        >
          {ready ? "Unlock" : "Loading…"}
        </button>

        <button
          onClick={onClose}
          style={{ width: "100%", background: "none", border: "none", color: c.textDim, fontSize: "12.5px", padding: "10px 0 0", cursor: "pointer" }}
        >
          Cancel
        </button>

        <p style={{ textAlign: "center", fontSize: "11px", color: c.placeholder, marginTop: "12px" }}>
          ✓ No account needed. 100% free.
        </p>
      </div>
    </div>
  );
}