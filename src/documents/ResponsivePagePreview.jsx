import { useEffect, useRef, useState } from "react";

export default function ResponsivePagePreview({ naturalWidth, naturalHeight, children }) {
  const outerRef = useRef(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const measure = () => {
      if (!outerRef.current) return;
      const available = outerRef.current.offsetWidth;
      setScale(available > 0 ? Math.min(1, available / naturalWidth) : 1);
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [naturalWidth]);

  return (
    <div ref={outerRef} style={{ width: "100%", height: `${naturalHeight * scale}px`, overflow: "hidden" }}>
      <div style={{ width: `${naturalWidth}px`, height: `${naturalHeight}px`, transform: `scale(${scale})`, transformOrigin: "top left" }}>
        {children}
      </div>
    </div>
  );
}