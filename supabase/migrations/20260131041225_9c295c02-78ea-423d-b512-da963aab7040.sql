-- Create enum for workflow status
CREATE TYPE public.workflow_status AS ENUM (
  'draft',
  'pending_buyer',
  'pending_commercial', 
  'pending_finance',
  'approved',
  'rejected',
  'revision_needed'
);

-- Create NPD submissions table
CREATE TABLE public.npd_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  division TEXT NOT NULL,
  status workflow_status NOT NULL DEFAULT 'draft',
  product_name_th TEXT,
  product_name_en TEXT NOT NULL,
  barcode TEXT,
  supplier_name TEXT,
  form_data JSONB NOT NULL DEFAULT '{}',
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  submitted_at TIMESTAMP WITH TIME ZONE,
  approved_at TIMESTAMP WITH TIME ZONE
);

-- Create workflow history table
CREATE TABLE public.npd_workflow_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  submission_id UUID REFERENCES public.npd_submissions(id) ON DELETE CASCADE NOT NULL,
  from_status workflow_status,
  to_status workflow_status NOT NULL,
  action TEXT NOT NULL,
  performed_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  performed_by_role TEXT,
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.npd_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.npd_workflow_history ENABLE ROW LEVEL SECURITY;

-- RLS Policies for npd_submissions
-- All authenticated users can view all submissions (needed for workflow)
CREATE POLICY "Authenticated users can view all submissions"
ON public.npd_submissions FOR SELECT
TO authenticated
USING (true);

-- Users can create their own submissions
CREATE POLICY "Users can create submissions"
ON public.npd_submissions FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = created_by);

-- Users can update submissions (workflow will control edit permissions in app)
CREATE POLICY "Authenticated users can update submissions"
ON public.npd_submissions FOR UPDATE
TO authenticated
USING (true);

-- RLS Policies for workflow history
CREATE POLICY "Authenticated users can view workflow history"
ON public.npd_workflow_history FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can add history entries"
ON public.npd_workflow_history FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = performed_by);

-- Update timestamp trigger
CREATE TRIGGER update_npd_submissions_updated_at
  BEFORE UPDATE ON public.npd_submissions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for common queries
CREATE INDEX idx_npd_submissions_status ON public.npd_submissions(status);
CREATE INDEX idx_npd_submissions_division ON public.npd_submissions(division);
CREATE INDEX idx_npd_submissions_created_by ON public.npd_submissions(created_by);
CREATE INDEX idx_npd_workflow_history_submission ON public.npd_workflow_history(submission_id);