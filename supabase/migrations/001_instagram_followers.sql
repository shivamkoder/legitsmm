-- Migration: Add curated Instagram Followers services from MoreThanPanel (supplier_id = 1)
-- Pricing rule: retail rate = ROUND(wholesale_rate * 1.4286, 4) for ~30% net margin

INSERT INTO public.services (
  id, category_id, platform, category, name, type, rate, min_qty, max_qty,
  refill, refill_days, cancel_allowed, start_time, speed, link_hint,
  markup_percent, cost_basis, audience, is_active, sort_order
) VALUES
  (
    5752, 3, 'Instagram', 'Followers',
    'Instagram Bot Followers (No Refill)',
    'default', 0.5572, 100, 100000,
    false, NULL, false, '0-1 Hour', '500 - 2K/Day', 'Instagram Profile URL',
    42.86, 0.3900, 'Bot', true, 1
  ),
  (
    5839, 3, 'Instagram', 'Followers',
    'Instagram Mix Followers (30-Day Refill)',
    'default', 5.1430, 10, 1000000,
    true, 30, false, '0-1 Hour', '1K - 10K/Day', 'Instagram Profile URL',
    42.86, 3.6000, 'Mix', true, 2
  ),
  (
    9107, 3, 'Instagram', 'Followers',
    'Instagram Organic Followers (30-Day Refill)',
    'default', 8.2145, 10, 100000,
    true, 30, false, '0-1 Hour', '10K - 20K/Day', 'Instagram Profile URL',
    42.86, 5.7500, 'Organic', true, 3
  ),
  (
    10268, 3, 'Instagram', 'Followers',
    'Instagram Organic Followers (Lifetime Guaranteed)',
    'default', 11.5002, 10, 500000,
    true, 365, false, '0-1 Hour', '5K - 20K/Day', 'Instagram Profile URL',
    42.86, 8.0500, 'Organic', true, 4
  )
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  rate = EXCLUDED.rate,
  min_qty = EXCLUDED.min_qty,
  max_qty = EXCLUDED.max_qty,
  refill = EXCLUDED.refill,
  refill_days = EXCLUDED.refill_days,
  start_time = EXCLUDED.start_time,
  speed = EXCLUDED.speed,
  link_hint = EXCLUDED.link_hint,
  cost_basis = EXCLUDED.cost_basis,
  audience = EXCLUDED.audience,
  is_active = true,
  updated_at = now();

INSERT INTO public.service_suppliers (
  service_id, supplier_id, supplier_service_id, cost_rate,
  supplier_min, supplier_max, priority, is_enabled
) VALUES
  (5752,  1, '5752',  0.3900, 100, 100000,  1, true),
  (5839,  1, '5839',  3.6000, 10,  1000000, 1, true),
  (9107,  1, '9107',  5.7500, 10,  100000,  1, true),
  (10268, 1, '10268', 8.0500, 10,  500000,  1, true)
ON CONFLICT (service_id) DO UPDATE SET
  supplier_id = EXCLUDED.supplier_id,
  supplier_service_id = EXCLUDED.supplier_service_id,
  cost_rate = EXCLUDED.cost_rate,
  supplier_min = EXCLUDED.supplier_min,
  supplier_max = EXCLUDED.supplier_max,
  is_enabled = true;
