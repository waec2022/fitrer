import { useRef, useState } from "react";
import UnlockGate from "../components/UnlockGate.jsx";

const loadImage = (src) =>
  new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });

// Redraws any source image (including formats jsPDF can't embed
// directly, like WebP) onto a canvas and exports it as a PNG data
// URL — this makes every accepted image format behave identically
// and reliably inside the PDF.
const toPngDataUrl = (img) => {
  const canvas = document.createElement("canvas");
  canvas.width = img.naturalWidth;
  canvas.height = img.naturalHeight;
  const ctx = canvas.getContext("2d");
  ctx.drawImage(img, 0, 0);
  return canvas.toDataURL("image/png");
};

export default function ImagesToPdf({ c, accent, onBack }) {
  const [images, setImages] = useState([]); // [{ id, dataUrl }]
  const [orientation, setOrientation] = useState("portrait");
  const [pageSize, setPageSize] = useState("a4");
  const [exporting, setExporting] = useState(false);
  const [unlocked, setUnlocked] = useState(false);
  const [showUnlock, setShowUnlock] = useState(false);
  const inputRef = useRef(null);

  const handleFiles = (e) => {
    const files = Array.from(e.target.files || []);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        setImages((prev) => [...prev, { id: `${Date.now()}-${Math.random()}`, dataUrl: reader.result }]);
      };
      reader.readAsDataURL(file);
    });
    e.target.value = "";
  };

  const removeImage = (id) => setImages((prev) => prev.filter((img) => img.id !== id));

  const moveImage = (index, dir) => {
    setImages((prev) => {
      const next = [...prev];
      const target = index + dir;
      if (target < 0 || target >= next.length) return prev;
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  };

  const doExport = async () => {
    setExporting(true);
    try {
      const { jsPDF } = await import("jspdf");
      const pdf = new jsPDF({ orientation, unit: "mm", format: pageSize });
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      for (let i = 0; i < images.length; i++) {
        if (i > 0) pdf.addPage(pageSize, orientation);
        const img = await loadImage(images[i].dataUrl);
        const ratio = Math.min(pageWidth / img.width, pageHeight / img.height);
        const w = img.width * ratio;
        const h = img.height * ratio;
        const x = (pageWidth - w) / 2;
        const y = (pageHeight - h) / 2;
        pdf.addImage(toPngDataUrl(img), "PNG", x, y, w, h);
      }
      pdf.save("images.pdf");
    } catch (e) {
      /* export failed silently — exporting flag still resets below */
    } finally {
      setExporting(false);
    }
  };

  const handleDownloadClick = () => {
    if (images.length === 0) return;
    if (!unlocked) {
      setShowUnlock(true);
      return;
    }
    doExport();
  };

  const handleUnlock = () => {
    setUnlocked(true);
    setShowUnlock(false);
    doExport();
  };

  return (
    <div style={{ maxWidth: "620px", margin: "0 auto", padding: "24px 20px 60px" }}>
      <button onClick={onBack} style={{ background: "none", border: "none", color: c.textDim, fontSize: "14px", cursor: "pointer", marginBottom: "16px", padding: 0 }}>
        ← Back
      </button>

      <h1 style={{ fontSize: "20px", fontWeight: 800, color: c.text, margin: "0 0 4px" }}>Images → PDF</h1>
      <p style={{ fontSize: "13px", color: c.textDim, margin: "0 0 18px" }}>
        Combine multiple images into one PDF — everything happens in your browser.
      </p>

      <div
        onClick={() => inputRef.current?.click()}
        style={{
          border: `2px dashed ${c.border}`,
          borderRadius: "14px",
          padding: "34px 16px",
          textAlign: "center",
          cursor: "pointer",
          marginBottom: "18px",
          color: c.textDim,
          fontSize: "13px",
        }}
      >
        Tap to add images
        <input ref={inputRef} type="file" accept="image/png,image/jpeg,image/webp" multiple onChange={handleFiles} style={{ display: "none" }} />
      </div>

      {images.length > 0 && (
        <>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "18px" }}>
            {images.map((img, i) => (
              <div key={img.id} style={{ display: "flex", alignItems: "center", gap: "10px", border: `1px solid ${c.border}`, borderRadius: "10px", padding: "8px" }}>
                <img src={img.dataUrl} alt="" style={{ width: "44px", height: "44px", objectFit: "cover", borderRadius: "6px", flexShrink: 0 }} />
                <div style={{ flex: 1, fontSize: "12px", color: c.textDim }}>Page {i + 1}</div>
                <button onClick={() => moveImage(i, -1)} disabled={i === 0} style={{ background: "none", border: "none", color: i === 0 ? c.placeholder : c.text, cursor: i === 0 ? "default" : "pointer", fontSize: "14px", padding: "4px" }}>
                  ↑
                </button>
                <button onClick={() => moveImage(i, 1)} disabled={i === images.length - 1} style={{ background: "none", border: "none", color: i === images.length - 1 ? c.placeholder : c.text, cursor: i === images.length - 1 ? "default" : "pointer", fontSize: "14px", padding: "4px" }}>
                  ↓
                </button>
                <button onClick={() => removeImage(img.id)} style={{ background: "none", border: "none", color: "#E5484D", cursor: "pointer", fontSize: "16px", padding: "4px" }}>
                  ×
                </button>
              </div>
            ))}
          </div>

          <div style={{ fontSize: "12px", fontWeight: 700, color: c.textDim, marginBottom: "8px" }}>Page size</div>
          <div style={{ display: "flex", gap: "8px", marginBottom: "14px" }}>
            {["a4", "letter"].map((s) => (
              <button
                key={s}
                onClick={() => setPageSize(s)}
                style={{
                  flex: 1,
                  padding: "9px",
                  borderRadius: "10px",
                  fontSize: "12.5px",
                  fontWeight: 700,
                  cursor: "pointer",
                  border: `1px solid ${pageSize === s ? accent : c.border}`,
                  background: pageSize === s ? accent : "transparent",
                  color: pageSize === s ? "#FFFFFF" : c.text,
                  textTransform: "uppercase",
                }}
              >
                {s}
              </button>
            ))}
          </div>

          <div style={{ fontSize: "12px", fontWeight: 700, color: c.textDim, marginBottom: "8px" }}>Orientation</div>
          <div style={{ display: "flex", gap: "8px", marginBottom: "20px" }}>
            {["portrait", "landscape"].map((o) => (
              <button
                key={o}
                onClick={() => setOrientation(o)}
                style={{
                  flex: 1,
                  padding: "9px",
                  borderRadius: "10px",
                  fontSize: "12.5px",
                  fontWeight: 700,
                  cursor: "pointer",
                  border: `1px solid ${orientation === o ? accent : c.border}`,
                  background: orientation === o ? accent : "transparent",
                  color: orientation === o ? "#FFFFFF" : c.text,
                  textTransform: "capitalize",
                }}
              >
                {o}
              </button>
            ))}
          </div>

          <button
            onClick={handleDownloadClick}
            disabled={exporting}
            style={{
              width: "100%",
              background: accent,
              border: "none",
              borderRadius: "10px",
              color: "#FFFFFF",
              fontSize: "14.5px",
              fontWeight: 700,
              padding: "13px",
              cursor: exporting ? "default" : "pointer",
              opacity: exporting ? 0.7 : 1,
            }}
          >
            {exporting ? "Creating PDF…" : `Create PDF (${images.length} ${images.length === 1 ? "page" : "pages"})`}
          </button>

          <p style={{ fontSize: "11.5px", color: c.placeholder, textAlign: "center", marginTop: "10px" }}>
            Downloads straight to your device. Nothing is stored on FITRER.
          </p>
        </>
      )}

      {showUnlock && (
        <UnlockGate
          c={c}
          accent={accent}
          title="Unlock PDF creation"
          message="Watch a short ad to unlock creating your PDF, free — no account needed."
          onUnlock={handleUnlock}
          onClose={() => setShowUnlock(false)}
        />
      )}
    </div>
  );
}