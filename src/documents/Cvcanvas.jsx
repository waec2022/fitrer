// Scales a CSS padding string's pixel values by a factor — used for
// the Narrow/Normal/Wide page margin presets without restructuring
// each layout's padding declarations individually.
const scalePad = (str, scale) => str.replace(/(\d+(\.\d+)?)px/g, (_, n) => `${Math.round(parseFloat(n) * scale)}px`);

const Section = ({ title, color, plain, children }) => (
  <div style={{ marginBottom: "14px" }}>
    <div
      style={{
        fontSize: "10.5px",
        fontWeight: 700,
        letterSpacing: "0.1em",
        textTransform: "uppercase",
        color: plain ? "#111111" : color,
        marginBottom: "6px",
        borderBottom: plain ? "1px solid #111111" : "none",
        paddingBottom: plain ? "3px" : 0,
      }}
    >
      {title}
    </div>
    {children}
  </div>
);

const ExperienceList = ({ items }) =>
  items.map((exp, i) => (
    <div key={i} style={{ marginBottom: "10px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12.5px", fontWeight: 700 }}>
        <span>{exp.role}</span>
        <span style={{ fontWeight: 500, color: "#6E6C7C" }}>{exp.start} – {exp.end}</span>
      </div>
      <div style={{ fontSize: "11.5px", color: "#6E6C7C", marginBottom: "3px" }}>
        {exp.company}{exp.location ? ` / ${exp.location}` : ""}
      </div>
      <ul style={{ margin: 0, paddingLeft: "16px", fontSize: "11.5px", lineHeight: 1.55 }}>
        {exp.bullets.split("\n").filter(Boolean).map((b, bi) => <li key={bi}>{b}</li>)}
      </ul>
    </div>
  ));

const EducationList = ({ items }) =>
  items.map((ed, i) => (
    <div key={i} style={{ marginBottom: "6px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12.5px", fontWeight: 700 }}>
        <span>{ed.degree}</span>
        <span style={{ fontWeight: 500, color: "#6E6C7C" }}>{ed.start} – {ed.end}</span>
      </div>
      <div style={{ fontSize: "11.5px", color: "#6E6C7C" }}>{ed.school}{ed.location ? ` / ${ed.location}` : ""}</div>
    </div>
  ));

