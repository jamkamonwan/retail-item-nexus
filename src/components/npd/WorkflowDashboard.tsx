import { useState, useMemo } from 'react';
import { 
  NPDSubmission, 
  WorkflowStatus, 
  WORKFLOW_STATUSES, 
  getNextAction,
  canTakeAction 
} from '@/types/workflow';
import { Division, DIVISIONS, UserType, USER_TYPES } from '@/types/npd';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  Eye, 
  MoreVertical, 
  CheckCircle2, 
  XCircle, 
  RotateCcw, 
  Filter,
  ChevronDown,
  ArrowRight,
  FileText,
  Loader2,
  Pencil
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

interface WorkflowDashboardProps {
  currentUserRole: UserType;
  submissions: NPDSubmission[];
  loading?: boolean;
  onViewSubmission?: (submission: NPDSubmission) => void;
  onCreateNew?: () => void;
  onEditDraft?: (submission: NPDSubmission) => void;
  onApprove?: (submission: NPDSubmission) => void;
  onReject?: (submission: NPDSubmission) => void;
  onRequestRevision?: (submission: NPDSubmission) => void;
}

export function WorkflowDashboard({ 
  currentUserRole, 
  submissions,
  loading = false,
  onViewSubmission,
  onCreateNew,
  onEditDraft,
  onApprove,
  onReject,
  onRequestRevision,
}: WorkflowDashboardProps) {
  const [statusFilter, setStatusFilter] = useState<WorkflowStatus | 'all'>('all');
  const [divisionFilter, setDivisionFilter] = useState<Division | 'all'>('all');

  // Filter submissions based on current user role and filters
  const filteredSubmissions = useMemo(() => {
    return submissions.filter(sub => {
      // Apply status filter
      if (statusFilter !== 'all' && sub.status !== statusFilter) return false;
      // Apply division filter
      if (divisionFilter !== 'all' && sub.division !== divisionFilter) return false;
      
      // Role-based visibility
      if (currentUserRole === 'supplier') {
        // Suppliers see only their own submissions
        return sub.status === 'draft' || sub.status === 'revision_needed' || true; // In demo, show all
      }
      
      // Internal roles see all submissions
      return true;
    });
  }, [submissions, statusFilter, divisionFilter, currentUserRole]);

  // Count by status
  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    submissions.forEach(sub => {
      counts[sub.status] = (counts[sub.status] || 0) + 1;
    });
    return counts;
  }, [submissions]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">NPD Workflow</h1>
          <p className="text-muted-foreground">
            Track and manage new product submissions
          </p>
        </div>
        <Button onClick={onCreateNew} className="bg-accent hover:bg-accent/90">
          <FileText className="w-4 h-4 mr-2" />
          New Submission
        </Button>
      </div>

      {/* Status Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
        {(['draft', 'pending_buyer', 'pending_commercial', 'pending_finance', 'approved', 'rejected'] as WorkflowStatus[]).map(status => (
          <Card 
            key={status}
            className={cn(
              'cursor-pointer transition-all hover:shadow-md',
              statusFilter === status && 'ring-2 ring-primary'
            )}
            onClick={() => setStatusFilter(statusFilter === status ? 'all' : status)}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <Badge className={cn('text-xs', WORKFLOW_STATUSES[status].color)}>
                  {WORKFLOW_STATUSES[status].label}
                </Badge>
                <span className="text-2xl font-bold text-foreground">
                  {statusCounts[status] || 0}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Workflow Diagram */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Workflow Flow</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between overflow-x-auto pb-2">
            {(['draft', 'pending_buyer', 'pending_commercial', 'pending_finance', 'approved'] as WorkflowStatus[]).map((status, index, arr) => (
              <div key={status} className="flex items-center">
                <div className={cn(
                  'flex flex-col items-center px-4 py-2 rounded-lg min-w-[120px]',
                  WORKFLOW_STATUSES[status].color
                )}>
                  <span className="text-xs font-medium text-center">
                    {status === 'draft' ? 'Supplier' : 
                     status === 'pending_buyer' ? 'Buyer' :
                     status === 'pending_commercial' ? 'Commercial' :
                     status === 'pending_finance' ? 'Finance' : 'Complete'}
                  </span>
                  <span className="text-[10px] opacity-75 text-center mt-1">
                    {WORKFLOW_STATUSES[status].labelTh}
                  </span>
                </div>
                {index < arr.length - 1 && (
                  <ArrowRight className="w-5 h-5 mx-2 text-muted-foreground shrink-0" />
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <div className="flex items-center gap-3">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              Division: {divisionFilter === 'all' ? 'All' : DIVISIONS[divisionFilter].label}
              <ChevronDown className="w-4 h-4 ml-2" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-popover border-border">
            <DropdownMenuItem onClick={() => setDivisionFilter('all')}>
              All Divisions
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            {(Object.keys(DIVISIONS) as Division[]).map(div => (
              <DropdownMenuItem key={div} onClick={() => setDivisionFilter(div)}>
                {DIVISIONS[div].label} - {DIVISIONS[div].fullName}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {(statusFilter !== 'all' || divisionFilter !== 'all') && (
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => {
              setStatusFilter('all');
              setDivisionFilter('all');
            }}
          >
            Clear Filters
          </Button>
        )}
      </div>

      {/* Submissions Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            Submissions ({filteredSubmissions.length})
          </CardTitle>
          <CardDescription>
            Viewing as: <span className="font-semibold">{USER_TYPES[currentUserRole].label}</span>
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[120px]">ID</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Division</TableHead>
                  <TableHead>Supplier</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Updated</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSubmissions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      No submissions found. Click "New Submission" to create one.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredSubmissions.map(submission => {
                    const canApproveAction = canTakeAction(currentUserRole, submission.status);
                    const nextAction = getNextAction(currentUserRole, submission.status);
                    
                    return (
                      <TableRow key={submission.id}>
                        <TableCell className="font-mono text-sm">
                          {submission.id.slice(0, 8)}...
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{submission.productNameTh || submission.productNameEn}</p>
                            <p className="text-sm text-muted-foreground">{submission.productNameEn}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={cn('division-badge', DIVISIONS[submission.division]?.color)}>
                            {submission.division}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm">
                          {submission.supplierName || '-'}
                        </TableCell>
                        <TableCell>
                          <Badge className={cn(WORKFLOW_STATUSES[submission.status].color)}>
                            {WORKFLOW_STATUSES[submission.status].label}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {format(submission.updatedAt, 'dd MMM yyyy')}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            {/* Edit button for drafts and revision_needed (supplier only) */}
                            {(submission.status === 'draft' || submission.status === 'revision_needed') && 
                             currentUserRole === 'supplier' && (
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => onEditDraft?.(submission)}
                              >
                                <Pencil className="w-4 h-4 mr-1" />
                                Edit
                              </Button>
                            )}
                            
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => onViewSubmission?.(submission)}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            
                            {canApproveAction && nextAction && (
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="outline" size="sm">
                                    <MoreVertical className="w-4 h-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="bg-popover border-border">
                                  <DropdownMenuItem 
                                    className="text-success"
                                    onClick={() => onApprove?.(submission)}
                                  >
                                    <CheckCircle2 className="w-4 h-4 mr-2" />
                                    {nextAction.action}
                                  </DropdownMenuItem>
                                  <DropdownMenuItem 
                                    className="text-warning"
                                    onClick={() => onRequestRevision?.(submission)}
                                  >
                                    <RotateCcw className="w-4 h-4 mr-2" />
                                    Request Revision
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem 
                                    className="text-destructive"
                                    onClick={() => onReject?.(submission)}
                                  >
                                    <XCircle className="w-4 h-4 mr-2" />
                                    Reject
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
