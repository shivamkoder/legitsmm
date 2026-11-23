-- Migration: Add Twitch, Pinterest, Snapchat, Discord, Reddit, and WhatsApp categories

INSERT INTO public.categories (id, platform, name, sort_order, is_active)
OVERRIDING SYSTEM VALUE VALUES
  (52, 'Twitch',    'Followers',             1, true),
  (53, 'Twitch',    'Live Viewers',          2, true),
  (54, 'Twitch',    'Channel Views',         3, true),
  (55, 'Twitch',    'Chatters',              4, true),
  (56, 'Pinterest', 'Followers',             1, true),
  (57, 'Pinterest', 'Likes',                 2, true),
  (58, 'Pinterest', 'Saves',                 3, true),
  (59, 'Pinterest', 'Comments',              4, true),
  (60, 'Snapchat',  'Followers',             1, true),
  (61, 'Snapchat',  'Story Views',           2, true),
  (62, 'Snapchat',  'Likes',                 3, true),
  (63, 'Discord',   'Server Members',        1, true),
  (64, 'Discord',   'Online Members',        2, true),
  (65, 'Discord',   'Reactions',             3, true),
  (66, 'Discord',   'Poll Votes',            4, true),
  (67, 'Reddit',    'Upvotes',               1, true),
  (68, 'Reddit',    'Subreddit Subscribers', 2, true),
  (69, 'Reddit',    'Views',                 3, true),
  (70, 'Reddit',    'Shares',                4, true),
  (71, 'WhatsApp',  'Channel Members',       1, true),
  (72, 'WhatsApp',  'Community Members',     2, true),
  (73, 'WhatsApp',  'Reactions',             3, true)
ON CONFLICT (id) DO UPDATE SET
  platform = EXCLUDED.platform,
  name = EXCLUDED.name,
  sort_order = EXCLUDED.sort_order,
  is_active = true;

SELECT setval(pg_get_serial_sequence('public.categories', 'id'), (SELECT COALESCE(MAX(id), 1) FROM public.categories));
