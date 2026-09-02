import { useRef, useState } from "react";
import UnlockGate from "../components/UnlockGate.jsx";
import AdSlot, { AffiliateSlot } from "../components/AdSlot.jsx";
import LetterCanvas from "./LetterCanvas.jsx";
import ResponsivePagePreview from "./ResponsivePagePreview.jsx";
import { DEFAULT_LETTER, LETTER_TYPES } from "./letterData.js";
import { LETTER_DESIGNS, PAPER_SIZES, COLOR_PRESETS, STYLE_MODES } from "./documentConfig.js";

const MM_TO_PX = 3.7795;

const SECTIONS = ["Sender", "Recipient & Date", "Subject & Body", "Closing & Signature"];

const field = (c) => ({
  width: "100%",
  padding: "10px 12px",
  borderRadius: "10px",
  border: `1px solid ${c.border}`,
  background: c.surfaceAlt,
  color: c.text,
  fontSize: "13px",
  marginBottom: "10px",
});

const labelStyle = (c) => ({ fontSize: "11px", fontWeight: 700, color: c.textDim, marginBottom: "4px", display: "block" });

const pillBtn = (c, active, accent) => ({
  padding: "7px 12px",
  borderRadius: "999px",
  fontSize: "11.5px",
  fontWeight: 700,
  cursor: "pointer",
  border: `1px solid ${active ? accent : c.border}`,
  background: active ? accent : "transparent",
  color: active ? "#FFFFFF" : c.text,
});

const DESIGN_THUMB_W = 120;
const DESIGN_RENDER_W = 400;
const THUMB_SCALE = DESIGN_THUMB_W / DESIGN_RENDER_W;

function DesignThumb({ c, design }) {
  return (
    <div style={{ width: `${DESIGN_THUMB_W}px`, aspectRatio: "210 / 297", overflow: "hidden", borderRadius: "8px", border: `1px solid ${c.border}`, pointerEvents: "none" }}>
      <div style={{ width: `${DESIGN_RENDER_W}px`, transform: `scale(${THUMB_SCALE})`, transformOrigin: "top left" }}>
        <LetterCanvas
          letter={DEFAULT_LETTER}
          design={design}
          colors={COLOR_PRESETS.find((p) => p.id === "navy")}
          styleMode="professional"
          pageStyle={{ width: "100%", aspectRatio: "210 / 297" }}
          canvasRef={null}
        />
      </div>
    </div>
  );
}

