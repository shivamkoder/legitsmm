-- Migration: Add TikTok categories to public.categories

INSERT INTO public.categories (id, platform, name, sort_order, is_active)
OVERRIDING SYSTEM VALUE VALUES
  (39, 'TikTok', 'Followers',   1, true),
  (40, 'TikTok', 'Likes',       2, true),
  (41, 'TikTok', 'Views',       3, true),
  (42, 'TikTok', 'Shares',      4, true),
  (43, 'TikTok', 'Comments',    5, true),
  (44, 'TikTok', 'Saves',       6, true),
  (45, 'TikTok', 'Live Stream', 7, true)
ON CONFLICT (id) DO UPDATE SET
  platform = EXCLUDED.platform,
  name = EXCLUDED.name,
  sort_order = EXCLUDED.sort_order,
  is_active = true;

SELECT setval(pg_get_serial_sequence('public.categories', 'id'), (SELECT COALESCE(MAX(id), 1) FROM public.categories));
