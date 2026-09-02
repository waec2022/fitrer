import { useRef, useState } from "react";
import UnlockGate from "../components/UnlockGate.jsx";
import AdSlot, { AffiliateSlot } from "../components/AdSlot.jsx";
import CVCanvas from "./CVCanvas.jsx";
import ResponsivePagePreview from "./ResponsivePagePreview.jsx";
import { DEFAULT_CV } from "./cvData.js";
import { CV_DESIGNS, PAPER_SIZES, COLOR_PRESETS, STYLE_MODES } from "./documentConfig.js";

// mm → px at 96 DPI — used only to give the live preview a natural,
// comfortable rendering size before it's visually scaled down for
// mobile. Keeps fixed-px text/spacing correctly proportioned instead
// of being laid out fresh inside a cramped narrow container.
const MM_TO_PX = 3.7795;

const SECTIONS = ["Personal Information", "Summary", "Experience", "Education", "Skills", "Languages", "Certifications", "Hobbies", "References"];

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
const DEFAULT_VISIBLE = { photo: true, website: true, references: true, hobbies: true, certifications: true, languages: true };

function DesignThumb({ c, design }) {
  return (
    <div style={{ width: `${DESIGN_THUMB_W}px`, aspectRatio: "210 / 297", overflow: "hidden", borderRadius: "8px", border: `1px solid ${c.border}`, pointerEvents: "none" }}>
      <div style={{ width: `${DESIGN_RENDER_W}px`, transform: `scale(${THUMB_SCALE})`, transformOrigin: "top left" }}>
        <CVCanvas
          cv={DEFAULT_CV}
          design={design}
          colors={COLOR_PRESETS.find((p) => p.id === "navy")}
          styleMode="professional"
          visible={DEFAULT_VISIBLE}
          pageStyle={{ width: "100%", aspectRatio: "210 / 297" }}
          canvasRef={null}
        />
      </div>
    </div>
  );
}

