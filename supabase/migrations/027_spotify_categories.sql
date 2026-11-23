-- Migration: Add Spotify categories to public.categories

INSERT INTO public.categories (id, platform, name, sort_order, is_active)
OVERRIDING SYSTEM VALUE VALUES
  (46, 'Spotify', 'Plays',             1, true),
  (47, 'Spotify', 'Monthly Listeners', 2, true),
  (48, 'Spotify', 'Followers',         3, true),
  (49, 'Spotify', 'Saves',             4, true),
  (50, 'Spotify', 'Playlist Plays',    5, true),
  (51, 'Spotify', 'Podcast',           6, true)
ON CONFLICT (id) DO UPDATE SET
  platform = EXCLUDED.platform,
  name = EXCLUDED.name,
  sort_order = EXCLUDED.sort_order,
  is_active = true;

SELECT setval(pg_get_serial_sequence('public.categories', 'id'), (SELECT COALESCE(MAX(id), 1) FROM public.categories));
