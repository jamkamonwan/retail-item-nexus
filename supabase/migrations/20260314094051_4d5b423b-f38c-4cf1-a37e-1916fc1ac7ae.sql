
-- Add email to all metadata entries that are missing it
UPDATE public.audit_logs SET metadata = metadata || '{"email": "admin@bigc.co.th"}'::jsonb
WHERE event_type IN ('USER_ROLE_ASSIGNED', 'USER_ROLE_REMOVED') AND metadata->>'assigned_by' = 'Admin User' OR metadata->>'removed_by' = 'Admin User';

UPDATE public.audit_logs SET metadata = metadata || '{"email": "somchai@unilever.com"}'::jsonb
WHERE actor_id = 'b1000000-0000-0000-0000-000000000001' AND metadata->>'email' IS NULL;

UPDATE public.audit_logs SET metadata = metadata || '{"email": "sarah.buyer@bigc.co.th"}'::jsonb
WHERE actor_id = 'c1000000-0000-0000-0000-000000000001' AND metadata->>'email' IS NULL;

UPDATE public.audit_logs SET metadata = metadata || '{"email": "pranee@cpfoods.co.th"}'::jsonb
WHERE actor_id = 'd1000000-0000-0000-0000-000000000001' AND metadata->>'email' IS NULL;

UPDATE public.audit_logs SET metadata = metadata || '{"email": "admin@bigc.co.th"}'::jsonb
WHERE actor_id = 'a1000000-0000-0000-0000-000000000001' AND metadata->>'email' IS NULL;

-- Failed login already has email
-- Make sure all remaining rows have email
UPDATE public.audit_logs SET metadata = metadata || '{"email": "hacker@unknown.com"}'::jsonb
WHERE event_type = 'FAILED_LOGIN' AND metadata->>'email' = 'hacker@unknown.com';
