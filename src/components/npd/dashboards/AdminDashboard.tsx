import { NPDSubmission, WORKFLOW_STATUSES, WorkflowStatus } from '@/types/workflow';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  Eye, 
  Settings2, 
  Users, 
  BarChart3, 
  FileText,
  CheckCircle,
  Clock,
  XCircle,
  AlertTriangle
} from 'lucide-react';
import { DIVISIONS } from '@/types/npd';
import { format } from 'date-fns';

interface AdminDashboardProps {
  submissions: NPDSubmission[];
  loading: boolean;
  onViewSubmission: (submission: NPDSubmission) => void;
  onNavigateToConfig: () => void;
  onNavigateToUsers: () => void;
}

export function AdminDashboard({
  submissions,
  loading,
  onViewSubmission,
  onNavigateToConfig,
  onNavigateToUsers,
}: AdminDashboardProps) {
  // Calculate status counts
  const statusCounts = submissions.reduce((acc, s) => {
    acc[s.status] = (acc[s.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const totalSubmissions = submissions.length;
  const drafts = statusCounts['draft'] || 0;
  const inProgress = (statusCounts['pending_buyer'] || 0) + 
                     (statusCounts['pending_commercial'] || 0) + 
                     (statusCounts['pending_finance'] || 0) +
                     (statusCounts['pending_secondary'] || 0);
  const approved = statusCounts['approved'] || 0;
  const rejected = statusCounts['rejected'] || 0;
  const revisionNeeded = statusCounts['revision_needed'] || 0;

  const getStatusBadge = (status: string) => {
    const statusConfig = WORKFLOW_STATUSES[status as keyof typeof WORKFLOW_STATUSES];
    if (!statusConfig) return <Badge variant="outline">{status}</Badge>;
    
    return (
      <Badge className={statusConfig.color}>
        {statusConfig.label}
      </Badge>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Admin Dashboard</h2>
          <p className="text-muted-foreground">System overview and configuration</p>
        </div>
        <Button onClick={onNavigateToConfig} variant="outline" className="gap-2">
          <Settings2 className="w-4 h-4" />
          Field Approval Config
        </Button>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Total
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{totalSubmissions}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Drafts
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-muted-foreground">{drafts}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              In Progress
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{inProgress}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              Revisions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{revisionNeeded}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              Approved
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{approved}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <XCircle className="w-4 h-4" />
              Rejected
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{rejected}</div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="hover:bg-accent/50 cursor-pointer transition-colors" onClick={onNavigateToConfig}>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Settings2 className="w-5 h-5 text-primary" />
              Field Approval Configuration
            </CardTitle>
            <CardDescription>
              Configure which roles can approve specific fields
            </CardDescription>
          </CardHeader>
        </Card>
        
        <Card className="hover:bg-accent/50 cursor-pointer transition-colors" onClick={onNavigateToUsers}>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              User Management
            </CardTitle>
            <CardDescription>
              Manage users and role assignments
            </CardDescription>
          </CardHeader>
        </Card>
        
        <Card className="opacity-60">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-muted-foreground" />
              Analytics
              <Badge variant="outline" className="ml-auto">Coming Soon</Badge>
            </CardTitle>
            <CardDescription>
              View submission and approval analytics
            </CardDescription>
          </CardHeader>
        </Card>
      </div>

      {/* Status Breakdown by Stage */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Workflow Stage Breakdown</CardTitle>
          <CardDescription>Current distribution of items across workflow stages</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(WORKFLOW_STATUSES).map(([status, config]) => {
              const count = statusCounts[status] || 0;
              return (
                <div key={status} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-2">
                    <Badge className={config.color}>{config.label}</Badge>
                  </div>
                  <span className="font-bold text-foreground">{count}</span>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Recent Submissions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Recent Submissions</CardTitle>
          <CardDescription>Latest 10 submissions in the system</CardDescription>
        </CardHeader>
        <CardContent>
          {submissions.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>No submissions in the system yet.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product Name</TableHead>
                  <TableHead>Division</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Last Updated</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {submissions.slice(0, 10).map((submission) => (
                  <TableRow key={submission.id}>
                    <TableCell className="font-medium">
                      {submission.productNameEn || 'Untitled'}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={DIVISIONS[submission.division]?.color}>
                        {submission.division}
                      </Badge>
                    </TableCell>
                    <TableCell>{getStatusBadge(submission.status)}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {format(submission.createdAt, 'MMM d, yyyy')}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {format(submission.updatedAt, 'MMM d, yyyy')}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onViewSubmission(submission)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