export default function CVEditor({ c, accent, onBack }) {
  const [selectedDesignId, setSelectedDesignId] = useState(null);
  const [cv, setCv] = useState(DEFAULT_CV);
  const [activeSection, setActiveSection] = useState("Personal Information");
  const [skillInput, setSkillInput] = useState("");
  const [certInput, setCertInput] = useState("");
  const [hobbyInput, setHobbyInput] = useState("");
  const [langName, setLangName] = useState("");
  const [langLevel, setLangLevel] = useState("");

  const [paperSize, setPaperSize] = useState("a4");
  const [orientation, setOrientation] = useState("portrait");
  const [styleMode, setStyleMode] = useState("professional");
  const [colorPresetId, setColorPresetId] = useState("navy");
  const [customColor, setCustomColor] = useState(null); // { primary, accent } or null
  const [visible, setVisible] = useState(DEFAULT_VISIBLE);
  const [marginPreset, setMarginPreset] = useState("normal");

  const [format, setFormat] = useState("pdf");
  const [unlocked, setUnlocked] = useState(false);
  const [showUnlock, setShowUnlock] = useState(false);
  const [exporting, setExporting] = useState(false);

  const cardRef = useRef(null);
  const fileInputRef = useRef(null);

  const design = CV_DESIGNS.find((d) => d.id === selectedDesignId) || CV_DESIGNS[0];
  const colors = customColor || COLOR_PRESETS.find((p) => p.id === colorPresetId) || COLOR_PRESETS[0];
  const paper = PAPER_SIZES[paperSize];
  const isLandscape = orientation === "landscape";
  const pageW = isLandscape ? paper.h : paper.w;
  const pageH = isLandscape ? paper.w : paper.h;
  const marginScale = marginPreset === "narrow" ? 0.6 : marginPreset === "wide" ? 1.5 : 1;

  const set = (patch) => setCv((v) => ({ ...v, ...patch }));
  const toggleVisible = (key) => setVisible((v) => ({ ...v, [key]: !v[key] }));

  const handlePhotoPick = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => set({ photo: reader.result });
    reader.readAsDataURL(file);
  };

  const addSkill = () => { const s = skillInput.trim(); if (!s) return; set({ skills: [...cv.skills, s] }); setSkillInput(""); };
  const removeSkill = (i) => set({ skills: cv.skills.filter((_, idx) => idx !== i) });

  const addCert = () => { const s = certInput.trim(); if (!s) return; set({ certifications: [...cv.certifications, s] }); setCertInput(""); };
  const removeCert = (i) => set({ certifications: cv.certifications.filter((_, idx) => idx !== i) });

  const addHobby = () => { const s = hobbyInput.trim(); if (!s) return; set({ hobbies: [...cv.hobbies, s] }); setHobbyInput(""); };
  const removeHobby = (i) => set({ hobbies: cv.hobbies.filter((_, idx) => idx !== i) });

  const addLanguage = () => {
    const n = langName.trim();
    if (!n) return;
    set({ languages: [...cv.languages, { name: n, level: langLevel.trim() || "Conversational" }] });
    setLangName("");
    setLangLevel("");
  };
  const removeLanguage = (i) => set({ languages: cv.languages.filter((_, idx) => idx !== i) });

  const updateExperience = (i, patch) => { const next = [...cv.experience]; next[i] = { ...next[i], ...patch }; set({ experience: next }); };
  const addExperience = () => set({ experience: [...cv.experience, { role: "", company: "", location: "", start: "", end: "", bullets: "" }] });
  const removeExperience = (i) => set({ experience: cv.experience.filter((_, idx) => idx !== i) });

  const updateEducation = (i, patch) => { const next = [...cv.education]; next[i] = { ...next[i], ...patch }; set({ education: next }); };
  const addEducation = () => set({ education: [...cv.education, { degree: "", school: "", location: "", start: "", end: "" }] });
  const removeEducation = (i) => set({ education: cv.education.filter((_, idx) => idx !== i) });

  const doExport = async () => {
    setExporting(true);
    try {
      const { default: html2canvas } = await import("html2canvas");
      const canvas = await html2canvas(cardRef.current, { scale: 2, useCORS: true });
      const fileBase = (cv.fullName || "cv").trim().replace(/\s+/g, "-").toLowerCase();

      if (format === "png" || format === "jpg") {
        const mime = format === "jpg" ? "image/jpeg" : "image/png";
        canvas.toBlob((blob) => {
          if (!blob) { setExporting(false); return; }
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = `${fileBase}.${format}`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
          setExporting(false);
        }, mime, 0.95);
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
    if (!unlocked) { setShowUnlock(true); return; }
    doExport();
  };
  const handleUnlock = () => { setUnlocked(true); setShowUnlock(false); doExport(); };

  // ---------------- Design picker screen ----------------
  if (!selectedDesignId) {
    return (
      <div style={{ maxWidth: "760px", margin: "0 auto", padding: "24px 20px 60px" }}>
        <button onClick={onBack} style={{ background: "none", border: "none", color: c.textDim, fontSize: "14px", cursor: "pointer", marginBottom: "16px", padding: 0 }}>
          ← Back
        </button>
        <h1 style={{ fontSize: "20px", fontWeight: 800, color: c.text, margin: "0 0 4px" }}>CV / Resume Builder</h1>
        <p style={{ fontSize: "13px", color: c.textDim, margin: "0 0 20px" }}>
          Choose a design to start. You can change the paper size, style, and colors after.
        </p>
        <div style={{ display: "grid", gridTemplateColumns: `repeat(auto-fill, minmax(${DESIGN_THUMB_W}px, 1fr))`, gap: "18px", justifyItems: "center" }}>
          {CV_DESIGNS.map((d) => (
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
        Nothing here is saved — it only lives in this session.
      </p>

      {/* Design settings: paper, orientation, style, color */}
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

      {/* Editor form */}
      <div style={{ background: c.surface, border: `1px solid ${c.border}`, borderRadius: "16px", padding: "18px", marginBottom: "20px" }}>
        {activeSection === "Personal Information" && (
          <>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "14px", flexWrap: "wrap" }}>
              <div onClick={() => fileInputRef.current?.click()} style={{ width: "56px", height: "56px", borderRadius: "50%", border: `2px solid ${accent}`, overflow: "hidden", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "9px", color: c.textDim, background: c.surfaceAlt, flexShrink: 0 }}>
                {cv.photo ? <img src={cv.photo} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : "+ Photo"}
              </div>
              <div style={{ fontSize: "11.5px", color: c.textDim }}>
                <label style={{ display: "flex", alignItems: "center", gap: "6px", cursor: "pointer", marginBottom: "4px" }}>
                  <input type="checkbox" checked={visible.photo} onChange={() => toggleVisible("photo")} /> Show photo on CV
                </label>
                {cv.photo && (
                  <button onClick={() => set({ photo: null })} style={{ background: "none", border: "none", color: accent, cursor: "pointer", fontSize: "11.5px", padding: 0 }}>Remove photo</button>
                )}
              </div>
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handlePhotoPick} style={{ display: "none" }} />
            </div>

            <label style={labelStyle(c)}>Full Name</label>
            <input style={field(c)} value={cv.fullName} onChange={(e) => set({ fullName: e.target.value })} />
            <label style={labelStyle(c)}>Title / Role</label>
            <input style={field(c)} value={cv.title} onChange={(e) => set({ title: e.target.value })} />
            <label style={labelStyle(c)}>Phone</label>
            <input style={field(c)} value={cv.phone} onChange={(e) => set({ phone: e.target.value })} />
            <label style={labelStyle(c)}>Email</label>
            <input style={field(c)} value={cv.email} onChange={(e) => set({ email: e.target.value })} />
            <label style={labelStyle(c)}>Location</label>
            <input style={field(c)} value={cv.location} onChange={(e) => set({ location: e.target.value })} />
            <label style={labelStyle(c)}>LinkedIn (optional)</label>
            <input style={field(c)} value={cv.linkedin} onChange={(e) => set({ linkedin: e.target.value })} />
            <label style={{ display: "flex", alignItems: "center", gap: "6px", cursor: "pointer", fontSize: "11px", fontWeight: 700, color: c.textDim, marginBottom: "4px" }}>
              <input type="checkbox" checked={visible.website} onChange={() => toggleVisible("website")} /> Website / Portfolio (optional)
            </label>
            <input style={field(c)} value={cv.website} onChange={(e) => set({ website: e.target.value })} />
          </>
        )}

        {activeSection === "Summary" && (
          <>
            <label style={labelStyle(c)}>About Me</label>
            <textarea style={{ ...field(c), minHeight: "110px", resize: "vertical" }} value={cv.summary} onChange={(e) => set({ summary: e.target.value })} />
          </>
        )}

        {activeSection === "Experience" && (
          <>
            {cv.experience.map((exp, i) => (
              <div key={i} style={{ border: `1px solid ${c.border}`, borderRadius: "12px", padding: "12px", marginBottom: "12px" }}>
                <label style={labelStyle(c)}>Role</label>
                <input style={field(c)} value={exp.role} onChange={(e) => updateExperience(i, { role: e.target.value })} />
                <label style={labelStyle(c)}>Company</label>
                <input style={field(c)} value={exp.company} onChange={(e) => updateExperience(i, { company: e.target.value })} />
                <label style={labelStyle(c)}>Location</label>
                <input style={field(c)} value={exp.location} onChange={(e) => updateExperience(i, { location: e.target.value })} />
                <div style={{ display: "flex", gap: "10px" }}>
                  <div style={{ flex: 1 }}>
                    <label style={labelStyle(c)}>Start</label>
                    <input style={field(c)} value={exp.start} onChange={(e) => updateExperience(i, { start: e.target.value })} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={labelStyle(c)}>End</label>
                    <input style={field(c)} value={exp.end} onChange={(e) => updateExperience(i, { end: e.target.value })} />
                  </div>
                </div>
                <label style={labelStyle(c)}>Highlights (one per line)</label>
                <textarea style={{ ...field(c), minHeight: "70px", resize: "vertical" }} value={exp.bullets} onChange={(e) => updateExperience(i, { bullets: e.target.value })} />
                <button onClick={() => removeExperience(i)} style={{ background: "none", border: "none", color: "#E5484D", fontSize: "12px", cursor: "pointer", padding: 0 }}>Remove this entry</button>
              </div>
            ))}
            <button onClick={addExperience} style={{ width: "100%", padding: "10px", borderRadius: "10px", border: `1px dashed ${accent}`, background: "transparent", color: accent, fontWeight: 700, fontSize: "12.5px", cursor: "pointer" }}>+ Add Experience</button>
          </>
        )}

        {activeSection === "Education" && (
          <>
            {cv.education.map((ed, i) => (
              <div key={i} style={{ border: `1px solid ${c.border}`, borderRadius: "12px", padding: "12px", marginBottom: "12px" }}>
                <label style={labelStyle(c)}>Degree</label>
                <input style={field(c)} value={ed.degree} onChange={(e) => updateEducation(i, { degree: e.target.value })} />
                <label style={labelStyle(c)}>School</label>
                <input style={field(c)} value={ed.school} onChange={(e) => updateEducation(i, { school: e.target.value })} />
                <label style={labelStyle(c)}>Location</label>
                <input style={field(c)} value={ed.location} onChange={(e) => updateEducation(i, { location: e.target.value })} />
                <div style={{ display: "flex", gap: "10px" }}>
                  <div style={{ flex: 1 }}>
                    <label style={labelStyle(c)}>Start</label>
                    <input style={field(c)} value={ed.start} onChange={(e) => updateEducation(i, { start: e.target.value })} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={labelStyle(c)}>End</label>
                    <input style={field(c)} value={ed.end} onChange={(e) => updateEducation(i, { end: e.target.value })} />
                  </div>
                </div>
                <button onClick={() => removeEducation(i)} style={{ background: "none", border: "none", color: "#E5484D", fontSize: "12px", cursor: "pointer", padding: 0 }}>Remove this entry</button>
              </div>
            ))}
            <button onClick={addEducation} style={{ width: "100%", padding: "10px", borderRadius: "10px", border: `1px dashed ${accent}`, background: "transparent", color: accent, fontWeight: 700, fontSize: "12.5px", cursor: "pointer" }}>+ Add Education</button>
          </>
        )}

        {activeSection === "Skills" && (
          <>
            <div style={{ display: "flex", gap: "8px", marginBottom: "12px" }}>
              <input style={{ ...field(c), marginBottom: 0, flex: 1 }} placeholder="e.g. Figma" value={skillInput} onChange={(e) => setSkillInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addSkill()} />
              <button onClick={addSkill} style={{ padding: "0 16px", borderRadius: "10px", border: "none", background: accent, color: "#FFFFFF", fontWeight: 700, cursor: "pointer" }}>Add</button>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
              {cv.skills.map((s, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: "6px", padding: "6px 10px", borderRadius: "999px", border: `1px solid ${c.border}`, fontSize: "12px", color: c.text }}>
                  {s}
                  <button onClick={() => removeSkill(i)} style={{ background: "none", border: "none", color: c.textDim, cursor: "pointer", fontSize: "13px", padding: 0 }}>×</button>
                </div>
              ))}
            </div>
          </>
        )}

        {activeSection === "Languages" && (
          <>
            <label style={{ display: "flex", alignItems: "center", gap: "6px", cursor: "pointer", fontSize: "11px", fontWeight: 700, color: c.textDim, marginBottom: "12px" }}>
              <input type="checkbox" checked={visible.languages} onChange={() => toggleVisible("languages")} /> Show Languages on CV
            </label>
            <div style={{ display: "flex", gap: "8px", marginBottom: "12px" }}>
              <input style={{ ...field(c), marginBottom: 0, flex: 2 }} placeholder="Language" value={langName} onChange={(e) => setLangName(e.target.value)} />
              <input style={{ ...field(c), marginBottom: 0, flex: 1 }} placeholder="Level" value={langLevel} onChange={(e) => setLangLevel(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addLanguage()} />
              <button onClick={addLanguage} style={{ padding: "0 16px", borderRadius: "10px", border: "none", background: accent, color: "#FFFFFF", fontWeight: 700, cursor: "pointer" }}>Add</button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              {cv.languages.map((l, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 10px", borderRadius: "10px", border: `1px solid ${c.border}`, fontSize: "12.5px", color: c.text }}>
                  <span>{l.name} — {l.level}</span>
                  <button onClick={() => removeLanguage(i)} style={{ background: "none", border: "none", color: "#E5484D", cursor: "pointer", fontSize: "12px" }}>Remove</button>
                </div>
              ))}
            </div>
          </>
        )}

        {activeSection === "Certifications" && (
          <>
            <label style={{ display: "flex", alignItems: "center", gap: "6px", cursor: "pointer", fontSize: "11px", fontWeight: 700, color: c.textDim, marginBottom: "12px" }}>
              <input type="checkbox" checked={visible.certifications} onChange={() => toggleVisible("certifications")} /> Show Certifications on CV
            </label>
            <div style={{ display: "flex", gap: "8px", marginBottom: "12px" }}>
              <input style={{ ...field(c), marginBottom: 0, flex: 1 }} placeholder="e.g. AWS Certified" value={certInput} onChange={(e) => setCertInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addCert()} />
              <button onClick={addCert} style={{ padding: "0 16px", borderRadius: "10px", border: "none", background: accent, color: "#FFFFFF", fontWeight: 700, cursor: "pointer" }}>Add</button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              {cv.certifications.map((s, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 10px", borderRadius: "10px", border: `1px solid ${c.border}`, fontSize: "12.5px", color: c.text }}>
                  <span>{s}</span>
                  <button onClick={() => removeCert(i)} style={{ background: "none", border: "none", color: "#E5484D", cursor: "pointer", fontSize: "12px" }}>Remove</button>
                </div>
              ))}
            </div>
          </>
        )}

        {activeSection === "Hobbies" && (
          <>
            <label style={{ display: "flex", alignItems: "center", gap: "6px", cursor: "pointer", fontSize: "11px", fontWeight: 700, color: c.textDim, marginBottom: "12px" }}>
              <input type="checkbox" checked={visible.hobbies} onChange={() => toggleVisible("hobbies")} /> Show Hobbies on CV
            </label>
            <div style={{ display: "flex", gap: "8px", marginBottom: "12px" }}>
              <input style={{ ...field(c), marginBottom: 0, flex: 1 }} placeholder="e.g. Photography" value={hobbyInput} onChange={(e) => setHobbyInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addHobby()} />
              <button onClick={addHobby} style={{ padding: "0 16px", borderRadius: "10px", border: "none", background: accent, color: "#FFFFFF", fontWeight: 700, cursor: "pointer" }}>Add</button>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
              {cv.hobbies.map((s, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: "6px", padding: "6px 10px", borderRadius: "999px", border: `1px solid ${c.border}`, fontSize: "12px", color: c.text }}>
                  {s}
                  <button onClick={() => removeHobby(i)} style={{ background: "none", border: "none", color: c.textDim, cursor: "pointer", fontSize: "13px", padding: 0 }}>×</button>
                </div>
              ))}
            </div>
          </>
        )}

        {activeSection === "References" && (
          <>
            <label style={{ display: "flex", alignItems: "center", gap: "6px", cursor: "pointer", fontSize: "11px", fontWeight: 700, color: c.textDim, marginBottom: "12px" }}>
              <input type="checkbox" checked={visible.references} onChange={() => toggleVisible("references")} /> Show References on CV
            </label>
            <textarea style={{ ...field(c), minHeight: "70px", resize: "vertical" }} value={cv.references} onChange={(e) => set({ references: e.target.value })} />
          </>
        )}
      </div>

      {/* Live preview */}
      <div style={{ fontSize: "12.5px", fontWeight: 700, color: c.textDim, marginBottom: "8px" }}>Preview</div>
      <div style={{ marginBottom: "20px" }}>
        <ResponsivePagePreview naturalWidth={pageW * MM_TO_PX} naturalHeight={pageH * MM_TO_PX}>
          <CVCanvas
            cv={cv}
            design={design}
            colors={colors}
            styleMode={styleMode}
            visible={visible}
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

      <AdSlot c={c} type="adsense" placement="cv" slotId="AD_CV_AFTER_DOWNLOAD" />
      <AffiliateSlot c={c} placement="cv" slotId="AFF_CV_CAREER_TOOLS" />

      {showUnlock && (
        <UnlockGate
          c={c}
          accent={accent}
          title="Unlock CV download"
          message="Watch a short ad to unlock downloading your CV, free — no account needed."
          onUnlock={handleUnlock}
          onClose={() => setShowUnlock(false)}
        />
      )}
    </div>
  );
}