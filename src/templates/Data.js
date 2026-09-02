// All templates are pure CSS (gradients + shapes) — no external image files,
// so the project stays dependency-free and works offline once built.

export const CATEGORIES = ["Birthday", "Wedding", "Funeral / Memorial", "Pet"];

const shape = (type, style) => ({ type, style });

export const TEMPLATES = [
  // ---------- BIRTHDAY ----------
  {
    id: "bday-confetti",
    category: "Birthday",
    name: "Confetti Pop",
    ratio: "3 / 4",
    palettes: [
      { name: "Coral & Gold", bg: "linear-gradient(160deg, #FF6B6B 0%, #FFD93D 100%)", text: "#3A1212", accent: "#3A1212" },
      { name: "Grape & Mint", bg: "linear-gradient(160deg, #7C3AED 0%, #3DD68C 100%)", text: "#FFFFFF", accent: "#FFFFFF" },
      { name: "Sunset", bg: "linear-gradient(160deg, #FF9A3D 0%, #FF4D8D 100%)", text: "#FFFFFF", accent: "#FFFFFF" },
    ],
    shapes: [
      shape("circle", { top: "6%", left: "8%", size: "18px", opacity: 0.55 }),
      shape("circle", { top: "14%", left: "80%", size: "12px", opacity: 0.5 }),
      shape("circle", { top: "78%", left: "12%", size: "14px", opacity: 0.5 }),
      shape("circle", { top: "85%", left: "75%", size: "20px", opacity: 0.4 }),
      shape("ring", { top: "22%", left: "70%", size: "26px", opacity: 0.5 }),
    ],
    hasPhoto: true,
    photoShape: "circle",
    fields: [
      { id: "title", role: "title", default: "Happy Birthday!" },
      { id: "name", role: "name", default: "Alex Turner" },
      { id: "line", role: "line", default: "Turning 28 · Saturday, June 14" },
      { id: "message", role: "message", default: "Join us for cake, music, and a whole lot of celebrating." },
    ],
  },
  {
    id: "bday-balloon",
    category: "Birthday",
    name: "Balloon Bash",
    ratio: "3 / 4",
    palettes: [
      { name: "Teal & Violet", bg: "linear-gradient(160deg, #0F766E 0%, #7C3AED 100%)", text: "#FFFFFF", accent: "#FFD93D" },
      { name: "Pink Party", bg: "linear-gradient(160deg, #FF4D8D 0%, #FF9A3D 100%)", text: "#FFFFFF", accent: "#FFFFFF" },
      { name: "Cream & Berry", bg: "linear-gradient(160deg, #FBEAEA 0%, #F5F5F7 100%)", text: "#831843", accent: "#831843" },
    ],
    shapes: [
      shape("balloon", { top: "8%", left: "15%", size: "34px", opacity: 0.85 }),
      shape("balloon", { top: "12%", left: "68%", size: "26px", opacity: 0.7 }),
      shape("balloon", { top: "4%", left: "45%", size: "20px", opacity: 0.6 }),
    ],
    hasPhoto: false,
    photoShape: "rect",
    fields: [
      { id: "title", role: "title", default: "You're Invited" },
      { id: "name", role: "name", default: "Maya's Birthday Bash" },
      { id: "line", role: "line", default: "Sunday, July 9 · 4:00 PM · The Garden Hall" },
      { id: "message", role: "message", default: "Come hungry, come dancing, come exactly as you are." },
    ],
  },

  // ---------- WEDDING ----------
  {
    id: "wed-ivory",
    category: "Wedding",
    name: "Ivory & Gold",
    ratio: "3 / 4",
    palettes: [
      { name: "Ivory & Gold", bg: "linear-gradient(180deg, #FBF8F2 0%, #F3ECDD 100%)", text: "#3A2E1F", accent: "#B8964F" },
      { name: "Blush", bg: "linear-gradient(180deg, #FCEEF0 0%, #F7E1E6 100%)", text: "#5C2A33", accent: "#C77B92" },
      { name: "Midnight", bg: "linear-gradient(180deg, #14141C 0%, #23212E 100%)", text: "#F2ECD9", accent: "#C9A85C" },
    ],
    shapes: [shape("frame", { inset: "5%", opacity: 0.7 })],
    hasPhoto: true,
    photoShape: "circle",
    fields: [
      { id: "title", role: "eyebrow", default: "Together With Their Families" },
      { id: "name", role: "name", default: "Elena & James" },
      { id: "line", role: "line", default: "September 21 · Willowbrook Estate" },
      { id: "message", role: "message", default: "Request the honor of your presence as they exchange vows." },
    ],
  },
  {
    id: "wed-sage",
    category: "Wedding",
    name: "Sage Romance",
    ratio: "3 / 4",
    palettes: [
      { name: "Sage & Blush", bg: "linear-gradient(160deg, #E7ECE3 0%, #F6E9E3 100%)", text: "#3B4636", accent: "#7C8F6E" },
      { name: "Deep Sage", bg: "linear-gradient(160deg, #3B4636 0%, #5A6B4C 100%)", text: "#F3F2EA", accent: "#D8CDAE" },
      { name: "Terracotta", bg: "linear-gradient(160deg, #F0E4D8 0%, #E8C9B0 100%)", text: "#5C3620", accent: "#B5602F" },
    ],
    shapes: [
      shape("leaf", { top: "4%", left: "6%", size: "60px", rotate: "-20deg", opacity: 0.5 }),
      shape("leaf", { top: "82%", left: "78%", size: "70px", rotate: "160deg", opacity: 0.5 }),
    ],
    hasPhoto: true,
    photoShape: "circle",
    fields: [
      { id: "title", role: "eyebrow", default: "Save the Date" },
      { id: "name", role: "name", default: "Priya & Noah" },
      { id: "line", role: "line", default: "May 3, next year · Vermont" },
      { id: "message", role: "message", default: "Formal invitation to follow. We can't wait to celebrate with you." },
    ],
  },

  // ---------- FUNERAL / MEMORIAL ----------
  {
    id: "mem-loving",
    category: "Funeral / Memorial",
    name: "In Loving Memory",
    ratio: "3 / 4",
    palettes: [
      { name: "Navy & Gold", bg: "linear-gradient(180deg, #12141F 0%, #1D2233 100%)", text: "#EDEBE0", accent: "#C9A85C" },
      { name: "Soft White", bg: "linear-gradient(180deg, #FAF9F6 0%, #EFEDE6 100%)", text: "#2B2A28", accent: "#8A7A54" },
      { name: "Charcoal", bg: "linear-gradient(180deg, #1A1A1A 0%, #2A2A2A 100%)", text: "#EDEDED", accent: "#9CA3AF" },
    ],
    shapes: [shape("rule", { top: "34%", opacity: 0.4 }), shape("rule", { top: "78%", opacity: 0.4 })],
    hasPhoto: true,
    photoShape: "circle",
    fields: [
      { id: "title", role: "eyebrow", default: "In Loving Memory" },
      { id: "name", role: "name", default: "Margaret Anne Wilson" },
      { id: "line", role: "line", default: "March 4, 1948 — August 12, 2026" },
      { id: "message", role: "message", default: "Forever in our hearts. Service held Friday at 2:00 PM, Riverside Chapel." },
    ],
  },
  {
    id: "mem-eternal",
    category: "Funeral / Memorial",
    name: "Eternal Light",
    ratio: "3 / 4",
    palettes: [
      { name: "Charcoal Glow", bg: "linear-gradient(180deg, #1B1B1F 0%, #2C2C33 100%)", text: "#F2F1EE", accent: "#D9CDB5" },
      { name: "Dove Grey", bg: "linear-gradient(180deg, #E9E9EA 0%, #D8D8DB 100%)", text: "#26262A", accent: "#5A5A63" },
      { name: "Deep Plum", bg: "linear-gradient(180deg, #241726 0%, #362038 100%)", text: "#F1E9EE", accent: "#C79ACB" },
    ],
    shapes: [shape("glow", { top: "8%", left: "50%", size: "180px", opacity: 0.35 })],
    hasPhoto: true,
    photoShape: "circle",
    fields: [
      { id: "title", role: "eyebrow", default: "Celebrating the Life of" },
      { id: "name", role: "name", default: "Robert James Carter" },
      { id: "line", role: "line", default: "1955 — 2026" },
      { id: "message", role: "message", default: "A kind heart, a steady hand, and a life well lived. You will be missed." },
    ],
  },

  // ---------- PET ----------
  {
    id: "pet-paw",
    category: "Pet",
    name: "Paw Prints",
    ratio: "3 / 4",
    palettes: [
      { name: "Amber & Cream", bg: "linear-gradient(160deg, #FBEEDD 0%, #F5D9B0 100%)", text: "#5C3A1A", accent: "#C8752E" },
      { name: "Teal Pup", bg: "linear-gradient(160deg, #0F766E 0%, #14B8A6 100%)", text: "#FFFFFF", accent: "#FFFFFF" },
      { name: "Soft Grey", bg: "linear-gradient(160deg, #2C2C37 0%, #1E1E24 100%)", text: "#F2F1F5", accent: "#7C3AED" },
    ],
    shapes: [
      shape("paw", { top: "8%", left: "12%", size: "22px", rotate: "-15deg", opacity: 0.5 }),
      shape("paw", { top: "84%", left: "78%", size: "26px", rotate: "20deg", opacity: 0.4 }),
    ],
    hasPhoto: true,
    photoShape: "circle",
    fields: [
      { id: "title", role: "eyebrow", default: "Happy Gotcha Day" },
      { id: "name", role: "name", default: "Biscuit" },
      { id: "line", role: "line", default: "3 years with us · October 2" },
      { id: "message", role: "message", default: "Best walks, worst zoomies, all our hearts. Here's to many more." },
    ],
  },
  {
    id: "pet-bff",
    category: "Pet",
    name: "Best Friend Forever",
    ratio: "3 / 4",
    palettes: [
      { name: "Coral & Teal", bg: "linear-gradient(160deg, #FF8C69 0%, #14B8A6 100%)", text: "#FFFFFF", accent: "#FFFFFF" },
      { name: "In Memory", bg: "linear-gradient(180deg, #1D2233 0%, #12141F 100%)", text: "#EDEBE0", accent: "#C9A85C" },
      { name: "Sunny", bg: "linear-gradient(160deg, #FFE8A3 0%, #FFC93D 100%)", text: "#4A3A0A", accent: "#4A3A0A" },
    ],
    shapes: [shape("paw", { top: "6%", left: "80%", size: "20px", rotate: "10deg", opacity: 0.5 })],
    hasPhoto: true,
    photoShape: "circle",
    fields: [
      { id: "title", role: "eyebrow", default: "In Loving Memory Of" },
      { id: "name", role: "name", default: "Max" },
      { id: "line", role: "line", default: "2013 — 2026" },
      { id: "message", role: "message", default: "Every good dog leaves paw prints on your heart. Run free, good boy." },
    ],
  },

  // ---------- BIRTHDAY (more) ----------
  {
    id: "bday-golden",
    category: "Birthday",
    name: "Golden Hour",
    ratio: "3 / 4",
    palettes: [
      { name: "Gold & Cream", bg: "linear-gradient(160deg, #FBF3E3 0%, #F0DCB0 100%)", text: "#4A3410", accent: "#B8862F" },
      { name: "Rose Gold", bg: "linear-gradient(160deg, #FBE8E3 0%, #F0C9BC 100%)", text: "#5C2E1F", accent: "#C77B5A" },
      { name: "Deep Emerald", bg: "linear-gradient(160deg, #123024 0%, #1E4A38 100%)", text: "#F2ECD9", accent: "#C9A85C" },
    ],
    shapes: [shape("frame", { inset: "6%", opacity: 0.6 }), shape("ring", { top: "10%", left: "78%", size: "20px", opacity: 0.5 })],
    hasPhoto: true,
    photoShape: "circle",
    fields: [
      { id: "title", role: "eyebrow", default: "Join Us to Celebrate" },
      { id: "name", role: "name", default: "David's 40th Birthday" },
      { id: "line", role: "line", default: "Saturday, November 8 · 7:00 PM" },
      { id: "message", role: "message", default: "An evening of good food, good wine, and forty years worth celebrating." },
    ],
  },
  {
    id: "bday-fiesta",
    category: "Birthday",
    name: "Kids Fiesta",
    ratio: "3 / 4",
    palettes: [
      { name: "Primary Pop", bg: "linear-gradient(160deg, #FFD93D 0%, #FF6B6B 50%, #4EA8DE 100%)", text: "#1A1A2E", accent: "#1A1A2E" },
      { name: "Bubblegum", bg: "linear-gradient(160deg, #FF9AD5 0%, #9AD1FF 100%)", text: "#3A1B3A", accent: "#3A1B3A" },
      { name: "Lime Fizz", bg: "linear-gradient(160deg, #C6F135 0%, #35D0C0 100%)", text: "#0F2E28", accent: "#0F2E28" },
    ],
    shapes: [
      shape("balloon", { top: "6%", left: "10%", size: "24px", opacity: 0.75 }),
      shape("balloon", { top: "8%", left: "72%", size: "30px", opacity: 0.7 }),
      shape("circle", { top: "80%", left: "18%", size: "16px", opacity: 0.5 }),
      shape("circle", { top: "84%", left: "68%", size: "12px", opacity: 0.5 }),
    ],
    hasPhoto: true,
    photoShape: "circle",
    fields: [
      { id: "title", role: "title", default: "It's a Party!" },
      { id: "name", role: "name", default: "Sofia is Turning 6" },
      { id: "line", role: "line", default: "Saturday, April 12 · 2:00 PM · Sunset Park" },
      { id: "message", role: "message", default: "Games, cupcakes, and confetti. Come dressed to play!" },
    ],
  },

  // ---------- WEDDING (more) ----------
  {
    id: "wed-minimal",
    category: "Wedding",
    name: "Modern Minimal",
    ratio: "3 / 4",
    palettes: [
      { name: "Black & White", bg: "linear-gradient(180deg, #FFFFFF 0%, #F2F2F2 100%)", text: "#111111", accent: "#111111" },
      { name: "Ink", bg: "linear-gradient(180deg, #0F0F14 0%, #1E1E24 100%)", text: "#F2F1F5", accent: "#F2F1F5" },
      { name: "Stone", bg: "linear-gradient(180deg, #E7E4DE 0%, #D8D3C8 100%)", text: "#2B2A26", accent: "#6B6355" },
    ],
    shapes: [shape("rule", { top: "40%", opacity: 0.35 })],
    hasPhoto: false,
    photoShape: "rect",
    fields: [
      { id: "title", role: "eyebrow", default: "The Wedding Of" },
      { id: "name", role: "name", default: "Claire & Daniel" },
      { id: "line", role: "line", default: "10.18 · Brooklyn, New York" },
      { id: "message", role: "message", default: "No gifts, just your presence and a good dance move." },
    ],
  },
  {
    id: "wed-vintage",
    category: "Wedding",
    name: "Vintage Romance",
    ratio: "3 / 4",
    palettes: [
      { name: "Dusty Rose", bg: "linear-gradient(160deg, #F3E3E0 0%, #E3C4BE 100%)", text: "#5C2E30", accent: "#A15A55" },
      { name: "Antique Cream", bg: "linear-gradient(160deg, #F6F0DE 0%, #E8DCB8 100%)", text: "#4A3E22", accent: "#9C8438" },
      { name: "Wine", bg: "linear-gradient(160deg, #2E141C 0%, #4A1F2B 100%)", text: "#F1E4E6", accent: "#C79AA0" },
    ],
    shapes: [
      shape("leaf", { top: "5%", left: "8%", size: "50px", rotate: "-15deg", opacity: 0.45 }),
      shape("leaf", { top: "85%", left: "80%", size: "55px", rotate: "165deg", opacity: 0.45 }),
      shape("ring", { top: "6%", left: "70%", size: "16px", opacity: 0.4 }),
    ],
    hasPhoto: true,
    photoShape: "circle",
    fields: [
      { id: "title", role: "eyebrow", default: "With Love and Joy" },
      { id: "name", role: "name", default: "Isabella & Marco" },
      { id: "line", role: "line", default: "June 6 · The Old Orchard" },
      { id: "message", role: "message", default: "Two families, one story, and a celebration we'd love for you to be part of." },
    ],
  },

  // ---------- FUNERAL / MEMORIAL (more) ----------
  {
    id: "mem-dove",
    category: "Funeral / Memorial",
    name: "Peaceful Dove",
    ratio: "3 / 4",
    palettes: [
      { name: "Soft Blue", bg: "linear-gradient(180deg, #EAF1F5 0%, #D8E4EC 100%)", text: "#233240", accent: "#5F7E93" },
      { name: "Cloud White", bg: "linear-gradient(180deg, #FBFBFC 0%, #EDEDEF 100%)", text: "#26262A", accent: "#8A8A93" },
      { name: "Midnight Blue", bg: "linear-gradient(180deg, #101826 0%, #1B2740 100%)", text: "#E9EEF3", accent: "#9FB6CC" },
    ],
    shapes: [shape("glow", { top: "10%", left: "50%", size: "160px", opacity: 0.3 }), shape("rule", { top: "76%", opacity: 0.35 })],
    hasPhoto: true,
    photoShape: "circle",
    fields: [
      { id: "title", role: "eyebrow", default: "With Peaceful Hearts" },
      { id: "name", role: "name", default: "Thomas Edward Reyes" },
      { id: "line", role: "line", default: "June 2, 1960 — August 3, 2026" },
      { id: "message", role: "message", default: "At rest now, and remembered always. Gathering Sunday at 1:00 PM." },
    ],
  },
  {
    id: "mem-garden",
    category: "Funeral / Memorial",
    name: "Garden of Memory",
    ratio: "3 / 4",
    palettes: [
      { name: "Sage", bg: "linear-gradient(180deg, #EAEFE5 0%, #D6E0CC 100%)", text: "#33402B", accent: "#6F8459" },
      { name: "Ivory", bg: "linear-gradient(180deg, #FAF8F2 0%, #EFEADA 100%)", text: "#3A3323", accent: "#8C7B4A" },
      { name: "Forest", bg: "linear-gradient(180deg, #16211A 0%, #223528 100%)", text: "#EDF1E8", accent: "#A9C08E" },
    ],
    shapes: [
      shape("leaf", { top: "6%", left: "10%", size: "45px", rotate: "-20deg", opacity: 0.4 }),
      shape("leaf", { top: "88%", left: "82%", size: "50px", rotate: "150deg", opacity: 0.4 }),
    ],
    hasPhoto: true,
    photoShape: "circle",
    fields: [
      { id: "title", role: "eyebrow", default: "Forever in Bloom" },
      { id: "name", role: "name", default: "Helen Grace Baker" },
      { id: "line", role: "line", default: "1942 — 2026" },
      { id: "message", role: "message", default: "A gentle spirit who left the world softer than she found it." },
    ],
  },

  // ---------- PET (more) ----------
  {
    id: "pet-rainbow",
    category: "Pet",
    name: "Rainbow Bridge",
    ratio: "3 / 4",
    palettes: [
      { name: "Pastel Sky", bg: "linear-gradient(160deg, #FFD6E8 0%, #FFF3B0 40%, #C9F2E8 70%, #C6D9FF 100%)", text: "#3A2E4A", accent: "#3A2E4A" },
      { name: "Soft Dusk", bg: "linear-gradient(180deg, #2B2140 0%, #4A2E5C 100%)", text: "#F1E9F5", accent: "#D9B8E8" },
      { name: "Warm Glow", bg: "linear-gradient(160deg, #FFE3B0 0%, #FFB4A2 100%)", text: "#4A2A1A", accent: "#4A2A1A" },
    ],
    shapes: [shape("paw", { top: "8%", left: "14%", size: "20px", rotate: "-10deg", opacity: 0.45 }), shape("paw", { top: "82%", left: "76%", size: "22px", rotate: "15deg", opacity: 0.4 })],
    hasPhoto: true,
    photoShape: "circle",
    fields: [
      { id: "title", role: "eyebrow", default: "Over the Rainbow Bridge" },
      { id: "name", role: "name", default: "Luna" },
      { id: "line", role: "line", default: "2010 — 2026" },
      { id: "message", role: "message", default: "Sixteen years of company, comfort, and unconditional love. Rest easy, sweet girl." },
    ],
  },
  {
    id: "pet-playful",
    category: "Pet",
    name: "Playful Pup",
    ratio: "3 / 4",
    palettes: [
      { name: "Orange Pop", bg: "linear-gradient(160deg, #FF8C42 0%, #FFC93D 100%)", text: "#3A1F00", accent: "#3A1F00" },
      { name: "Berry Blue", bg: "linear-gradient(160deg, #4EA8DE 0%, #7C3AED 100%)", text: "#FFFFFF", accent: "#FFFFFF" },
      { name: "Mint Fresh", bg: "linear-gradient(160deg, #B8F2E6 0%, #6FCF97 100%)", text: "#0F3A2A", accent: "#0F3A2A" },
    ],
    shapes: [
      shape("paw", { top: "6%", left: "78%", size: "18px", rotate: "10deg", opacity: 0.5 }),
      shape("paw", { top: "84%", left: "10%", size: "20px", rotate: "-15deg", opacity: 0.45 }),
      shape("circle", { top: "12%", left: "10%", size: "10px", opacity: 0.4 }),
    ],
    hasPhoto: true,
    photoShape: "circle",
    fields: [
      { id: "title", role: "eyebrow", default: "Welcome Home" },
      { id: "name", role: "name", default: "Cooper" },
      { id: "line", role: "line", default: "Joined the family · March 1" },
      { id: "message", role: "message", default: "New paws, new adventures. So happy you're here." },
    ],
  },

  // ---------- PREMIUM (1 extra per category, unlocked by watching an ad) ----------
  {
    id: "bday-gold",
    category: "Birthday",
    name: "Golden Celebration",
    ratio: "3 / 4",
    premium: true,
    palettes: [
      { name: "Black & Gold", bg: "linear-gradient(160deg, #1A1A1A 0%, #3A2E10 100%)", text: "#F2E7C9", accent: "#E8B93B" },
      { name: "Champagne", bg: "linear-gradient(160deg, #FBF3E3 0%, #EFDCB0 100%)", text: "#4A3A0A", accent: "#B8964F" },
      { name: "Rose Gold", bg: "linear-gradient(160deg, #F7E3E0 0%, #E8B4A8 100%)", text: "#5C2E22", accent: "#B8694F" },
    ],
    shapes: [
      shape("ring", { top: "8%", left: "10%", size: "22px", opacity: 0.5 }),
      shape("ring", { top: "80%", left: "80%", size: "18px", opacity: 0.5 }),
      shape("circle", { top: "88%", left: "16%", size: "10px", opacity: 0.5 }),
    ],
    hasPhoto: true,
    photoShape: "circle",
    fields: [
      { id: "title", role: "title", default: "A Golden Celebration" },
      { id: "name", role: "name", default: "Evelyn's 50th" },
      { id: "line", role: "line", default: "Saturday, September 12 · 6:00 PM" },
      { id: "message", role: "message", default: "Fifty years of stories worth telling. Join us for an evening to remember." },
    ],
  },
  {
    id: "wed-royal",
    category: "Wedding",
    name: "Royal Elegance",
    ratio: "3 / 4",
    premium: true,
    palettes: [
      { name: "Emerald & Gold", bg: "linear-gradient(180deg, #0F2A22 0%, #163B30 100%)", text: "#F2ECD9", accent: "#C9A85C" },
      { name: "Ivory & Navy", bg: "linear-gradient(180deg, #FBF8F2 0%, #F0EEE7 100%)", text: "#1A2436", accent: "#2E4468" },
      { name: "Deep Wine", bg: "linear-gradient(180deg, #2A1218 0%, #3D1A22 100%)", text: "#F1E4E4", accent: "#C9A85C" },
    ],
    shapes: [shape("frame", { inset: "4%", opacity: 0.6 }), shape("rule", { top: "88%", opacity: 0.4 })],
    hasPhoto: true,
    photoShape: "circle",
    fields: [
      { id: "title", role: "eyebrow", default: "With Great Joy" },
      { id: "name", role: "name", default: "Isabella & Alexander" },
      { id: "line", role: "line", default: "December 6 · The Grand Ballroom" },
      { id: "message", role: "message", default: "An evening of elegance, love, and celebration. We hope you'll join us." },
    ],
  },
  {
    id: "mem-golden-light",
    category: "Funeral / Memorial",
    name: "Golden Light",
    ratio: "3 / 4",
    premium: true,
    palettes: [
      { name: "Deep Navy Gold", bg: "linear-gradient(180deg, #0D1420 0%, #1A2438 100%)", text: "#F2ECD9", accent: "#C9A85C" },
      { name: "Warm Ivory", bg: "linear-gradient(180deg, #FBF6EC 0%, #F0E6D2 100%)", text: "#3A2E1F", accent: "#B8964F" },
      { name: "Soft Charcoal", bg: "linear-gradient(180deg, #232323 0%, #333333 100%)", text: "#F0F0F0", accent: "#C9A85C" },
    ],
    shapes: [shape("glow", { top: "6%", left: "50%", size: "200px", opacity: 0.3 }), shape("rule", { top: "86%", opacity: 0.4 })],
    hasPhoto: true,
    photoShape: "circle",
    fields: [
      { id: "title", role: "eyebrow", default: "Forever Cherished" },
      { id: "name", role: "name", default: "Eleanor Grace Whitfield" },
      { id: "line", role: "line", default: "1938 — 2026" },
      { id: "message", role: "message", default: "A life of grace, warmth, and quiet strength. Held forever in our hearts." },
    ],
  },
  {
    id: "pet-golden-years",
    category: "Pet",
    name: "Golden Years",
    ratio: "3 / 4",
    premium: true,
    palettes: [
      { name: "Amber Glow", bg: "linear-gradient(160deg, #3A2A10 0%, #6B4A18 100%)", text: "#F5E3C0", accent: "#E8B93B" },
      { name: "Soft Cream", bg: "linear-gradient(160deg, #FBF3E3 0%, #F0DDB8 100%)", text: "#4A3A0A", accent: "#B8964F" },
      { name: "Dusty Rose", bg: "linear-gradient(160deg, #F0DCD8 0%, #D9A8A0 100%)", text: "#5C2A22", accent: "#B8694F" },
    ],
    shapes: [
      shape("paw", { top: "8%", left: "14%", size: "20px", rotate: "-10deg", opacity: 0.5 }),
      shape("glow", { top: "10%", left: "50%", size: "150px", opacity: 0.25 }),
    ],
    hasPhoto: true,
    photoShape: "circle",
    fields: [
      { id: "title", role: "eyebrow", default: "Celebrating Every Year" },
      { id: "name", role: "name", default: "Bailey" },
      { id: "line", role: "line", default: "10 wonderful years · and counting" },
      { id: "message", role: "message", default: "Grey around the muzzle, still the best part of every day." },
    ],
  },
];

// System-installed font stacks only — no web fonts are downloaded, so
// picking any of these costs zero extra network weight (important for
// slow connections). A couple are free by default; the rest unlock
// after watching one ad, same pattern as everything else premium here.
export const FONT_OPTIONS = [
  { id: "default", label: "Default", stack: null, premium: false },
  { id: "system", label: "Clean Sans", stack: "system-ui, -apple-system, sans-serif", premium: false },
  { id: "mono", label: "Typewriter", stack: "'Courier New', Courier, monospace", premium: true },
  { id: "elegant", label: "Elegant Serif", stack: "'Palatino Linotype', 'Book Antiqua', Palatino, serif", premium: true },
  { id: "bold", label: "Bold Impact", stack: "Impact, 'Arial Narrow Bold', sans-serif", premium: true },
  { id: "script", label: "Script", stack: "'Brush Script MT', 'Segoe Script', cursive", premium: true },
];

export const getTemplatesByCategory = (category) =>
  TEMPLATES.filter((t) => t.category === category);