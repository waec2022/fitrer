// Small local copy of the margin-scaling helper used in CVCanvas.jsx —
// duplicated on purpose rather than importing from the CV system, so
// this file has zero coupling to CVCanvas.jsx and can never affect it.
const scalePad = (str, scale) => str.replace(/(\d+(\.\d+)?)px/g, (_, n) => `${Math.round(parseFloat(n) * scale)}px`);

const paragraphs = (text) => (text || "").split("\n\n").filter(Boolean);

const SenderBlock = ({ letter, align = "left", small }) => (
  <div style={{ fontSize: small ? "10.5px" : "11.5px", lineHeight: 1.7, textAlign: align }}>
    <div style={{ fontWeight: 700 }}>{letter.senderName}</div>
    {letter.senderTitle && <div>{letter.senderTitle}</div>}
    {letter.senderCompany && <div>{letter.senderCompany}</div>}
    {letter.senderAddress.split("\n").filter(Boolean).map((l, i) => <div key={i}>{l}</div>)}
    {letter.senderPhone && <div>{letter.senderPhone}</div>}
    {letter.senderEmail && <div>{letter.senderEmail}</div>}
    {letter.senderWebsite && <div>{letter.senderWebsite}</div>}
  </div>
);

const RecipientBlock = ({ letter }) => (
  <div style={{ fontSize: "11.5px", lineHeight: 1.7, marginBottom: "16px" }}>
    {letter.recipientName && <div style={{ fontWeight: 700 }}>{letter.recipientName}</div>}
    {letter.recipientOrganization && <div>{letter.recipientOrganization}</div>}
    {letter.recipientAddress.split("\n").filter(Boolean).map((l, i) => <div key={i}>{l}</div>)}
  </div>
);

const BodyBlock = ({ letter, accent, plain }) => (
  <>
    {letter.subject && (
      <div
        style={{
          fontSize: "12px",
          fontWeight: 700,
          marginBottom: "14px",
          color: plain ? "#111111" : accent,
          borderBottom: plain ? "none" : `1px solid ${accent}`,
          paddingBottom: plain ? 0 : "4px",
          display: "inline-block",
        }}
      >
        Subject: {letter.subject}
      </div>
    )}
    {letter.greeting && <div style={{ fontSize: "12px", marginBottom: "12px" }}>{letter.greeting}</div>}
    {paragraphs(letter.body).map((p, i) => (
      <p key={i} style={{ fontSize: "12px", lineHeight: 1.7, marginBottom: "12px" }}>{p}</p>
    ))}
  </>
);

const SignatureBlock = ({ letter }) => (
  <div style={{ marginTop: "18px" }}>
    {letter.closing && <div style={{ fontSize: "12px", marginBottom: "34px" }}>{letter.closing}</div>}
    {letter.signatureName && <div style={{ fontFamily: "'Brush Script MT', cursive", fontSize: "19px", marginBottom: "2px" }}>{letter.signatureName}</div>}
    {letter.signatureName && <div style={{ fontSize: "12px", fontWeight: 700 }}>{letter.signatureName}</div>}
    {letter.signatureTitle && <div style={{ fontSize: "11px", color: "#6E6C7C" }}>{letter.signatureTitle}</div>}
  </div>
);

