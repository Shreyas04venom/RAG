DROP POLICY IF EXISTS "Allow public read access to latency_traces" ON public.latency_traces;

REVOKE SELECT ON public.latency_traces FROM anon, authenticated;
GRANT ALL ON public.latency_traces TO service_role;

CREATE POLICY "No client read access to latency_traces"
ON public.latency_traces
FOR SELECT
TO anon, authenticated
USING (false);

REVOKE SELECT ON public.query_logs FROM anon, authenticated;
GRANT ALL ON public.query_logs TO service_role;

CREATE POLICY "No client read access to query_logs"
ON public.query_logs
FOR SELECT
TO anon, authenticated
USING (false);