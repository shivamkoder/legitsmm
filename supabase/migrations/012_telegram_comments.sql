-- Migration: Add curated Telegram Comments services from MoreThanPanel (supplier_id = 1)
-- Pricing rule: retail rate = ROUND(wholesale_rate * 1.4286, 4) for ~30% net margin

INSERT INTO public.services (
  id, category_id, platform, category, name, type, rate, min_qty, max_qty,
  refill, refill_days, cancel_allowed, start_time, speed, link_hint,
  markup_percent, cost_basis, audience, is_active, sort_order
) VALUES
  (
    3526, 12, 'Telegram', 'Comments',
    'Telegram USA Random Comments + Static Views',
    'geo_targeted', 5.5287, 20, 5000,
    false, NULL, false, '0-1 Hour', '1K - 5K/Day', 'Telegram Channel Post Link',
    42.86, 3.8700, 'Organic', true, 1
  ),
  (
    3529, 12, 'Telegram', 'Comments',
    'Telegram Indian Random Comments + Static Views',
    'geo_targeted', 5.5287, 20, 5000,
    false, NULL, false, '0-1 Hour', '1K - 5K/Day', 'Telegram Channel Post Link',
    42.86, 3.8700, 'Mix', true, 2
  ),
  (
    3528, 12, 'Telegram', 'Comments',
    'Telegram Arabic Random Comments + Static Views',
    'geo_targeted', 5.5287, 20, 5000,
    false, NULL, false, '0-1 Hour', '1K - 5K/Day', 'Telegram Channel Post Link',
    42.86, 3.8700, 'Mix', true, 3
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
  (3526, 1, '3526', 3.8700, 20, 5000, 1, true),
  (3529, 1, '3529', 3.8700, 20, 5000, 1, true),
  (3528, 1, '3528', 3.8700, 20, 5000, 1, true)
ON CONFLICT (service_id) DO UPDATE SET
  supplier_id = EXCLUDED.supplier_id,
  supplier_service_id = EXCLUDED.supplier_service_id,
  cost_rate = EXCLUDED.cost_rate,
  supplier_min = EXCLUDED.supplier_min,
  supplier_max = EXCLUDED.supplier_max,
  is_enabled = true;
