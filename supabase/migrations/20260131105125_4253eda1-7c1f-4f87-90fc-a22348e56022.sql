-- Add must_change_password column to profiles table
ALTER TABLE public.profiles 
ADD COLUMN must_change_password boolean NOT NULL DEFAULT false;

-- Add comment for documentation
COMMENT ON COLUMN public.profiles.must_change_password IS 'Flag to enforce password change on first login for admin-created users';