-- Migration: Add curated Telegram Members services from MoreThanPanel (supplier_id = 1)
-- Pricing rule: retail rate = ROUND(wholesale_rate * 1.4286, 4) for ~30% net margin

INSERT INTO public.services (
  id, category_id, platform, category, name, type, rate, min_qty, max_qty,
  refill, refill_days, cancel_allowed, start_time, speed, link_hint,
  markup_percent, cost_basis, audience, is_active, sort_order
) VALUES
  (
    1640, 8, 'Telegram', 'Members',
    'Telegram Bot Members (Fast, No Refill)',
    'default', 0.0429, 10, 50000,
    false, NULL, false, 'Instant', '10K - 100K/Day', 'Telegram Channel / Group Link',
    42.86, 0.0300, 'Bot', true, 1
  ),
  (
    5753, 8, 'Telegram', 'Members',
    'Telegram Mix Members (90-Day Refill, Low Drop)',
    'default', 0.2714, 200, 100000,
    true, 90, false, '0-1 Hour', '5K - 10K/Day', 'Telegram Channel / Group Link',
    42.86, 0.1900, 'Mix', true, 2
  ),
  (
    9244, 8, 'Telegram', 'Members',
    'Telegram Mix Members (Lifetime Guaranteed)',
    'default', 0.3286, 100, 100000,
    true, 365, false, '0-1 Hour', '5K - 10K/Day', 'Telegram Channel / Group Link',
    42.86, 0.2300, 'Mix', true, 3
  ),
  (
    8942, 8, 'Telegram', 'Members',
    'Telegram Organic Online Members (30-Day Refill)',
    'default', 3.4286, 10, 100000,
    true, 30, false, '0-1 Hour', '10K - 50K/Day', 'Telegram Channel / Group Link',
    42.86, 2.4000, 'Organic', true, 4
  ),
  (
    7516, 8, 'Telegram', 'Members',
    'Telegram Premium Members (5-Day Refill)',
    'default', 3.4001, 100, 100000,
    true, 5, false, '0-1 Hour', '5K/Day', 'Telegram Channel / Group Link',
    42.86, 2.3800, 'Organic', true, 5
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
  (1640, 1, '1640', 0.0300, 10,  50000,  1, true),
  (5753, 1, '5753', 0.1900, 200, 100000, 1, true),
  (9244, 1, '9244', 0.2300, 100, 100000, 1, true),
  (8942, 1, '8942', 2.4000, 10,  100000, 1, true),
  (7516, 1, '7516', 2.3800, 100, 100000, 1, true)
ON CONFLICT (service_id) DO UPDATE SET
  supplier_id = EXCLUDED.supplier_id,
  supplier_service_id = EXCLUDED.supplier_service_id,
  cost_rate = EXCLUDED.cost_rate,
  supplier_min = EXCLUDED.supplier_min,
  supplier_max = EXCLUDED.supplier_max,
  is_enabled = true;
