-- Migration: Add Facebook categories to public.categories

INSERT INTO public.categories (id, platform, name, sort_order, is_active)
OVERRIDING SYSTEM VALUE VALUES
  (14, 'Facebook', 'Followers',         1, true),
  (15, 'Facebook', 'Page Likes',        2, true),
  (16, 'Facebook', 'Post Likes',        3, true),
  (17, 'Facebook', 'Views',             4, true),
  (18, 'Facebook', 'Shares',            5, true),
  (19, 'Facebook', 'Comments',          6, true),
  (20, 'Facebook', 'Post Reactions',    7, true),
  (21, 'Facebook', 'Group Members',     8, true),
  (22, 'Facebook', 'Live Stream Views', 9, true)
ON CONFLICT (id) DO UPDATE SET
  platform = EXCLUDED.platform,
  name = EXCLUDED.name,
  sort_order = EXCLUDED.sort_order,
  is_active = true;

SELECT setval(pg_get_serial_sequence('public.categories', 'id'), (SELECT COALESCE(MAX(id), 1) FROM public.categories));
