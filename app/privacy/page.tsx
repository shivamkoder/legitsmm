import type { Metadata } from "next";
import { LegalPage } from "@/components/legal-page";
import { LEGAL, type LegalSection } from "@/lib/legal";

export const metadata: Metadata = { title: `Privacy Policy | ${LEGAL.brand}` };

const sections: LegalSection[] = [
  {
    heading: "Who we are",
    body: [`${LEGAL.brand} is operated by ${LEGAL.legalName} (“we”, “us”). We are the data fiduciary for the personal data described in this policy.`],
  },
  {
    heading: "Information we collect",
    list: [
      "Account details: your name, email address and password. Passwords are handled by our authentication provider and are not stored in plain text.",
      "Order details: the links or usernames you submit, services ordered, quantities and order history.",
      "Payment details: deposit amount, method, status and transaction references. Card numbers, UPI PINs and banking credentials are entered with the payment gateway and are never stored by us.",
      "Support details: messages and attachments you send through tickets.",
      "Technical data: IP address, browser and device type, pages visited and timestamps, used for security and fraud prevention.",
    ],
  },
  {
    heading: "How we use your information",
    list: [
      "To create and manage your account and deliver your orders.",
      "To process payments, detect fraud and prevent abuse.",
      "To provide support and send service messages such as email confirmation and password resets.",
      "To improve and secure the Service.",
      "To comply with legal obligations.",
    ],
    body: ["We do not sell your personal data."],
  },
  {
    heading: "Who we share it with",
    list: [
      "Infrastructure providers, for example our hosting and authentication/database provider (Supabase) and our web host.",
      "Payment gateways and processors, so deposits can be completed and verified.",
      "Service suppliers, who receive only what is needed to fulfil an order (such as the public link you submitted).",
      "Authorities or courts, when required by law or to protect our rights and users.",
    ],
  },
  {
    heading: "Cookies",
    body: ["We use essential cookies to keep you signed in and keep the Service secure, and a cookie to remember your theme preference. We do not use advertising cookies."],
  },
  {
    heading: "How long we keep data",
    body: ["We keep account and order records for as long as your account is active and afterwards for the period needed for accounting, tax, dispute and legal purposes. You can ask us to delete your account; we will delete or anonymise data we are no longer required to keep."],
  },
  {
    heading: "Security",
    body: ["We use encrypted connections, access controls and row-level security on our database. No system is perfectly secure, so please use a strong, unique password."],
  },
  {
    heading: "Your rights",
    body: ["Under applicable Indian law, including the Digital Personal Data Protection Act, 2023, you may:"],
    list: [
      "ask for access to the personal data we hold about you;",
      "ask us to correct or update inaccurate data;",
      "ask us to erase your data, subject to legal retention requirements;",
      "withdraw consent, which may mean we can no longer provide the Service;",
      "make a grievance to us and, if unresolved, to the Data Protection Board of India.",
    ],
  },
  {
    heading: "Children",
    body: ["The Service is not intended for anyone under 18. If we learn that a minor has registered, we will close the account."],
  },
  {
    heading: "International transfers",
    body: ["Our providers may process data on servers outside India. We choose providers that apply appropriate safeguards."],
  },
  {
    heading: "Changes to this policy",
    body: ["We may update this policy. The latest version will always be on this page with its date."],
  },
  {
    heading: "Grievance contact",
    body: [`For privacy requests or complaints, email ${LEGAL.email}. We aim to respond within 7 working days.`],
  },
];

export default function Page() {
  return (
    <LegalPage
      title="Privacy Policy"
      intro="This policy explains what personal data we collect, why we collect it and the choices you have."
      sections={sections}
      current="/privacy"
    />
  );
}
