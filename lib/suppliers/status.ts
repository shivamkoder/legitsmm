export type OpenStatus = "pending" | "in_progress" | "processing";
export type FinalStatus = "completed" | "partial" | "canceled";
export type OrderStatus = OpenStatus | FinalStatus;

export const OPEN_STATUSES: OpenStatus[] = ["pending", "in_progress", "processing"];

export function isFinal(s: OrderStatus): s is FinalStatus {
  return s === "completed" || s === "partial" || s === "canceled";
}

/**
 * Maps a supplier's status text ("In progress", "Canceled", ...) to ours.
 * Returns null for anything unrecognised so the poller can skip it and log it
 * instead of guessing (a wrong guess on "canceled" would refund money).
 */
export function mapSupplierStatus(raw: string): OrderStatus | null {
  switch (raw.trim().toLowerCase().replace(/[\s_-]+/g, " ")) {
    case "pending":
      return "pending";
    case "in progress":
      return "in_progress";
    case "processing":
      return "processing";
    case "completed":
      return "completed";
    case "partial":
      return "partial";
    case "canceled":
    case "cancelled":
    case "refunded":
    case "fail":
    case "failed":
      return "canceled";
    default:
      return null;
  }
}
