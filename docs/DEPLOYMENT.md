# LegitSMM Production Deployment Guide

This guide details the step-by-step procedure to deploy the **LegitSMM** platform to production using Vercel, Supabase, and Upstash.

---

## 1. Environment Variables Reference

Configure the following environment variables in your Vercel Project Settings:

| Variable Name | Environment | Description |
| :--- | :--- | :--- |
| `NEXT_PUBLIC_SUPABASE_URL` | Production & Preview | Supabase project URL (`https://<project-ref>.supabase.co`) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Production & Preview | Supabase client anon / publishable key |
| `SUPABASE_SERVICE_ROLE_KEY` | Production & Preview | Supabase service role secret key (never expose to client) |
| `MORETHANPANEL_API_KEY` | Production & Preview | MoreThanPanel wholesale provider API key |
| `NEXT_PUBLIC_REOWN_PROJECT_ID` | Production & Preview | Reown / AppKit Cloud Project ID for Web3 wallet modal |
| `QSTASH_CURRENT_SIGNING_KEY` | Production | Upstash QStash webhook signing key |
| `QSTASH_NEXT_SIGNING_KEY` | Production | Upstash QStash next key (for zero-downtime key rotation) |

---

## 2. Supabase Setup

### 2.1 Database Initialization
Ensure all schema tables, constraints, and stored procedures are applied:
1. `services` and `service_suppliers` tables populated.
2. Ensure `UNIQUE (service_id)` is enforced on `public.service_suppliers`.
3. Verify stored procedures `public.place_order`, `public.finalize_order`, and `public.apply_transaction`.

### 2.2 Row Level Security (RLS)
Confirm the following policies are active:
- `services`: Public `SELECT` allowed for `is_active = true`.
- `profiles`: Authenticated users can read and update where `id = auth.uid()`.
- `orders`: Authenticated users can read where `user_id = auth.uid()`.
- `transactions`: Authenticated users can read where `user_id = auth.uid()`.

---

## 3. Wholesale Provider Configuration (MoreThanPanel)

1. Obtain your API key from the MoreThanPanel API Settings dashboard.
2. Deposit wholesale operating capital into your MoreThanPanel balance (orders will fail and trigger instant user refunds if provider balance reaches `$0.00`).
3. Set `MORETHANPANEL_API_KEY` in Vercel environment variables.

---

## 4. Background Status Synchronization (Upstash QStash)

Automated order status polling requires recurring invocation of `/api/jobs/checkstatus`:

1. Sign in to the [Upstash Console](https://console.upstash.com/qstash).
2. Create a new **Recurring Schedule**:
   - **Destination URL:** `https://your-domain.com/api/jobs/checkstatus`
   - **Cron Expression:** `*/2 * * * *` (Runs every 2 minutes)
   - **Method:** `POST`
3. Copy `QSTASH_CURRENT_SIGNING_KEY` and `QSTASH_NEXT_SIGNING_KEY` from the Upstash QStash dashboard into Vercel environment variables.

---

## 5. Vercel Deployment

1. Connect your GitHub repository `shivamkoder/legitsmm` to Vercel.
2. Select framework preset: **Next.js**.
3. In **Build & Development Settings**:
   - Build Command: `npm run build`
   - Output Directory: `.next`
   - Install Command: `npm install`
4. Deploy the project and verify that the build succeeds.
