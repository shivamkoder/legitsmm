-- Migration: Add curated Telegram Channel Views services from MoreThanPanel (supplier_id = 1)
-- Pricing rule: retail rate = ROUND(wholesale_rate * 1.4286, 4) for ~30% net margin

INSERT INTO public.services (
  id, category_id, platform, category, name, type, rate, min_qty, max_qty,
  refill, refill_days, cancel_allowed, start_time, speed, link_hint,
  markup_percent, cost_basis, audience, is_active, sort_order
) VALUES
  (
    9863, 9, 'Telegram', 'Channel Views',
    'Telegram Bot Post & Channel Views (Fast)',
    'default', 0.0043, 10, 50000,
    false, NULL, false, 'Instant', '5K - 10K/Day', 'Telegram Post / Channel Link',
    42.86, 0.0030, 'Bot', true, 1
  ),
  (
    4880, 9, 'Telegram', 'Channel Views',
    'Telegram Mix Views (Last 5 Posts)',
    'default', 0.0286, 10, 300000,
    false, NULL, false, 'Instant', '100K - 200K/Day', 'Telegram Channel Link',
    42.86, 0.0200, 'Mix', true, 2
  ),
  (
    2949, 9, 'Telegram', 'Channel Views',
    'Telegram Mix Views (Last 10 Posts)',
    'default', 0.0429, 10, 300000,
    false, NULL, false, 'Instant', '100K - 200K/Day', 'Telegram Channel Link',
    42.86, 0.0300, 'Mix', true, 3
  ),
  (
    8500, 9, 'Telegram', 'Channel Views',
    'Telegram Organic Future Post Views (Next 5 Posts)',
    'default', 0.0286, 10, 320000,
    false, NULL, false, 'Instant', '100K - 200K/Day', 'Telegram Channel Link',
    42.86, 0.0200, 'Organic', true, 4
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
  (9863, 1, '9863', 0.0030, 10, 50000,  1, true),
  (4880, 1, '4880', 0.0200, 10, 300000, 1, true),
  (2949, 1, '2949', 0.0300, 10, 300000, 1, true),
  (8500, 1, '8500', 0.0200, 10, 320000, 1, true)
ON CONFLICT (service_id) DO UPDATE SET
  supplier_id = EXCLUDED.supplier_id,
  supplier_service_id = EXCLUDED.supplier_service_id,
  cost_rate = EXCLUDED.cost_rate,
  supplier_min = EXCLUDED.supplier_min,
  supplier_max = EXCLUDED.supplier_max,
  is_enabled = true;
