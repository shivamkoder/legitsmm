-- Service #10236: YouTube Watch Time Views (30-Day Refill, 60+ Min Video) (MoreThanPanel supplier_id = 1)
-- Wholesale cost: $18.2000 | Retail rate (42.86% markup): $26.0005

INSERT INTO public.services (
  id, category_id, platform, category, name, type, rate, min_qty, max_qty,
  refill, refill_days, cancel_allowed, start_time, speed, link_hint,
  markup_percent, cost_basis, audience, is_active, sort_order
) VALUES (
  10236, 27, 'YouTube', 'Watch Time',
  'YouTube Watch Time Views (30-Day Refill, 60+ Min Video)',
  'default', 26.0005, 100, 4000,
  true, 30, false, '0-1 Hour', '100 - 200H/Day', 'YouTube Video URL (60+ Min)',
  42.86, 18.2000, 'Organic', true, 2
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
  10236, 1, '10236', 18.2000, 100, 4000, 1, true
)
ON CONFLICT (service_id) DO UPDATE SET
  supplier_id = EXCLUDED.supplier_id,
  supplier_service_id = EXCLUDED.supplier_service_id,
  cost_rate = EXCLUDED.cost_rate,
  supplier_min = EXCLUDED.supplier_min,
  supplier_max = EXCLUDED.supplier_max,
  is_enabled = true;
