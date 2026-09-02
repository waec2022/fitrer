import { useEffect, useState } from "react";

const STORAGE_KEY = "fitrer-cookie-consent";

export default function CookieConsent({ c, accent, onOpenPrivacy }) {
  const [choice, setChoice] = useState(null); // null = not yet decided

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved) setChoice(saved);
    } catch (e) {
      /* localStorage unavailable — banner will just show every visit */
    }
  }, []);

  const decide = (value) => {
    setChoice(value);
    try {
      window.localStorage.setItem(STORAGE_KEY, value);
    } catch (e) {
      /* ignore */
    }
  };

  if (choice) return null;

  return (
    <div
      style={{
        position: "fixed",
        left: "16px",
        right: "16px",
        bottom: "16px",
        maxWidth: "560px",
        margin: "0 auto",
        background: c.surface,
        border: `1px solid ${c.border}`,
        borderRadius: "14px",
        padding: "16px 18px",
        boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
        zIndex: 200,
      }}
    >
      <p style={{ margin: "0 0 12px", fontSize: "12.5px", lineHeight: 1.5, color: c.text }}>
        FITRER uses cookies and similar local storage to keep the site free — this includes ads that may use
        cookies for measurement and personalization. We never collect or store what you generate or design.{" "}
        <button
          onClick={onOpenPrivacy}
          style={{ background: "none", border: "none", padding: 0, color: accent, fontSize: "12.5px", cursor: "pointer", textDecoration: "underline" }}
        >
          Learn more
        </button>
      </p>
      <div style={{ display: "flex", gap: "10px" }}>
        <button
          onClick={() => decide("necessary")}
          style={{
            flex: 1,
            background: "transparent",
            border: `1px solid ${c.border}`,
            borderRadius: "10px",
            padding: "10px",
            fontSize: "12.5px",
            fontWeight: 600,
            color: c.text,
            cursor: "pointer",
          }}
        >
          Necessary Only
        </button>
        <button
          onClick={() => decide("all")}
          style={{
            flex: 1,
            background: accent,
            border: "none",
            borderRadius: "10px",
            padding: "10px",
            fontSize: "12.5px",
            fontWeight: 700,
            color: "#FFFFFF",
            cursor: "pointer",
          }}
        >
          Accept All
        </button>
      </div>
    </div>
  );
}