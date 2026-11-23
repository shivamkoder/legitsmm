-- Migration: Add curated Facebook Views services from MoreThanPanel (supplier_id = 1)
-- Pricing rule: retail rate = ROUND(wholesale_rate * 1.4286, 4) for ~30% net margin

INSERT INTO public.services (
  id, category_id, platform, category, name, type, rate, min_qty, max_qty,
  refill, refill_days, cancel_allowed, start_time, speed, link_hint,
  markup_percent, cost_basis, audience, is_active, sort_order
) VALUES
  (
    4715, 17, 'Facebook', 'Views',
    'Facebook Mix Video & Reels Views (Lifetime Guaranteed)',
    'default', 0.1000, 100, 10000000,
    true, 365, false, 'Instant', '5K - 15K/Day', 'Facebook Video / Reel URL',
    42.86, 0.0700, 'Mix', true, 1
  ),
  (
    10187, 17, 'Facebook', 'Views',
    'Facebook Mix Video Views (Non-Drop, High Speed)',
    'default', 0.1143, 500, 100000000,
    false, NULL, false, 'Instant', '10K - 100K/Day', 'Facebook Video / Reel URL',
    42.86, 0.0800, 'Mix', true, 2
  ),
  (
    680, 17, 'Facebook', 'Views',
    'Facebook Organic Video & Reels Views (30-Day Refill)',
    'default', 0.1429, 100, 10000000,
    true, 30, false, 'Instant', '20K - 30K/Day', 'Facebook Video / Reel URL',
    42.86, 0.1000, 'Organic', true, 3
  )
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name, type = EXCLUDED.type, rate = EXCLUDED.rate, min_qty = EXCLUDED.min_qty, max_qty = EXCLUDED.max_qty,
  refill = EXCLUDED.refill, refill_days = EXCLUDED.refill_days, start_time = EXCLUDED.start_time,
  speed = EXCLUDED.speed, link_hint = EXCLUDED.link_hint, cost_basis = EXCLUDED.cost_basis,
  audience = EXCLUDED.audience, is_active = true, updated_at = now();

INSERT INTO public.service_suppliers (
  service_id, supplier_id, supplier_service_id, cost_rate, supplier_min, supplier_max, priority, is_enabled
) VALUES
  (4715,  1, '4715',  0.0700, 100, 10000000,  1, true),
  (10187, 1, '10187', 0.0800, 500, 100000000, 1, true),
  (680,   1, '680',   0.1000, 100, 10000000,  1, true)
ON CONFLICT (service_id) DO UPDATE SET
  supplier_id = EXCLUDED.supplier_id, supplier_service_id = EXCLUDED.supplier_service_id,
  cost_rate = EXCLUDED.cost_rate, supplier_min = EXCLUDED.supplier_min, supplier_max = EXCLUDED.supplier_max, is_enabled = true;
