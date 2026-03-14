-- Tighten the anon Terms policies added previously so they are not unconditional true.
-- Keep Vercel mock-mode working by allowing anon access only to rows with created_by IS NULL.

DROP POLICY IF EXISTS "Anon can read all terms_versions" ON public.terms_versions;
DROP POLICY IF EXISTS "Anon can insert terms_versions" ON public.terms_versions;
DROP POLICY IF EXISTS "Anon can update terms_versions" ON public.terms_versions;

CREATE POLICY "Anon can read mock terms_versions"
ON public.terms_versions
FOR SELECT
TO anon
USING (created_by IS NULL);

CREATE POLICY "Anon can insert mock terms_versions"
ON public.terms_versions
FOR INSERT
TO anon
WITH CHECK (created_by IS NULL);

CREATE POLICY "Anon can update mock terms_versions"
ON public.terms_versions
FOR UPDATE
TO anon
USING (created_by IS NULL)
WITH CHECK (created_by IS NULL);