export default function CVCanvas({ cv, design, colors, styleMode, visible, pageStyle, canvasRef, marginScale = 1 }) {
  const plain = styleMode === "plain";
  const primary = plain ? "#111111" : colors.primary;
  const accent = plain ? "#111111" : colors.accent;
  const legendary = styleMode === "legendary";

  const hasSection = (key, arr) => visible[key] && ((Array.isArray(arr) ? arr.length > 0 : !!arr));

  const SidebarBlock = ({ dark }) => (
    <>
      {visible.photo && cv.photo && (
        <img src={cv.photo} alt="" style={{ width: "84px", height: "84px", borderRadius: design.layout === "sidebar-right" ? "10px" : "50%", objectFit: "cover", marginBottom: "16px", border: `3px solid ${dark ? accent : "#FFFFFF"}` }} />
      )}
      <div style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: dark ? "#B9B4D0" : "rgba(255,255,255,0.75)", marginBottom: "8px" }}>Contact</div>
      <div style={{ fontSize: "11px", lineHeight: 1.9, marginBottom: "16px", wordBreak: "break-word" }}>
        {cv.phone && <div>{cv.phone}</div>}
        {cv.email && <div>{cv.email}</div>}
        {cv.location && <div>{cv.location}</div>}
        {cv.linkedin && <div>{cv.linkedin}</div>}
        {visible.website && cv.website && <div>{cv.website}</div>}
      </div>
      {cv.skills.length > 0 && (
        <>
          <div style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: dark ? "#B9B4D0" : "rgba(255,255,255,0.75)", marginBottom: "8px" }}>Skills</div>
          <div style={{ fontSize: "11px", lineHeight: 1.9, marginBottom: "16px" }}>{cv.skills.map((s, i) => <div key={i}>{s}</div>)}</div>
        </>
      )}
      {hasSection("languages", cv.languages) && (
        <>
          <div style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: dark ? "#B9B4D0" : "rgba(255,255,255,0.75)", marginBottom: "8px" }}>Languages</div>
          <div style={{ fontSize: "11px", lineHeight: 1.9, marginBottom: "16px" }}>{cv.languages.map((l, i) => <div key={i}>{l.name} — {l.level}</div>)}</div>
        </>
      )}
      {hasSection("certifications", cv.certifications) && (
        <>
          <div style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: dark ? "#B9B4D0" : "rgba(255,255,255,0.75)", marginBottom: "8px" }}>Certifications</div>
          <div style={{ fontSize: "11px", lineHeight: 1.7 }}>{cv.certifications.map((s, i) => <div key={i}>{s}</div>)}</div>
        </>
      )}
    </>
  );

  const MainBlock = () => (
    <>
      {cv.summary && <Section title="About Me" color={accent} plain={plain}><div style={{ fontSize: "11.5px", lineHeight: 1.6 }}>{cv.summary}</div></Section>}
      {cv.experience.length > 0 && <Section title="Experience" color={accent} plain={plain}><ExperienceList items={cv.experience} /></Section>}
      {cv.education.length > 0 && <Section title="Education" color={accent} plain={plain}><EducationList items={cv.education} /></Section>}
      {hasSection("hobbies", cv.hobbies) && <Section title="Hobbies" color={accent} plain={plain}><div style={{ fontSize: "11.5px" }}>{cv.hobbies.join(" · ")}</div></Section>}
      {hasSection("references", cv.references) && <Section title="References" color={accent} plain={plain}><div style={{ fontSize: "11.5px" }}>{cv.references}</div></Section>}
    </>
  );

  const wrapStyle = { ...pageStyle, background: "#FFFFFF", color: "#16151F", overflow: "hidden", boxShadow: "0 8px 30px rgba(0,0,0,0.18)", borderRadius: "10px" };

  if (design.layout === "single") {
    return (
      <div ref={canvasRef} style={{ ...wrapStyle, display: "flex", flexDirection: "column", alignItems: "center", padding: scalePad("34px 30px", marginScale), textAlign: "center" }}>
        {visible.photo && cv.photo && <img src={cv.photo} alt="" style={{ width: "76px", height: "76px", borderRadius: "50%", objectFit: "cover", marginBottom: "12px", border: `2px solid ${primary}` }} />}
        <div style={{ fontSize: "24px", fontWeight: 800 }}>{cv.fullName}</div>
        <div style={{ fontSize: "12.5px", fontWeight: 600, color: accent, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "10px" }}>{cv.title}</div>
        <div style={{ fontSize: "11px", color: "#6E6C7C", marginBottom: "18px" }}>
          {[cv.phone, cv.email, cv.location, visible.website && cv.website].filter(Boolean).join("   ·   ")}
        </div>
        <div style={{ width: "100%", textAlign: "left" }}>
          <MainBlock />
          {cv.skills.length > 0 && <Section title="Skills" color={accent} plain={plain}><div style={{ fontSize: "11.5px" }}>{cv.skills.join(" · ")}</div></Section>}
          {hasSection("languages", cv.languages) && <Section title="Languages" color={accent} plain={plain}><div style={{ fontSize: "11.5px" }}>{cv.languages.map((l) => `${l.name} (${l.level})`).join(" · ")}</div></Section>}
          {hasSection("certifications", cv.certifications) && <Section title="Certifications" color={accent} plain={plain}><div style={{ fontSize: "11.5px" }}>{cv.certifications.join(" · ")}</div></Section>}
        </div>
      </div>
    );
  }

  if (design.layout === "sidebar-left") {
    return (
      <div ref={canvasRef} style={{ ...wrapStyle, display: "flex", flexWrap: "wrap" }}>
        <div style={{ width: "220px", flex: "1 1 220px", background: plain ? "#F5F4F8" : primary, color: plain ? "#16151F" : "#F3F1F8", padding: scalePad("26px 18px", marginScale), borderRight: plain ? "1px solid #111111" : "none" }}>
          <SidebarBlock dark={!plain} />
        </div>
        <div style={{ flex: "3 1 320px", padding: scalePad("28px 24px", marginScale) }}>
          <div style={{ fontSize: "24px", fontWeight: 800 }}>{cv.fullName}</div>
          <div style={{ fontSize: "12.5px", fontWeight: 600, color: accent, marginBottom: "16px", textTransform: "uppercase", letterSpacing: "0.06em" }}>{cv.title}</div>
          <MainBlock />
        </div>
      </div>
    );
  }

  if (design.layout === "header-band") {
    return (
      <div ref={canvasRef} style={wrapStyle}>
        <div style={{ position: "relative", background: plain ? "#FFFFFF" : primary, borderBottom: plain ? "2px solid #111111" : "none", padding: scalePad("30px 26px 44px", marginScale), color: plain ? "#111111" : "#FFFFFF" }}>
          <div style={{ fontSize: "26px", fontWeight: 800 }}>{cv.fullName}</div>
          <div style={{ fontSize: "13px", fontWeight: 600, opacity: 0.9, textTransform: "uppercase", letterSpacing: "0.06em" }}>{cv.title}</div>
          {visible.photo && cv.photo && (
            <img src={cv.photo} alt="" style={{ position: "absolute", right: "26px", bottom: "-30px", width: "68px", height: "68px", borderRadius: "50%", objectFit: "cover", border: "3px solid #FFFFFF" }} />
          )}
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", padding: scalePad("40px 24px 24px", marginScale) }}>
          <div style={{ flex: "3 1 300px", paddingRight: "18px" }}>
            <MainBlock />
          </div>
          <div style={{ flex: "1 1 140px", borderLeft: "1px solid #E7E6F0", paddingLeft: "16px" }}>
            {cv.skills.length > 0 && <Section title="Skills" color={accent} plain={plain}><div style={{ fontSize: "11px" }}>{cv.skills.map((s, i) => <div key={i} style={{ marginBottom: "4px" }}>{s}</div>)}</div></Section>}
            {hasSection("languages", cv.languages) && <Section title="Languages" color={accent} plain={plain}><div style={{ fontSize: "11px" }}>{cv.languages.map((l, i) => <div key={i}>{l.name} — {l.level}</div>)}</div></Section>}
            {hasSection("certifications", cv.certifications) && <Section title="Certs" color={accent} plain={plain}><div style={{ fontSize: "11px" }}>{cv.certifications.map((s, i) => <div key={i} style={{ marginBottom: "4px" }}>{s}</div>)}</div></Section>}
          </div>
        </div>
      </div>
    );
  }

  if (design.layout === "minimal") {
    return (
      <div ref={canvasRef} style={{ ...wrapStyle, padding: scalePad("36px 32px", marginScale) }}>
        <div style={{ fontSize: "26px", fontWeight: 300, letterSpacing: "0.02em" }}>{cv.fullName}</div>
        <div style={{ fontSize: "11px", fontWeight: 600, color: "#6E6C7C", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: "6px" }}>{cv.title}</div>
        <div style={{ fontSize: "10.5px", color: "#6E6C7C", marginBottom: "22px" }}>
          {[cv.phone, cv.email, cv.location].filter(Boolean).join("  /  ")}
        </div>
        <div style={{ borderTop: `1px solid ${plain ? "#111111" : accent}`, paddingTop: "16px" }}>
          <MainBlock />
          {cv.skills.length > 0 && <Section title="Skills" color={accent} plain={plain}><div style={{ fontSize: "11px" }}>{cv.skills.join("   ·   ")}</div></Section>}
          {hasSection("languages", cv.languages) && <Section title="Languages" color={accent} plain={plain}><div style={{ fontSize: "11px" }}>{cv.languages.map((l) => `${l.name} (${l.level})`).join("   ·   ")}</div></Section>}
        </div>
      </div>
    );
  }

  if (design.layout === "sidebar-right") {
    return (
      <div ref={canvasRef} style={{ ...wrapStyle, display: "flex", flexWrap: "wrap-reverse" }}>
        <div style={{ flex: "3 1 320px", padding: scalePad("28px 24px", marginScale) }}>
          <div style={{ fontSize: "24px", fontWeight: 800 }}>{cv.fullName}</div>
          <div style={{ fontSize: "12.5px", fontWeight: 600, color: accent, marginBottom: "16px", textTransform: "uppercase", letterSpacing: "0.06em" }}>{cv.title}</div>
          <MainBlock />
        </div>
        <div style={{ width: "210px", flex: "1 1 210px", position: "relative", background: plain ? "#F5F4F8" : accent, color: plain ? "#16151F" : "#FFFFFF", padding: scalePad("26px 18px", marginScale), borderLeft: plain ? "1px solid #111111" : "none" }}>
          {legendary && !plain && (
            <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "40px", background: "rgba(255,255,255,0.14)", clipPath: "polygon(0 0, 100% 0, 100% 30%, 0 100%)" }} />
          )}
          <div style={{ position: "relative" }}>
            <SidebarBlock dark={false} />
          </div>
        </div>
      </div>
    );
  }

  return null;
}