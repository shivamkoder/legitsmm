-- Migration: Add curated Instagram Comments services from MoreThanPanel (supplier_id = 1)
-- Pricing rule: retail rate = ROUND(wholesale_rate * 1.4286, 4) for ~30% net margin

INSERT INTO public.services (
  id, category_id, platform, category, name, type, rate, min_qty, max_qty,
  refill, refill_days, cancel_allowed, start_time, speed, link_hint,
  markup_percent, cost_basis, audience, is_active, sort_order
) VALUES
  (
    1850, 4, 'Instagram', 'Comments',
    'Instagram Random Comments (Non-Drop)',
    'default', 2.2000, 10, 10000,
    false, NULL, false, '0-1 Hour', '100 - 500/Day', 'Instagram Post / Reel URL',
    42.86, 1.5400, 'Mix', true, 1
  ),
  (
    4641, 4, 'Instagram', 'Comments',
    'Instagram Custom Comments (Budget)',
    'custom_comments', 1.3000, 50, 10000,
    false, NULL, false, '0-1 Hour', '100 - 200/Day', 'Instagram Post / Reel URL',
    42.86, 0.9100, 'Bot', true, 2
  ),
  (
    10234, 4, 'Instagram', 'Comments',
    'Instagram Organic Custom Comments (High Quality)',
    'custom_comments', 4.9858, 10, 2000,
    false, NULL, false, '0-1 Hour', '500 - 2K/Day', 'Instagram Post / Reel URL',
    42.86, 3.4900, 'Organic', true, 3
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
  (1850,  1, '1850',  1.5400, 10, 10000, 1, true),
  (4641,  1, '4641',  0.9100, 50, 10000, 1, true),
  (10234, 1, '10234', 3.4900, 10, 2000,  1, true)
ON CONFLICT (service_id) DO UPDATE SET
  supplier_id = EXCLUDED.supplier_id,
  supplier_service_id = EXCLUDED.supplier_service_id,
  cost_rate = EXCLUDED.cost_rate,
  supplier_min = EXCLUDED.supplier_min,
  supplier_max = EXCLUDED.supplier_max,
  is_enabled = true;
