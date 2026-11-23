-- Migration: Add curated Telegram Post Reactions services from MoreThanPanel (supplier_id = 1)
-- Pricing rule: retail rate = ROUND(wholesale_rate * 1.4286, 4) for ~30% net margin

INSERT INTO public.services (
  id, category_id, platform, category, name, type, rate, min_qty, max_qty,
  refill, refill_days, cancel_allowed, start_time, speed, link_hint,
  markup_percent, cost_basis, audience, is_active, sort_order
) VALUES
  (
    8510, 10, 'Telegram', 'Post Reactions',
    'Telegram Mix Positive Reactions + Views',
    'default', 0.0429, 10, 300000,
    false, NULL, false, 'Instant', '10K - 100K/Day', 'Telegram Post Link',
    42.86, 0.0300, 'Mix', true, 1
  ),
  (
    2737, 10, 'Telegram', 'Post Reactions',
    'Telegram Organic Positive Reactions + Views (Low Drop)',
    'default', 0.1143, 10, 1000000,
    false, NULL, false, 'Instant', '10K - 100K/Day', 'Telegram Post Link',
    42.86, 0.0800, 'Organic', true, 2
  ),
  (
    7681, 10, 'Telegram', 'Post Reactions',
    'Telegram Mix Fire Reactions + Views',
    'default', 0.1286, 10, 1000000,
    false, NULL, false, 'Instant', '10K - 100K/Day', 'Telegram Post Link',
    42.86, 0.0900, 'Mix', true, 3
  ),
  (
    2738, 10, 'Telegram', 'Post Reactions',
    'Telegram Bot Negative Reactions + Views (Low Drop)',
    'default', 0.0143, 10, 500000,
    false, NULL, false, 'Instant', '10K - 100K/Day', 'Telegram Post Link',
    42.86, 0.0100, 'Bot', true, 4
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
  (8510, 1, '8510', 0.0300, 10, 300000,  1, true),
  (2737, 1, '2737', 0.0800, 10, 1000000, 1, true),
  (7681, 1, '7681', 0.0900, 10, 1000000, 1, true),
  (2738, 1, '2738', 0.0100, 10, 500000,  1, true)
ON CONFLICT (service_id) DO UPDATE SET
  supplier_id = EXCLUDED.supplier_id,
  supplier_service_id = EXCLUDED.supplier_service_id,
  cost_rate = EXCLUDED.cost_rate,
  supplier_min = EXCLUDED.supplier_min,
  supplier_max = EXCLUDED.supplier_max,
  is_enabled = true;
