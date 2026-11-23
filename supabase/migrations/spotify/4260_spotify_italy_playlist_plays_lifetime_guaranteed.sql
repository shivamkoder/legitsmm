-- Service #4260: Spotify Italy Playlist Plays (Lifetime Guaranteed) (MoreThanPanel supplier_id = 1)
-- Wholesale cost: $0.7200 | Retail rate (42.86% markup): $1.0286

INSERT INTO public.services (
  id, category_id, platform, category, name, type, rate, min_qty, max_qty,
  refill, refill_days, cancel_allowed, start_time, speed, link_hint,
  markup_percent, cost_basis, audience, is_active, sort_order
) VALUES (
  4260, 50, 'Spotify', 'Playlist Plays',
  'Spotify Italy Playlist Plays (Lifetime Guaranteed)',
  'geo_targeted', 1.0286, 500, 20000000,
  true, 365, false, '0-1 Hour', '30K - 100K/Day', 'Spotify Playlist URL',
  42.86, 0.7200, 'Mix', true, 4
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name, type = EXCLUDED.type, rate = EXCLUDED.rate,
  min_qty = EXCLUDED.min_qty, max_qty = EXCLUDED.max_qty,
  refill = EXCLUDED.refill, refill_days = EXCLUDED.refill_days,
  start_time = EXCLUDED.start_time, speed = EXCLUDED.speed,
  link_hint = EXCLUDED.link_hint, cost_basis = EXCLUDED.cost_basis,
  audience = EXCLUDED.audience, is_active = true, updated_at = now();

INSERT INTO public.service_suppliers (
  service_id, supplier_id, supplier_service_id, cost_rate,
  supplier_min, supplier_max, priority, is_enabled
) VALUES (
  4260, 1, '4260', 0.7200, 500, 20000000, 1, true
)
ON CONFLICT (service_id) DO UPDATE SET
  supplier_id = EXCLUDED.supplier_id,
  supplier_service_id = EXCLUDED.supplier_service_id,
  cost_rate = EXCLUDED.cost_rate,
  supplier_min = EXCLUDED.supplier_min,
  supplier_max = EXCLUDED.supplier_max,
  is_enabled = true;
