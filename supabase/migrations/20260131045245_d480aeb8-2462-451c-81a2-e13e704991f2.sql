-- Field Approval Configuration Table
-- Maps which fields require approval from which secondary roles
CREATE TABLE public.field_approval_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  field_id TEXT NOT NULL,
  required_role public.app_role NOT NULL,
  division TEXT,  -- NULL = applies to all divisions, or specific division code like 'DF', 'NF'
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(field_id, required_role, division)
);

-- Field Approvals Tracking Table
-- Tracks actual approval status per field per submission
CREATE TABLE public.field_approvals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  submission_id UUID NOT NULL REFERENCES public.npd_submissions(id) ON DELETE CASCADE,
  field_id TEXT NOT NULL,
  approver_role public.app_role NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  approved_by UUID,
  comment TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(submission_id, field_id, approver_role)
);

-- Add new workflow status for secondary approval phase
ALTER TYPE public.workflow_status ADD VALUE IF NOT EXISTS 'pending_secondary';

-- Enable RLS on new tables
ALTER TABLE public.field_approval_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.field_approvals ENABLE ROW LEVEL SECURITY;

-- RLS Policies for field_approval_config (admin-level, readable by all authenticated)
CREATE POLICY "Authenticated users can view field approval config"
ON public.field_approval_config
FOR SELECT
USING (true);

CREATE POLICY "Authenticated users can manage field approval config"
ON public.field_approval_config
FOR ALL
USING (true)
WITH CHECK (true);

-- RLS Policies for field_approvals
CREATE POLICY "Authenticated users can view field approvals"
ON public.field_approvals
FOR SELECT
USING (true);

CREATE POLICY "Authenticated users can create field approvals"
ON public.field_approvals
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Authenticated users can update field approvals"
ON public.field_approvals
FOR UPDATE
USING (true);

-- Trigger for updated_at on field_approval_config
CREATE TRIGGER update_field_approval_config_updated_at
BEFORE UPDATE ON public.field_approval_config
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Trigger for updated_at on field_approvals
CREATE TRIGGER update_field_approvals_updated_at
BEFORE UPDATE ON public.field_approvals
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();