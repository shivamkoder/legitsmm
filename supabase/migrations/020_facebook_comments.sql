-- Migration: Add curated Facebook Comments services from MoreThanPanel (supplier_id = 1)
-- Pricing rule: retail rate = ROUND(wholesale_rate * 1.4286, 4) for ~30% net margin

INSERT INTO public.services (
  id, category_id, platform, category, name, type, rate, min_qty, max_qty,
  refill, refill_days, cancel_allowed, start_time, speed, link_hint,
  markup_percent, cost_basis, audience, is_active, sort_order
) VALUES
  (
    701, 19, 'Facebook', 'Comments',
    'Facebook Mix Custom Comments (30-Day Refill)',
    'custom_comments', 3.1572, 10, 20000,
    true, 30, false, '0-1 Hour', '100 - 200/Day', 'Facebook Post URL',
    42.86, 2.2100, 'Mix', true, 1
  ),
  (
    10188, 19, 'Facebook', 'Comments',
    'Facebook Organic Custom Comments (Non-Drop)',
    'custom_comments', 6.0858, 10, 1000000,
    false, NULL, false, '0-1 Hour', '200 - 1K/Day', 'Facebook Post URL',
    42.86, 4.2600, 'Organic', true, 2
  ),
  (
    10192, 19, 'Facebook', 'Comments',
    'Facebook Mix Random English Comments (Non-Drop)',
    'default', 6.0858, 10, 1000000,
    false, NULL, false, '0-1 Hour', '200 - 1K/Day', 'Facebook Post URL',
    42.86, 4.2600, 'Mix', true, 3
  ),
  (
    9795, 19, 'Facebook', 'Comments',
    'Facebook Organic Random Comments (Low Drop)',
    'default', 10.3574, 10, 5000,
    false, NULL, false, '0-1 Hour', '100 - 200/Day', 'Facebook Post URL',
    42.86, 7.2500, 'Organic', true, 4
  )
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name, type = EXCLUDED.type, rate = EXCLUDED.rate, min_qty = EXCLUDED.min_qty, max_qty = EXCLUDED.max_qty,
  refill = EXCLUDED.refill, refill_days = EXCLUDED.refill_days, start_time = EXCLUDED.start_time,
  speed = EXCLUDED.speed, link_hint = EXCLUDED.link_hint, cost_basis = EXCLUDED.cost_basis,
  audience = EXCLUDED.audience, is_active = true, updated_at = now();

INSERT INTO public.service_suppliers (
  service_id, supplier_id, supplier_service_id, cost_rate, supplier_min, supplier_max, priority, is_enabled
) VALUES
  (701,   1, '701',   2.2100, 10, 20000,   1, true),
  (10188, 1, '10188', 4.2600, 10, 1000000, 1, true),
  (10192, 1, '10192', 4.2600, 10, 1000000, 1, true),
  (9795,  1, '9795',  7.2500, 10, 5000,    1, true)
ON CONFLICT (service_id) DO UPDATE SET
  supplier_id = EXCLUDED.supplier_id, supplier_service_id = EXCLUDED.supplier_service_id,
  cost_rate = EXCLUDED.cost_rate, supplier_min = EXCLUDED.supplier_min, supplier_max = EXCLUDED.supplier_max, is_enabled = true;
