CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE public.chunks (
    id uuid primary key default gen_random_uuid(),
    content text not null,
    metadata jsonb default '{}'::jsonb,
    embedding vector(1536),
    parent_id uuid references public.chunks(id) on delete cascade,
    chunk_type text not null, -- 'semantic', 'parent', 'child'
    created_at timestamptz default now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.chunks TO authenticated;
GRANT ALL ON public.chunks TO service_role;
GRANT SELECT ON public.chunks TO anon;

ALTER TABLE public.chunks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to chunks"
ON public.chunks
FOR SELECT
TO anon, authenticated
USING (true);

CREATE INDEX ON public.chunks USING hnsw (embedding vector_cosine_ops);

CREATE TABLE public.latency_traces (
    id uuid primary key default gen_random_uuid(),
    trace_id text not null,
    stage text not null,
    duration_ms float not null,
    metadata jsonb default '{}'::jsonb,
    created_at timestamptz default now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.latency_traces TO authenticated;
GRANT ALL ON public.latency_traces TO service_role;
GRANT SELECT ON public.latency_traces TO anon;

ALTER TABLE public.latency_traces ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to latency_traces"
ON public.latency_traces
FOR SELECT
TO anon, authenticated
USING (true);

CREATE POLICY "Allow authenticated insert to latency_traces"
ON public.latency_traces
FOR INSERT
TO authenticated, service_role
WITH CHECK (true);
