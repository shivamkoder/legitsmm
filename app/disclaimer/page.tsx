import type { Metadata } from "next";
import { LegalPage } from "@/components/legal-page";
import { LEGAL, type LegalSection } from "@/lib/legal";

export const metadata: Metadata = { title: `Disclaimer | ${LEGAL.brand}` };

const sections: LegalSection[] = [
  {
    heading: "No affiliation",
    body: [`${LEGAL.brand} is an independent business. We are not affiliated with, authorised, maintained, sponsored or endorsed by Instagram, Meta, YouTube, Google, TikTok, X, Telegram, Spotify, Twitch or any other platform. All product names, logos and brands are property of their respective owners and are used only to identify the services we offer.`],
  },
  {
    heading: "No guarantee of results",
    body: ["Delivery times, speeds and retention are estimates. We do not guarantee any specific result, growth, reach, revenue or ranking. Engagement delivered through the Service does not mean real customers or sales."],
  },
  {
    heading: "Third-party platforms",
    body: ["Platforms may change their rules or remove content or engagement at any time. You are responsible for following the terms of every platform you use. We are not responsible for action taken by a platform against your account."],
  },
  {
    heading: "Pricing and availability",
    body: ["Services, prices and payment methods may change or become unavailable without notice. Payment methods marked “Soon” are not yet active."],
  },
  {
    heading: "No professional advice",
    body: ["Information on this site is for general information only and is not legal, financial or marketing advice."],
  },
  {
    heading: "Use at your own risk",
    body: ["By using the Service you accept these limits and agree that you are responsible for how you use it. See our Terms of Service for the full terms."],
  },
];

export default function Page() {
  return (
    <LegalPage
      title="Disclaimer"
      intro="Please read this disclaimer together with our Terms of Service."
      sections={sections}
      current="/disclaimer"
    />
  );
}
