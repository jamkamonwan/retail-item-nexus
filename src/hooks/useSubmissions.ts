import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { NPDSubmission, WorkflowStatus, WorkflowHistoryEntry } from '@/types/workflow';
import { Division, UserType } from '@/types/npd';
import { toast } from 'sonner';

export function useSubmissions() {
  const { user } = useAuth();
  const [submissions, setSubmissions] = useState<NPDSubmission[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch all submissions
  const fetchSubmissions = async () => {
    if (!user) {
      setSubmissions([]);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('npd_submissions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Transform database records to NPDSubmission format
      const transformed: NPDSubmission[] = (data || []).map(row => ({
        id: row.id,
        division: row.division as Division,
        status: row.status as WorkflowStatus,
        productNameTh: row.product_name_th || '',
        productNameEn: row.product_name_en,
        barcode: row.barcode || '',
        supplierName: row.supplier_name || '',
        createdAt: new Date(row.created_at),
        updatedAt: new Date(row.updated_at),
        submittedAt: row.submitted_at ? new Date(row.submitted_at) : undefined,
        approvedAt: row.approved_at ? new Date(row.approved_at) : undefined,
        formData: row.form_data as Record<string, string | number | File | null>,
        history: [], // Will be fetched separately if needed
      }));

      setSubmissions(transformed);
    } catch (error: any) {
      console.error('Error fetching submissions:', error);
      toast.error('Failed to load submissions');
    } finally {
      setLoading(false);
    }
  };

  // Create a new submission
  const createSubmission = async (
    division: Division,
    productNameEn: string,
    productNameTh: string,
    formData: Record<string, string | number | File | null>
  ): Promise<NPDSubmission | null> => {
    if (!user) {
      toast.error('Please sign in to create submissions');
      return null;
    }

    try {
      // Filter out File objects from formData for JSON storage
      const jsonFormData: Record<string, string | number | null> = {};
      for (const [key, value] of Object.entries(formData)) {
        if (!(value instanceof File)) {
          jsonFormData[key] = value;
        }
      }

      const { data, error } = await supabase
        .from('npd_submissions')
        .insert({
          division: division,
          product_name_en: productNameEn,
          product_name_th: productNameTh,
          form_data: jsonFormData,
          created_by: user.id,
        })
        .select()
        .single();

      if (error) throw error;

      const newSubmission: NPDSubmission = {
        id: data.id,
        division: data.division as Division,
        status: data.status as WorkflowStatus,
        productNameTh: data.product_name_th || '',
        productNameEn: data.product_name_en,
        barcode: data.barcode || '',
        supplierName: data.supplier_name || '',
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at),
        formData: data.form_data as Record<string, string | number | File | null>,
        history: [],
      };

      setSubmissions(prev => [newSubmission, ...prev]);
      toast.success('Submission created successfully');
      return newSubmission;
    } catch (error: any) {
      console.error('Error creating submission:', error);
      toast.error('Failed to create submission');
      return null;
    }
  };

  // Update submission status (workflow action)
  const updateStatus = async (
    submissionId: string,
    newStatus: WorkflowStatus,
    action: string,
    userRole: UserType,
    comment?: string
  ): Promise<boolean> => {
    if (!user) {
      toast.error('Please sign in');
      return false;
    }

    try {
      // Get current submission
      const submission = submissions.find(s => s.id === submissionId);
      if (!submission) throw new Error('Submission not found');

      // Update submission status
      const updateData: Record<string, any> = { status: newStatus };
      
      if (newStatus === 'pending_buyer' && !submission.submittedAt) {
        updateData.submitted_at = new Date().toISOString();
      }
      if (newStatus === 'approved') {
        updateData.approved_at = new Date().toISOString();
      }

      const { error: updateError } = await supabase
        .from('npd_submissions')
        .update(updateData)
        .eq('id', submissionId);

      if (updateError) throw updateError;

      // Add history entry
      const { error: historyError } = await supabase
        .from('npd_workflow_history')
        .insert({
          submission_id: submissionId,
          from_status: submission.status,
          to_status: newStatus,
          action,
          performed_by: user.id,
          performed_by_role: userRole,
          comment,
        });

      if (historyError) console.error('Failed to add history:', historyError);

      // Update local state
      setSubmissions(prev => prev.map(s => 
        s.id === submissionId 
          ? { 
              ...s, 
              status: newStatus, 
              updatedAt: new Date(),
              submittedAt: updateData.submitted_at ? new Date(updateData.submitted_at) : s.submittedAt,
              approvedAt: updateData.approved_at ? new Date(updateData.approved_at) : s.approvedAt,
            }
          : s
      ));

      return true;
    } catch (error: any) {
      console.error('Error updating status:', error);
      toast.error('Failed to update submission');
      return false;
    }
  };

  // Update submission form data
  const updateFormData = async (
    submissionId: string,
    formData: Record<string, string | number | File | null>
  ): Promise<boolean> => {
    try {
      // Filter out File objects from formData for JSON storage
      const jsonFormData: Record<string, string | number | null> = {};
      for (const [key, value] of Object.entries(formData)) {
        if (!(value instanceof File)) {
          jsonFormData[key] = value;
        }
      }

      const { error } = await supabase
        .from('npd_submissions')
        .update({ form_data: jsonFormData })
        .eq('id', submissionId);

      if (error) throw error;

      setSubmissions(prev => prev.map(s => 
        s.id === submissionId 
          ? { ...s, formData, updatedAt: new Date() }
          : s
      ));

      return true;
    } catch (error: any) {
      console.error('Error updating form data:', error);
      toast.error('Failed to save changes');
      return false;
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, [user]);

  return {
    submissions,
    loading,
    createSubmission,
    updateStatus,
    updateFormData,
    refetch: fetchSubmissions,
  };
}
