import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useSubmissions } from '@/hooks/useSubmissions';
import { usePasswordChangeCheck } from '@/hooks/usePasswordChangeCheck';
import { useTermsAcceptance } from '@/hooks/useTermsAcceptance';
import { UserType } from '@/types/npd';
import { NPDSubmission, WORKFLOW_STATUSES, WorkflowStatus } from '@/types/workflow';
import { WorkflowDashboard } from './WorkflowDashboard';
import { SubmissionView } from './SubmissionView';
import { NPDForm } from './NPDForm';
import { FieldApprovalConfigScreen } from './FieldApprovalConfigScreen';
import { TermsAcceptancePage } from './TermsAcceptancePage';
import { ChangePasswordDialog } from '@/components/auth';
import { BigCHeader } from '@/components/layout/BigCHeader';
import { SupplierDashboard, SupplierAdminDashboard, ApproverDashboard, AdminDashboard } from './dashboards';
import { UserManagement, TierManagement, SupplierGroupManagement } from '@/components/admin';
import { AuditLogViewer } from '@/components/admin/AuditLogViewer';
import { TermsManagement } from '@/components/admin/TermsManagement';
import { TermsAcceptanceReport } from '@/components/admin/TermsAcceptanceReport';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LayoutDashboard, FileText, Settings2, ListChecks, Users, Layers, FolderTree, UserCog, ScrollText, FileCheck, ClipboardList } from 'lucide-react';
import { toast } from 'sonner';

type View = 'dashboard' | 'form' | 'submission' | 'config' | 'all-items' | 'users' | 'tiers' | 'supplier-groups' | 'staff' | 'audit-logs' | 'terms' | 'terms-report';

// Map roles to their pending status for approver dashboard
const ROLE_PENDING_STATUS: Partial<Record<UserType, WorkflowStatus>> = {
  buyer: 'pending_buyer',
  commercial: 'pending_commercial',
  finance: 'pending_finance',
};

