export default function TemplateShape({ shape, accent }) {
  const s = shape.style;

  if (shape.type === "circle") {
    return (
      <div
        style={{
          position: "absolute",
          top: s.top,
          left: s.left,
          width: s.size,
          height: s.size,
          borderRadius: "50%",
          background: accent,
          opacity: s.opacity,
        }}
      />
    );
  }

  if (shape.type === "ring") {
    return (
      <div
        style={{
          position: "absolute",
          top: s.top,
          left: s.left,
          width: s.size,
          height: s.size,
          borderRadius: "50%",
          border: `3px solid ${accent}`,
          opacity: s.opacity,
        }}
      />
    );
  }

  if (shape.type === "balloon") {
    return (
      <div style={{ position: "absolute", top: s.top, left: s.left, opacity: s.opacity }}>
        <div
          style={{
            width: s.size,
            height: `calc(${s.size} * 1.2)`,
            borderRadius: "50% 50% 50% 50% / 60% 60% 40% 40%",
            background: accent,
          }}
        />
        <div style={{ width: "1px", height: "24px", background: accent, margin: "0 auto" }} />
      </div>
    );
  }

  if (shape.type === "leaf") {
    return (
      <div
        style={{
          position: "absolute",
          top: s.top,
          left: s.left,
          width: s.size,
          height: `calc(${s.size} * 0.5)`,
          background: accent,
          opacity: s.opacity,
          borderRadius: "0% 100% 0% 100%",
          transform: `rotate(${s.rotate})`,
        }}
      />
    );
  }

  if (shape.type === "paw") {
    return (
      <div style={{ position: "absolute", top: s.top, left: s.left, opacity: s.opacity, transform: `rotate(${s.rotate})` }}>
        <div style={{ width: s.size, height: s.size, borderRadius: "50%", background: accent, position: "relative" }}>
          <div style={{ position: "absolute", top: "-40%", left: "-10%", width: "35%", height: "35%", borderRadius: "50%", background: accent }} />
          <div style={{ position: "absolute", top: "-40%", left: "35%", width: "35%", height: "35%", borderRadius: "50%", background: accent }} />
          <div style={{ position: "absolute", top: "-30%", left: "80%", width: "30%", height: "30%", borderRadius: "50%", background: accent }} />
        </div>
      </div>
    );
  }

  if (shape.type === "frame") {
    return (
      <div
        style={{
          position: "absolute",
          top: s.inset,
          left: s.inset,
          right: s.inset,
          bottom: s.inset,
          border: `1px solid ${accent}`,
          opacity: s.opacity,
          pointerEvents: "none",
        }}
      />
    );
  }

  if (shape.type === "rule") {
    return (
      <div
        style={{
          position: "absolute",
          top: s.top,
          left: "20%",
          right: "20%",
          height: "1px",
          background: accent,
          opacity: s.opacity,
        }}
      />
    );
  }

  if (shape.type === "glow") {
    return (
      <div
        style={{
          position: "absolute",
          top: s.top,
          left: s.left,
          width: s.size,
          height: s.size,
          transform: "translateX(-50%)",
          borderRadius: "50%",
          background: `radial-gradient(circle, ${accent} 0%, transparent 70%)`,
          opacity: s.opacity,
        }}
      />
    );
  }

  return null;
}