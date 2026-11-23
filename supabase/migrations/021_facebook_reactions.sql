-- Migration: Add curated Facebook Post Reactions services from MoreThanPanel (supplier_id = 1)
-- Pricing rule: retail rate = ROUND(wholesale_rate * 1.4286, 4) for ~30% net margin

INSERT INTO public.services (
  id, category_id, platform, category, name, type, rate, min_qty, max_qty,
  refill, refill_days, cancel_allowed, start_time, speed, link_hint,
  markup_percent, cost_basis, audience, is_active, sort_order
) VALUES
  (
    5986, 20, 'Facebook', 'Post Reactions',
    'Facebook Post Reactions - Love',
    'default', 0.3857, 10, 1000000,
    false, NULL, false, '0-1 Hour', '50 - 200/Day', 'Facebook Post URL',
    42.86, 0.2700, 'Mix', true, 1
  ),
  (
    5988, 20, 'Facebook', 'Post Reactions',
    'Facebook Post Reactions - Wow',
    'default', 0.3857, 10, 1000000,
    false, NULL, false, '0-1 Hour', '50 - 200/Day', 'Facebook Post URL',
    42.86, 0.2700, 'Mix', true, 2
  ),
  (
    5989, 20, 'Facebook', 'Post Reactions',
    'Facebook Post Reactions - Haha',
    'default', 0.3857, 10, 1000000,
    false, NULL, false, '0-1 Hour', '50 - 200/Day', 'Facebook Post URL',
    42.86, 0.2700, 'Mix', true, 3
  ),
  (
    5990, 20, 'Facebook', 'Post Reactions',
    'Facebook Post Reactions - Sad',
    'default', 0.3857, 10, 1000000,
    false, NULL, false, '0-1 Hour', '50 - 200/Day', 'Facebook Post URL',
    42.86, 0.2700, 'Mix', true, 4
  ),
  (
    5991, 20, 'Facebook', 'Post Reactions',
    'Facebook Post Reactions - Angry',
    'default', 0.3857, 10, 1000000,
    false, NULL, false, '0-1 Hour', '50 - 200/Day', 'Facebook Post URL',
    42.86, 0.2700, 'Bot', true, 5
  )
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name, type = EXCLUDED.type, rate = EXCLUDED.rate, min_qty = EXCLUDED.min_qty, max_qty = EXCLUDED.max_qty,
  refill = EXCLUDED.refill, refill_days = EXCLUDED.refill_days, start_time = EXCLUDED.start_time,
  speed = EXCLUDED.speed, link_hint = EXCLUDED.link_hint, cost_basis = EXCLUDED.cost_basis,
  audience = EXCLUDED.audience, is_active = true, updated_at = now();

INSERT INTO public.service_suppliers (
  service_id, supplier_id, supplier_service_id, cost_rate, supplier_min, supplier_max, priority, is_enabled
) VALUES
  (5986, 1, '5986', 0.2700, 10, 1000000, 1, true),
  (5988, 1, '5988', 0.2700, 10, 1000000, 1, true),
  (5989, 1, '5989', 0.2700, 10, 1000000, 1, true),
  (5990, 1, '5990', 0.2700, 10, 1000000, 1, true),
  (5991, 1, '5991', 0.2700, 10, 1000000, 1, true)
ON CONFLICT (service_id) DO UPDATE SET
  supplier_id = EXCLUDED.supplier_id, supplier_service_id = EXCLUDED.supplier_service_id,
  cost_rate = EXCLUDED.cost_rate, supplier_min = EXCLUDED.supplier_min, supplier_max = EXCLUDED.supplier_max, is_enabled = true;
