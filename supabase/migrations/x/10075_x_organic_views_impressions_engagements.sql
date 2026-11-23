-- Service #10075: X Organic Views + Impressions + Engagements (MoreThanPanel supplier_id = 1)
-- Wholesale cost: $0.4400 | Retail rate (42.86% markup): $0.6286

INSERT INTO public.services (
  id, category_id, platform, category, name, type, rate, min_qty, max_qty,
  refill, refill_days, cancel_allowed, start_time, speed, link_hint,
  markup_percent, cost_basis, audience, is_active, sort_order
) VALUES (
  10075, 36, 'X', 'Impressions',
  'X Organic Views + Impressions + Engagements',
  'default', 0.6286, 1000, 100000,
  false, NULL, false, 'Instant', '10K - 100K/Day', 'X Post / Tweet URL',
  42.86, 0.4400, 'Organic', true, 2
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
  10075, 1, '10075', 0.4400, 1000, 100000, 1, true
)
ON CONFLICT (service_id) DO UPDATE SET
  supplier_id = EXCLUDED.supplier_id,
  supplier_service_id = EXCLUDED.supplier_service_id,
  cost_rate = EXCLUDED.cost_rate,
  supplier_min = EXCLUDED.supplier_min,
  supplier_max = EXCLUDED.supplier_max,
  is_enabled = true;
