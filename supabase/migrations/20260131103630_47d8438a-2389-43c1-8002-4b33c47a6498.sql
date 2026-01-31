-- Add 'nsd' to app_role enum if not exists
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'nsd' AND enumtypid = 'public.app_role'::regtype) THEN
    ALTER TYPE public.app_role ADD VALUE 'nsd';
  END IF;
END$$;

-- Create user_status enum
CREATE TYPE public.user_status AS ENUM ('active', 'inactive', 'locked');

-- Create user_type enum
CREATE TYPE public.user_type AS ENUM ('internal', 'external');

-- Create permission_type enum
CREATE TYPE public.permission_type AS ENUM (
  'can_approve',
  'can_reject',
  'can_revise',
  'can_view_all_depts',
  'can_export',
  'can_access_reports'
);

-- Create departments table with seed data
CREATE TABLE public.departments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text UNIQUE NOT NULL,
  name text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS on departments
ALTER TABLE public.departments ENABLE ROW LEVEL SECURITY;

-- Everyone can read departments
CREATE POLICY "Anyone can view departments"
ON public.departments FOR SELECT
USING (true);

-- Seed departments
INSERT INTO public.departments (code, name) VALUES
  ('HL', 'Hard Lines'),
  ('HOL', 'Home Office Living'),
  ('DF', 'Dairy & Frozen'),
  ('NF', 'Non-Food'),
  ('SL', 'Soft Lines'),
  ('FF', 'Fresh Food'),
  ('PH', 'Pharmacy');

-- Create user_departments junction table
CREATE TABLE public.user_departments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  department_code text NOT NULL REFERENCES public.departments(code) ON DELETE CASCADE,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE (user_id, department_code)
);

-- Enable RLS on user_departments
ALTER TABLE public.user_departments ENABLE ROW LEVEL SECURITY;

-- Create user_permissions table
CREATE TABLE public.user_permissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  permission public.permission_type NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE (user_id, permission)
);

-- Enable RLS on user_permissions
ALTER TABLE public.user_permissions ENABLE ROW LEVEL SECURITY;

-- Create suppliers table
CREATE TABLE public.suppliers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  code text UNIQUE NOT NULL,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS on suppliers
ALTER TABLE public.suppliers ENABLE ROW LEVEL SECURITY;

-- Anyone can view suppliers
CREATE POLICY "Anyone can view suppliers"
ON public.suppliers FOR SELECT
USING (true);

-- Create user_suppliers junction table
CREATE TABLE public.user_suppliers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  supplier_id uuid NOT NULL REFERENCES public.suppliers(id) ON DELETE CASCADE,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE (user_id, supplier_id)
);

-- Enable RLS on user_suppliers
ALTER TABLE public.user_suppliers ENABLE ROW LEVEL SECURITY;

-- Add new columns to profiles table
ALTER TABLE public.profiles 
  ADD COLUMN IF NOT EXISTS status public.user_status NOT NULL DEFAULT 'active',
  ADD COLUMN IF NOT EXISTS last_login_at timestamp with time zone,
  ADD COLUMN IF NOT EXISTS user_type public.user_type NOT NULL DEFAULT 'internal';

-- Create is_admin security definer function
CREATE OR REPLACE FUNCTION public.is_admin(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = 'admin'
  )
$$;

-- RLS policies for user_departments
CREATE POLICY "Users can view their own departments"
ON public.user_departments FOR SELECT
USING (auth.uid() = user_id OR public.is_admin(auth.uid()));

CREATE POLICY "Admins can manage user departments"
ON public.user_departments FOR ALL
USING (public.is_admin(auth.uid()));

-- RLS policies for user_permissions
CREATE POLICY "Users can view their own permissions"
ON public.user_permissions FOR SELECT
USING (auth.uid() = user_id OR public.is_admin(auth.uid()));

CREATE POLICY "Admins can manage user permissions"
ON public.user_permissions FOR ALL
USING (public.is_admin(auth.uid()));

-- RLS policies for user_suppliers
CREATE POLICY "Users can view their own suppliers"
ON public.user_suppliers FOR SELECT
USING (auth.uid() = user_id OR public.is_admin(auth.uid()));

CREATE POLICY "Admins can manage user suppliers"
ON public.user_suppliers FOR ALL
USING (public.is_admin(auth.uid()));

-- Admins can manage suppliers
CREATE POLICY "Admins can manage suppliers"
ON public.suppliers FOR ALL
USING (public.is_admin(auth.uid()));

-- Update profiles RLS to allow admins to view all profiles
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
CREATE POLICY "Users can view own profile or admins can view all"
ON public.profiles FOR SELECT
USING (auth.uid() = user_id OR public.is_admin(auth.uid()));

-- Admins can update any profile
CREATE POLICY "Admins can update any profile"
ON public.profiles FOR UPDATE
USING (public.is_admin(auth.uid()));

-- Allow admins to view all user roles
DROP POLICY IF EXISTS "Users can view their own roles" ON public.user_roles;
CREATE POLICY "Users can view own roles or admins can view all"
ON public.user_roles FOR SELECT
USING (auth.uid() = user_id OR public.is_admin(auth.uid()));

-- Admins can manage all user roles
CREATE POLICY "Admins can manage user roles"
ON public.user_roles FOR ALL
USING (public.is_admin(auth.uid()));