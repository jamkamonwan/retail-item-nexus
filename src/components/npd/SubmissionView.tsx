import { useMemo } from 'react';
import { NPDSubmission, WORKFLOW_STATUSES, getFieldPermission, getNextAction, canTakeAction } from '@/types/workflow';
import { UserType, Division, DIVISIONS, FormSection, FORM_SECTIONS } from '@/types/npd';
import { getFieldsForContext } from '@/data/npd-fields';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ArrowLeft, 
  CheckCircle2, 
  XCircle, 
  RotateCcw, 
  Clock,
  User,
  Lock,
  Edit3,
  Eye
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { toast } from 'sonner';

interface SubmissionViewProps {
  submission: NPDSubmission;
  currentUserRole: UserType;
  onBack: () => void;
  onApprove: () => void;
  onReject: () => void;
  onRequestRevision: () => void;
}

const FORM_STEPS: FormSection[] = [
  'basic_info',
  'product_images',
  'specifications',
  'dimensions',
  'pricing',
  'compliance',
  'logistics',
];

export function SubmissionView({
  submission,
  currentUserRole,
  onBack,
  onApprove,
  onReject,
  onRequestRevision,
}: SubmissionViewProps) {
  const canApprove = canTakeAction(currentUserRole, submission.status);
  const nextAction = getNextAction(currentUserRole, submission.status);
  
  // Get all fields for this submission's division
  const allFields = useMemo(() => {
    return getFieldsForContext(submission.division, currentUserRole, 'both');
  }, [submission.division, currentUserRole]);

  // Group fields by section
  const fieldsBySection = useMemo(() => {
    const grouped: Record<FormSection, typeof allFields> = {} as any;
    FORM_STEPS.forEach(section => {
      grouped[section] = allFields.filter(f => f.section === section);
    });
    return grouped;
  }, [allFields]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to List
          </Button>
          <div className="h-6 w-px bg-border" />
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-bold text-foreground">
                {submission.productNameTh}
              </h1>
              <Badge className={cn('division-badge', DIVISIONS[submission.division].color)}>
                {submission.division}
              </Badge>
              <Badge className={cn(WORKFLOW_STATUSES[submission.status].color)}>
                {WORKFLOW_STATUSES[submission.status].label}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              {submission.id} • {submission.productNameEn}
            </p>
          </div>
        </div>
        
        {canApprove && nextAction && (
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={onRequestRevision}>
              <RotateCcw className="w-4 h-4 mr-2" />
              Request Revision
            </Button>
            <Button variant="outline" className="text-destructive" onClick={onReject}>
              <XCircle className="w-4 h-4 mr-2" />
              Reject
            </Button>
            <Button className="bg-success hover:bg-success/90 text-white" onClick={onApprove}>
              <CheckCircle2 className="w-4 h-4 mr-2" />
              {nextAction.action}
            </Button>
          </div>
        )}
      </div>

      {/* Role Legend */}
      <Card>
        <CardContent className="py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-accent" />
                <span className="text-sm">Supplier fields</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-primary" />
                <span className="text-sm">Buyer fields</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-purple-500" />
                <span className="text-sm">Commercial fields</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-orange-500" />
                <span className="text-sm">Finance fields</span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Edit3 className="w-4 h-4" />
                Editable by you
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Lock className="w-4 h-4" />
                View only
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabbed Form View */}
      <Tabs defaultValue="basic_info">
        <TabsList className="flex flex-wrap h-auto gap-1 bg-muted/50 p-1">
          {FORM_STEPS.map(section => (
            <TabsTrigger 
              key={section} 
              value={section}
              className="text-xs px-3 py-2"
            >
              {FORM_SECTIONS[section].title}
            </TabsTrigger>
          ))}
        </TabsList>

        {FORM_STEPS.map(section => (
          <TabsContent key={section} value={section}>
            <Card>
              <CardHeader>
                <CardTitle>{FORM_SECTIONS[section].title}</CardTitle>
                <CardDescription>{FORM_SECTIONS[section].titleTh}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {fieldsBySection[section]?.map(field => {
                    const permission = getFieldPermission(
                      field.assignedTo,
                      currentUserRole,
                      submission.status
                    );
                    const isEditable = permission === 'edit';
                    
                    // Determine field owner color
                    const ownerColor = field.assignedTo.includes('supplier') 
                      ? 'border-l-accent'
                      : field.assignedTo.includes('buyer')
                      ? 'border-l-primary'
                      : field.assignedTo.includes('commercial')
                      ? 'border-l-purple-500'
                      : 'border-l-orange-500';

                    // Mock value for demo
                    const mockValue = submission.formData[field.id] || '';

                    return (
                      <div 
                        key={field.id}
                        className={cn(
                          'p-4 rounded-lg border-l-4 bg-muted/30',
                          ownerColor
                        )}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <Label className="text-sm font-medium">
                            {field.name}
                            {field.requirement === 'mandatory' && (
                              <span className="text-destructive ml-1">*</span>
                            )}
                          </Label>
                          {isEditable ? (
                            <Edit3 className="w-3 h-3 text-muted-foreground" />
                          ) : (
                            <Lock className="w-3 h-3 text-muted-foreground" />
                          )}
                        </div>
                        {field.nameTh && (
                          <p className="text-xs text-muted-foreground mb-2">
                            {field.nameTh}
                          </p>
                        )}
                        
                        {field.inputType === 'textarea' ? (
                          <Textarea
                            value={mockValue as string}
                            disabled={!isEditable}
                            placeholder={field.placeholder || `Enter ${field.name.toLowerCase()}`}
                            className={cn(
                              'mt-1',
                              !isEditable && 'bg-muted cursor-not-allowed'
                            )}
                          />
                        ) : (
                          <Input
                            type={field.inputType === 'number' ? 'number' : 'text'}
                            value={mockValue as string}
                            disabled={!isEditable}
                            placeholder={field.placeholder || `Enter ${field.name.toLowerCase()}`}
                            className={cn(
                              'mt-1',
                              !isEditable && 'bg-muted cursor-not-allowed'
                            )}
                          />
                        )}
                        
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant="outline" className="text-[10px]">
                            {field.assignedTo.map(r => r.toUpperCase()).join(', ')}
                          </Badge>
                          {field.channel !== 'both' && (
                            <Badge variant="secondary" className="text-[10px]">
                              {field.channel === 'online' ? 'Online' : 'Offline'}
                            </Badge>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>

      {/* Workflow History */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Workflow History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center shrink-0">
                <User className="w-4 h-4" />
              </div>
              <div>
                <p className="text-sm">
                  <span className="font-medium">Supplier</span> created submission
                </p>
                <p className="text-xs text-muted-foreground">
                  {format(submission.createdAt, 'dd MMM yyyy HH:mm')}
                </p>
              </div>
            </div>
            {submission.submittedAt && (
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm">
                    <span className="font-medium">Supplier</span> submitted to Buyer
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {format(submission.submittedAt, 'dd MMM yyyy HH:mm')}
                  </p>
                </div>
              </div>
            )}
            {submission.status === 'pending_commercial' && (
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-4 h-4 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm">
                    <span className="font-medium">Buyer</span> approved and forwarded to Commercial
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {format(submission.updatedAt, 'dd MMM yyyy HH:mm')}
                  </p>
                </div>
              </div>
            )}
            {submission.status === 'pending_finance' && (
              <>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-4 h-4 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm">
                      <span className="font-medium">Buyer</span> approved
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-4 h-4 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm">
                      <span className="font-medium">Commercial</span> approved and forwarded to Finance
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {format(submission.updatedAt, 'dd MMM yyyy HH:mm')}
                    </p>
                  </div>
                </div>
              </>
            )}
            {submission.approvedAt && (
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-success/20 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-4 h-4 text-success" />
                </div>
                <div>
                  <p className="text-sm">
                    <span className="font-medium">Finance</span> gave final approval
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {format(submission.approvedAt, 'dd MMM yyyy HH:mm')}
                  </p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
