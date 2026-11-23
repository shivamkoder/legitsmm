-- Migration: Add additional curated Instagram Likes services from MoreThanPanel (supplier_id = 1)
-- Pricing rule: retail rate = ROUND(wholesale_rate * 1.4286, 4) for ~30% net margin

INSERT INTO public.services (
  id, category_id, platform, category, name, type, rate, min_qty, max_qty,
  refill, refill_days, cancel_allowed, start_time, speed, link_hint,
  markup_percent, cost_basis, audience, is_active, sort_order
) VALUES
  (
    2847, 2, 'Instagram', 'Likes',
    'Instagram Bot Likes (No Refill)',
    'default', 0.1429, 10, 1000000,
    false, NULL, false, 'Instant', '5K - 50K/Day', 'Instagram Post / Reel URL',
    42.86, 0.1000, 'Bot', true, 1
  ),
  (
    2499, 2, 'Instagram', 'Likes',
    'Instagram Mix Likes (30-Day Refill)',
    'default', 0.1714, 10, 5000000,
    true, 30, false, 'Instant', '5K - 50K/Day', 'Instagram Post / Reel URL',
    42.86, 0.1200, 'Mix', true, 2
  ),
  (
    2498, 2, 'Instagram', 'Likes',
    'Instagram Mix Likes (Lifetime Guaranteed)',
    'default', 0.1857, 10, 5000000,
    true, 365, false, 'Instant', '5K - 50K/Day', 'Instagram Post / Reel URL',
    42.86, 0.1300, 'Mix', true, 3
  ),
  (
    8024, 2, 'Instagram', 'Likes',
    'Instagram USA Targeted Likes (30-Day Refill)',
    'geo_targeted', 0.4857, 10, 1000000,
    true, 30, false, '0-1 Hour', '5K - 10K/Day', 'Instagram Post / Reel URL',
    42.86, 0.3400, 'Organic', true, 4
  )
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  type = EXCLUDED.type,
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
  (2847, 1, '2847', 0.1000, 10, 1000000, 1, true),
  (2499, 1, '2499', 0.1200, 10, 5000000, 1, true),
  (2498, 1, '2498', 0.1300, 10, 5000000, 1, true),
  (8024, 1, '8024', 0.3400, 10, 1000000, 1, true)
ON CONFLICT (service_id) DO UPDATE SET
  supplier_id = EXCLUDED.supplier_id,
  supplier_service_id = EXCLUDED.supplier_service_id,
  cost_rate = EXCLUDED.cost_rate,
  supplier_min = EXCLUDED.supplier_min,
  supplier_max = EXCLUDED.supplier_max,
  is_enabled = true;
