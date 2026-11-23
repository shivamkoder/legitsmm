-- Migration: Add curated Facebook Followers services from MoreThanPanel (supplier_id = 1)
-- Pricing rule: retail rate = ROUND(wholesale_rate * 1.4286, 4) for ~30% net margin

INSERT INTO public.services (
  id, category_id, platform, category, name, type, rate, min_qty, max_qty,
  refill, refill_days, cancel_allowed, start_time, speed, link_hint,
  markup_percent, cost_basis, audience, is_active, sort_order
) VALUES
  (
    4138, 14, 'Facebook', 'Followers',
    'Facebook Bot Followers (No Refill)',
    'default', 0.2286, 10, 1000000,
    false, NULL, false, '0-1 Hour', '1K - 5K/Day', 'Facebook Profile / Page URL',
    42.86, 0.1600, 'Bot', true, 1
  ),
  (
    1402, 14, 'Facebook', 'Followers',
    'Facebook Mix Followers (30-Day Refill)',
    'default', 0.2571, 10, 1000000,
    true, 30, false, '0-1 Hour', '1K - 5K/Day', 'Facebook Profile / Page URL',
    42.86, 0.1800, 'Mix', true, 2
  ),
  (
    8927, 14, 'Facebook', 'Followers',
    'Facebook Mix Followers (Lifetime Guaranteed)',
    'default', 0.3000, 10, 1000000,
    true, 365, false, '0-1 Hour', '1K - 5K/Day', 'Facebook Profile / Page URL',
    42.86, 0.2100, 'Mix', true, 3
  )
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name, type = EXCLUDED.type, rate = EXCLUDED.rate, min_qty = EXCLUDED.min_qty, max_qty = EXCLUDED.max_qty,
  refill = EXCLUDED.refill, refill_days = EXCLUDED.refill_days, start_time = EXCLUDED.start_time,
  speed = EXCLUDED.speed, link_hint = EXCLUDED.link_hint, cost_basis = EXCLUDED.cost_basis,
  audience = EXCLUDED.audience, is_active = true, updated_at = now();

INSERT INTO public.service_suppliers (
  service_id, supplier_id, supplier_service_id, cost_rate, supplier_min, supplier_max, priority, is_enabled
) VALUES
  (4138, 1, '4138', 0.1600, 10, 1000000, 1, true),
  (1402, 1, '1402', 0.1800, 10, 1000000, 1, true),
  (8927, 1, '8927', 0.2100, 10, 1000000, 1, true)
ON CONFLICT (service_id) DO UPDATE SET
  supplier_id = EXCLUDED.supplier_id, supplier_service_id = EXCLUDED.supplier_service_id,
  cost_rate = EXCLUDED.cost_rate, supplier_min = EXCLUDED.supplier_min, supplier_max = EXCLUDED.supplier_max, is_enabled = true;
