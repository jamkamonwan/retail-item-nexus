
-- Fix search_path on log_audit function
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
SET search_path = public
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
