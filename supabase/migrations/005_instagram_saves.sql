-- Migration: Add curated Instagram Saves services from MoreThanPanel (supplier_id = 1)
-- Pricing rule: retail rate = ROUND(wholesale_rate * 1.4286, 4) for ~30% net margin

INSERT INTO public.services (
  id, category_id, platform, category, name, type, rate, min_qty, max_qty,
  refill, refill_days, cancel_allowed, start_time, speed, link_hint,
  markup_percent, cost_basis, audience, is_active, sort_order
) VALUES
  (
    2947, 6, 'Instagram', 'Saves',
    'Instagram Bot Saves (No Refill)',
    'default', 0.1714, 10, 1000000,
    false, NULL, false, 'Instant', '50K - 100K/Day', 'Instagram Post / Reel URL',
    42.86, 0.1200, 'Bot', true, 1
  ),
  (
    9887, 6, 'Instagram', 'Saves',
    'Instagram Organic Power Saves (30-Day Refill)',
    'default', 0.1714, 10, 5000000,
    true, 30, false, 'Instant', '50K - 100K/Day', 'Instagram Post / Reel URL',
    42.86, 0.1200, 'Organic', true, 2
  ),
  (
    9884, 6, 'Instagram', 'Saves',
    'Instagram Mix Saves (High Speed)',
    'default', 0.2000, 10, 10000000,
    false, NULL, false, 'Instant', '50K - 100K/Day', 'Instagram Post / Reel URL',
    42.86, 0.1400, 'Mix', true, 3
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
  (2947, 1, '2947', 0.1200, 10, 1000000,  1, true),
  (9887, 1, '9887', 0.1200, 10, 5000000,  1, true),
  (9884, 1, '9884', 0.1400, 10, 10000000, 1, true)
ON CONFLICT (service_id) DO UPDATE SET
  supplier_id = EXCLUDED.supplier_id,
  supplier_service_id = EXCLUDED.supplier_service_id,
  cost_rate = EXCLUDED.cost_rate,
  supplier_min = EXCLUDED.supplier_min,
  supplier_max = EXCLUDED.supplier_max,
  is_enabled = true;
