-- Service #9220: YouTube Mix Views (30-Day Refill) (MoreThanPanel supplier_id = 1)
-- Wholesale cost: $0.6900 | Retail rate (42.86% markup): $0.9857

INSERT INTO public.services (
  id, category_id, platform, category, name, type, rate, min_qty, max_qty,
  refill, refill_days, cancel_allowed, start_time, speed, link_hint,
  markup_percent, cost_basis, audience, is_active, sort_order
) VALUES (
  9220, 23, 'YouTube', 'Views',
  'YouTube Mix Views (30-Day Refill)',
  'default', 0.9857, 100, 1000000,
  true, 30, false, '0-1 Hour', '1K - 5K/Day', 'YouTube Video URL',
  42.86, 0.6900, 'Mix', true, 3
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
  9220, 1, '9220', 0.6900, 100, 1000000, 1, true
)
ON CONFLICT (service_id) DO UPDATE SET
  supplier_id = EXCLUDED.supplier_id,
  supplier_service_id = EXCLUDED.supplier_service_id,
  cost_rate = EXCLUDED.cost_rate,
  supplier_min = EXCLUDED.supplier_min,
  supplier_max = EXCLUDED.supplier_max,
  is_enabled = true;
