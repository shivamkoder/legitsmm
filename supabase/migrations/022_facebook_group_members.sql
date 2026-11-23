-- Migration: Add curated Facebook Group Members services from MoreThanPanel (supplier_id = 1)
-- Pricing rule: retail rate = ROUND(wholesale_rate * 1.4286, 4) for ~30% net margin

INSERT INTO public.services (
  id, category_id, platform, category, name, type, rate, min_qty, max_qty,
  refill, refill_days, cancel_allowed, start_time, speed, link_hint,
  markup_percent, cost_basis, audience, is_active, sort_order
) VALUES
  (
    1724, 21, 'Facebook', 'Group Members',
    'Facebook Bot Group Members (No Refill)',
    'default', 0.3429, 10, 100000,
    false, NULL, false, '0-1 Hour', '1K - 5K/Day', 'Facebook Group URL',
    42.86, 0.2400, 'Bot', true, 1
  ),
  (
    720, 21, 'Facebook', 'Group Members',
    'Facebook Mix Group Members (30-Day Refill)',
    'default', 0.3714, 10, 100000,
    true, 30, false, '0-1 Hour', '1K - 5K/Day', 'Facebook Group URL',
    42.86, 0.2600, 'Mix', true, 2
  ),
  (
    10227, 21, 'Facebook', 'Group Members',
    'Facebook Mix Group Members (Lifetime Guaranteed)',
    'default', 0.4286, 10, 100000,
    true, 365, false, '0-1 Hour', '1K - 5K/Day', 'Facebook Group URL',
    42.86, 0.3000, 'Mix', true, 3
  ),
  (
    9344, 21, 'Facebook', 'Group Members',
    'Facebook Organic Group Members (Old Accounts, 30-Day Refill)',
    'default', 0.7286, 10, 1000000,
    true, 30, false, '0-1 Hour', '1K - 10K/Day', 'Facebook Group URL',
    42.86, 0.5100, 'Organic', true, 4
  )
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name, type = EXCLUDED.type, rate = EXCLUDED.rate, min_qty = EXCLUDED.min_qty, max_qty = EXCLUDED.max_qty,
  refill = EXCLUDED.refill, refill_days = EXCLUDED.refill_days, start_time = EXCLUDED.start_time,
  speed = EXCLUDED.speed, link_hint = EXCLUDED.link_hint, cost_basis = EXCLUDED.cost_basis,
  audience = EXCLUDED.audience, is_active = true, updated_at = now();

INSERT INTO public.service_suppliers (
  service_id, supplier_id, supplier_service_id, cost_rate, supplier_min, supplier_max, priority, is_enabled
) VALUES
  (1724,  1, '1724',  0.2400, 10, 100000,  1, true),
  (720,   1, '720',   0.2600, 10, 100000,  1, true),
  (10227, 1, '10227', 0.3000, 10, 100000,  1, true),
  (9344,  1, '9344',  0.5100, 10, 1000000, 1, true)
ON CONFLICT (service_id) DO UPDATE SET
  supplier_id = EXCLUDED.supplier_id, supplier_service_id = EXCLUDED.supplier_service_id,
  cost_rate = EXCLUDED.cost_rate, supplier_min = EXCLUDED.supplier_min, supplier_max = EXCLUDED.supplier_max, is_enabled = true;
