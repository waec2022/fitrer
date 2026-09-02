import { useRef, useState } from "react";
import UnlockGate from "../components/UnlockGate.jsx";

const clamp = (v, min, max) => Math.min(max, Math.max(min, v));

export default function TextInImageEditor({ c, accent, onBack }) {
  const [image, setImage] = useState(null); // data URL
  const [regions, setRegions] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [detecting, setDetecting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [detectError, setDetectError] = useState(false);
  const [format, setFormat] = useState("png");
  const [exporting, setExporting] = useState(false);
  const [unlocked, setUnlocked] = useState(false);
  const [showUnlock, setShowUnlock] = useState(false);

  const wrapRef = useRef(null);
  const imgElRef = useRef(null);
  const fileInputRef = useRef(null);
  const dragRef = useRef(null);

  const active = regions.find((r) => r.id === activeId) || null;

  const handleUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setImage(reader.result);
      setRegions([]);
      setActiveId(null);
      setDetectError(false);
    };
    reader.readAsDataURL(file);
  };

  const handleDetect = async () => {
    if (!image || !imgElRef.current) return;
    setDetecting(true);
    setProgress(0);
    setDetectError(false);
    try {
      const { createWorker } = await import("tesseract.js");
      const worker = await createWorker("eng", 1, {
        logger: (m) => {
          if (m.status === "recognizing text") setProgress(Math.round((m.progress || 0) * 100));
        },
      });
      const { data } = await worker.recognize(image);
      await worker.terminate();

      const naturalW = imgElRef.current.naturalWidth;
      const naturalH = imgElRef.current.naturalHeight;

      const detected = (data.lines || [])
        .filter((l) => l.text.trim().length > 0)
        .map((l, i) => {
          const wPct = ((l.bbox.x1 - l.bbox.x0) / naturalW) * 100;
          const hPct = ((l.bbox.y1 - l.bbox.y0) / naturalH) * 100;
          return {
            id: `region-${Date.now()}-${i}`,
            text: l.text.trim(),
            xPct: (l.bbox.x0 / naturalW) * 100,
            yPct: (l.bbox.y0 / naturalH) * 100,
            wPct: Math.max(wPct, 10),
            hPct: Math.max(hPct, 4),
            fontSize: 16,
            color: "#000000",
            coverColor: "#FFFFFF",
            align: "left",
          };
        });
      setRegions(detected);
      if (detected.length === 0) setDetectError(true);
    } catch (e) {
      setDetectError(true);
    } finally {
      setDetecting(false);
    }
  };

  const addRegion = () => {
    const id = `region-${Date.now()}`;
    setRegions((prev) => [
      ...prev,
      { id, text: "New text", xPct: 30, yPct: 40, wPct: 30, hPct: 8, fontSize: 18, color: "#000000", coverColor: "#FFFFFF", align: "left" },
    ]);
    setActiveId(id);
  };

  const updateRegion = (id, patch) => setRegions((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  const deleteRegion = (id) => {
    setRegions((prev) => prev.filter((r) => r.id !== id));
    if (activeId === id) setActiveId(null);
  };

  const onDrag = (e) => {
    const d = dragRef.current;
    if (!d) return;
    const dxPct = ((e.clientX - d.startX) / d.rectW) * 100;
    const dyPct = ((e.clientY - d.startY) / d.rectH) * 100;
    updateRegion(d.id, {
      xPct: clamp(d.startXPct + dxPct, 0, 92),
      yPct: clamp(d.startYPct + dyPct, 0, 92),
    });
  };

  const endDrag = () => {
    dragRef.current = null;
    window.removeEventListener("pointermove", onDrag);
    window.removeEventListener("pointerup", endDrag);
    window.removeEventListener("pointercancel", endDrag);
  };

  const startDrag = (e, id) => {
    e.preventDefault();
    e.stopPropagation();
    setActiveId(id);
    const rect = wrapRef.current.getBoundingClientRect();
    const region = regions.find((r) => r.id === id);
    dragRef.current = { id, startX: e.clientX, startY: e.clientY, startXPct: region.xPct, startYPct: region.yPct, rectW: rect.width, rectH: rect.height };
    window.addEventListener("pointermove", onDrag);
    window.addEventListener("pointerup", endDrag);
    window.addEventListener("pointercancel", endDrag);
  };

  const doExport = async () => {
    setExporting(true);
    setActiveId(null);
    await new Promise((r) => setTimeout(r, 50)); // let the selection outline clear before capture
    try {
      const { default: html2canvas } = await import("html2canvas");
      const canvas = await html2canvas(wrapRef.current, { scale: 2, useCORS: true });

      if (format === "pdf") {
        const { jsPDF } = await import("jspdf");
        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF({ orientation: canvas.width >= canvas.height ? "landscape" : "portrait", unit: "px", format: [canvas.width, canvas.height] });
        pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height);
        pdf.save("edited-image.pdf");
        setExporting(false);
        return;
      }

      const mime = format === "jpg" ? "image/jpeg" : "image/png";
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            setExporting(false);
            return;
          }
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = `edited-image.${format === "jpg" ? "jpg" : "png"}`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
          setExporting(false);
        },
        mime,
        0.92
      );
    } catch (e) {
      setExporting(false);
    }
  };

  const handleDownloadClick = () => {
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

      <h1 style={{ fontSize: "20px", fontWeight: 800, color: c.text, margin: "0 0 4px" }}>Text-in-Image Editor</h1>
      <p style={{ fontSize: "13px", color: c.textDim, margin: "0 0 18px" }}>
        Upload an image, detect the text in it, then edit, move, or replace any of it. Nothing is uploaded to a
        server — detection runs in your browser.
      </p>

      {!image && (
        <div
          onClick={() => fileInputRef.current?.click()}
          style={{ border: `2px dashed ${c.border}`, borderRadius: "14px", padding: "34px 16px", textAlign: "center", cursor: "pointer", color: c.textDim, fontSize: "13px" }}
        >
          Tap to choose an image
        </div>
      )}
      <input ref={fileInputRef} type="file" accept="image/png,image/jpeg,image/webp" onChange={handleUpload} style={{ display: "none" }} />

      {image && (
        <>
          <div
            ref={wrapRef}
            style={{ position: "relative", width: "100%", borderRadius: "14px", overflow: "hidden", marginBottom: "14px", boxShadow: "0 8px 30px rgba(0,0,0,0.18)" }}
          >
            <img ref={imgElRef} src={image} alt="" style={{ width: "100%", display: "block" }} />
            {regions.map((r) => (
              <div
                key={r.id}
                onPointerDown={(e) => startDrag(e, r.id)}
                onClick={() => setActiveId(r.id)}
                style={{
                  position: "absolute",
                  left: `${r.xPct}%`,
                  top: `${r.yPct}%`,
                  width: `${r.wPct}%`,
                  minHeight: `${r.hPct}%`,
                  background: r.coverColor,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: r.align === "center" ? "center" : r.align === "right" ? "flex-end" : "flex-start",
                  padding: "2px 4px",
                  cursor: "move",
                  touchAction: "none",
                  boxSizing: "border-box",
                  border: activeId === r.id ? `2px solid ${accent}` : "2px solid transparent",
                }}
              >
                <span style={{ fontSize: `${r.fontSize}px`, color: r.color, fontFamily: "Arial, sans-serif", whiteSpace: "pre-wrap", wordBreak: "break-word", lineHeight: 1.2 }}>
                  {r.text}
                </span>
              </div>
            ))}
          </div>

          <div style={{ display: "flex", gap: "8px", marginBottom: "16px" }}>
            <button
              onClick={handleDetect}
              disabled={detecting}
              style={{ flex: 1, padding: "11px", borderRadius: "10px", border: "none", background: accent, color: "#FFFFFF", fontWeight: 700, fontSize: "13px", cursor: detecting ? "default" : "pointer", opacity: detecting ? 0.7 : 1 }}
            >
              {detecting ? `Detecting text… ${progress}%` : "Detect Text"}
            </button>
            <button
              onClick={addRegion}
              style={{ padding: "11px 14px", borderRadius: "10px", border: `1px solid ${accent}`, background: "transparent", color: accent, fontWeight: 700, fontSize: "13px", cursor: "pointer" }}
            >
              + Add Text
            </button>
          </div>

          {detectError && (
            <div style={{ color: "#E5484D", fontSize: "12.5px", marginBottom: "14px", textAlign: "center" }}>
              Couldn't detect readable text in this image — you can still add text manually with "+ Add Text".
            </div>
          )}

          {active && (
            <div style={{ background: c.surface, border: `1px solid ${c.border}`, borderRadius: "14px", padding: "16px", marginBottom: "20px" }}>
              <div style={{ fontSize: "11px", fontWeight: 700, color: c.textDim, marginBottom: "6px" }}>Text</div>
              <textarea
                value={active.text}
                onChange={(e) => updateRegion(active.id, { text: e.target.value })}
                style={{ width: "100%", minHeight: "60px", padding: "10px", borderRadius: "10px", border: `1px solid ${c.border}`, background: c.surfaceAlt, color: c.text, fontSize: "13px", marginBottom: "12px", resize: "vertical" }}
              />

              <div style={{ display: "flex", gap: "16px", marginBottom: "12px", flexWrap: "wrap" }}>
                <div>
                  <div style={{ fontSize: "11px", fontWeight: 700, color: c.textDim, marginBottom: "6px" }}>Text Color</div>
                  <input type="color" value={active.color} onChange={(e) => updateRegion(active.id, { color: e.target.value })} style={{ width: "34px", height: "34px", border: `1px solid ${c.border}`, borderRadius: "8px", padding: 0, cursor: "pointer" }} />
                </div>
                <div>
                  <div style={{ fontSize: "11px", fontWeight: 700, color: c.textDim, marginBottom: "6px" }}>Cover Color</div>
                  <input type="color" value={active.coverColor} onChange={(e) => updateRegion(active.id, { coverColor: e.target.value })} style={{ width: "34px", height: "34px", border: `1px solid ${c.border}`, borderRadius: "8px", padding: 0, cursor: "pointer" }} />
                </div>
                <div>
                  <div style={{ fontSize: "11px", fontWeight: 700, color: c.textDim, marginBottom: "6px" }}>Font Size</div>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <button onClick={() => updateRegion(active.id, { fontSize: Math.max(8, active.fontSize - 2) })} style={{ width: "28px", height: "28px", borderRadius: "8px", border: `1px solid ${c.border}`, background: "transparent", color: c.text, cursor: "pointer" }}>−</button>
                    <span style={{ fontSize: "12.5px", color: c.text, minWidth: "24px", textAlign: "center" }}>{active.fontSize}</span>
                    <button onClick={() => updateRegion(active.id, { fontSize: Math.min(72, active.fontSize + 2) })} style={{ width: "28px", height: "28px", borderRadius: "8px", border: `1px solid ${c.border}`, background: "transparent", color: c.text, cursor: "pointer" }}>+</button>
                  </div>
                </div>
              </div>

              <div style={{ fontSize: "11px", fontWeight: 700, color: c.textDim, marginBottom: "6px" }}>Alignment</div>
              <div style={{ display: "flex", gap: "6px", marginBottom: "14px" }}>
                {["left", "center", "right"].map((a) => (
                  <button
                    key={a}
                    onClick={() => updateRegion(active.id, { align: a })}
                    style={{ flex: 1, padding: "7px", borderRadius: "8px", fontSize: "12px", fontWeight: 600, cursor: "pointer", border: `1px solid ${active.align === a ? accent : c.border}`, background: active.align === a ? accent : "transparent", color: active.align === a ? "#FFFFFF" : c.text, textTransform: "capitalize" }}
                  >
                    {a}
                  </button>
                ))}
              </div>

              <button onClick={() => deleteRegion(active.id)} style={{ width: "100%", padding: "9px", borderRadius: "10px", border: "1px solid #E5484D", background: "transparent", color: "#E5484D", fontWeight: 700, fontSize: "12.5px", cursor: "pointer" }}>
                Delete this text
              </button>
            </div>
          )}

          <div style={{ display: "flex", gap: "8px", marginBottom: "12px" }}>
            {["png", "jpg", "pdf"].map((f) => (
              <button
                key={f}
                onClick={() => setFormat(f)}
                style={{ flex: 1, padding: "10px", borderRadius: "10px", fontSize: "12.5px", fontWeight: 700, cursor: "pointer", border: `1px solid ${format === f ? accent : c.border}`, background: format === f ? accent : "transparent", color: format === f ? "#FFFFFF" : c.text, textTransform: "uppercase" }}
              >
                {f}
              </button>
            ))}
          </div>

          <button
            onClick={handleDownloadClick}
            disabled={exporting}
            style={{ width: "100%", background: accent, border: "none", borderRadius: "10px", color: "#FFFFFF", fontSize: "14.5px", fontWeight: 700, padding: "13px", cursor: exporting ? "default" : "pointer", opacity: exporting ? 0.7 : 1 }}
          >
            {exporting ? "Preparing your file…" : `Download ${format.toUpperCase()}`}
          </button>

          <p style={{ fontSize: "11.5px", color: c.placeholder, textAlign: "center", marginTop: "10px" }}>
            Downloads straight to your device. Nothing is stored on FITRER.
          </p>

          <button
            onClick={() => {
              setImage(null);
              setRegions([]);
              setActiveId(null);
            }}
            style={{ display: "block", margin: "14px auto 0", background: "none", border: "none", color: c.textDim, fontSize: "11.5px", textDecoration: "underline", cursor: "pointer" }}
          >
            Start over with a different image
          </button>
        </>
      )}

      {showUnlock && (
        <UnlockGate
          c={c}
          accent={accent}
          title="Unlock download"
          message="Watch a short ad to unlock downloading your edited image, free — no account needed."
          onUnlock={handleUnlock}
          onClose={() => setShowUnlock(false)}
        />
      )}
    </div>
  );
}