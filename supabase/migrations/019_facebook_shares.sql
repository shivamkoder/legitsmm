-- Migration: Add curated Facebook Shares services from MoreThanPanel (supplier_id = 1)
-- Pricing rule: retail rate = ROUND(wholesale_rate * 1.4286, 4) for ~30% net margin

INSERT INTO public.services (
  id, category_id, platform, category, name, type, rate, min_qty, max_qty,
  refill, refill_days, cancel_allowed, start_time, speed, link_hint,
  markup_percent, cost_basis, audience, is_active, sort_order
) VALUES
  (
    10195, 18, 'Facebook', 'Shares',
    'Facebook Mix Post Shares (Non-Drop, High Speed)',
    'default', 0.4857, 100, 1000000,
    false, NULL, false, 'Instant', '10K - 100K/Day', 'Facebook Post URL',
    42.86, 0.3400, 'Mix', true, 1
  ),
  (
    10196, 18, 'Facebook', 'Shares',
    'Facebook Organic Photo & Post Shares (Non-Drop)',
    'default', 29.0434, 30, 300000,
    false, NULL, false, '0-1 Hour', '10K - 100K/Day', 'Facebook Post / Photo URL',
    42.86, 20.3300, 'Organic', true, 2
  )
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name, type = EXCLUDED.type, rate = EXCLUDED.rate, min_qty = EXCLUDED.min_qty, max_qty = EXCLUDED.max_qty,
  refill = EXCLUDED.refill, refill_days = EXCLUDED.refill_days, start_time = EXCLUDED.start_time,
  speed = EXCLUDED.speed, link_hint = EXCLUDED.link_hint, cost_basis = EXCLUDED.cost_basis,
  audience = EXCLUDED.audience, is_active = true, updated_at = now();

INSERT INTO public.service_suppliers (
  service_id, supplier_id, supplier_service_id, cost_rate, supplier_min, supplier_max, priority, is_enabled
) VALUES
  (10195, 1, '10195', 0.3400,  100, 1000000, 1, true),
  (10196, 1, '10196', 20.3300, 30,  300000,  1, true)
ON CONFLICT (service_id) DO UPDATE SET
  supplier_id = EXCLUDED.supplier_id, supplier_service_id = EXCLUDED.supplier_service_id,
  cost_rate = EXCLUDED.cost_rate, supplier_min = EXCLUDED.supplier_min, supplier_max = EXCLUDED.supplier_max, is_enabled = true;
