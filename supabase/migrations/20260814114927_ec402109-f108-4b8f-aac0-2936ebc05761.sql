-- Allow authenticated/service_role to insert chunks
CREATE POLICY "Allow service role insert to chunks"
ON public.chunks
FOR INSERT
TO service_role, authenticated
WITH CHECK (true);

-- Ensure service role has all privileges (should already be there but being explicit)
GRANT ALL ON public.chunks TO service_role;
GRANT ALL ON public.latency_traces TO service_role;

-- Add demo data directly in migration for guaranteed seed
INSERT INTO public.chunks (content, chunk_type, metadata)
VALUES 
('MS MARCO (Microsoft Machine Reading Comprehension) is a large-scale dataset for deep learning in search. It was first released at NIPS 2016 and features over 1 million real-world queries collected from Bing search logs.', 'parent', '{"original_id": "msmarco-1"}'),
('The MS MARCO dataset includes several tasks such as passage ranking, document ranking, and natural language generation. The passage ranking task requires models to rank a set of passages based on their relevance to a given query.', 'parent', '{"original_id": "msmarco-2"}'),
('MS MARCO-XI (Indic) expands the original dataset to include high-quality Indic language pairs. This allows researchers to build better search and retrieval models for languages spoken in India.', 'parent', '{"original_id": "indic-1"}');
