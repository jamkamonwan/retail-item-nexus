-- Add policy for users to insert their own roles
CREATE POLICY "Users can insert their own roles"
ON public.user_roles FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Alternative: Create a trigger to auto-assign role from user metadata
CREATE OR REPLACE FUNCTION public.handle_new_user_role()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Insert default role if specified in user metadata, otherwise default to 'buyer'
  INSERT INTO public.user_roles (user_id, role)
  VALUES (
    NEW.id,
    COALESCE(
      (NEW.raw_user_meta_data->>'role')::app_role,
      'buyer'::app_role
    )
  );
  RETURN NEW;
EXCEPTION
  WHEN unique_violation THEN
    -- Role already exists, ignore
    RETURN NEW;
END;
$$;

-- Create trigger to auto-create role on signup
CREATE TRIGGER on_auth_user_created_role
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_role();