CREATE TABLE IF NOT EXISTS public.routes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id BIGINT REFERENCES public.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  start_time TEXT,
  privacy TEXT DEFAULT 'public',
  route_info JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
