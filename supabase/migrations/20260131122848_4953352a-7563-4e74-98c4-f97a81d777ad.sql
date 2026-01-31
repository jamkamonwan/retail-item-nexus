-- Drop all triggers first (must be done before functions)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS on_auth_user_created_role ON auth.users;
DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
DROP TRIGGER IF EXISTS update_npd_submissions_updated_at ON public.npd_submissions;
DROP TRIGGER IF EXISTS update_field_approvals_updated_at ON public.field_approvals;
DROP TRIGGER IF EXISTS update_field_approval_config_updated_at ON public.field_approval_config;

-- Drop all tables (order matters due to foreign keys)
DROP TABLE IF EXISTS public.field_approvals CASCADE;
DROP TABLE IF EXISTS public.field_approval_config CASCADE;
DROP TABLE IF EXISTS public.npd_workflow_history CASCADE;
DROP TABLE IF EXISTS public.npd_submissions CASCADE;
DROP TABLE IF EXISTS public.user_suppliers CASCADE;
DROP TABLE IF EXISTS public.user_permissions CASCADE;
DROP TABLE IF EXISTS public.user_departments CASCADE;
DROP TABLE IF EXISTS public.user_roles CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;
DROP TABLE IF EXISTS public.suppliers CASCADE;
DROP TABLE IF EXISTS public.departments CASCADE;

-- Drop all custom functions
DROP FUNCTION IF EXISTS public.is_admin(uuid) CASCADE;
DROP FUNCTION IF EXISTS public.has_role(uuid, app_role) CASCADE;
DROP FUNCTION IF EXISTS public.get_user_role(uuid) CASCADE;
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;
DROP FUNCTION IF EXISTS public.handle_new_user_role() CASCADE;
DROP FUNCTION IF EXISTS public.update_updated_at_column() CASCADE;

-- Drop custom enum types
DROP TYPE IF EXISTS public.workflow_status CASCADE;
DROP TYPE IF EXISTS public.app_role CASCADE;
DROP TYPE IF EXISTS public.permission_type CASCADE;
DROP TYPE IF EXISTS public.user_status CASCADE;
DROP TYPE IF EXISTS public.user_type CASCADE;