import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useSubmissions } from '@/hooks/useSubmissions';
import { usePasswordChangeCheck } from '@/hooks/usePasswordChangeCheck';
import { UserType } from '@/types/npd';
import { NPDSubmission, WORKFLOW_STATUSES, WorkflowStatus } from '@/types/workflow';
import { WorkflowDashboard } from './WorkflowDashboard';
import { SubmissionView } from './SubmissionView';
import { NPDForm } from './NPDForm';
import { FieldApprovalConfigScreen } from './FieldApprovalConfigScreen';
import { ChangePasswordDialog } from '@/components/auth';
import { BigCHeader } from '@/components/layout/BigCHeader';
import { SupplierDashboard, ApproverDashboard, AdminDashboard } from './dashboards';
import { UserManagement } from '@/components/admin';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LayoutDashboard, FileText, Settings2, ListChecks, Users } from 'lucide-react';
import { toast } from 'sonner';

type View = 'dashboard' | 'form' | 'submission' | 'config' | 'all-items' | 'users';

// Map roles to their pending status for approver dashboard
const ROLE_PENDING_STATUS: Partial<Record<UserType, WorkflowStatus>> = {
  buyer: 'pending_buyer',
  commercial: 'pending_commercial',
  finance: 'pending_finance',
  // scm and im could be added when their workflow stages are implemented
};

export function AuthenticatedWorkflowApp() {
  const { role, user } = useAuth();
  const { submissions, loading, updateStatus, refetch } = useSubmissions();
  const { mustChangePassword, loading: passwordCheckLoading, clearPasswordChangeFlag } = usePasswordChangeCheck(user);
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [selectedSubmission, setSelectedSubmission] = useState<NPDSubmission | null>(null);
  const [editingSubmission, setEditingSubmission] = useState<NPDSubmission | null>(null);
  
  // Allow role switching for demo purposes - default to authenticated role or 'buyer'
  const [demoRole, setDemoRole] = useState<UserType>(role || 'buyer');

  // Use demoRole for determining which dashboard to show
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
    refetch(); // Refresh after returning from form/submission
  };

  const handleNavigateToConfig = () => {
    setCurrentView('config');
  };

  const handleNavigateToUsers = () => {
    setCurrentView('users');
  };

  const handleApprove = async (submission: NPDSubmission) => {
    const nextStatus = WORKFLOW_STATUSES[submission.status].nextStatus;
    if (nextStatus) {
      const success = await updateStatus(
        submission.id,
        nextStatus,
        'approve',
        activeRole
      );
      if (success) {
        toast.success(`${submission.productNameEn} approved!`);
        if (selectedSubmission?.id === submission.id) {
          handleBackToList();
        }
      }
    }
  };

  const handleReject = async (submission: NPDSubmission) => {
    const success = await updateStatus(
      submission.id,
      'rejected' as WorkflowStatus,
      'reject',
      activeRole
    );
    if (success) {
      toast.error(`${submission.productNameEn} rejected`);
      if (selectedSubmission?.id === submission.id) {
        handleBackToList();
      }
    }
  };

  const handleRequestRevision = async (submission: NPDSubmission) => {
    const success = await updateStatus(
      submission.id,
      'revision_needed' as WorkflowStatus,
      'request_revision',
      activeRole
    );
    if (success) {
      toast.info(`${submission.productNameEn} sent back for revision`);
      if (selectedSubmission?.id === submission.id) {
        handleBackToList();
      }
    }
  };

  // Determine which tabs to show based on role
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
            <TabsTrigger value="config" className="gap-2">
              <Settings2 className="w-4 h-4" />
              Config
            </TabsTrigger>
          </>
        );
      default:
        // Approver roles (buyer, commercial, finance, scm, im, dc_income)
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

  // Render the appropriate dashboard based on role
  const renderDashboard = () => {
    switch (activeRole) {
      case 'supplier':
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
          />
        );
      case 'buyer':
      case 'commercial':
      case 'finance':
      case 'scm':
      case 'im':
      case 'dc_income':
        // For roles without specific pending status, default to pending_finance
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
      {/* Force password change dialog for admin-created users */}
      <ChangePasswordDialog 
        open={mustChangePassword && !passwordCheckLoading} 
        onPasswordChanged={clearPasswordChangeFlag} 
      />
      
      {/* Big C Branded Header */}
      <BigCHeader demoRole={demoRole} onRoleChange={setDemoRole} />

      {/* Navigation Tabs - Below header */}
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

      {/* Main Content */}
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

        {currentView === 'config' && (
          <FieldApprovalConfigScreen />
        )}

        {currentView === 'users' && (
          <UserManagement onBack={handleBackToList} />
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
