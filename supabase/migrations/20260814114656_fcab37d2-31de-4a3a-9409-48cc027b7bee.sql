-- Add search vector for sparse retrieval
ALTER TABLE public.chunks ADD COLUMN IF NOT EXISTS fts tsvector 
GENERATED ALWAYS AS (to_tsvector('english', content)) STORED;

CREATE INDEX IF NOT EXISTS chunks_fts_idx ON public.chunks USING gin(fts);

-- Hybrid Search Function (Dense + Sparse + RRF)
CREATE OR REPLACE FUNCTION public.match_chunks(
    query_embedding vector(1536),
    query_text text,
    match_count int DEFAULT 10,
    rrf_k int DEFAULT 60
)
RETURNS TABLE (
    id uuid,
    content text,
    chunk_type text,
    parent_id uuid,
    metadata jsonb,
    combined_score float
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    WITH dense_results AS (
        SELECT 
            c.id,
            1.0 - (c.embedding <=> query_embedding) as score,
            ROW_NUMBER() OVER (ORDER BY c.embedding <=> query_embedding) as rank
        FROM public.chunks c
        WHERE c.chunk_type = 'child'
        ORDER BY c.embedding <=> query_embedding
        LIMIT match_count * 2
    ),
    sparse_results AS (
        SELECT 
            c.id,
            ts_rank(c.fts, websearch_to_tsquery('english', query_text)) as score,
            ROW_NUMBER() OVER (ORDER BY ts_rank(c.fts, websearch_to_tsquery('english', query_text)) DESC) as rank
        FROM public.chunks c
        WHERE c.fts @@ websearch_to_tsquery('english', query_text)
          AND c.chunk_type = 'child'
        ORDER BY score DESC
        LIMIT match_count * 2
    )
    SELECT 
        c.id,
        c.content,
        c.chunk_type,
        c.parent_id,
        c.metadata,
        (COALESCE(1.0 / (rrf_k + dr.rank), 0.0) + 
         COALESCE(1.0 / (rrf_k + sr.rank), 0.0))::float as combined_score
    FROM public.chunks c
    LEFT JOIN dense_results dr ON c.id = dr.id
    LEFT JOIN sparse_results sr ON c.id = sr.id
    WHERE dr.id IS NOT NULL OR sr.id IS NOT NULL
    ORDER BY combined_score DESC
    LIMIT match_count;
END;
$$;

GRANT EXECUTE ON FUNCTION public.match_chunks TO anon, authenticated, service_role;
