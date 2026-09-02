export default function PrivacyPolicy({ c, accent, onBack }) {
  const Section = ({ title, children }) => (
    <div style={{ marginBottom: "22px" }}>
      <h2 style={{ fontSize: "15px", fontWeight: 700, color: c.text, margin: "0 0 8px" }}>{title}</h2>
      <div style={{ fontSize: "13.5px", lineHeight: 1.7, color: c.textDim }}>{children}</div>
    </div>
  );

  return (
    <div style={{ maxWidth: "620px", margin: "0 auto", padding: "24px 20px 60px" }}>
      <button
        onClick={onBack}
        style={{ background: "none", border: "none", color: c.textDim, fontSize: "14px", cursor: "pointer", marginBottom: "18px", padding: 0 }}
      >
        ← Back
      </button>

      <h1 style={{ fontSize: "22px", fontWeight: 800, color: c.text, margin: "0 0 4px" }}>Privacy Policy</h1>
      <p style={{ fontSize: "12.5px", color: c.placeholder, margin: "0 0 26px" }}>Last updated: August 26, 2026</p>

      <Section title="The short version">
        FITRER doesn't have accounts, doesn't have a server database, and doesn't store anything you generate,
        type, or design. Everything you create — passwords, names, story ideas, template edits, photos you
        upload — stays in your browser's memory for that visit only and disappears when you leave or refresh.
      </Section>

      <Section title="Information we collect">
        We don't collect personal information through this site. There is no sign-up, no form that sends data
        to a server, and no database. The only exception is basic, non-identifying data that ad partners may
        collect for measurement and ad delivery — see "Advertising" below.
      </Section>

      <Section title="Local storage and cookies">
        FITRER stores two small preferences directly on your device, never on a server:
        <ul style={{ margin: "8px 0 0", paddingLeft: "20px" }}>
          <li>Your light/dark theme choice</li>
          <li>Your cookie-consent choice from the banner</li>
        </ul>
        Neither of these identifies you or leaves your device. If ads are active on this site, the ad network
        may separately set cookies in your browser for ad measurement and personalization — those are set and
        controlled by the ad network, not by FITRER directly.
      </Section>

      <Section title="Advertising">
        FITRER shows ads to stay free to use, with no subscription. Ad slots are clearly labeled
        "Advertisement." We never require or reward clicking an ad — where a download is gated behind an ad,
        the ad only needs to be shown, never clicked, before the download unlocks. Ad networks may use cookies
        or similar technology to show relevant ads and measure performance; you can control this through the
        cookie banner and your browser's own privacy settings.
      </Section>

      <Section title="Templates and uploaded photos">
        Anything you type or upload while editing a template (text, colors, photos) is held only in your
        browser's temporary memory for that session. It is never uploaded to a server, never saved to your
        browser's storage, and is gone as soon as you leave the page or download your file. Downloads go
        straight to your device — nothing passes through FITRER's servers because FITRER doesn't have one.
      </Section>

      <Section title="Children's privacy">
        FITRER does not knowingly collect personal information from anyone, including children, because it
        does not collect personal information from anyone at all.
      </Section>

      <Section title="Changes to this policy">
        If this policy changes, we'll update the date above. Continued use of the site after a change means
        you accept the updated policy.
      </Section>

      <Section title="Contact">
        Questions about this policy can be sent to the site owner through the contact details listed wherever
        this site is published.
      </Section>
    </div>
  );
}