-- Migration: Add X (Twitter) categories to public.categories

INSERT INTO public.categories (id, platform, name, sort_order, is_active)
OVERRIDING SYSTEM VALUE VALUES
  (31, 'X', 'Followers',       1, true),
  (32, 'X', 'Likes',           2, true),
  (33, 'X', 'Retweets',        3, true),
  (34, 'X', 'Views',           4, true),
  (35, 'X', 'Comments',        5, true),
  (36, 'X', 'Impressions',     6, true),
  (37, 'X', 'Space Listeners', 7, true),
  (38, 'X', 'Poll Votes',      8, true)
ON CONFLICT (id) DO UPDATE SET
  platform = EXCLUDED.platform,
  name = EXCLUDED.name,
  sort_order = EXCLUDED.sort_order,
  is_active = true;

SELECT setval(pg_get_serial_sequence('public.categories', 'id'), (SELECT COALESCE(MAX(id), 1) FROM public.categories));
