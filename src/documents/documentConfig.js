// One reusable editor, many designs — designs are just config, not
// separate components. Adding a 6th CV design later means adding one
// entry here, not building a new editor.

export const CV_DESIGNS = [
  { id: "simple-standard", name: "Simple Standard", layout: "single" },
  { id: "classic-professional", name: "Classic Professional", layout: "sidebar-left" },
  { id: "modern-executive", name: "Modern Executive", layout: "header-band" },
  { id: "minimal-professional", name: "Minimal Professional", layout: "minimal" },
  { id: "creative-professional", name: "Creative Professional", layout: "sidebar-right" },
];

// Same reusable-design principle as CV_DESIGNS above — one Letter
// editor, five layout configs. Adding a 6th letter design later means
// adding one entry here, not building a new editor.
export const LETTER_DESIGNS = [
  { id: "standard-formal", name: "Standard Formal", layout: "standard" },
  { id: "professional-business", name: "Professional Business", layout: "business" },
  { id: "modern-corporate", name: "Modern Corporate", layout: "corporate" },
  { id: "executive-formal", name: "Executive Formal", layout: "executive" },
  { id: "minimal-professional-letter", name: "Minimal Professional", layout: "minimal-letter" },
];

// Real paper dimensions in millimeters — used both for the on-screen
// aspect ratio and for sizing the actual exported PDF page correctly.
export const PAPER_SIZES = {
  a4: { w: 210, h: 297, label: "A4" },
  a5: { w: 148, h: 210, label: "A5" },
  letter: { w: 215.9, h: 279.4, label: "Letter" },
  legal: { w: 215.9, h: 355.6, label: "Legal" },
};

export const COLOR_PRESETS = [
  { id: "bw", name: "Black & White", primary: "#111111", accent: "#111111" },
  { id: "navy", name: "Navy Professional", primary: "#16233F", accent: "#2E4A8F" },
  { id: "ocean", name: "Ocean Blue", primary: "#0B4F86", accent: "#1479FF" },
  { id: "green", name: "Deep Green", primary: "#0F4C34", accent: "#10A878" },
  { id: "burgundy", name: "Burgundy", primary: "#5C1A2B", accent: "#8F2942" },
  { id: "charcoal", name: "Charcoal", primary: "#2A2A2A", accent: "#565656" },
  { id: "slate", name: "Slate", primary: "#33414F", accent: "#5A6B7D" },
  { id: "warm", name: "Warm Neutral", primary: "#5C4A3A", accent: "#8A7259" },
];

// Plain = no decorative fills at all (real blank-document mode).
// Professional = solid color treatment. Modern = slightly bolder.
// Legendary = adds one tasteful corner accent on top of Modern.
export const STYLE_MODES = ["plain", "professional", "modern", "legendary"];