-- Service #4879: YouTube Watch Time Views (90-Day Refill, 3+ Min Video) (MoreThanPanel supplier_id = 1)
-- Wholesale cost: $11.5700 | Retail rate (42.86% markup): $16.5289

INSERT INTO public.services (
  id, category_id, platform, category, name, type, rate, min_qty, max_qty,
  refill, refill_days, cancel_allowed, start_time, speed, link_hint,
  markup_percent, cost_basis, audience, is_active, sort_order
) VALUES (
  4879, 27, 'YouTube', 'Watch Time',
  'YouTube Watch Time Views (90-Day Refill, 3+ Min Video)',
  'default', 16.5289, 50, 50000,
  true, 90, false, '0-1 Hour', '10 - 50H/Day', 'YouTube Video URL (3+ Min)',
  42.86, 11.5700, 'Mix', true, 1
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
  4879, 1, '4879', 11.5700, 50, 50000, 1, true
)
ON CONFLICT (service_id) DO UPDATE SET
  supplier_id = EXCLUDED.supplier_id,
  supplier_service_id = EXCLUDED.supplier_service_id,
  cost_rate = EXCLUDED.cost_rate,
  supplier_min = EXCLUDED.supplier_min,
  supplier_max = EXCLUDED.supplier_max,
  is_enabled = true;
