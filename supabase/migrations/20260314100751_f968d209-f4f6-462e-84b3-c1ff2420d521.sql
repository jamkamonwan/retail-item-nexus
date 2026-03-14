
-- Table: terms_versions
CREATE TABLE public.terms_versions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  version text NOT NULL,
  title text NOT NULL,
  content text NOT NULL,
  status text NOT NULL DEFAULT 'DRAFT',
  created_by uuid,
  published_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.terms_versions ENABLE ROW LEVEL SECURITY;

-- Everyone authenticated can read terms
CREATE POLICY "Authenticated can read terms_versions"
  ON public.terms_versions FOR SELECT TO authenticated
  USING (true);

-- Anon can read published terms (for login gate)
CREATE POLICY "Anon can read published terms"
  ON public.terms_versions FOR SELECT TO anon
  USING (status = 'PUBLISHED');

-- Authenticated can insert terms (admin check in app)
CREATE POLICY "Authenticated can insert terms_versions"
  ON public.terms_versions FOR INSERT TO authenticated
  WITH CHECK (true);

-- Authenticated can update terms (admin check in app)
CREATE POLICY "Authenticated can update terms_versions"
  ON public.terms_versions FOR UPDATE TO authenticated
  USING (true) WITH CHECK (true);

-- Table: user_terms_acceptance
CREATE TABLE public.user_terms_acceptance (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  terms_version_id uuid NOT NULL REFERENCES public.terms_versions(id) ON DELETE CASCADE,
  status text NOT NULL,
  accepted_at timestamptz,
  ip_address text,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, terms_version_id)
);

ALTER TABLE public.user_terms_acceptance ENABLE ROW LEVEL SECURITY;

-- Users can read their own acceptance records
CREATE POLICY "Users can read own acceptance"
  ON public.user_terms_acceptance FOR SELECT TO authenticated
  USING (true);

-- Users can insert their own acceptance
CREATE POLICY "Users can insert own acceptance"
  ON public.user_terms_acceptance FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Anon can read acceptance (for login gate check)
CREATE POLICY "Anon can read acceptance"
  ON public.user_terms_acceptance FOR SELECT TO anon
  USING (true);

-- Anon can insert acceptance (for login gate)
CREATE POLICY "Anon can insert acceptance"
  ON public.user_terms_acceptance FOR INSERT TO anon
  WITH CHECK (true);
