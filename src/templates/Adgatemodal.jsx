// This is also part of the "reward" ad type — same category as
// UnlockGate.jsx (see its top comment), specifically for the template
// download flow. Kept architecturally separate from AdSlot.jsx (the
// passive display/affiliate/sponsored/referral placements).
import { useEffect, useRef, useState } from "react";
// html2canvas is loaded on demand (below), not at page load — it's a
// heavy library and most visitors never touch the download flow, so
// there's no reason to make everyone pay for it on a slow connection.

// Simple in-page frequency cap: only the first couple of downloads per
// visit get the full ad-view wait. After that, the ad still shows (it
// still earns impressions) but doesn't force a wait — this keeps the
// site from feeling like it's nagging someone who's actively editing
// several designs in one sitting. Resets naturally on page reload,
// nothing is stored.
let sessionGateCount = 0;
const FULL_WAIT_MS = 4000;
const SHORT_WAIT_MS = 800;

export default function AdGateModal({ c, accent, targetRef, fileName, scale = 2, onClose }) {
  const [ready, setReady] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    const wait = sessionGateCount < 2 ? FULL_WAIT_MS : SHORT_WAIT_MS;
    timerRef.current = setTimeout(() => {
      setReady(true);
      sessionGateCount += 1;
    }, wait);
    return () => clearTimeout(timerRef.current);
  }, []);

  const handleDownload = async () => {
    if (!ready || !targetRef.current) return;
    setDownloading(true);
    try {
      const { default: html2canvas } = await import("html2canvas");
      const canvas = await html2canvas(targetRef.current, { scale, useCORS: true });
      canvas.toBlob((blob) => {
        if (!blob) {
          setDownloading(false);
          return;
        }
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${fileName}.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        setDownloading(false);
        onClose();
      }, "image/png");
    } catch (e) {
      setDownloading(false);
    }
  };

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
        <h3 style={{ margin: "0 0 4px", fontSize: "16px", fontWeight: 800, color: c.text }}>Almost there</h3>
        <p style={{ margin: "0 0 16px", fontSize: "13px", color: c.textDim }}>
          Your download starts right after this. FITRER stays free because of ads like this one — nothing you make is
          ever saved or uploaded.
        </p>

        <div
          style={{
            border: `1px dashed ${c.border}`,
            borderRadius: "10px",
            padding: "28px 12px",
            textAlign: "center",
            fontSize: "12px",
            color: c.placeholder,
            marginBottom: "16px",
          }}
        >
          Advertisement
        </div>

        <button
          onClick={handleDownload}
          disabled={!ready || downloading}
          style={{
            width: "100%",
            border: "none",
            borderRadius: "10px",
            padding: "13px",
            fontSize: "14.5px",
            fontWeight: 700,
            color: "#FFFFFF",
            background: ready ? accent : c.border,
            cursor: ready && !downloading ? "pointer" : "default",
            opacity: downloading ? 0.7 : 1,
          }}
        >
          {downloading ? "Preparing your file…" : ready ? "Download Now" : "Loading…"}
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