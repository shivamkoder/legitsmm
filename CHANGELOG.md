# Changelog

All notable changes to the **LegitSMM** project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

### Added
- **Full YouTube MoreThanPanel Catalog (30 Active Services across all 8 Categories):**
  - **Views (6 services):** Bot (`2961`), Mix 10-Day (`9550`), Mix 30-Day (`9220`), Mix Lifetime (`9549`), Organic Views+Likes (`9551`), Organic Views+Likes+Comments (`9552`).
  - **Subscribers (5 services):** Bot (`10226`), Organic Looking (`8073`), Mix 30-Day (`8355`), Mix 30-Day High Speed (`10316`), Organic Drip-Feed (`10206`).
  - **Likes (3 services):** Organic 30-Day (`1857`), Organic Drip-Feed (`9663`), Turkey Targeted (`5710`).
  - **Comments (4 services):** Mix Custom 30-Day (`8139`), Mix Custom Fast (`7990`), USA Organic Custom (`7991`), Comment Likes Lifetime (`912`).
  - **Watch Time (3 services):** 3+ Min 90-Day (`4879`), 60+ Min 30-Day (`10236`), 5+ Min 90-Day (`3589`).
  - **Shares (3 services):** Lifetime 50/Day (`6250`), 100/Day (`6251`), 250/Day (`6252`).
  - **Live Stream Views (3 services):** 15m (`1547`), 15m 100% Concurrent (`10163`), Live Reactions (`7291`).
  - **Shorts Views (3 services):** Bot (`5713`), Mix 30-Day (`5714`), Organic Lifetime (`862`).
- **Full Facebook MoreThanPanel Catalog (35 Active Services across all 9 Categories):**
  - **Followers (3 services):** Bot (`4138`), Mix 30-Day (`1402`), Mix Lifetime (`8927`).
  - **Page Likes (5 services):** Bot (`985`), Mix 30-Day (`1986`), Mix Lifetime (`9885`), Organic Real-Looking (`8129`), USA Organic 30-Day (`8435`).
  - **Post Likes (5 services):** Bot (`578`), Mix 30-Day (`5133`), Mix Lifetime (`5207`), Mix Drip-Feed (`9062`), Organic Low-Drop (`8130`).
  - **Views (3 services):** Mix Lifetime Video/Reels (`4715`), Mix Non-Drop (`10187`), Organic 30-Day (`680`).
  - **Shares (2 services):** Mix Non-Drop (`10195`), Organic Photo & Post (`10196`).
  - **Comments (4 services):** Mix Custom 30-Day (`701`), Organic Custom Non-Drop (`10188`), Random English (`10192`), Organic Random (`9795`).
  - **Post Reactions (5 services):** Love (`5986`), Wow (`5988`), Haha (`5989`), Sad (`5990`), Angry (`5991`).
  - **Group Members (4 services):** Bot (`1724`), Mix 30-Day (`720`), Mix Lifetime (`10227`), Organic Old Accounts (`9344`).
  - **Live Stream Views (4 services):** 15m (`618`), 30m (`619`), 60m (`620`), 90m (`621`).
- **Full Telegram MoreThanPanel Catalog (21 Active Services across all 6 Categories):**
  - **Members (5 services):** Fast Bot (`1640`), Mix 90-Day (`5753`), Mix Lifetime (`9244`), Organic Online 30-Day (`8942`), Premium 5-Day (`7516`).
  - **Channel Views (4 services):** Fast Post/Channel (`9863`), Last 5 Posts (`4880`), Last 10 Posts (`2949`), Future 5 Posts (`8500`).
  - **Post Reactions (4 services):** Mix Positive (`8510`), Organic Positive Low-Drop (`2737`), Fire (`7681`), Negative Low-Drop (`2738`).
  - **Shares (3 services):** Fast Post Shares (`8509`), Global Mix Shares + Views (`2936`), Direct Repost (`2935`).
  - **Comments (3 services):** USA (`3526`), Indian (`3529`), Arabic (`3528`) Random Comments + Static Views.
  - **Channel Boosts (2 services):** 1-Day Story Activate (`7461`), 7-Day Story Activate (`7462`).
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
