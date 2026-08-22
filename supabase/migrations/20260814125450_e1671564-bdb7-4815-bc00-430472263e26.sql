DELETE FROM public.chunks;

CREATE TABLE IF NOT EXISTS public.query_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  trace_id text NOT NULL,
  query text NOT NULL,
  answer text,
  status text NOT NULL,
  confidence double precision NOT NULL DEFAULT 0,
  grounded boolean NOT NULL DEFAULT false,
  total_latency_ms double precision NOT NULL DEFAULT 0,
  latencies jsonb NOT NULL DEFAULT '{}'::jsonb,
  sources jsonb NOT NULL DEFAULT '[]'::jsonb,
  language text,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT ALL ON public.query_logs TO service_role;
ALTER TABLE public.query_logs ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS query_logs_created_at_idx ON public.query_logs (created_at DESC);
