
-- Create audit_logs table
CREATE TABLE public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type TEXT NOT NULL,
  actor_id UUID,
  target_user_id UUID,
  entity_type TEXT,
  entity_id TEXT,
  metadata JSONB DEFAULT '{}',
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create index for common queries
CREATE INDEX idx_audit_logs_event_type ON public.audit_logs(event_type);
CREATE INDEX idx_audit_logs_actor_id ON public.audit_logs(actor_id);
CREATE INDEX idx_audit_logs_target_user_id ON public.audit_logs(target_user_id);
CREATE INDEX idx_audit_logs_created_at ON public.audit_logs(created_at DESC);
CREATE INDEX idx_audit_logs_entity ON public.audit_logs(entity_type, entity_id);

-- Create log_audit function
CREATE OR REPLACE FUNCTION public.log_audit(
  p_event_type TEXT,
  p_actor_id UUID DEFAULT NULL,
  p_target_user_id UUID DEFAULT NULL,
  p_entity_type TEXT DEFAULT NULL,
  p_entity_id TEXT DEFAULT NULL,
  p_metadata JSONB DEFAULT '{}'
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.audit_logs(
    event_type, actor_id, target_user_id,
    entity_type, entity_id, metadata
  )
  VALUES (
    p_event_type, p_actor_id, p_target_user_id,
    p_entity_type, p_entity_id, p_metadata
  );
END;
$$;

-- Enable RLS
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to insert (for logging)
CREATE POLICY "Authenticated users can insert audit logs"
ON public.audit_logs
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Allow anon to insert (for mock/demo usage)
CREATE POLICY "Anon can insert audit logs"
ON public.audit_logs
FOR INSERT
TO anon
WITH CHECK (true);

-- Allow authenticated to read (admin check done in app layer for now)
CREATE POLICY "Authenticated users can read audit logs"
ON public.audit_logs
FOR SELECT
TO authenticated
USING (true);

-- Allow anon to read (for mock/demo usage)
CREATE POLICY "Anon can read audit logs"
ON public.audit_logs
FOR SELECT
TO anon
USING (true);

-- Make logs immutable - no updates or deletes via RLS
CREATE POLICY "No updates allowed"
ON public.audit_logs
FOR UPDATE
TO authenticated
USING (false)
WITH CHECK (false);

CREATE POLICY "No deletes allowed"
ON public.audit_logs
FOR DELETE
TO authenticated
USING (false);
