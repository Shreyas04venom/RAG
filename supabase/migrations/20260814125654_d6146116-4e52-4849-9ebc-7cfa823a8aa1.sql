CREATE OR REPLACE FUNCTION public.match_evidence(
  query_embedding extensions.vector,
  query_text text,
  match_count integer DEFAULT 8,
  rrf_k integer DEFAULT 60
)
RETURNS TABLE(
  id uuid,
  content text,
  metadata jsonb,
  dense_score double precision,
  sparse_score double precision,
  combined_score double precision
)
LANGUAGE plpgsql
STABLE
SET search_path TO 'public', 'extensions'
AS $function$
DECLARE
  tsq tsquery;
BEGIN
  BEGIN
    tsq := websearch_to_tsquery('english', coalesce(query_text, ''));
  EXCEPTION WHEN others THEN
    tsq := NULL;
  END;

  RETURN QUERY
  WITH dense AS (
    SELECT c.id, (1.0 - (c.embedding <=> query_embedding))::float AS score,
           ROW_NUMBER() OVER (ORDER BY c.embedding <=> query_embedding) AS rank
    FROM public.chunks c
    WHERE c.embedding IS NOT NULL
    ORDER BY c.embedding <=> query_embedding
    LIMIT match_count * 4
  ),
  sparse AS (
    SELECT c.id, ts_rank(c.fts, tsq)::float AS score,
           ROW_NUMBER() OVER (ORDER BY ts_rank(c.fts, tsq) DESC) AS rank
    FROM public.chunks c
    WHERE tsq IS NOT NULL AND c.fts @@ tsq
    ORDER BY ts_rank(c.fts, tsq) DESC
    LIMIT match_count * 4
  )
  SELECT c.id, c.content, c.metadata,
         COALESCE(d.score, 0)::float,
         COALESCE(s.score, 0)::float,
         (COALESCE(1.0 / (rrf_k + d.rank), 0.0) + COALESCE(1.0 / (rrf_k + s.rank), 0.0))::float AS combined
  FROM public.chunks c
  LEFT JOIN dense d ON d.id = c.id
  LEFT JOIN sparse s ON s.id = c.id
  WHERE d.id IS NOT NULL OR s.id IS NOT NULL
  ORDER BY combined DESC
  LIMIT match_count;
END;
$function$;

GRANT EXECUTE ON FUNCTION public.match_evidence(extensions.vector, text, integer, integer) TO service_role, authenticated, anon;
