-- Migration: Add curated Facebook Post Likes services from MoreThanPanel (supplier_id = 1)
-- Pricing rule: retail rate = ROUND(wholesale_rate * 1.4286, 4) for ~30% net margin

INSERT INTO public.services (
  id, category_id, platform, category, name, type, rate, min_qty, max_qty,
  refill, refill_days, cancel_allowed, start_time, speed, link_hint,
  markup_percent, cost_basis, audience, is_active, sort_order
) VALUES
  (
    578, 16, 'Facebook', 'Post Likes',
    'Facebook Bot Post Likes (No Refill)',
    'default', 0.2000, 10, 1000000,
    false, NULL, false, 'Instant', '1K - 10K/Day', 'Facebook Post URL',
    42.86, 0.1400, 'Bot', true, 1
  ),
  (
    5133, 16, 'Facebook', 'Post Likes',
    'Facebook Mix Post Likes (30-Day Refill)',
    'default', 0.2286, 10, 1000000,
    true, 30, false, 'Instant', '1K - 10K/Day', 'Facebook Post URL',
    42.86, 0.1600, 'Mix', true, 2
  ),
  (
    5207, 16, 'Facebook', 'Post Likes',
    'Facebook Mix Post Likes (Lifetime Guaranteed)',
    'default', 0.2857, 10, 1000000,
    true, 365, false, 'Instant', '1K - 10K/Day', 'Facebook Post URL',
    42.86, 0.2000, 'Mix', true, 3
  ),
  (
    9062, 16, 'Facebook', 'Post Likes',
    'Facebook Mix Post Likes (Low Drop, Drip-Feed)',
    'default', 0.6286, 20, 500000,
    false, NULL, false, 'Instant', '5K - 10K/Day', 'Facebook Post URL',
    42.86, 0.4400, 'Mix', true, 4
  ),
  (
    8130, 16, 'Facebook', 'Post Likes',
    'Facebook Organic Post Likes (Low Drop)',
    'default', 1.2429, 50, 20000,
    false, NULL, false, '0-1 Hour', '250 - 500/Day', 'Facebook Post URL',
    42.86, 0.8700, 'Organic', true, 5
  )
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name, type = EXCLUDED.type, rate = EXCLUDED.rate, min_qty = EXCLUDED.min_qty, max_qty = EXCLUDED.max_qty,
  refill = EXCLUDED.refill, refill_days = EXCLUDED.refill_days, start_time = EXCLUDED.start_time,
  speed = EXCLUDED.speed, link_hint = EXCLUDED.link_hint, cost_basis = EXCLUDED.cost_basis,
  audience = EXCLUDED.audience, is_active = true, updated_at = now();

INSERT INTO public.service_suppliers (
  service_id, supplier_id, supplier_service_id, cost_rate, supplier_min, supplier_max, priority, is_enabled
) VALUES
  (578,  1, '578',  0.1400, 10, 1000000, 1, true),
  (5133, 1, '5133', 0.1600, 10, 1000000, 1, true),
  (5207, 1, '5207', 0.2000, 10, 1000000, 1, true),
  (9062, 1, '9062', 0.4400, 20, 500000,  1, true),
  (8130, 1, '8130', 0.8700, 50, 20000,   1, true)
ON CONFLICT (service_id) DO UPDATE SET
  supplier_id = EXCLUDED.supplier_id, supplier_service_id = EXCLUDED.supplier_service_id,
  cost_rate = EXCLUDED.cost_rate, supplier_min = EXCLUDED.supplier_min, supplier_max = EXCLUDED.supplier_max, is_enabled = true;
