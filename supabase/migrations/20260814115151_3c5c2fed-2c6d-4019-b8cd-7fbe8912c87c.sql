INSERT INTO public.chunks (content, chunk_type, parent_id, metadata) 
SELECT 'MS MARCO (Microsoft Machine Reading Comprehension) is a large-scale dataset for deep learning in search.', 'child', id, metadata 
FROM public.chunks 
WHERE content LIKE 'MS MARCO%' AND chunk_type = 'parent' 
LIMIT 1;
