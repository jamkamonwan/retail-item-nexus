import { NPDSubmission, WORKFLOW_STATUSES, WorkflowStatus } from '@/types/workflow';
import { UserType, DIVISIONS, USER_TYPES } from '@/types/npd';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Eye, CheckCircle, XCircle, RotateCcw, Clock, AlertTriangle } from 'lucide-react';
import { format } from 'date-fns';

interface ApproverDashboardProps {
  role: UserType;
  pendingStatus: WorkflowStatus;
  submissions: NPDSubmission[];
  loading: boolean;
  onViewSubmission: (submission: NPDSubmission) => void;
  onApprove: (submission: NPDSubmission) => void;
  onReject: (submission: NPDSubmission) => void;
  onRequestRevision: (submission: NPDSubmission) => void;
}

export function ApproverDashboard({
  role,
  pendingStatus,
  submissions,
  loading,
  onViewSubmission,
  onApprove,
  onReject,
  onRequestRevision,
}: ApproverDashboardProps) {
  const roleLabel = USER_TYPES[role]?.label || role;
  
  // Items pending this role's review
  const pendingReview = submissions.filter(s => s.status === pendingStatus);
  
  // All other items for visibility
  const otherItems = submissions.filter(s => s.status !== pendingStatus);
  
  // Count by status for overview
  const statusCounts = submissions.reduce((acc, s) => {
    acc[s.status] = (acc[s.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

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
      <div>
        <h2 className="text-2xl font-bold text-foreground">{roleLabel} Dashboard</h2>
        <p className="text-muted-foreground">Review and approve product submissions</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-primary bg-primary/5">
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2 text-primary">
              <AlertTriangle className="w-4 h-4" />
              Awaiting Your Review
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">{pendingReview.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Total In Progress
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">
              {(statusCounts['pending_buyer'] || 0) + 
               (statusCounts['pending_commercial'] || 0) + 
               (statusCounts['pending_finance'] || 0) +
               (statusCounts['pending_secondary'] || 0)}
            </div>
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
            <div className="text-3xl font-bold text-green-600">{statusCounts['approved'] || 0}</div>
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
            <div className="text-3xl font-bold text-destructive">{statusCounts['rejected'] || 0}</div>
          </CardContent>
        </Card>
      </div>

      {/* Pending Review Queue */}
      <Card className="border-primary/50">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-primary" />
            Awaiting Your Review
            {pendingReview.length > 0 && (
              <Badge variant="destructive" className="ml-2">{pendingReview.length}</Badge>
            )}
          </CardTitle>
          <CardDescription>Items that need your approval decision</CardDescription>
        </CardHeader>
        <CardContent>
          {pendingReview.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <CheckCircle className="w-12 h-12 mx-auto mb-4 text-green-500" />
              <p>No items pending your review!</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product Name</TableHead>
                  <TableHead>Division</TableHead>
                  <TableHead>Supplier</TableHead>
                  <TableHead>Submitted</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pendingReview.map((submission) => (
                  <TableRow key={submission.id}>
                    <TableCell className="font-medium">
                      {submission.productNameEn || 'Untitled'}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={DIVISIONS[submission.division]?.color}>
                        {submission.division}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {submission.supplierName || '-'}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {submission.submittedAt 
                        ? format(submission.submittedAt, 'MMM d, yyyy')
                        : format(submission.createdAt, 'MMM d, yyyy')}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onViewSubmission(submission)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="default"
                          size="sm"
                          onClick={() => onApprove(submission)}
                          className="gap-1"
                        >
                          <CheckCircle className="w-4 h-4" />
                          Approve
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onRequestRevision(submission)}
                          className="gap-1"
                        >
                          <RotateCcw className="w-4 h-4" />
                          Revise
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => onReject(submission)}
                          className="gap-1"
                        >
                          <XCircle className="w-4 h-4" />
                          Reject
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* All Items */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">All Submissions</CardTitle>
          <CardDescription>View all items in the system</CardDescription>
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
                  <TableHead>Last Updated</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {submissions.map((submission) => (
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
