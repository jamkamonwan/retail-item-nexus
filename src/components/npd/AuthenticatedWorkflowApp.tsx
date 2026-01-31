import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { UserType } from '@/types/npd';
import { NPDSubmission, WORKFLOW_STATUSES } from '@/types/workflow';
import { WorkflowDashboard } from './WorkflowDashboard';
import { SubmissionView } from './SubmissionView';
import { NPDForm } from './NPDForm';
import { UserMenu } from '@/components/auth/UserMenu';
import { RoleSimulator } from './RoleSimulator';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { LayoutDashboard, FileText } from 'lucide-react';
import { toast } from 'sonner';

type View = 'dashboard' | 'form' | 'submission';

export function AuthenticatedWorkflowApp() {
  const { role } = useAuth();
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [selectedSubmission, setSelectedSubmission] = useState<NPDSubmission | null>(null);
  
  // Allow role switching for demo purposes - default to authenticated role or 'buyer'
  const [demoRole, setDemoRole] = useState<UserType>(role || 'buyer');

  const handleViewSubmission = (submission: NPDSubmission) => {
    setSelectedSubmission(submission);
    setCurrentView('submission');
  };

  const handleCreateNew = () => {
    setCurrentView('form');
  };

  const handleBackToList = () => {
    setSelectedSubmission(null);
    setCurrentView('dashboard');
  };

  const handleApprove = () => {
    if (selectedSubmission) {
      const nextStatus = WORKFLOW_STATUSES[selectedSubmission.status].nextStatus;
      if (nextStatus) {
        toast.success(`${selectedSubmission.productNameEn} approved!`);
        handleBackToList();
      }
    }
  };

  const handleReject = () => {
    if (selectedSubmission) {
      toast.error(`${selectedSubmission.productNameEn} rejected`);
      handleBackToList();
    }
  };

  const handleRequestRevision = () => {
    if (selectedSubmission) {
      toast.info(`${selectedSubmission.productNameEn} sent back for revision`);
      handleBackToList();
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Top Navigation */}
      <header className="sticky top-0 z-50 bg-card border-b border-border">
        <div className="container max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-xl font-bold text-foreground">NPD System</h1>
              <div className="h-6 w-px bg-border" />
              <Tabs 
                value={currentView === 'submission' ? 'dashboard' : currentView} 
                onValueChange={(v) => setCurrentView(v as View)}
              >
                <TabsList>
                  <TabsTrigger value="dashboard" className="gap-2">
                    <LayoutDashboard className="w-4 h-4" />
                    Workflow
                  </TabsTrigger>
                  <TabsTrigger value="form" className="gap-2">
                    <FileText className="w-4 h-4" />
                    New Entry
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            <div className="flex items-center gap-3">
              {/* Demo Role Switcher */}
              <Card className="py-2 px-3 bg-card border-border">
                <div className="flex items-center gap-3">
                  <span className="text-xs text-muted-foreground">Demo Role:</span>
                  <RoleSimulator 
                    selectedRole={demoRole} 
                    onRoleChange={setDemoRole}
                  />
                </div>
              </Card>
              
              <UserMenu />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container max-w-7xl mx-auto px-4 py-6">
        {currentView === 'dashboard' && (
          <WorkflowDashboard
            currentUserRole={demoRole}
            onViewSubmission={handleViewSubmission}
            onCreateNew={handleCreateNew}
          />
        )}

        {currentView === 'form' && (
          <NPDForm />
        )}

        {currentView === 'submission' && selectedSubmission && (
          <SubmissionView
            submission={selectedSubmission}
            currentUserRole={demoRole}
            onBack={handleBackToList}
            onApprove={handleApprove}
            onReject={handleReject}
            onRequestRevision={handleRequestRevision}
          />
        )}
      </main>
    </div>
  );
}