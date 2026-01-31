// NPD Workflow Type Definitions
// Updated for mock-data-driven design-first development

import { UserType, Division } from './npd';

// Workflow Status - Detailed flow from Supplier to Approval
export type WorkflowStatus = 
  | 'draft'
  | 'pending_buyer'
  | 'pending_commercial'
  | 'pending_finance'
  | 'pending_secondary'
  | 'approved'
  | 'rejected'
  | 'revision_needed';

export const WORKFLOW_STATUSES: Record<WorkflowStatus, { 
  label: string; 
  labelTh: string; 
  color: string;
  nextStatus?: WorkflowStatus;
  previousStatus?: WorkflowStatus;
}> = {
  draft: { 
    label: 'Draft', 
    labelTh: 'ร่าง', 
    color: 'bg-muted text-muted-foreground',
    nextStatus: 'pending_buyer'
  },
  pending_buyer: { 
    label: 'Pending Buyer Review', 
    labelTh: 'รอ Buyer ตรวจสอบ', 
    color: 'bg-blue-100 text-blue-800',
    nextStatus: 'pending_commercial',
    previousStatus: 'draft'
  },
  pending_commercial: { 
    label: 'Pending Commercial', 
    labelTh: 'รอ Commercial ตรวจสอบ', 
    color: 'bg-purple-100 text-purple-800',
    nextStatus: 'pending_finance',
    previousStatus: 'pending_buyer'
  },
  pending_finance: { 
    label: 'Pending Finance', 
    labelTh: 'รอ Finance ตรวจสอบ', 
    color: 'bg-orange-100 text-orange-800',
    nextStatus: 'approved',
    previousStatus: 'pending_commercial'
  },
  pending_secondary: { 
    label: 'Secondary Review', 
    labelTh: 'รอตรวจสอบเพิ่มเติม', 
    color: 'bg-indigo-100 text-indigo-800',
    nextStatus: 'approved',
    previousStatus: 'pending_commercial'
  },
  approved: { 
    label: 'Approved', 
    labelTh: 'อนุมัติแล้ว', 
    color: 'bg-success/20 text-success'
  },
  rejected: { 
    label: 'Rejected', 
    labelTh: 'ปฏิเสธ', 
    color: 'bg-destructive/20 text-destructive'
  },
  revision_needed: { 
    label: 'Revision Needed', 
    labelTh: 'ต้องแก้ไข', 
    color: 'bg-warning/20 text-warning'
  },
};

// Which roles can approve at which stage
export const APPROVAL_PERMISSIONS: Record<WorkflowStatus, UserType[]> = {
  draft: ['supplier'],
  pending_buyer: ['buyer'],
  pending_commercial: ['commercial'],
  pending_finance: ['finance'],
  pending_secondary: ['scm', 'im', 'dc_income', 'nsd'],
  approved: [],
  rejected: [],
  revision_needed: ['supplier'],
};

// Which roles can edit at which stage
export const EDIT_PERMISSIONS: Record<WorkflowStatus, UserType[]> = {
  draft: ['supplier'],
  pending_buyer: ['buyer'],
  pending_commercial: ['commercial'],
  pending_finance: ['finance'],
  pending_secondary: ['scm', 'im', 'dc_income', 'nsd'],
  approved: [],
  rejected: [],
  revision_needed: ['supplier'],
};

// NPD Submission Record
export interface NPDSubmission {
  id: string;
  division: Division;
  status: WorkflowStatus;
  productNameTh: string;
  productNameEn: string;
  barcode: string;
  supplierId?: string;
  supplierName: string;
  createdBy?: string;
  createdByName?: string;
  createdAt: Date;
  updatedAt: Date;
  submittedAt?: Date;
  approvedAt?: Date;
  formData: Record<string, string | number | File | null>;
  history: WorkflowHistoryEntry[];
}

// Workflow History Entry
export interface WorkflowHistoryEntry {
  id: string;
  fromStatus: WorkflowStatus | null;
  toStatus: WorkflowStatus;
  action: string;
  performedBy: string;
  performedByRole: UserType;
  comment?: string;
  createdAt: Date;
}

// Field Permission for current user
export type FieldPermission = 'edit' | 'view' | 'hidden';

// Get field permission based on current status and user role
export function getFieldPermission(
  fieldAssignedTo: UserType[],
  currentUserRole: UserType,
  currentStatus: WorkflowStatus
): FieldPermission {
  const canEdit = EDIT_PERMISSIONS[currentStatus]?.includes(currentUserRole);
  const isFieldOwner = fieldAssignedTo.includes(currentUserRole);
  
  if (canEdit && isFieldOwner) {
    return 'edit';
  }
  
  return 'view';
}

// Check if user can take action on submission
export function canTakeAction(
  userRole: UserType,
  currentStatus: WorkflowStatus
): boolean {
  return APPROVAL_PERMISSIONS[currentStatus]?.includes(userRole) ?? false;
}

// Get next action available
export function getNextAction(
  userRole: UserType,
  currentStatus: WorkflowStatus
): { action: string; actionTh: string } | null {
  if (!canTakeAction(userRole, currentStatus)) return null;
  
  switch (currentStatus) {
    case 'draft':
      return { action: 'Submit to Buyer', actionTh: 'ส่งให้ Buyer ตรวจสอบ' };
    case 'pending_buyer':
      return { action: 'Approve & Send to Commercial', actionTh: 'อนุมัติและส่งต่อ Commercial' };
    case 'pending_commercial':
      return { action: 'Approve & Send to Finance', actionTh: 'อนุมัติและส่งต่อ Finance' };
    case 'pending_finance':
      return { action: 'Final Approval', actionTh: 'อนุมัติขั้นสุดท้าย' };
    case 'pending_secondary':
      return { action: 'Approve', actionTh: 'อนุมัติ' };
    case 'revision_needed':
      return { action: 'Resubmit', actionTh: 'ส่งใหม่' };
    default:
      return null;
  }
}
