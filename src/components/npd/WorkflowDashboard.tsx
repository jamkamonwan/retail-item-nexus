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
  Clock,
  Filter,
  ChevronDown,
  ArrowRight,
  FileText
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { toast } from 'sonner';

// Mock data for demo
const MOCK_SUBMISSIONS: NPDSubmission[] = [
  {
    id: 'NPD-2024-001',
    division: 'DF',
    status: 'pending_buyer',
    productNameTh: 'นมสดพาสเจอร์ไรส์',
    productNameEn: 'Fresh Pasteurized Milk',
    barcode: '8850000000001',
    supplierName: 'Thai Dairy Co., Ltd.',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-16'),
    submittedAt: new Date('2024-01-16'),
    formData: {},
    history: [],
  },
  {
    id: 'NPD-2024-002',
    division: 'HL',
    status: 'pending_commercial',
    productNameTh: 'เครื่องปิ้งขนมปัง',
    productNameEn: 'Electric Toaster',
    barcode: '8850000000002',
    supplierName: 'Home Appliance Ltd.',
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-14'),
    submittedAt: new Date('2024-01-12'),
    formData: {},
    history: [],
  },
  {
    id: 'NPD-2024-003',
    division: 'NF',
    status: 'pending_finance',
    productNameTh: 'แชมพูสระผม',
    productNameEn: 'Hair Shampoo',
    barcode: '8850000000003',
    supplierName: 'Beauty Care Co.',
    createdAt: new Date('2024-01-08'),
    updatedAt: new Date('2024-01-13'),
    submittedAt: new Date('2024-01-09'),
    formData: {},
    history: [],
  },
  {
    id: 'NPD-2024-004',
    division: 'SL',
    status: 'draft',
    productNameTh: 'เสื้อยืดคอกลม',
    productNameEn: 'Round Neck T-Shirt',
    barcode: '8850000000004',
    supplierName: 'Fashion Textile',
    createdAt: new Date('2024-01-17'),
    updatedAt: new Date('2024-01-17'),
    formData: {},
    history: [],
  },
  {
    id: 'NPD-2024-005',
    division: 'FF',
    status: 'approved',
    productNameTh: 'ผักสลัดผสม',
    productNameEn: 'Mixed Salad',
    barcode: '8850000000005',
    supplierName: 'Fresh Farm Co.',
    createdAt: new Date('2024-01-05'),
    updatedAt: new Date('2024-01-12'),
    submittedAt: new Date('2024-01-06'),
    approvedAt: new Date('2024-01-12'),
    formData: {},
    history: [],
  },
  {
    id: 'NPD-2024-006',
    division: 'DF',
    status: 'revision_needed',
    productNameTh: 'ไอศกรีมวานิลา',
    productNameEn: 'Vanilla Ice Cream',
    barcode: '8850000000006',
    supplierName: 'Frozen Delights',
    createdAt: new Date('2024-01-11'),
    updatedAt: new Date('2024-01-15'),
    submittedAt: new Date('2024-01-12'),
    formData: {},
    history: [],
  },
];

interface WorkflowDashboardProps {
  currentUserRole: UserType;
  onViewSubmission?: (submission: NPDSubmission) => void;
  onCreateNew?: () => void;
}

export function WorkflowDashboard({ 
  currentUserRole, 
  onViewSubmission,
  onCreateNew 
}: WorkflowDashboardProps) {
  const [submissions, setSubmissions] = useState<NPDSubmission[]>(MOCK_SUBMISSIONS);
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
        // Suppliers see only their own submissions (in demo, show drafts and revision_needed)
        return sub.status === 'draft' || sub.status === 'revision_needed' || sub.supplierName === 'Thai Dairy Co., Ltd.';
      }
      
      // Internal roles see submissions at their stage or later
      const statusOrder: WorkflowStatus[] = ['draft', 'pending_buyer', 'pending_commercial', 'pending_finance', 'approved'];
      const roleStageMap: Record<UserType, number> = {
        supplier: 0,
        buyer: 1,
        commercial: 2,
        finance: 3,
        scm: 1,
        im: 1,
        dc_income: 3,
      };
      
      const userStageIndex = roleStageMap[currentUserRole] || 0;
      const submissionStageIndex = statusOrder.indexOf(sub.status);
      
      return submissionStageIndex >= userStageIndex || sub.status === 'approved' || sub.status === 'rejected';
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

  // Handle workflow actions
  const handleApprove = (submission: NPDSubmission) => {
    const nextStatus = WORKFLOW_STATUSES[submission.status].nextStatus;
    if (!nextStatus) return;
    
    setSubmissions(prev => prev.map(sub => 
      sub.id === submission.id 
        ? { ...sub, status: nextStatus, updatedAt: new Date() }
        : sub
    ));
    
    toast.success(`${submission.productNameEn} approved and moved to ${WORKFLOW_STATUSES[nextStatus].label}`);
  };

  const handleReject = (submission: NPDSubmission) => {
    setSubmissions(prev => prev.map(sub => 
      sub.id === submission.id 
        ? { ...sub, status: 'rejected' as WorkflowStatus, updatedAt: new Date() }
        : sub
    ));
    
    toast.error(`${submission.productNameEn} has been rejected`);
  };

  const handleRequestRevision = (submission: NPDSubmission) => {
    setSubmissions(prev => prev.map(sub => 
      sub.id === submission.id 
        ? { ...sub, status: 'revision_needed' as WorkflowStatus, updatedAt: new Date() }
        : sub
    ));
    
    toast.info(`${submission.productNameEn} sent back for revision`);
  };

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
        {currentUserRole === 'supplier' && (
          <Button onClick={onCreateNew} className="bg-accent hover:bg-accent/90">
            <FileText className="w-4 h-4 mr-2" />
            New Submission
          </Button>
        )}
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
          <DropdownMenuContent>
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
                    No submissions found matching the filters
                  </TableCell>
                </TableRow>
              ) : (
                filteredSubmissions.map(submission => {
                  const canApprove = canTakeAction(currentUserRole, submission.status);
                  const nextAction = getNextAction(currentUserRole, submission.status);
                  
                  return (
                    <TableRow key={submission.id}>
                      <TableCell className="font-mono text-sm">
                        {submission.id}
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{submission.productNameTh}</p>
                          <p className="text-sm text-muted-foreground">{submission.productNameEn}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={cn('division-badge', DIVISIONS[submission.division].color)}>
                          {submission.division}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm">
                        {submission.supplierName}
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
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => onViewSubmission?.(submission)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          
                          {canApprove && nextAction && (
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="sm">
                                  <MoreVertical className="w-4 h-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem 
                                  className="text-success"
                                  onClick={() => handleApprove(submission)}
                                >
                                  <CheckCircle2 className="w-4 h-4 mr-2" />
                                  {nextAction.action}
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  className="text-warning"
                                  onClick={() => handleRequestRevision(submission)}
                                >
                                  <RotateCcw className="w-4 h-4 mr-2" />
                                  Request Revision
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem 
                                  className="text-destructive"
                                  onClick={() => handleReject(submission)}
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
        </CardContent>
      </Card>
    </div>
  );
}
