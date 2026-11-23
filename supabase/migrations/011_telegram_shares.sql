-- Migration: Add curated Telegram Shares services from MoreThanPanel (supplier_id = 1)
-- Pricing rule: retail rate = ROUND(wholesale_rate * 1.4286, 4) for ~30% net margin

INSERT INTO public.services (
  id, category_id, platform, category, name, type, rate, min_qty, max_qty,
  refill, refill_days, cancel_allowed, start_time, speed, link_hint,
  markup_percent, cost_basis, audience, is_active, sort_order
) VALUES
  (
    8509, 11, 'Telegram', 'Shares',
    'Telegram Bot Fast Post Shares',
    'default', 0.0129, 10, 20000,
    false, NULL, false, 'Instant', '5K - 10K/Day', 'Telegram Post Link',
    42.86, 0.0090, 'Bot', true, 1
  ),
  (
    2936, 11, 'Telegram', 'Shares',
    'Telegram Global Mix Shares + Views + Ranking',
    'default', 0.0143, 10, 100000,
    false, NULL, false, 'Instant', '10K - 50K/Day', 'Telegram Post Link',
    42.86, 0.0100, 'Mix', true, 2
  ),
  (
    2935, 11, 'Telegram', 'Shares',
    'Telegram Bot Direct Post Repost Shares',
    'default', 0.0143, 10, 100000,
    false, NULL, false, 'Instant', '10K - 50K/Day', 'Telegram Post Link',
    42.86, 0.0100, 'Bot', true, 3
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
  (8509, 1, '8509', 0.0090, 10, 20000,  1, true),
  (2936, 1, '2936', 0.0100, 10, 100000, 1, true),
  (2935, 1, '2935', 0.0100, 10, 100000, 1, true)
ON CONFLICT (service_id) DO UPDATE SET
  supplier_id = EXCLUDED.supplier_id,
  supplier_service_id = EXCLUDED.supplier_service_id,
  cost_rate = EXCLUDED.cost_rate,
  supplier_min = EXCLUDED.supplier_min,
  supplier_max = EXCLUDED.supplier_max,
  is_enabled = true;
