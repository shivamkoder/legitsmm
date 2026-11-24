# LegitSMM API Reference

This document provides technical documentation for all internal route handlers and background job endpoints in the **LegitSMM** platform.

---

## 1. Orders

### `POST /api/orders`
Places a new order for an authenticated user. Validates parameters, deducts balance atomically via `place_order` RPC, and dispatches the request to the assigned wholesale supplier.

- **Authentication:** Required (Supabase Auth Session Cookie)
- **Content-Type:** `application/json`

#### Request Body
```json
{
  "serviceId": "9052",
  "link": "https://www.instagram.com/p/C_...",
  "quantity": 1000,
  "extra": {}
}
```

#### Responses
- **`200 OK` (Order Dispatched & Confirmed):**
  ```json
  {
    "success": true,
    "orderId": 142,
    "charge": 0.0286
  }
  ```
- **`202 Accepted` (Supplier Timeout / Unconfirmed):**
  ```json
  {
    "success": true,
    "orderId": 142,
    "charge": 0.0286,
    "warning": "Your order is being confirmed with our provider."
  }
  ```
- **`400 Bad Request`:**
  ```json
  { "error": "Invalid link." }
  ```
- **`401 Unauthorized`:**
  ```json
  { "error": "Not authenticated." }
  ```
- **`402 Payment Required`:**
  ```json
  { "error": "Insufficient balance." }
  ```
- **`502 Bad Gateway` (Supplier Failed & User Refunded):**
  ```json
  { "error": "We couldn't place this order right now. You have not been charged." }
  ```

---

## 2. Background Jobs & Webhooks

### `POST /api/jobs/checkstatus`
Reconciles open orders against wholesale supplier APIs. Groups open orders by supplier, fetches batch statuses, and updates database records with start counts, remains, and completion times.

- **Authentication:** Upstash QStash Signature Header (`upstash-signature`)
- **Execution Frequency:** Recommended every 2 minutes

#### Headers
```http
upstash-signature: eyJhbGciOi...
```

#### Response
```json
{
  "open": 24,
  "checked": 24,
  "updated": 18,
  "finalized": 6,
  "skipped": 0,
  "errors": 0
}
```

---

### `POST /api/jobs/sync-catalog`
Synchronizes wholesale provider service catalogs into `public.supplier_catalog`. Captures rates, minimum/maximum limits, refill availability, and service descriptions.

- **Authentication:** Internal / QStash Webhook

#### Response
```json
{
  "success": true,
  "synced": 6598,
  "supplier": "morethanpanel"
}
```

---

## 3. Web3 Payments & Wallets

### `POST /api/payments/verifyweb3`
Verifies an on-chain deposit transaction hash against public EVM RPC nodes. Validates that the transaction was mined, sent to the designated vault address, and confirms the correct token/native amount before crediting user balance.

- **Authentication:** Required (Supabase Auth Session Cookie)

#### Request Body
```json
{
  "txHash": "0x4f8a...c912",
  "chainId": 137,
  "amount": 25.00,
  "token": "USDT"
}
```

#### Response
```json
{
  "success": true,
  "depositId": "dep_9102",
  "creditedAmount": 25.00,
  "newBalance": 35.50
}
```

---

### `POST /api/wallet/link`
Links a Web3 wallet address to the user's Supabase profile using an EIP-4361 / EIP-191 cryptographic signature.

- **Authentication:** Required (Supabase Auth Session Cookie)

#### Request Body
```json
{
  "address": "0x71C...8976",
  "message": "Sign to verify ownership of 0x71C... on LegitSMM",
  "signature": "0x3a4...f1"
}
```

#### Response
```json
{
  "success": true,
  "linked": true,
  "address": "0x71C...8976"
}
```

---

## 4. Admin Management

### `GET /api/admin/suppliers`
Lists all registered wholesale suppliers, connection status, and endpoint configurations.

- **Authentication:** Admin Role Required

### `POST /api/admin/suppliers`
Updates wholesale supplier credentials, enables/disables suppliers, or adjusts sync frequencies.

---

## 5. Public Reseller API (SMM Panel v2)

### `POST /api/v2`
Standard SMM Panel v2 endpoint accepting `application/x-www-form-urlencoded` or `application/json` requests authenticated with a user's hashed API key (`profiles.api_key_hash`).

- **Supported Actions:**
  - `action=services` — Lists all active services with live retail rates and min/max bounds.
  - `action=balance` — Returns `{ balance, currency: "USD" }`.
  - `action=add` — Places an order atomically (`service`, `link`, `quantity`, optional `comments`), tags `source = 'api'`, and returns `{ order }`.
  - `action=status` — Returns live fulfillment status for a single `order` or comma-separated `orders` (up to 100) scoped to the authenticated user.

### `GET / POST / DELETE /api/account/api-key`
Session-authenticated routes for managing the signed-in user's API key (stores only SHA-256 hash and display prefix).

