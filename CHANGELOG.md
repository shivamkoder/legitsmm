# Changelog

All notable changes to the **LegitSMM** project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

### Added
- **Full Instagram MoreThanPanel Catalog Expansion (26 Active Services across all 7 Categories):**
  - **Followers (4 services):** Bot (`5752`), Mix 30-Day (`5839`), Organic 30-Day (`9107`), Organic Lifetime (`10268`).
  - **Likes (5 services):** Bot (`2847`), Mix 30-Day (`2499`), Mix Lifetime (`2498`), Organic Drip-feed (`9033`), USA Targeted (`8024`).
  - **Comments (3 services):** Random Non-Drop (`1850`), Budget Custom Comments (`4641`), Organic Custom Comments (`10234`).
  - **Shares (3 services):** Fast Bot (`5707`), Mix Direct (`2960`), Organic Shares + Reach (`5208`).
  - **Saves (3 services):** Bot (`2947`), Organic Power Saves 30-Day (`9887`), Mix High Speed (`9884`).
  - **Impressions (3 services):** Bot Reach + Impressions (`5030`), Mix High Max (`2959`), Organic 30-Day (`8134`).
- **Custom Comments Order Form UI:** Automatic multi-line comment textarea, live line-count quantity calculation, and `extra.comments` submission for `custom_comments` services.
- **Refill Window Labels:** Surfaced `refill_days` from Supabase to show exact `30-Day Refill` and `Lifetime Refill` badges in `ServiceDetails`.

### Planned
- Automated ticket support system with real-time customer messaging.
- Mass order batch submission parser.
- Affiliate referral system with automated commission attribution.

---

## [1.0.0] - 2026-11-23

### Added
- **Core Architecture:**
  - Modern Next.js 16 App Router foundation with React 19 and Turbopack support.
  - Supabase PostgreSQL database integration with full Row Level Security (RLS) enforcement.
  - PL/pgSQL stored procedures:
    - `place_order`: Atomic user balance validation (`FOR UPDATE`), order creation, and financial ledger debit.
    - `finalize_order`: Idempotent status transitions and automated full/partial balance refunds.
    - `apply_transaction`: Double-entry accounting ledger with unique idempotency keys.
- **Wholesale Fulfillment Engine:**
  - Hardcoded single-supplier routing architecture (`service_suppliers_service_id_unique`) strictly bound to MoreThanPanel.
  - Eliminated unstable cross-supplier failover loops; failed orders automatically cancel and refund immediately.
  - Live catalog synchronization job (`/api/jobs/sync-catalog`) populating over 6,500 wholesale services.
  - Upstash QStash-driven status reconciliation worker (`/api/jobs/checkstatus`) with cryptographic signature validation.
- **Frontend & User Experience:**
  - Responsive dark-themed dashboard featuring neon green accent branding (`#7FFF00`).
  - Curated Instagram services catalog covering Organic Views, Bot Views, Mix Views, US-Targeted Views, and Organic Likes.
  - Category dropdown with dynamic service count badges and automatic first-service selection.
  - Service Description Card featuring a 2x2 stat grid including Start Time, Speed, Guaranteed (Refill), and **Audience Type** badges (Organic, Mix, Bot).
  - Dynamic live price estimation based on selected service rate and order quantity.
  - Real-time user balance in dashboard header and stats card bound to Supabase `profiles`.
  - Live Orders History tab displaying user orders, links, charges, and statuses directly from database.
- **Web3 Payments & Wallets:**
  - Multi-chain Web3 deposit modal supporting Polygon, Arbitrum, Base, and BNB Chain.
  - Integrated `@reown/appkit` and Wagmi wallet connectors for MetaMask, Phantom, Coinbase Wallet, and Rainbow.
  - Client-only dynamic import of `WalletDeposit` with `ssr: false` to ensure seamless Turbopack production builds.
  - On-chain transaction verification route (`/api/payments/verifyweb3`).
- **Documentation & Governance:**
  - Complete overhaul of `README.md` with system overview, features, and architecture diagrams.
  - Added `docs/ARCHITECTURE.md` specifying database schema, ERDs, and transactional sequences.
  - Added `docs/API.md` with schemas for all internal endpoints and webhook jobs.
  - Added `docs/DEPLOYMENT.md` detailing Vercel, Supabase, and QStash deployment steps.
  - Added `CONTRIBUTING.md`, `SECURITY.md`, and GitHub issue/PR templates.

### Fixed
- Fixed Turbopack build failure caused by modular `@x402/*` packages required by Coinbase CDP SDK.
- Fixed New Order tab empty service dropdown by defaulting category filter to "All Categories".
- Added database generated columns for `min` and `max` quantities aliased to `min_qty` and `max_qty`.
- Resolved supplier API key resolution to check `process.env` before static fallbacks.
