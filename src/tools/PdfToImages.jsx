import { useRef, useState } from "react";
import UnlockGate from "../components/UnlockGate.jsx";
import { AdsterraSlot } from "../components/AdSlot.jsx";
import StickyAdSlot from "../monetization/StickyAdSlot.jsx";

export default function PdfToImages({ c, accent, onBack }) {
  const [pages, setPages] = useState([]); // [{ index, dataUrl }]
  const [selected, setSelected] = useState(new Set());
  const [format, setFormat] = useState("png");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [fileName, setFileName] = useState("document");
  const [unlocked, setUnlocked] = useState(false);
  const [showUnlock, setShowUnlock] = useState(false);
  const inputRef = useRef(null);

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name.replace(/\.pdf$/i, ""));
    setLoading(true);
    setError(false);
    setPages([]);
    setSelected(new Set());
    try {
      // Loaded on demand, right when a file is actually chosen — not
      // at page-open — matching how every other heavy library in
      // this project defers loading until the moment it's needed.
      const pdfjsLib = await import("pdfjs-dist");
      const { default: pdfjsWorker } = await import("pdfjs-dist/build/pdf.worker.min.js?url");
      pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      const rendered = [];
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 1.4 });
        const canvas = document.createElement("canvas");
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        const ctx = canvas.getContext("2d");
        await page.render({ canvasContext: ctx, viewport }).promise;
        rendered.push({ index: i, dataUrl: canvas.toDataURL("image/png") });
      }
      setPages(rendered);
      setSelected(new Set(rendered.map((p) => p.index)));
    } catch (err) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const toggleSelect = (i) => {
    setSelected((s) => {
      const next = new Set(s);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  };

  const selectAll = () => setSelected(new Set(pages.map((p) => p.index)));
  const selectNone = () => setSelected(new Set());

  const doDownload = () => {
    const chosen = pages.filter((p) => selected.has(p.index));
    chosen.forEach((p, idx) => {
      setTimeout(() => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext("2d");
          if (format === "jpg") {
            ctx.fillStyle = "#FFFFFF";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
          }
          ctx.drawImage(img, 0, 0);
          const mime = format === "jpg" ? "image/jpeg" : "image/png";
          const ext = format === "jpg" ? "jpg" : "png";
          canvas.toBlob(
            (blob) => {
              if (!blob) return;
              const url = URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url;
              a.download = `${fileName}-page-${p.index}.${ext}`;
              document.body.appendChild(a);
              a.click();
              document.body.removeChild(a);
              URL.revokeObjectURL(url);
            },
            mime,
            0.92
          );
        };
        img.src = p.dataUrl;
      }, idx * 300);
    });
  };

  const handleDownloadClick = () => {
    if (selected.size === 0) return;
    if (!unlocked) {
      setShowUnlock(true);
      return;
    }
    doDownload();
  };

  const handleUnlock = () => {
    setUnlocked(true);
    setShowUnlock(false);
    doDownload();
  };

  return (
    <div style={{ maxWidth: "620px", margin: "0 auto", padding: "24px 20px 60px" }}>
      <button onClick={onBack} style={{ background: "none", border: "none", color: c.textDim, fontSize: "14px", cursor: "pointer", marginBottom: "16px", padding: 0 }}>
        ← Back
      </button>

      <h1 style={{ fontSize: "20px", fontWeight: 800, color: c.text, margin: "0 0 4px" }}>PDF → Images</h1>
      <p style={{ fontSize: "13px", color: c.textDim, margin: "0 0 18px" }}>
        Everything happens in your browser — your PDF is never uploaded anywhere.
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
        {loading ? "Reading your PDF…" : "Tap to choose a PDF file"}
        <input ref={inputRef} type="file" accept="application/pdf" onChange={handleFile} style={{ display: "none" }} />
      </div>

      {error && (
        <div style={{ color: "#E5484D", fontSize: "13px", marginBottom: "16px", textAlign: "center" }}>
          Couldn't read that file — make sure it's a valid PDF and try again.
        </div>
      )}

      {pages.length > 0 && (
        <>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
            <div style={{ fontSize: "12.5px", fontWeight: 700, color: c.textDim }}>{pages.length} pages · {selected.size} selected</div>
            <div style={{ display: "flex", gap: "8px" }}>
              <button onClick={selectAll} style={{ fontSize: "11.5px", background: "none", border: "none", color: accent, cursor: "pointer", padding: 0 }}>
                All
              </button>
              <button onClick={selectNone} style={{ fontSize: "11.5px", background: "none", border: "none", color: c.textDim, cursor: "pointer", padding: 0 }}>
                None
              </button>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(90px, 1fr))", gap: "10px", marginBottom: "20px" }}>
            {pages.map((p) => {
              const isSelected = selected.has(p.index);
              return (
                <div
                  key={p.index}
                  onClick={() => toggleSelect(p.index)}
                  style={{
                    position: "relative",
                    border: `2px solid ${isSelected ? accent : c.border}`,
                    borderRadius: "10px",
                    overflow: "hidden",
                    cursor: "pointer",
                  }}
                >
                  <img src={p.dataUrl} alt={`Page ${p.index}`} style={{ width: "100%", display: "block" }} />
                  <div
                    style={{
                      position: "absolute",
                      bottom: "4px",
                      right: "4px",
                      background: isSelected ? accent : "rgba(0,0,0,0.55)",
                      color: "#FFFFFF",
                      fontSize: "10px",
                      fontWeight: 700,
                      padding: "2px 6px",
                      borderRadius: "6px",
                    }}
                  >
                    {p.index}
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{ display: "flex", gap: "8px", marginBottom: "12px" }}>
            {["png", "jpg"].map((f) => (
              <button
                key={f}
                onClick={() => setFormat(f)}
                style={{
                  flex: 1,
                  padding: "10px",
                  borderRadius: "10px",
                  fontSize: "12.5px",
                  fontWeight: 700,
                  cursor: "pointer",
                  border: `1px solid ${format === f ? accent : c.border}`,
                  background: format === f ? accent : "transparent",
                  color: format === f ? "#FFFFFF" : c.text,
                  textTransform: "uppercase",
                }}
              >
                {f}
              </button>
            ))}
          </div>

          <button
            onClick={handleDownloadClick}
            disabled={selected.size === 0}
            style={{
              width: "100%",
              background: accent,
              border: "none",
              borderRadius: "10px",
              color: "#FFFFFF",
              fontSize: "14.5px",
              fontWeight: 700,
              padding: "13px",
              cursor: selected.size === 0 ? "default" : "pointer",
              opacity: selected.size === 0 ? 0.5 : 1,
            }}
          >
            Download {selected.size} {selected.size === 1 ? "image" : "images"}
          </button>

          <p style={{ fontSize: "11.5px", color: c.placeholder, textAlign: "center", marginTop: "10px" }}>
            Downloads straight to your device. Nothing is stored on FITRER.
          </p>

          <AdsterraSlot c={c} placement="pdf-to-images" slotId="AD_PDF_AFTER_CONVERSION" />
        </>
      )}

      {showUnlock && (
        <UnlockGate
          c={c}
          accent={accent}
          title="Unlock download"
          message="Watch a short ad to unlock downloading these pages, free — no account needed."
          onUnlock={handleUnlock}
          onClose={() => setShowUnlock(false)}
        />
      )}

      <StickyAdSlot c={c} page="pdf-to-images" />
    </div>
  );
}