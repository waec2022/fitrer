import { useState } from "react";
import { CATEGORIES, getTemplatesByCategory } from "./data.js";
import TemplateShape from "./TemplateShape.jsx";
import UnlockGate from "../components/UnlockGate.jsx";
import { MonetagSlot, AffiliateSlot } from "../components/AdSlot.jsx";

export default function TemplateGallery({ c, accent, isDark, onSelect, onBack }) {
  const [activeCategory, setActiveCategory] = useState("Birthday");
  const [unlockedIds, setUnlockedIds] = useState([]);
  const [pendingTemplate, setPendingTemplate] = useState(null);
  const templates = getTemplatesByCategory(activeCategory);

  const handleCardClick = (t) => {
    if (t.premium && !unlockedIds.includes(t.id)) {
      setPendingTemplate(t);
      return;
    }
    onSelect(t);
  };

  const handleUnlock = () => {
    setUnlockedIds((ids) => [...ids, pendingTemplate.id]);
    onSelect(pendingTemplate);
    setPendingTemplate(null);
  };

  return (
    <div style={{ maxWidth: "720px", margin: "0 auto", padding: "24px 20px 60px" }}>
      <button
        onClick={onBack}
        style={{
          background: "none",
          border: "none",
          color: c.textDim,
          fontSize: "14px",
          cursor: "pointer",
          marginBottom: "18px",
          padding: 0,
        }}
      >
        ← Back
      </button>

      <h1 style={{ fontSize: "24px", fontWeight: 800, color: c.text, margin: "0 0 6px" }}>Free Templates</h1>
      <p style={{ fontSize: "14px", color: c.textDim, margin: "0 0 20px" }}>
        Pick a design, edit the text, swap the colors and photo, then download. No account, no subscription. A few
        extra designs per category unlock by watching one short ad.
      </p>

      <div style={{ display: "flex", gap: "8px", overflowX: "auto", marginBottom: "22px", paddingBottom: "4px" }}>
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            style={{
              flexShrink: 0,
              padding: "8px 14px",
              borderRadius: "20px",
              fontSize: "13px",
              fontWeight: 600,
              cursor: "pointer",
              border: `1px solid ${cat === activeCategory ? accent : c.border}`,
              background: cat === activeCategory ? accent : "transparent",
              color: cat === activeCategory ? "#FFFFFF" : c.textDim,
              whiteSpace: "nowrap",
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      <MonetagSlot c={c} placement="templates" slotId="AD_TEMPLATES_BETWEEN_GROUPS" />

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: "14px" }}>
        {templates.map((t) => {
          const p = t.palettes[0];
          const locked = t.premium && !unlockedIds.includes(t.id);
          return (
            <button
              key={t.id}
              onClick={() => handleCardClick(t)}
              style={{
                border: `1px solid ${c.border}`,
                borderRadius: "14px",
                overflow: "hidden",
                cursor: "pointer",
                padding: 0,
                background: c.surface,
                textAlign: "left",
                position: "relative",
              }}
            >
              <div style={{ position: "relative", width: "100%", aspectRatio: t.ratio, background: p.bg, overflow: "hidden" }}>
                {t.shapes.map((s, i) => (
                  <TemplateShape key={i} shape={s} accent={p.accent} />
                ))}
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "10%",
                    textAlign: "center",
                    fontSize: "11px",
                    fontWeight: 700,
                    color: p.text,
                  }}
                >
                  {t.fields.find((f) => f.role === "name")?.default || t.name}
                </div>
                {locked && (
                  <div
                    style={{
                      position: "absolute",
                      top: "6px",
                      right: "6px",
                      background: "rgba(0,0,0,0.6)",
                      color: "#FFFFFF",
                      fontSize: "9.5px",
                      fontWeight: 700,
                      padding: "3px 7px",
                      borderRadius: "20px",
                    }}
                  >
                    🔒 Unlock
                  </div>
                )}
              </div>
              <div style={{ padding: "8px 10px" }}>
                <div style={{ fontSize: "12.5px", fontWeight: 700, color: c.text, marginBottom: "2px" }}>{t.name}</div>
                {!t.premium && (
                  <div style={{ fontSize: "10.5px", fontWeight: 700, color: "#22B573" }}>Free</div>
                )}
              </div>
            </button>
          );
        })}
      </div>

      <AffiliateSlot c={c} placement="templates" slotId="AFF_TEMPLATES_DESIGN_TOOLS" />

      {pendingTemplate && (
        <UnlockGate
          c={c}
          accent={accent}
          title="Unlock this design"
          message={`Watch a short ad to unlock "${pendingTemplate.name}" — free, no account needed.`}
          onUnlock={handleUnlock}
          onClose={() => setPendingTemplate(null)}
        />
      )}
    </div>
  );
}