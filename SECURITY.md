# Security Policy

At **LegitSMM**, the security of our users, financial transactions, and platform infrastructure is our highest priority. We take security vulnerabilities seriously and appreciate the efforts of the security research community to help keep our platform safe.

---

## 1. Supported Versions

Only the latest release running on the `main` branch is actively supported with security updates and patches.

| Version | Supported |
| :--- | :--- |
| `main` (Latest) | :white_check_mark: |
| Older tags / branches | :x: |

---

## 2. Reporting a Vulnerability

If you discover a security vulnerability in LegitSMM, **please do not open a public GitHub issue**. Doing so exposes users to risk before a patch is available.

Instead, please report vulnerabilities privately:

1. **GitHub Security Advisory (Recommended):** Submit a confidential report via GitHub's [Private Vulnerability Reporting](https://github.com/shivamkoder/legitsmm/security/advisories/new) interface.
2. **Email Security Contact:** Alternatively, email details to `security@legitsmm.com` or contact repository maintainers directly.

### What to Include in Your Report

To help us triage and resolve the issue quickly, please provide:
- A clear description of the vulnerability and its potential impact.
- Step-by-step instructions or a minimal proof-of-concept (PoC) to reproduce the issue.
- The affected component, file, or API endpoint.
- Any suggested fixes or mitigations.

### Response Timelines

- **Initial Response:** We aim to acknowledge receipt of your vulnerability report within **48 hours**.
- **Assessment & Triage:** We will assess severity and provide an initial verdict within **5 business days**.
- **Fix & Disclosure:** We will work to release a patch promptly and coordinate public disclosure after the patch has been deployed to production.

---

## 3. Platform Security Architecture

LegitSMM incorporates defense-in-depth principles across all architectural layers:

### 3.1 Financial Invariants & Atomic Row Locking
- All user balance mutations, order deductions, and refunds are executed through PostgreSQL stored procedures (`place_order`, `finalize_order`, `apply_transaction`).
- Balance checks are guarded by pessimistic database row locks:
  ```sql
  SELECT balance FROM public.profiles WHERE id = p_user FOR UPDATE;
  ```
  This eliminates race conditions and double-spending attempts under high concurrency.
- Every financial mutation creates an immutable transaction row in `public.transactions` with a strict `UNIQUE` idempotency key.

### 3.2 Row Level Security (RLS)
- Supabase Row Level Security (RLS) is enabled across all public tables.
- Authenticated users can only read and mutate their own profile, orders, wallet connections, and transactions (`auth.uid() = user_id`).
- Administrative actions require service role authentication or verified admin roles.

### 3.3 Zero-Trust Client Architecture
- Service retail prices, minimum/maximum order limits, and provider wholesale rates are never trusted from the client request.
- Order payloads are validated strictly on the server against the database before order placement.

### 3.4 Web3 Cryptographic Verification
- Wallet address linking requires cryptographic signature verification (EIP-191 / EIP-4361 personal sign).
- On-chain deposits are verified directly against EVM RPC nodes (confirming transaction recipient vault, mined status, and token transfer event logs) before crediting balances.

### 3.5 Secret Isolation
- Sensitive credentials—including `SUPABASE_SERVICE_ROLE_KEY`, `MORETHANPANEL_API_KEY`, and `QSTASH_CURRENT_SIGNING_KEY`—are restricted to server-side execution and never exposed via `NEXT_PUBLIC_*` client variables.
- External webhook endpoints verify cryptographic signatures (`upstash-signature`) to prevent spoofing.
