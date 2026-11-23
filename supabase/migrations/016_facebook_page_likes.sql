-- Migration: Add curated Facebook Page Likes services from MoreThanPanel (supplier_id = 1)
-- Pricing rule: retail rate = ROUND(wholesale_rate * 1.4286, 4) for ~30% net margin

INSERT INTO public.services (
  id, category_id, platform, category, name, type, rate, min_qty, max_qty,
  refill, refill_days, cancel_allowed, start_time, speed, link_hint,
  markup_percent, cost_basis, audience, is_active, sort_order
) VALUES
  (
    985, 15, 'Facebook', 'Page Likes',
    'Facebook Bot Page Likes + Followers (No Refill)',
    'default', 0.4000, 10, 1000000,
    false, NULL, false, '0-1 Hour', '1K - 5K/Day', 'Facebook Page URL',
    42.86, 0.2800, 'Bot', true, 1
  ),
  (
    1986, 15, 'Facebook', 'Page Likes',
    'Facebook Mix Page Likes + Followers (30-Day Refill)',
    'default', 0.4572, 10, 1000000,
    true, 30, false, '0-1 Hour', '1K - 5K/Day', 'Facebook Page URL',
    42.86, 0.3200, 'Mix', true, 2
  ),
  (
    9885, 15, 'Facebook', 'Page Likes',
    'Facebook Mix Page Likes + Followers (Lifetime Refill)',
    'default', 0.5286, 10, 1000000,
    true, 365, false, '0-1 Hour', '1K - 5K/Day', 'Facebook Page URL',
    42.86, 0.3700, 'Mix', true, 3
  ),
  (
    8129, 15, 'Facebook', 'Page Likes',
    'Facebook Organic Page Likes + Followers (Real Looking)',
    'default', 4.1429, 100, 10000,
    false, NULL, false, '0-1 Hour', '500 - 1K/Day', 'Facebook Page URL',
    42.86, 2.9000, 'Organic', true, 4
  ),
  (
    8435, 15, 'Facebook', 'Page Likes',
    'Facebook USA Organic Page Likes (30-Day Refill)',
    'geo_targeted', 16.7146, 20, 10000,
    true, 30, false, '0-1 Hour', '100 - 300/Day', 'Facebook Page URL',
    42.86, 11.7000, 'Organic', true, 5
  )
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name, type = EXCLUDED.type, rate = EXCLUDED.rate, min_qty = EXCLUDED.min_qty, max_qty = EXCLUDED.max_qty,
  refill = EXCLUDED.refill, refill_days = EXCLUDED.refill_days, start_time = EXCLUDED.start_time,
  speed = EXCLUDED.speed, link_hint = EXCLUDED.link_hint, cost_basis = EXCLUDED.cost_basis,
  audience = EXCLUDED.audience, is_active = true, updated_at = now();

INSERT INTO public.service_suppliers (
  service_id, supplier_id, supplier_service_id, cost_rate, supplier_min, supplier_max, priority, is_enabled
) VALUES
  (985,  1, '985',  0.2800,  10,  1000000, 1, true),
  (1986, 1, '1986', 0.3200,  10,  1000000, 1, true),
  (9885, 1, '9885', 0.3700,  10,  1000000, 1, true),
  (8129, 1, '8129', 2.9000,  100, 10000,   1, true),
  (8435, 1, '8435', 11.7000, 20,  10000,   1, true)
ON CONFLICT (service_id) DO UPDATE SET
  supplier_id = EXCLUDED.supplier_id, supplier_service_id = EXCLUDED.supplier_service_id,
  cost_rate = EXCLUDED.cost_rate, supplier_min = EXCLUDED.supplier_min, supplier_max = EXCLUDED.supplier_max, is_enabled = true;
