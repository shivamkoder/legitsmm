-- Migration: Add curated Facebook Live Stream Views services from MoreThanPanel (supplier_id = 1)
-- Pricing rule: retail rate = ROUND(wholesale_rate * 1.4286, 4) for ~30% net margin

INSERT INTO public.services (
  id, category_id, platform, category, name, type, rate, min_qty, max_qty,
  refill, refill_days, cancel_allowed, start_time, speed, link_hint,
  markup_percent, cost_basis, audience, is_active, sort_order
) VALUES
  (
    618, 22, 'Facebook', 'Live Stream Views',
    'Facebook Live Stream Views (15 Minutes)',
    'default', 0.5143, 50, 20000,
    false, NULL, false, 'Instant', 'Live Concurrent', 'Facebook Live Stream URL',
    42.86, 0.3600, 'Mix', true, 1
  ),
  (
    619, 22, 'Facebook', 'Live Stream Views',
    'Facebook Live Stream Views (30 Minutes)',
    'default', 1.0286, 50, 20000,
    false, NULL, false, 'Instant', 'Live Concurrent', 'Facebook Live Stream URL',
    42.86, 0.7200, 'Mix', true, 2
  ),
  (
    620, 22, 'Facebook', 'Live Stream Views',
    'Facebook Live Stream Views (60 Minutes)',
    'default', 2.0429, 50, 20000,
    false, NULL, false, 'Instant', 'Live Concurrent', 'Facebook Live Stream URL',
    42.86, 1.4300, 'Mix', true, 3
  ),
  (
    621, 22, 'Facebook', 'Live Stream Views',
    'Facebook Live Stream Views (90 Minutes)',
    'default', 3.0572, 50, 20000,
    false, NULL, false, 'Instant', 'Live Concurrent', 'Facebook Live Stream URL',
    42.86, 2.1400, 'Organic', true, 4
  )
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name, type = EXCLUDED.type, rate = EXCLUDED.rate, min_qty = EXCLUDED.min_qty, max_qty = EXCLUDED.max_qty,
  refill = EXCLUDED.refill, refill_days = EXCLUDED.refill_days, start_time = EXCLUDED.start_time,
  speed = EXCLUDED.speed, link_hint = EXCLUDED.link_hint, cost_basis = EXCLUDED.cost_basis,
  audience = EXCLUDED.audience, is_active = true, updated_at = now();

INSERT INTO public.service_suppliers (
  service_id, supplier_id, supplier_service_id, cost_rate, supplier_min, supplier_max, priority, is_enabled
) VALUES
  (618, 1, '618', 0.3600, 50, 20000, 1, true),
  (619, 1, '619', 0.7200, 50, 20000, 1, true),
  (620, 1, '620', 1.4300, 50, 20000, 1, true),
  (621, 1, '621', 2.1400, 50, 20000, 1, true)
ON CONFLICT (service_id) DO UPDATE SET
  supplier_id = EXCLUDED.supplier_id, supplier_service_id = EXCLUDED.supplier_service_id,
  cost_rate = EXCLUDED.cost_rate, supplier_min = EXCLUDED.supplier_min, supplier_max = EXCLUDED.supplier_max, is_enabled = true;
