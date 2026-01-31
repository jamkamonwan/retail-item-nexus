import { useState, useCallback } from 'react';
import { 
  mockSubmissions, 
  MockSubmission, 
  MockWorkflowStatus, 
  MockDivision,
  MockHistoryEntry 
} from '@/data/mock';
import { MockRole } from '@/data/mock/users';
import { toast } from 'sonner';

// Re-export types for compatibility
export type WorkflowStatus = MockWorkflowStatus;
export type Division = MockDivision;

export interface NPDSubmission extends MockSubmission {}

// Workflow status configuration
export const WORKFLOW_STATUSES: Record<WorkflowStatus, { 
  label: string; 
  color: string; 
  nextStatus?: WorkflowStatus;
  canEdit?: boolean;
}> = {
  draft: { label: 'Draft', color: 'bg-gray-500', nextStatus: 'pending_buyer', canEdit: true },
  pending_buyer: { label: 'Pending Buyer', color: 'bg-yellow-500', nextStatus: 'pending_commercial' },
  pending_commercial: { label: 'Pending Commercial', color: 'bg-orange-500', nextStatus: 'pending_finance' },
  pending_finance: { label: 'Pending Finance', color: 'bg-blue-500', nextStatus: 'approved' },
  pending_secondary: { label: 'Secondary Review', color: 'bg-purple-500', nextStatus: 'approved' },
  approved: { label: 'Approved', color: 'bg-green-500' },
  rejected: { label: 'Rejected', color: 'bg-red-500' },
  revision_needed: { label: 'Revision Needed', color: 'bg-amber-500', canEdit: true },
};

export function useSubmissions() {
  const [submissions, setSubmissions] = useState<NPDSubmission[]>([...mockSubmissions]);
  const [loading, setLoading] = useState(false);

  const fetchSubmissions = useCallback(async () => {
    setLoading(true);
    // Simulate network delay for realistic UX
    await new Promise(resolve => setTimeout(resolve, 300));
    setSubmissions([...mockSubmissions]);
    setLoading(false);
  }, []);

  // Create a new submission
  const createSubmission = async (
    division: Division,
    productNameEn: string,
    productNameTh: string,
    formData: Record<string, string | number | File | null>
  ): Promise<NPDSubmission | null> => {
    // Filter out File objects for storage
    const jsonFormData: Record<string, string | number | null> = {};
    for (const [key, value] of Object.entries(formData)) {
      if (!(value instanceof File)) {
        jsonFormData[key] = value;
      }
    }

    const newSubmission: NPDSubmission = {
      id: `sub-${Date.now()}`,
      division,
      status: 'draft',
      productNameTh,
      productNameEn,
      barcode: '',
      supplierId: 'supplier-001',
      supplierName: 'ACME Corporation',
      createdBy: 'user-supplier-001',
      createdByName: 'John Supplier',
      createdAt: new Date(),
      updatedAt: new Date(),
      formData: jsonFormData,
      history: [],
    };

    setSubmissions(prev => [newSubmission, ...prev]);
    toast.success('Submission created successfully');
    return newSubmission;
  };

  // Update submission status
  const updateStatus = async (
    submissionId: string,
    newStatus: WorkflowStatus,
    action: string,
    userRole: MockRole,
    comment?: string
  ): Promise<boolean> => {
    const submission = submissions.find(s => s.id === submissionId);
    if (!submission) {
      toast.error('Submission not found');
      return false;
    }

    const historyEntry: MockHistoryEntry = {
      id: `hist-${Date.now()}`,
      fromStatus: submission.status,
      toStatus: newStatus,
      action,
      performedBy: 'current-user',
      performedByRole: userRole,
      comment,
      createdAt: new Date(),
    };

    setSubmissions(prev => prev.map(s => 
      s.id === submissionId 
        ? { 
            ...s, 
            status: newStatus, 
            updatedAt: new Date(),
            submittedAt: newStatus === 'pending_buyer' && !s.submittedAt ? new Date() : s.submittedAt,
            approvedAt: newStatus === 'approved' ? new Date() : s.approvedAt,
            history: [...s.history, historyEntry],
          }
        : s
    ));

    return true;
  };

  // Update submission form data
  const updateFormData = async (
    submissionId: string,
    formData: Record<string, string | number | File | null>
  ): Promise<boolean> => {
    const jsonFormData: Record<string, string | number | null> = {};
    for (const [key, value] of Object.entries(formData)) {
      if (!(value instanceof File)) {
        jsonFormData[key] = value;
      }
    }

    setSubmissions(prev => prev.map(s => 
      s.id === submissionId 
        ? { ...s, formData: jsonFormData, updatedAt: new Date() }
        : s
    ));

    return true;
  };

  return {
    submissions,
    loading,
    createSubmission,
    updateStatus,
    updateFormData,
    refetch: fetchSubmissions,
  };
}
