import type { Metadata } from "next";
import { LegalPage } from "@/components/legal-page";
import { LEGAL, type LegalSection } from "@/lib/legal";

export const metadata: Metadata = { title: `Refund & Cancellation Policy | ${LEGAL.brand}` };

const sections: LegalSection[] = [
  {
    heading: "Digital services",
    body: ["Our services are digital and begin processing automatically soon after an order is placed. Because of this, orders generally cannot be cancelled once they have started."],
  },
  {
    heading: "Cancelling an order",
    list: [
      "You may request cancellation through a ticket only while the order is still Pending and has not started processing.",
      "Orders that are In progress or Processing cannot be cancelled.",
      "If a cancellation is accepted, the order amount is returned to your account balance.",
    ],
  },
  {
    heading: "Partial and failed orders",
    list: [
      "Partial: if we cannot deliver the full quantity, the charge for the undelivered part is returned to your account balance automatically.",
      "Canceled: if we or our supplier cancel an order, the full charge is returned to your account balance.",
      "Refunds for orders are always made as account balance, not to your original payment method.",
    ],
  },
  {
    heading: "When refunds are not given",
    list: [
      "The link or username was wrong, private, deleted or changed during the order.",
      "The order was delivered in full as described, even if you later lose followers, likes or views because of platform action. If a refill is offered for that service, use the refill within its stated period.",
      "You placed several orders for the same link at the same time.",
      "Delivery was slower than estimated but still in progress. Estimates are not guarantees.",
      "Your account was closed for breaching our Terms.",
    ],
  },
  {
    heading: "Refills",
    body: ["Where a service shows a refill period, you may request a refill within that period for drops in delivered quantity. Refills are not a refund and do not extend the period."],
  },
  {
    heading: "Deposits and unused balance",
    list: [
      "Funds added to your balance are credit for spending on services. Balance is non-transferable.",
      "Crypto deposits are deposit-only and cannot be converted back to crypto or withdrawn.",
      "If you paid but the amount did not reach your balance, send us the transaction ID and a screenshot. We will verify with the payment gateway and credit your balance once confirmed.",
      "If a payment was debited from your bank or UPI app but the payment failed, it is normally reversed by your bank or the gateway within 5 to 7 working days. Contact us if it is not.",
      "For unused balance on a closed account, contact us. Eligibility is reviewed case by case, and any bonuses or discounts credited are deducted first.",
    ],
  },
  {
    heading: "Chargebacks",
    body: ["Please contact us before raising a dispute with your bank. Chargebacks on delivered orders may lead to account suspension and recovery of the disputed amount."],
  },
  {
    heading: "How to request a refund or cancellation",
    body: [`Open a ticket from your dashboard (Tickets) or email ${LEGAL.email} with your order ID. We aim to respond within 24 hours, and approved items are applied to your balance within 7 working days.`],
  },
];

export default function Page() {
  return (
    <LegalPage
      title="Refund & Cancellation Policy"
      intro="This policy explains when orders can be cancelled and how refunds and balance credits work."
      sections={sections}
      current="/refund-policy"
    />
  );
}
