-- Migration: Add curated Instagram Shares services from MoreThanPanel (supplier_id = 1)
-- Pricing rule: retail rate = ROUND(wholesale_rate * 1.4286, 4) for ~30% net margin

INSERT INTO public.services (
  id, category_id, platform, category, name, type, rate, min_qty, max_qty,
  refill, refill_days, cancel_allowed, start_time, speed, link_hint,
  markup_percent, cost_basis, audience, is_active, sort_order
) VALUES
  (
    5707, 5, 'Instagram', 'Shares',
    'Instagram Bot Shares (Fast, No Refill)',
    'default', 0.0286, 100, 100000,
    false, NULL, false, 'Instant', '50K - 100K/Day', 'Instagram Post / Reel URL',
    42.86, 0.0200, 'Bot', true, 1
  ),
  (
    2960, 5, 'Instagram', 'Shares',
    'Instagram Mix Direct Post Shares',
    'default', 0.0571, 100, 100000,
    false, NULL, false, 'Instant', '10K - 50K/Day', 'Instagram Post / Reel URL',
    42.86, 0.0400, 'Mix', true, 2
  ),
  (
    5208, 5, 'Instagram', 'Shares',
    'Instagram Organic Shares + Engagement + Reach',
    'default', 0.1571, 10, 1000000,
    false, NULL, false, 'Instant', '10K - 50K/Day', 'Instagram Post / Reel URL',
    42.86, 0.1100, 'Organic', true, 3
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
  (5707, 1, '5707', 0.0200, 100, 100000,  1, true),
  (2960, 1, '2960', 0.0400, 100, 100000,  1, true),
  (5208, 1, '5208', 0.1100, 10,  1000000, 1, true)
ON CONFLICT (service_id) DO UPDATE SET
  supplier_id = EXCLUDED.supplier_id,
  supplier_service_id = EXCLUDED.supplier_service_id,
  cost_rate = EXCLUDED.cost_rate,
  supplier_min = EXCLUDED.supplier_min,
  supplier_max = EXCLUDED.supplier_max,
  is_enabled = true;
