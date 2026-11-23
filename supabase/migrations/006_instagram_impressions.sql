-- Migration: Add curated Instagram Impressions & Reach services from MoreThanPanel (supplier_id = 1)
-- Pricing rule: retail rate = ROUND(wholesale_rate * 1.4286, 4) for ~30% net margin

INSERT INTO public.services (
  id, category_id, platform, category, name, type, rate, min_qty, max_qty,
  refill, refill_days, cancel_allowed, start_time, speed, link_hint,
  markup_percent, cost_basis, audience, is_active, sort_order
) VALUES
  (
    5030, 7, 'Instagram', 'Impressions',
    'Instagram Bot Reach + Impressions (Post Engagement)',
    'default', 0.0857, 10, 10000000,
    false, NULL, false, 'Instant', '10K - 50K/Day', 'Instagram Post / Reel URL',
    42.86, 0.0600, 'Bot', true, 1
  ),
  (
    2959, 7, 'Instagram', 'Impressions',
    'Instagram Mix Reach + Impressions (High Max)',
    'default', 0.2714, 10, 1000000,
    false, NULL, false, 'Instant', '10K - 50K/Day', 'Instagram Post / Reel URL',
    42.86, 0.1900, 'Mix', true, 2
  ),
  (
    8134, 7, 'Instagram', 'Impressions',
    'Instagram Organic Reach + Impressions (30-Day Refill)',
    'default', 0.7000, 100, 1000000,
    true, 30, false, 'Instant', '50K - 200K/Day', 'Instagram Post / Reel URL',
    42.86, 0.4900, 'Organic', true, 3
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
  (5030, 1, '5030', 0.0600, 10,  10000000, 1, true),
  (2959, 1, '2959', 0.1900, 10,  1000000,  1, true),
  (8134, 1, '8134', 0.4900, 100, 1000000,  1, true)
ON CONFLICT (service_id) DO UPDATE SET
  supplier_id = EXCLUDED.supplier_id,
  supplier_service_id = EXCLUDED.supplier_service_id,
  cost_rate = EXCLUDED.cost_rate,
  supplier_min = EXCLUDED.supplier_min,
  supplier_max = EXCLUDED.supplier_max,
  is_enabled = true;
