-- Migration: Update all services to a uniform 21% retail markup over wholesale supplier cost
-- Formula: retail rate = GREATEST(ROUND(cost_rate * 1.21, 4), 0.0001)

UPDATE public.services s
SET
  cost_basis = ss.cost_rate,
  markup_percent = 21.00,
  rate = GREATEST(ROUND(ss.cost_rate * 1.21, 4), 0.0001),
  updated_at = now()
FROM public.service_suppliers ss
WHERE ss.service_id = s.id
  AND ss.is_enabled = true;