export function AuthenticatedWorkflowApp() {
  const { role, user } = useAuth();
  const { submissions, loading, updateStatus, refetch } = useSubmissions();
  const { mustChangePassword, loading: passwordCheckLoading, clearPasswordChangeFlag } = usePasswordChangeCheck(user);
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [selectedSubmission, setSelectedSubmission] = useState<NPDSubmission | null>(null);
  const [editingSubmission, setEditingSubmission] = useState<NPDSubmission | null>(null);
  
  const [demoRole, setDemoRole] = useState<UserType>(role || 'buyer');

  // Terms acceptance check for supplier roles
  const isSupplierRole = demoRole === 'supplier' || demoRole === 'supplier_admin';
  const { hasAccepted, publishedTerms, loading: termsLoading, acceptTerms, rejectTerms } = useTermsAcceptance(
    isSupplierRole ? user?.id : undefined,
    user?.email,
    user?.user_metadata?.full_name || user?.email
  );

  const handleRoleChange = (newRole: UserType) => {
    setDemoRole(newRole);
    setCurrentView(newRole === 'supplier_admin' ? 'staff' : 'dashboard');
  };

  const activeRole = demoRole;

  const handleViewSubmission = (submission: NPDSubmission) => {
    setSelectedSubmission(submission);
    setCurrentView('submission');
  };

  const handleCreateNew = () => {
    setEditingSubmission(null);
    setCurrentView('form');
  };

  const handleEditDraft = (submission: NPDSubmission) => {
    setEditingSubmission(submission);
    setCurrentView('form');
  };

  const handleBackToList = () => {
    setSelectedSubmission(null);
    setEditingSubmission(null);
    setCurrentView('dashboard');
    refetch();
  };

  const handleNavigateToConfig = () => setCurrentView('config');
  const handleNavigateToUsers = () => setCurrentView('users');
  const handleNavigateToTiers = () => setCurrentView('tiers');
  const handleNavigateToAuditLogs = () => setCurrentView('audit-logs');

  const handleApprove = async (submission: NPDSubmission) => {
    const nextStatus = WORKFLOW_STATUSES[submission.status].nextStatus;
    if (nextStatus) {
      const success = await updateStatus(submission.id, nextStatus, 'approve', activeRole);
      if (success) {
        toast.success(`${submission.productNameEn} approved!`);
        if (selectedSubmission?.id === submission.id) handleBackToList();
      }
    }
  };

  const handleReject = async (submission: NPDSubmission) => {
    const success = await updateStatus(submission.id, 'rejected' as WorkflowStatus, 'reject', activeRole);
    if (success) {
      toast.error(`${submission.productNameEn} rejected`);
      if (selectedSubmission?.id === submission.id) handleBackToList();
    }
  };

  const handleRequestRevision = async (submission: NPDSubmission) => {
    const success = await updateStatus(submission.id, 'revision_needed' as WorkflowStatus, 'request_revision', activeRole);
    if (success) {
      toast.info(`${submission.productNameEn} sent back for revision`);
      if (selectedSubmission?.id === submission.id) handleBackToList();
    }
  };

  // Terms gate for supplier roles
  if (isSupplierRole && !termsLoading && hasAccepted === false && publishedTerms) {
    return (
      <div className="min-h-screen bg-background">
        <BigCHeader demoRole={demoRole} onRoleChange={handleRoleChange} />
        <TermsAcceptancePage
          terms={publishedTerms}
          onAccept={acceptTerms}
          onReject={rejectTerms}
        />
      </div>
    );
  }

  const getNavigationTabs = () => {
    switch (activeRole) {
      case 'supplier':
        return (
          <>
            <TabsTrigger value="dashboard" className="gap-2">
              <LayoutDashboard className="w-4 h-4" />
              My Submissions
            </TabsTrigger>
            <TabsTrigger value="form" className="gap-2">
              <FileText className="w-4 h-4" />
              New Entry
            </TabsTrigger>
          </>
        );
      case 'supplier_admin':
        return (
          <>
            <TabsTrigger value="staff" className="gap-2">
              <UserCog className="w-4 h-4" />
              My Staff
            </TabsTrigger>
          </>
        );
      case 'admin':
        return (
          <>
            <TabsTrigger value="dashboard" className="gap-2">
              <LayoutDashboard className="w-4 h-4" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="all-items" className="gap-2">
              <ListChecks className="w-4 h-4" />
              All Items
            </TabsTrigger>
            <TabsTrigger value="users" className="gap-2">
              <Users className="w-4 h-4" />
              Users
            </TabsTrigger>
            <TabsTrigger value="tiers" className="gap-2">
              <Layers className="w-4 h-4" />
              Tiers
            </TabsTrigger>
            <TabsTrigger value="supplier-groups" className="gap-2">
              <FolderTree className="w-4 h-4" />
              Supplier Partners
            </TabsTrigger>
            <TabsTrigger value="terms" className="gap-2">
              <FileCheck className="w-4 h-4" />
              Terms
            </TabsTrigger>
            <TabsTrigger value="terms-report" className="gap-2">
              <ClipboardList className="w-4 h-4" />
              Acceptance
            </TabsTrigger>
            <TabsTrigger value="config" className="gap-2">
              <Settings2 className="w-4 h-4" />
              Config
            </TabsTrigger>
            <TabsTrigger value="audit-logs" className="gap-2">
              <ScrollText className="w-4 h-4" />
              Audit Logs
            </TabsTrigger>
          </>
        );
      default:
        return (
          <>
            <TabsTrigger value="dashboard" className="gap-2">
              <LayoutDashboard className="w-4 h-4" />
              Review Queue
            </TabsTrigger>
            <TabsTrigger value="all-items" className="gap-2">
              <ListChecks className="w-4 h-4" />
              All Items
            </TabsTrigger>
          </>
        );
    }
  };

  const renderDashboard = () => {
    switch (activeRole) {
      case 'supplier':
      case 'supplier_admin':
        return (
          <SupplierDashboard
            submissions={submissions}
            loading={loading}
            userId={user?.id}
            onCreateNew={handleCreateNew}
            onEditDraft={handleEditDraft}
            onViewSubmission={handleViewSubmission}
          />
        );
      case 'admin':
        return (
          <AdminDashboard
            submissions={submissions}
            loading={loading}
            onViewSubmission={handleViewSubmission}
            onNavigateToConfig={handleNavigateToConfig}
            onNavigateToUsers={handleNavigateToUsers}
            onNavigateToTiers={handleNavigateToTiers}
            onNavigateToAuditLogs={handleNavigateToAuditLogs}
          />
        );
      default:
        const pendingStatus = ROLE_PENDING_STATUS[activeRole] || 'pending_finance';
        return (
          <ApproverDashboard
            role={activeRole}
            pendingStatus={pendingStatus}
            submissions={submissions}
            loading={loading}
            onViewSubmission={handleViewSubmission}
            onApprove={handleApprove}
            onReject={handleReject}
            onRequestRevision={handleRequestRevision}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <ChangePasswordDialog 
        open={mustChangePassword && !passwordCheckLoading} 
        onPasswordChanged={clearPasswordChangeFlag} 
      />
      
      <BigCHeader demoRole={demoRole} onRoleChange={handleRoleChange} />

      <div className="bg-card border-b border-border sticky top-[104px] z-40">
        <div className="container max-w-7xl mx-auto px-4">
          <Tabs 
            value={currentView === 'submission' ? 'dashboard' : currentView} 
            onValueChange={(v) => setCurrentView(v as View)}
          >
            <TabsList className="bg-transparent border-0 h-12">
              {getNavigationTabs()}
            </TabsList>
          </Tabs>
        </div>
      </div>

      <main className="container max-w-7xl mx-auto px-4 py-6">
        {currentView === 'dashboard' && renderDashboard()}

        {currentView === 'all-items' && (
          <WorkflowDashboard
            currentUserRole={activeRole}
            submissions={submissions}
            loading={loading}
            onViewSubmission={handleViewSubmission}
            onCreateNew={handleCreateNew}
            onEditDraft={handleEditDraft}
            onApprove={handleApprove}
            onReject={handleReject}
            onRequestRevision={handleRequestRevision}
          />
        )}

        {currentView === 'form' && (
          <NPDForm 
            userRole={activeRole} 
            editingSubmission={editingSubmission}
            onSubmitSuccess={handleBackToList} 
            onCancel={handleBackToList} 
          />
        )}

        {currentView === 'config' && <FieldApprovalConfigScreen />}
        {currentView === 'users' && <UserManagement onBack={handleBackToList} />}
        {currentView === 'tiers' && <TierManagement onBack={handleBackToList} />}
        {currentView === 'supplier-groups' && <SupplierGroupManagement onBack={handleBackToList} />}
        {currentView === 'audit-logs' && <AuditLogViewer onBack={handleBackToList} />}
        {currentView === 'terms' && <TermsManagement onBack={handleBackToList} />}
        {currentView === 'terms-report' && <TermsAcceptanceReport onBack={handleBackToList} />}

        {currentView === 'staff' && (
          <SupplierAdminDashboard userId={user?.id} supplierGroupId="group-001" />
        )}

        {currentView === 'submission' && selectedSubmission && (
          <SubmissionView
            submission={selectedSubmission}
            currentUserRole={activeRole}
            onBack={handleBackToList}
            onApprove={() => handleApprove(selectedSubmission)}
            onReject={() => handleReject(selectedSubmission)}
            onRequestRevision={() => handleRequestRevision(selectedSubmission)}
          />
        )}
      </main>
    </div>
  );
}
