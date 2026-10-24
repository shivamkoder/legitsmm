// Edit these once; every legal page reads from here.
export const LEGAL = {
  brand: "Legit SMM",
  legalName: "[Your registered business name]", // e.g. proprietor / Udyam-registered name
  email: "support@yourdomain.com",
  address: "[Your registered address, City, State, PIN, India]",
  courtCity: "[City]", // jurisdiction city for disputes
  updated: "October 24, 2026",
};

export type LegalSection = {
  heading: string;
  body?: string[];
  list?: string[];
};

export const legalLinks = [
  { href: "/about", label: "About Us" },
  { href: "/terms", label: "Terms of Service" },
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/refund-policy", label: "Refund & Cancellation" },
  { href: "/disclaimer", label: "Disclaimer" },
];
