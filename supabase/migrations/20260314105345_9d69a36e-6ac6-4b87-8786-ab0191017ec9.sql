-- Allow mock/anonymous sessions (e.g. Vercel demo mode) to manage Terms versions
-- so create/update/publish flows work without a real authenticated session.

CREATE POLICY "Anon can read all terms_versions"
ON public.terms_versions
FOR SELECT
TO anon
USING (true);

CREATE POLICY "Anon can insert terms_versions"
ON public.terms_versions
FOR INSERT
TO anon
WITH CHECK (true);

CREATE POLICY "Anon can update terms_versions"
ON public.terms_versions
FOR UPDATE
TO anon
USING (true)
WITH CHECK (true);