export default function LetterEditor({ c, accent, onBack }) {
  const [selectedDesignId, setSelectedDesignId] = useState(null);
  const [letterType, setLetterType] = useState(LETTER_TYPES[0]);
  const [letter, setLetter] = useState(DEFAULT_LETTER);
  const [activeSection, setActiveSection] = useState("Sender");

  const [paperSize, setPaperSize] = useState("a4");
  const [orientation, setOrientation] = useState("portrait");
  const [styleMode, setStyleMode] = useState("professional");
  const [colorPresetId, setColorPresetId] = useState("navy");
  const [customColor, setCustomColor] = useState(null);
  const [marginPreset, setMarginPreset] = useState("normal");

  const [format, setFormat] = useState("pdf");
  const [unlocked, setUnlocked] = useState(false);
  const [showUnlock, setShowUnlock] = useState(false);
  const [exporting, setExporting] = useState(false);

  const cardRef = useRef(null);
  const logoInputRef = useRef(null);

  const design = LETTER_DESIGNS.find((d) => d.id === selectedDesignId) || LETTER_DESIGNS[0];
  const colors = customColor || COLOR_PRESETS.find((p) => p.id === colorPresetId) || COLOR_PRESETS[0];
  const paper = PAPER_SIZES[paperSize];
  const isLandscape = orientation === "landscape";
  const pageW = isLandscape ? paper.h : paper.w;
  const pageH = isLandscape ? paper.w : paper.h;
  const marginScale = marginPreset === "narrow" ? 0.6 : marginPreset === "wide" ? 1.5 : 1;

  const set = (patch) => setLetter((v) => ({ ...v, ...patch }));

  const handleLogoPick = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => set({ logo: reader.result });
    reader.readAsDataURL(file);
  };

  const doExport = async () => {
    setExporting(true);
    try {
      const { default: html2canvas } = await import("html2canvas");
      const canvas = await html2canvas(cardRef.current, { scale: 2, useCORS: true });
      const fileBase = `${letterType}-${letter.senderName || "letter"}`.trim().replace(/\s+/g, "-").toLowerCase();

      if (format === "png" || format === "jpg") {
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
            a.download = `${fileBase}.${format}`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            setExporting(false);
          },
          mime,
          0.95
        );
      } else {
        const { jsPDF } = await import("jspdf");
        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF({ orientation, unit: "mm", format: [pageW, pageH], compress: true });
        pdf.addImage(imgData, "PNG", 0, 0, pageW, pageH);
        pdf.save(`${fileBase}.pdf`);
        setExporting(false);
      }
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

  // ---------------- Design picker screen ----------------
  if (!selectedDesignId) {
    return (
      <div style={{ maxWidth: "760px", margin: "0 auto", padding: "24px 20px 60px" }}>
        <button onClick={onBack} style={{ background: "none", border: "none", color: c.textDim, fontSize: "14px", cursor: "pointer", marginBottom: "16px", padding: 0 }}>
          ← Back
        </button>
        <h1 style={{ fontSize: "20px", fontWeight: 800, color: c.text, margin: "0 0 4px" }}>Letter Builder</h1>
        <p style={{ fontSize: "13px", color: c.textDim, margin: "0 0 16px" }}>
          Choose a design to start. You can change the paper size, style, and colors after.
        </p>

        <div style={{ fontSize: "11px", fontWeight: 700, color: c.textDim, marginBottom: "8px" }}>Letter type</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "20px" }}>
          {LETTER_TYPES.map((t) => (
            <button key={t} onClick={() => setLetterType(t)} style={pillBtn(c, letterType === t, accent)}>{t}</button>
          ))}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: `repeat(auto-fill, minmax(${DESIGN_THUMB_W}px, 1fr))`, gap: "18px", justifyItems: "center" }}>
          {LETTER_DESIGNS.map((d) => (
            <button key={d.id} onClick={() => setSelectedDesignId(d.id)} style={{ background: "none", border: "none", padding: 0, cursor: "pointer", textAlign: "center" }}>
              <DesignThumb c={c} design={d} />
              <div style={{ fontSize: "11.5px", fontWeight: 700, color: c.text, marginTop: "8px" }}>{d.name}</div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // ---------------- Editor screen ----------------
  return (
    <div style={{ maxWidth: "760px", margin: "0 auto", padding: "24px 20px 60px" }}>
      <button onClick={onBack} style={{ background: "none", border: "none", color: c.textDim, fontSize: "14px", cursor: "pointer", marginBottom: "16px", padding: 0 }}>
        ← Back
      </button>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "4px" }}>
        <h1 style={{ fontSize: "20px", fontWeight: 800, color: c.text, margin: 0 }}>{design.name}</h1>
        <button onClick={() => setSelectedDesignId(null)} style={{ background: "none", border: "none", color: accent, fontSize: "12px", fontWeight: 700, cursor: "pointer", padding: 0 }}>
          Change design
        </button>
      </div>
      <p style={{ fontSize: "13px", color: c.textDim, margin: "0 0 18px" }}>
        {letterType} · Nothing here is saved — it only lives in this session.
      </p>

      {/* Design settings: paper, orientation, style, margins, color */}
      <div style={{ background: c.surface, border: `1px solid ${c.border}`, borderRadius: "16px", padding: "16px", marginBottom: "16px" }}>
        <div style={{ fontSize: "11px", fontWeight: 700, color: c.textDim, marginBottom: "8px" }}>Paper size</div>
        <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "14px" }}>
          {Object.entries(PAPER_SIZES).map(([id, p]) => (
            <button key={id} onClick={() => setPaperSize(id)} style={pillBtn(c, paperSize === id, accent)}>{p.label}</button>
          ))}
        </div>

        <div style={{ fontSize: "11px", fontWeight: 700, color: c.textDim, marginBottom: "8px" }}>Orientation</div>
        <div style={{ display: "flex", gap: "6px", marginBottom: "14px" }}>
          {["portrait", "landscape"].map((o) => (
            <button key={o} onClick={() => setOrientation(o)} style={{ ...pillBtn(c, orientation === o, accent), textTransform: "capitalize", flex: 1 }}>{o}</button>
          ))}
        </div>

        <div style={{ fontSize: "11px", fontWeight: 700, color: c.textDim, marginBottom: "8px" }}>Style</div>
        <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "14px" }}>
          {STYLE_MODES.map((s) => (
            <button key={s} onClick={() => setStyleMode(s)} style={{ ...pillBtn(c, styleMode === s, accent), textTransform: "capitalize" }}>{s}</button>
          ))}
        </div>

        <div style={{ fontSize: "11px", fontWeight: 700, color: c.textDim, marginBottom: "8px" }}>Page margins</div>
        <div style={{ display: "flex", gap: "6px", marginBottom: "14px" }}>
          {["narrow", "normal", "wide"].map((m) => (
            <button key={m} onClick={() => setMarginPreset(m)} style={{ ...pillBtn(c, marginPreset === m, accent), textTransform: "capitalize", flex: 1 }}>{m}</button>
          ))}
        </div>

        <div style={{ fontSize: "11px", fontWeight: 700, color: c.textDim, marginBottom: "8px" }}>Color</div>
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", alignItems: "center" }}>
          {COLOR_PRESETS.map((p) => (
            <button
              key={p.id}
              onClick={() => { setColorPresetId(p.id); setCustomColor(null); }}
              title={p.name}
              style={{ width: "28px", height: "28px", borderRadius: "50%", background: p.primary, border: !customColor && colorPresetId === p.id ? `2px solid ${c.text}` : "2px solid transparent", cursor: "pointer", padding: 0 }}
            />
          ))}
          <label style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "2px", cursor: "pointer" }}>
            <input
              type="color"
              value={customColor?.primary || "#111111"}
              onChange={(e) => setCustomColor({ primary: e.target.value, accent: e.target.value })}
              style={{ width: "28px", height: "28px", border: `1px solid ${c.border}`, borderRadius: "50%", padding: 0, cursor: "pointer" }}
            />
            <span style={{ fontSize: "8.5px", color: c.textDim }}>Custom</span>
          </label>
        </div>
      </div>

      {/* Section tabs */}
      <div style={{ display: "flex", gap: "6px", overflowX: "auto", marginBottom: "16px", paddingBottom: "4px" }}>
        {SECTIONS.map((s) => (
          <button
            key={s}
            onClick={() => setActiveSection(s)}
            style={{ flexShrink: 0, padding: "8px 12px", borderRadius: "999px", fontSize: "12px", fontWeight: 600, cursor: "pointer", border: `1px solid ${s === activeSection ? accent : c.border}`, background: s === activeSection ? accent : "transparent", color: s === activeSection ? "#FFFFFF" : c.textDim, whiteSpace: "nowrap" }}
          >
            {s}
          </button>
        ))}
      </div>

      <div style={{ background: c.surface, border: `1px solid ${c.border}`, borderRadius: "16px", padding: "18px", marginBottom: "20px" }}>
        {activeSection === "Sender" && (
          <>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "14px", flexWrap: "wrap" }}>
              <div
                onClick={() => logoInputRef.current?.click()}
                style={{
                  width: "56px",
                  height: "56px",
                  borderRadius: "10px",
                  border: `2px solid ${accent}`,
                  overflow: "hidden",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "9px",
                  color: c.textDim,
                  background: c.surfaceAlt,
                  flexShrink: 0,
                }}
              >
                {letter.logo ? <img src={letter.logo} alt="" style={{ width: "100%", height: "100%", objectFit: "contain" }} /> : "+ Logo"}
              </div>
              <div style={{ fontSize: "11.5px", color: c.textDim }}>
                Logo is optional.{" "}
                {letter.logo && (
                  <button onClick={() => set({ logo: null })} style={{ background: "none", border: "none", color: accent, cursor: "pointer", fontSize: "11.5px", padding: 0 }}>
                    Remove logo
                  </button>
                )}
              </div>
              <input ref={logoInputRef} type="file" accept="image/*" onChange={handleLogoPick} style={{ display: "none" }} />
            </div>

            <label style={labelStyle(c)}>Full Name</label>
            <input style={field(c)} value={letter.senderName} onChange={(e) => set({ senderName: e.target.value })} />
            <label style={labelStyle(c)}>Title / Role (optional)</label>
            <input style={field(c)} value={letter.senderTitle} onChange={(e) => set({ senderTitle: e.target.value })} />
            <label style={labelStyle(c)}>Company / Organization (optional)</label>
            <input style={field(c)} value={letter.senderCompany} onChange={(e) => set({ senderCompany: e.target.value })} />
            <label style={labelStyle(c)}>Address</label>
            <textarea style={{ ...field(c), minHeight: "56px", resize: "vertical" }} value={letter.senderAddress} onChange={(e) => set({ senderAddress: e.target.value })} />
            <label style={labelStyle(c)}>Phone</label>
            <input style={field(c)} value={letter.senderPhone} onChange={(e) => set({ senderPhone: e.target.value })} />
            <label style={labelStyle(c)}>Email</label>
            <input style={field(c)} value={letter.senderEmail} onChange={(e) => set({ senderEmail: e.target.value })} />
            <label style={labelStyle(c)}>Website (optional)</label>
            <input style={field(c)} value={letter.senderWebsite} onChange={(e) => set({ senderWebsite: e.target.value })} />
          </>
        )}

        {activeSection === "Recipient & Date" && (
          <>
            <label style={labelStyle(c)}>Date</label>
            <input style={field(c)} value={letter.date} onChange={(e) => set({ date: e.target.value })} />
            <label style={labelStyle(c)}>Reference Number (optional)</label>
            <input style={field(c)} value={letter.referenceNumber} onChange={(e) => set({ referenceNumber: e.target.value })} />
            <label style={labelStyle(c)}>Recipient Name</label>
            <input style={field(c)} value={letter.recipientName} onChange={(e) => set({ recipientName: e.target.value })} />
            <label style={labelStyle(c)}>Recipient Organization (optional)</label>
            <input style={field(c)} value={letter.recipientOrganization} onChange={(e) => set({ recipientOrganization: e.target.value })} />
            <label style={labelStyle(c)}>Recipient Address</label>
            <textarea style={{ ...field(c), minHeight: "56px", resize: "vertical" }} value={letter.recipientAddress} onChange={(e) => set({ recipientAddress: e.target.value })} />
          </>
        )}

        {activeSection === "Subject & Body" && (
          <>
            <label style={labelStyle(c)}>Subject (optional)</label>
            <input style={field(c)} value={letter.subject} onChange={(e) => set({ subject: e.target.value })} />
            <label style={labelStyle(c)}>Greeting</label>
            <input style={field(c)} value={letter.greeting} onChange={(e) => set({ greeting: e.target.value })} />
            <label style={labelStyle(c)}>Letter Body (leave a blank line between paragraphs)</label>
            <textarea style={{ ...field(c), minHeight: "180px", resize: "vertical" }} value={letter.body} onChange={(e) => set({ body: e.target.value })} />
          </>
        )}

        {activeSection === "Closing & Signature" && (
          <>
            <label style={labelStyle(c)}>Closing</label>
            <input style={field(c)} value={letter.closing} onChange={(e) => set({ closing: e.target.value })} />
            <label style={labelStyle(c)}>Signature Name</label>
            <input style={field(c)} value={letter.signatureName} onChange={(e) => set({ signatureName: e.target.value })} />
            <label style={labelStyle(c)}>Signature Title (optional)</label>
            <input style={field(c)} value={letter.signatureTitle} onChange={(e) => set({ signatureTitle: e.target.value })} />
            <p style={{ fontSize: "11px", color: c.placeholder, margin: "6px 0 0" }}>
              The signature line is typed, not drawn — it renders in a script-style font on the document.
            </p>
          </>
        )}
      </div>

      {/* Live preview */}
      <div style={{ fontSize: "12.5px", fontWeight: 700, color: c.textDim, marginBottom: "8px" }}>Preview</div>
      <div style={{ marginBottom: "20px" }}>
        <ResponsivePagePreview naturalWidth={pageW * MM_TO_PX} naturalHeight={pageH * MM_TO_PX}>
          <LetterCanvas
            letter={letter}
            design={design}
            colors={colors}
            styleMode={styleMode}
            pageStyle={{ width: `${pageW * MM_TO_PX}px`, height: `${pageH * MM_TO_PX}px` }}
            canvasRef={cardRef}
            marginScale={marginScale}
          />
        </ResponsivePagePreview>
      </div>

      {/* Download */}
      <div style={{ display: "flex", gap: "8px", marginBottom: "12px" }}>
        {["pdf", "png", "jpg"].map((f) => (
          <button key={f} onClick={() => setFormat(f)} style={{ flex: 1, padding: "10px", borderRadius: "10px", fontSize: "12px", fontWeight: 700, cursor: "pointer", border: `1px solid ${format === f ? accent : c.border}`, background: format === f ? accent : "transparent", color: format === f ? "#FFFFFF" : c.text, textTransform: "uppercase" }}>
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

      <AdSlot c={c} type="adsense" placement="letter" slotId="AD_LETTER_AFTER_DOWNLOAD" />
      <AffiliateSlot c={c} placement="letter" slotId="AFF_LETTER_BUSINESS_TOOLS" />

      {showUnlock && (
        <UnlockGate
          c={c}
          accent={accent}
          title="Unlock letter download"
          message="Watch a short ad to unlock downloading your letter, free — no account needed."
          onUnlock={handleUnlock}
          onClose={() => setShowUnlock(false)}
        />
      )}
    </div>
  );
}