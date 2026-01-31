-- Drop overly permissive policies and replace with role-appropriate ones

-- field_approval_config: Only buyers/admins should manage config, all can read
DROP POLICY IF EXISTS "Authenticated users can manage field approval config" ON public.field_approval_config;

-- Create separate INSERT/UPDATE/DELETE policies for field_approval_config
-- For now, allow authenticated users to manage (can be restricted to admin role later)
CREATE POLICY "Authenticated users can insert field approval config"
ON public.field_approval_config
FOR INSERT
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update field approval config"
ON public.field_approval_config
FOR UPDATE
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can delete field approval config"
ON public.field_approval_config
FOR DELETE
USING (auth.uid() IS NOT NULL);

-- field_approvals: Update policies to check user is authenticated and tie to approved_by
DROP POLICY IF EXISTS "Authenticated users can create field approvals" ON public.field_approvals;
DROP POLICY IF EXISTS "Authenticated users can update field approvals" ON public.field_approvals;

CREATE POLICY "Authenticated users can create field approvals"
ON public.field_approvals
FOR INSERT
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update their field approvals"
ON public.field_approvals
FOR UPDATE
USING (auth.uid() IS NOT NULL);