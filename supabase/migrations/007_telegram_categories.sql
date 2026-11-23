-- Migration: Add Telegram categories to public.categories

INSERT INTO public.categories (id, platform, name, sort_order, is_active)
OVERRIDING SYSTEM VALUE VALUES
  (8,  'Telegram', 'Members',        1, true),
  (9,  'Telegram', 'Channel Views',  2, true),
  (10, 'Telegram', 'Post Reactions', 3, true),
  (11, 'Telegram', 'Shares',         4, true),
  (12, 'Telegram', 'Comments',       5, true),
  (13, 'Telegram', 'Channel Boosts', 6, true)
ON CONFLICT (id) DO UPDATE SET
  platform = EXCLUDED.platform,
  name = EXCLUDED.name,
  sort_order = EXCLUDED.sort_order,
  is_active = true;

SELECT setval(pg_get_serial_sequence('public.categories', 'id'), (SELECT COALESCE(MAX(id), 1) FROM public.categories));
