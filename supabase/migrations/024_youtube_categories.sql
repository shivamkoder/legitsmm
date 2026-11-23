-- Migration: Add YouTube categories to public.categories

INSERT INTO public.categories (id, platform, name, sort_order, is_active)
OVERRIDING SYSTEM VALUE VALUES
  (23, 'YouTube', 'Views',             1, true),
  (24, 'YouTube', 'Subscribers',       2, true),
  (25, 'YouTube', 'Likes',             3, true),
  (26, 'YouTube', 'Comments',          4, true),
  (27, 'YouTube', 'Watch Time',        5, true),
  (28, 'YouTube', 'Shares',            6, true),
  (29, 'YouTube', 'Live Stream Views', 7, true),
  (30, 'YouTube', 'Shorts Views',      8, true)
ON CONFLICT (id) DO UPDATE SET
  platform = EXCLUDED.platform,
  name = EXCLUDED.name,
  sort_order = EXCLUDED.sort_order,
  is_active = true;

SELECT setval(pg_get_serial_sequence('public.categories', 'id'), (SELECT COALESCE(MAX(id), 1) FROM public.categories));
