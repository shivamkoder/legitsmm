import type { Metadata } from "next";
import { LegalPage } from "@/components/legal-page";
import { LEGAL, type LegalSection } from "@/lib/legal";

export const metadata: Metadata = { title: `Terms of Service | ${LEGAL.brand}` };

const sections: LegalSection[] = [
  {
    heading: "Acceptance of these terms",
    body: [
      `By creating an account or using ${LEGAL.brand} (the “Service”), you agree to these Terms of Service, our Privacy Policy, Refund & Cancellation Policy and Disclaimer. If you do not agree, do not use the Service.`,
    ],
  },
  {
    heading: "Eligibility",
    body: [
      "You must be at least 18 years old and legally able to enter into a contract. If you use the Service for a business, you confirm you have authority to bind that business.",
    ],
  },
  {
    heading: "What we provide",
    body: [
      `${LEGAL.brand} is a social media marketing panel. We let you purchase promotional services such as followers, likes, views and similar engagement for your own public accounts and content. Some services are fulfilled by third-party suppliers.`,
      "We are not affiliated with, endorsed by, or sponsored by Instagram, Facebook, YouTube, TikTok, X, Telegram, Spotify, Twitch or any other platform. All trademarks belong to their owners.",
    ],
  },
  {
    heading: "Your account",
    list: [
      "Provide accurate information and keep your login details secure. You are responsible for all activity under your account.",
      "One person or business per account. Creating multiple accounts to abuse offers, bonuses or points is not allowed.",
      "Tell us immediately at the contact email if you suspect unauthorised access.",
    ],
  },
  {
    heading: "Placing orders",
    list: [
      "Make sure the link or username you submit is correct and public. Orders on private, deleted or restricted profiles cannot be delivered and are not refundable once started.",
      "Do not change a username, make an account private or delete a post while an order is in progress.",
      "Do not place more than one order for the same link at the same time unless the previous one is complete.",
      "Start times, speeds and estimated completion times are estimates, not guarantees.",
      "Once an order has started it cannot be modified.",
    ],
  },
  {
    heading: "Pricing, balance and payments",
    list: [
      "Prices are shown on the Service and may change at any time. The price at the time you place an order applies to that order.",
      "Funds you add are stored as account balance (credit) that can only be spent on services on this platform. Balance is not a bank account or e-wallet, earns no interest, and cannot be transferred to another user.",
      "Deposits made in cryptocurrency are deposit-only. Credit from crypto deposits cannot be converted back to cryptocurrency or withdrawn to any wallet.",
      "Payments are processed by third-party payment gateways. We never see or store your card, UPI PIN or banking passwords.",
      "Applicable taxes, gateway charges or currency conversion fees may apply. Bonuses and discount codes have no cash value and can be withdrawn if misused.",
      "You agree not to initiate chargebacks or payment disputes for orders that were delivered. We may suspend accounts and recover amounts for fraudulent or abusive disputes.",
    ],
  },
  {
    heading: "Refunds and cancellations",
    body: ["Refunds and cancellations are governed by our Refund & Cancellation Policy, which forms part of these Terms."],
  },
  {
    heading: "Acceptable use",
    body: ["You agree not to use the Service to:"],
    list: [
      "promote anything illegal, including fraud, scams, hate speech, violence, child exploitation, terrorism or non-consensual content;",
      "infringe anyone’s intellectual property or privacy rights;",
      "attempt to hack, overload, scrape or reverse engineer the Service, or abuse the API;",
      "resell access in a way that misrepresents us or breaches these Terms, unless we have agreed in writing;",
      "violate any applicable law, including Indian law.",
    ],
  },
  {
    heading: "Platform risk",
    body: [
      "Social media platforms set their own rules and may remove engagement, restrict reach, or take action against accounts at any time. We cannot control this. Services marked with a refill period are refilled only as described for that service and only within that period.",
      "You use the Service at your own risk and are responsible for ensuring your use complies with the rules of each platform.",
    ],
  },
  {
    heading: "Account points and promotions",
    body: [
      "Account points, bonuses, discounts and any rewards have no cash value, are not transferable, and may be changed, limited or ended at any time. We may void rewards obtained through abuse or error.",
    ],
  },
  {
    heading: "API access",
    body: ["If we provide API access, you must keep your key secret, respect rate limits, and remain responsible for every request made with your key."],
  },
  {
    heading: "Suspension and termination",
    body: [
      "We may suspend or close your account, cancel orders, or refuse service if we reasonably believe you have breached these Terms, created risk or legal exposure for us, or abused the Service. You may stop using the Service and ask us to close your account at any time. Unused balance is handled under the Refund & Cancellation Policy.",
    ],
  },
  {
    heading: "Disclaimer of warranties",
    body: [
      "The Service is provided “as is” and “as available”. To the maximum extent permitted by law, we do not guarantee uninterrupted service, specific results, retention of delivered engagement, or that the Service will meet your expectations.",
    ],
  },
  {
    heading: "Limitation of liability",
    body: [
      "To the maximum extent permitted by law, we are not liable for indirect, incidental or consequential losses, including lost profits, loss of data, or account suspension by a third-party platform. Our total liability for any claim is limited to the amount you paid us for the order giving rise to the claim.",
    ],
  },
  {
    heading: "Indemnity",
    body: ["You agree to compensate us for losses, claims and costs arising from your breach of these Terms or your misuse of the Service."],
  },
  {
    heading: "Changes to these terms",
    body: ["We may update these Terms from time to time. The updated version applies from the date shown at the top of this page. Continuing to use the Service means you accept the changes."],
  },
  {
    heading: "Governing law and disputes",
    body: [
      `These Terms are governed by the laws of India. Subject to applicable law, the courts at ${LEGAL.courtCity} have exclusive jurisdiction. Please contact us first at ${LEGAL.email} so we can try to resolve any issue informally.`,
    ],
  },
];

export default function Page() {
  return (
    <LegalPage
      title="Terms of Service"
      intro={`Please read these terms carefully before using ${LEGAL.brand}, operated by ${LEGAL.legalName}.`}
      sections={sections}
      current="/terms"
    />
  );
}
