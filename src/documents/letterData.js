export const DEFAULT_LETTER = {
  logo: null,
  senderName: "John Doe",
  senderTitle: "Marketing Specialist",
  senderCompany: "",
  senderAddress: "123 Green Street\nLagos, Nigeria",
  senderPhone: "+234 801 234 5678",
  senderEmail: "john.doe@email.com",
  senderWebsite: "",
  date: "May 20, 2025",
  recipientName: "The HR Manager",
  recipientOrganization: "ABC Company Ltd.",
  recipientAddress: "45 Business Avenue\nVictoria Island, Lagos\nNigeria",
  referenceNumber: "",
  subject: "Application for the Position of Marketing Officer",
  greeting: "Dear Sir/Madam,",
  body:
    "I am writing to express my interest in the Marketing Officer position advertised on your company website. With a strong background in marketing and communications, I am confident in my ability to contribute effectively to your team.\n\nIn my previous role at XYZ Company, I successfully managed marketing campaigns that increased brand visibility and customer engagement. I am passionate about creating strategies that drive results.\n\nI would welcome the opportunity to discuss how my skills and experience align with your needs.\n\nThank you for your time and consideration.",
  closing: "Yours faithfully,",
  signatureName: "John Doe",
  signatureTitle: "Marketing Specialist",
};

// A label only — doesn't change which fields appear, just helps the
// user keep track of what they're writing and tags the exported
// filename. Keeps one editor working for many letter purposes instead
// of building a separate editor per letter type.
export const LETTER_TYPES = [
  "Formal Letter",
  "Application Letter",
  "Cover Letter",
  "Business Letter",
  "Recommendation Letter",
  "Official Letter",
  "Personal Letter",
];