import { NPDSubmission } from '@/types/workflow';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, FileEdit, Eye, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { DIVISIONS } from '@/types/npd';
import { WORKFLOW_STATUSES } from '@/types/workflow';
import { format } from 'date-fns';

interface SupplierDashboardProps {
  submissions: NPDSubmission[];
  loading: boolean;
  userId: string | undefined;
  onCreateNew: () => void;
  onEditDraft: (submission: NPDSubmission) => void;
  onViewSubmission: (submission: NPDSubmission) => void;
}

export function SupplierDashboard({
  submissions,
  loading,
  userId,
  onCreateNew,
  onEditDraft,
  onViewSubmission,
}: SupplierDashboardProps) {
  // Filter to only user's own submissions
  const mySubmissions = submissions.filter(s => s.formData?.created_by === userId || true); // TODO: proper filtering when created_by is tracked
  
  const drafts = mySubmissions.filter(s => s.status === 'draft' || s.status === 'revision_needed');
  const pending = mySubmissions.filter(s => 
    ['pending_buyer', 'pending_commercial', 'pending_finance', 'pending_secondary'].includes(s.status)
  );
  const approved = mySubmissions.filter(s => s.status === 'approved');
  const rejected = mySubmissions.filter(s => s.status === 'rejected');

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
      {/* Welcome & Quick Action */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Supplier Dashboard</h2>
          <p className="text-muted-foreground">Manage your product submissions</p>
        </div>
        <Button onClick={onCreateNew} size="lg" className="gap-2">
          <Plus className="w-5 h-5" />
          Create New Submission
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <FileEdit className="w-4 h-4" />
              Drafts & Revisions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{drafts.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Pending Review
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{pending.length}</div>
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
            <div className="text-3xl font-bold text-green-600">{approved.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              Rejected
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-destructive">{rejected.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Drafts Section */}
      {drafts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">My Drafts & Revisions Needed</CardTitle>
            <CardDescription>Items that need your attention</CardDescription>
          </CardHeader>
          <CardContent>
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
                {drafts.map((submission) => (
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
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onEditDraft(submission)}
                          className="gap-1"
                        >
                          <FileEdit className="w-4 h-4" />
                          Edit
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* All Submissions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">All My Submissions</CardTitle>
          <CardDescription>Track the status of all your submissions</CardDescription>
        </CardHeader>
        <CardContent>
          {mySubmissions.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>You haven't created any submissions yet.</p>
              <Button onClick={onCreateNew} variant="link" className="mt-2">
                Create your first submission
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product Name</TableHead>
                  <TableHead>Division</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mySubmissions.map((submission) => (
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
