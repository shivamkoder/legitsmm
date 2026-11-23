-- Service #10316: YouTube Mix Subscribers (30-Day Refill, High Speed) (MoreThanPanel supplier_id = 1)
-- Wholesale cost: $27.5500 | Retail rate (42.86% markup): $39.3579

INSERT INTO public.services (
  id, category_id, platform, category, name, type, rate, min_qty, max_qty,
  refill, refill_days, cancel_allowed, start_time, speed, link_hint,
  markup_percent, cost_basis, audience, is_active, sort_order
) VALUES (
  10316, 24, 'YouTube', 'Subscribers',
  'YouTube Mix Subscribers (30-Day Refill, High Speed)',
  'default', 39.3579, 100, 200000,
  true, 30, false, '0-1 Hour', '1K - 5K/Day', 'YouTube Channel URL',
  42.86, 27.5500, 'Mix', true, 4
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name, type = EXCLUDED.type, rate = EXCLUDED.rate,
  min_qty = EXCLUDED.min_qty, max_qty = EXCLUDED.max_qty,
  refill = EXCLUDED.refill, refill_days = EXCLUDED.refill_days,
  start_time = EXCLUDED.start_time, speed = EXCLUDED.speed,
  link_hint = EXCLUDED.link_hint, cost_basis = EXCLUDED.cost_basis,
  audience = EXCLUDED.audience, is_active = true, updated_at = now();

INSERT INTO public.service_suppliers (
  service_id, supplier_id, supplier_service_id, cost_rate,
  supplier_min, supplier_max, priority, is_enabled
) VALUES (
  10316, 1, '10316', 27.5500, 100, 200000, 1, true
)
ON CONFLICT (service_id) DO UPDATE SET
  supplier_id = EXCLUDED.supplier_id,
  supplier_service_id = EXCLUDED.supplier_service_id,
  cost_rate = EXCLUDED.cost_rate,
  supplier_min = EXCLUDED.supplier_min,
  supplier_max = EXCLUDED.supplier_max,
  is_enabled = true;