export default function LetterCanvas({ letter, design, colors, styleMode, pageStyle, canvasRef, marginScale = 1 }) {
  const plain = styleMode === "plain";
  const primary = plain ? "#111111" : colors.primary;
  const accent = plain ? "#111111" : colors.accent;
  const legendary = styleMode === "legendary";

  const wrapStyle = { ...pageStyle, background: "#FFFFFF", color: "#16151F", overflow: "hidden", boxShadow: "0 8px 30px rgba(0,0,0,0.18)", borderRadius: "10px" };

  if (design.layout === "standard") {
    return (
      <div ref={canvasRef} style={{ ...wrapStyle, padding: scalePad("40px 36px", marginScale) }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "24px" }}>
          <SenderBlock letter={letter} />
          <div style={{ fontSize: "11.5px" }}>{letter.date}</div>
        </div>
        {letter.referenceNumber && <div style={{ fontSize: "11px", color: "#6E6C7C", marginBottom: "10px" }}>Ref: {letter.referenceNumber}</div>}
        <RecipientBlock letter={letter} />
        <BodyBlock letter={letter} accent={accent} plain={plain} />
        <SignatureBlock letter={letter} />
      </div>
    );
  }

  if (design.layout === "business") {
    return (
      <div ref={canvasRef} style={{ ...wrapStyle, padding: scalePad("38px 34px", marginScale) }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "10px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            {!plain && <div style={{ width: "8px", height: "26px", background: primary }} />}
            {letter.logo && <img src={letter.logo} alt="" style={{ height: "30px", objectFit: "contain" }} />}
            <div>
              <div style={{ fontSize: "18px", fontWeight: 800, letterSpacing: "0.02em" }}>{letter.senderName.toUpperCase()}</div>
              {letter.senderTitle && <div style={{ fontSize: "11px", color: "#6E6C7C" }}>{letter.senderTitle}</div>}
            </div>
          </div>
          <div style={{ fontSize: "10.5px", textAlign: "right", lineHeight: 1.8 }}>
            {letter.senderEmail && <div>{letter.senderEmail}</div>}
            {letter.senderPhone && <div>{letter.senderPhone}</div>}
            {letter.senderWebsite && <div>{letter.senderWebsite}</div>}
          </div>
        </div>
        <div style={{ height: "2px", background: plain ? "#111111" : primary, marginBottom: "22px" }} />
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "18px" }}>
          <RecipientBlock letter={letter} />
          <div style={{ fontSize: "11.5px" }}>{letter.date}</div>
        </div>
        <BodyBlock letter={letter} accent={accent} plain={plain} />
        <SignatureBlock letter={letter} />
      </div>
    );
  }

  if (design.layout === "corporate") {
    return (
      <div ref={canvasRef} style={{ ...wrapStyle, position: "relative" }}>
        {!plain && (
          <div style={{ position: "absolute", top: 0, right: 0, width: "120px", height: "120px", background: `linear-gradient(135deg, transparent 50%, ${accent}22 50%)` }} />
        )}
        <div style={{ padding: scalePad("36px 32px", marginScale), position: "relative" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px" }}>
            {!plain && <div style={{ width: "26px", height: "26px", borderRadius: "8px", background: primary, flexShrink: 0 }} />}
            {letter.logo && <img src={letter.logo} alt="" style={{ height: "28px", objectFit: "contain" }} />}
            <div style={{ fontSize: "17px", fontWeight: 800 }}>{letter.senderName}</div>
          </div>
          {letter.senderTitle && <div style={{ fontSize: "11.5px", color: "#6E6C7C", marginBottom: "14px" }}>{letter.senderTitle}</div>}

          <div style={{ display: "flex", flexWrap: "wrap", gap: "14px", fontSize: "10.5px", color: "#6E6C7C", marginBottom: "20px" }}>
            {letter.senderAddress.split("\n").filter(Boolean).map((l, i) => <span key={i}>{l}</span>)}
            {letter.senderEmail && <span>{letter.senderEmail}</span>}
            {letter.senderPhone && <span>{letter.senderPhone}</span>}
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "16px" }}>
            <RecipientBlock letter={letter} />
            <div style={{ fontSize: "11.5px" }}>{letter.date}</div>
          </div>
          <BodyBlock letter={letter} accent={accent} plain={plain} />
          <SignatureBlock letter={letter} />
        </div>
        {!plain && (
          <div style={{ position: "absolute", bottom: 0, right: 0, width: "80px", height: "80px", background: `linear-gradient(315deg, transparent 50%, ${primary}18 50%)` }} />
        )}
      </div>
    );
  }

  if (design.layout === "executive") {
    return (
      <div ref={canvasRef} style={wrapStyle}>
        <div
          style={{
            background: plain ? "#FFFFFF" : primary,
            borderBottom: plain ? "2px solid #111111" : "none",
            color: plain ? "#111111" : "#FFFFFF",
            padding: scalePad("32px 30px", marginScale),
            textAlign: "center",
          }}
        >
          {letter.logo ? (
            <img src={letter.logo} alt="" style={{ height: "40px", objectFit: "contain", marginBottom: "10px" }} />
          ) : (
            !plain && (
              <div style={{ width: "46px", height: "46px", borderRadius: "50%", border: `1.5px solid ${accent}`, margin: "0 auto 10px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "15px", fontWeight: 800, color: accent }}>
                {letter.senderName.split(" ").map((w) => w[0]).slice(0, 2).join("")}
              </div>
            )
          )}
          <div style={{ fontSize: "20px", fontWeight: 800, letterSpacing: "0.03em" }}>{letter.senderName.toUpperCase()}</div>
          {letter.senderTitle && <div style={{ fontSize: "11px", letterSpacing: "0.1em", textTransform: "uppercase", opacity: 0.85, marginTop: "2px" }}>{letter.senderTitle}</div>}
          {legendary && !plain && <div style={{ width: "60px", height: "2px", background: accent, margin: "12px auto 0" }} />}
        </div>

        <div style={{ padding: scalePad("28px 30px", marginScale) }}>
          <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "8px", fontSize: "10.5px", color: "#6E6C7C", marginBottom: "18px" }}>
            <div>{[letter.senderPhone, letter.senderEmail].filter(Boolean).join("   ·   ")}</div>
            <div>{letter.date}</div>
          </div>
          <RecipientBlock letter={letter} />
          <BodyBlock letter={letter} accent={accent} plain={plain} />
          <SignatureBlock letter={letter} />
        </div>
      </div>
    );
  }

  if (design.layout === "minimal-letter") {
    return (
      <div ref={canvasRef} style={{ ...wrapStyle, padding: scalePad("40px 38px", marginScale) }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "18px" }}>
          <div>
            <div style={{ fontSize: "18px", fontWeight: 300, letterSpacing: "0.02em" }}>{letter.senderName}</div>
            {letter.senderTitle && <div style={{ fontSize: "10.5px", color: "#6E6C7C", textTransform: "uppercase", letterSpacing: "0.1em" }}>{letter.senderTitle}</div>}
          </div>
          <div style={{ fontSize: "10.5px", textAlign: "right", color: "#6E6C7C", lineHeight: 1.8 }}>
            {letter.senderEmail && <div>{letter.senderEmail}</div>}
            {letter.senderPhone && <div>{letter.senderPhone}</div>}
          </div>
        </div>
        <div style={{ borderTop: `1px solid ${plain ? "#111111" : accent}`, marginBottom: "20px" }} />
        <div style={{ fontSize: "11px", color: "#6E6C7C", marginBottom: "18px" }}>{letter.date}</div>
        <RecipientBlock letter={letter} />
        <BodyBlock letter={letter} accent={accent} plain={plain} />
        <SignatureBlock letter={letter} />
        <div style={{ borderTop: `1px solid ${plain ? "#111111" : accent}`, marginTop: "26px" }} />
      </div>
    );
  }

  return null;
}