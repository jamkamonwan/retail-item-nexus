import { useMemo, useState, useEffect } from 'react';
import { NPDSubmission, WORKFLOW_STATUSES, getFieldPermission, getNextAction, canTakeAction } from '@/types/workflow';
import { UserType, Division, DIVISIONS, SupplierFormSection, SUPPLIER_FORM_SECTIONS, SUPPLIER_FORM_STEPS } from '@/types/npd';
import { getFieldsForSectionAndDivision, ALL_SUPPLIER_FIELDS } from '@/data/npd-fields-supplier';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ProgressStepper } from './ProgressStepper';
import { 
  ArrowLeft,
  ArrowRight,
  CheckCircle2, 
  XCircle, 
  RotateCcw, 
  Clock,
  User,
  Lock,
  Edit3,
  Image as ImageIcon,
  Package,
  List,
  ShieldCheck,
  DollarSign,
  Truck,
  Settings,
  Globe,
  ShoppingCart
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

// Component to display image preview from File object
function ImagePreview({ file, fieldName }: { file: File; fieldName: string }) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  if (!previewUrl) {
    return (
      <div className="w-full h-40 bg-muted/30 rounded-lg flex items-center justify-center border border-dashed border-border">
        <ImageIcon className="w-10 h-10 text-muted-foreground" />
      </div>
    );
  }

  return (
    <img
      src={previewUrl}
      alt={fieldName}
      className="w-full h-40 object-cover rounded-lg border border-border"
    />
  );
}

interface SubmissionViewProps {
  submission: NPDSubmission;
  currentUserRole: UserType;
  onBack: () => void;
  onApprove: () => void;
  onReject: () => void;
  onRequestRevision: () => void;
}

// Helper to get role owner CSS class
const getFieldOwnerClass = (assignedTo: UserType[]): string => {
  if (assignedTo.includes('supplier')) return 'field-owner-supplier';
  if (assignedTo.includes('buyer')) return 'field-owner-buyer';
  if (assignedTo.includes('commercial')) return 'field-owner-commercial';
  if (assignedTo.includes('finance')) return 'field-owner-finance';
  if (assignedTo.includes('scm')) return 'field-owner-scm';
  if (assignedTo.includes('im')) return 'field-owner-im';
  if (assignedTo.includes('dc_income')) return 'field-owner-dc_income';
  if (assignedTo.includes('nsd')) return 'field-owner-nsd';
  if (assignedTo.includes('admin')) return 'field-owner-admin';
  return 'field-owner-supplier';
};

// Helper to get role owner label
const getFieldOwnerLabel = (assignedTo: UserType[]): string => {
  if (assignedTo.includes('supplier')) return 'SUPPLIER';
  if (assignedTo.includes('buyer')) return 'BUYER';
  if (assignedTo.includes('commercial')) return 'COMMERCIAL';
  if (assignedTo.includes('finance')) return 'FINANCE';
  if (assignedTo.includes('scm')) return 'SCM';
  if (assignedTo.includes('im')) return 'IM';
  if (assignedTo.includes('dc_income')) return 'DC INCOME';
  if (assignedTo.includes('nsd')) return 'NSD';
  if (assignedTo.includes('admin')) return 'ADMIN';
  return assignedTo[0]?.toUpperCase() || 'UNKNOWN';
};

// Section icon mapping
const getSectionIcon = (section: SupplierFormSection) => {
  switch (section) {
    case 'product_identification':
      return Package;
    case 'product_images':
      return ImageIcon;
    case 'basic_attributes':
      return List;
    case 'compliance':
      return ShieldCheck;
    case 'pricing':
      return DollarSign;
    case 'logistics':
      return Truck;
    case 'system_fields':
      return Settings;
    default:
      return Package;
  }
};

export function SubmissionView({
  submission,
  currentUserRole,
  onBack,
  onApprove,
  onReject,
  onRequestRevision,
}: SubmissionViewProps) {
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const currentSection = SUPPLIER_FORM_STEPS[currentSectionIndex];
  
  const canApprove = canTakeAction(currentUserRole, submission.status);
  const nextAction = getNextAction(currentUserRole, submission.status);
  
  // Get fields grouped by section for this division
  const fieldsBySection = useMemo(() => {
    const grouped: Record<SupplierFormSection, typeof ALL_SUPPLIER_FIELDS> = {} as any;
    SUPPLIER_FORM_STEPS.forEach(section => {
      grouped[section] = getFieldsForSectionAndDivision(section, submission.division);
    });
    return grouped;
  }, [submission.division]);

  // Get field count for each section
  const getSectionFieldCount = (section: SupplierFormSection): number => {
    return fieldsBySection[section]?.length || 0;
  };

  // Handle section navigation
  const handleSectionClick = (stepIndex: number) => {
    setCurrentSectionIndex(stepIndex);
  };

  const handlePrevious = () => {
    setCurrentSectionIndex(prev => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setCurrentSectionIndex(prev => Math.min(SUPPLIER_FORM_STEPS.length - 1, prev + 1));
  };

  // Build section info with dynamic field counts
  const sectionInfo = useMemo(() => {
    const info: Record<string, { title: string; titleTh: string; icon?: string; fieldCount?: number }> = {};
    SUPPLIER_FORM_STEPS.forEach(section => {
      info[section] = {
        ...SUPPLIER_FORM_SECTIONS[section],
        fieldCount: getSectionFieldCount(section),
      };
    });
    return info;
  }, [fieldsBySection]);

  const SectionIcon = getSectionIcon(currentSection);
  const currentFields = fieldsBySection[currentSection] || [];

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
          <div className="flex flex-wrap items-center justify-between gap-4">
            {/* Role color dots */}
            <div className="flex flex-wrap items-center gap-4 lg:gap-6">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-orange-500" />
                <span className="text-sm">Supplier fields</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-600" />
                <span className="text-sm">Buyer fields</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-purple-600" />
                <span className="text-sm">Commercial fields</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-amber-600" />
                <span className="text-sm">Finance fields</span>
              </div>
            </div>
            
            {/* Edit indicators */}
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

      {/* Two-Column Layout: Sidebar + Content */}
      <div className="flex gap-6">
        {/* Sidebar - Desktop */}
        <aside className="hidden lg:block w-72 shrink-0">
          <div className="sticky top-24 bg-card rounded-xl border border-border p-4">
            <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider mb-4">
              Form Sections ({SUPPLIER_FORM_STEPS.length})
            </h3>
            <ProgressStepper
              steps={SUPPLIER_FORM_STEPS}
              currentStep={currentSectionIndex}
              completedSteps={[]}
              onStepClick={handleSectionClick}
              sectionInfo={sectionInfo}
            />
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-w-0">
          {/* Mobile Section Stepper */}
          <div className="lg:hidden mb-6">
            <ProgressStepper
              steps={SUPPLIER_FORM_STEPS}
              currentStep={currentSectionIndex}
              completedSteps={[]}
              onStepClick={handleSectionClick}
              sectionInfo={sectionInfo}
            />
          </div>

          {/* Section Content Card */}
          <Card>
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3">
                <SectionIcon className="w-5 h-5 text-primary" />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-lg">{SUPPLIER_FORM_SECTIONS[currentSection].title}</CardTitle>
                    <Badge variant="secondary" className="text-xs">
                      {currentFields.length} fields
                    </Badge>
                  </div>
                  <CardDescription>{SUPPLIER_FORM_SECTIONS[currentSection].titleTh}</CardDescription>
                </div>
                <span className="text-sm text-muted-foreground">
                  Section {currentSectionIndex + 1} of {SUPPLIER_FORM_STEPS.length}
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentFields.map(field => {
                  const permission = getFieldPermission(
                    field.assignedTo,
                    currentUserRole,
                    submission.status
                  );
                  const isEditable = permission === 'edit';
                  const ownerClass = getFieldOwnerClass(field.assignedTo);
                  const ownerLabel = getFieldOwnerLabel(field.assignedTo);

                  // Mock value for demo
                  const mockValue = submission.formData[field.id] || '';

                  return (
                    <div 
                      key={field.id}
                      className={cn(
                        'p-4 rounded-lg bg-card border shadow-sm',
                        ownerClass
                      )}
                    >
                      {/* Field Header */}
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <Label className="text-sm font-medium leading-tight">
                            {field.name}
                            {field.requirement === 'mandatory' && (
                              <span className="text-destructive ml-1">*</span>
                            )}
                          </Label>
                          {field.nameTh && (
                            <p className="text-xs text-muted-foreground mt-0.5">
                              {field.nameTh}
                            </p>
                          )}
                        </div>
                        {isEditable ? (
                          <Edit3 className="w-4 h-4 text-muted-foreground shrink-0 ml-2" />
                        ) : (
                          <Lock className="w-4 h-4 text-muted-foreground shrink-0 ml-2" />
                        )}
                      </div>
                      
                      {/* Field Value/Input */}
                      <div className="mt-3">
                        {field.inputType === 'file' ? (
                          // Render image preview for file fields
                          mockValue instanceof File ? (
                            <ImagePreview file={mockValue} fieldName={field.name} />
                          ) : (
                            <div className="w-full h-40 bg-muted/30 rounded-lg flex flex-col items-center justify-center border border-dashed border-border">
                              <ImageIcon className="w-10 h-10 text-muted-foreground mb-2" />
                              <span className="text-xs text-muted-foreground">No image uploaded</span>
                            </div>
                          )
                        ) : field.inputType === 'textarea' ? (
                          <Textarea
                            value={mockValue as string}
                            readOnly
                            placeholder={field.placeholder || `Enter ${field.name.toLowerCase()}`}
                            className={cn(
                              'resize-none',
                              !isEditable && 'bg-muted/50 cursor-not-allowed'
                            )}
                            rows={3}
                          />
                        ) : (
                          <Input
                            type={field.inputType === 'number' ? 'number' : field.inputType === 'date' ? 'date' : 'text'}
                            value={mockValue as string}
                            readOnly
                            placeholder={field.placeholder || `Enter ${field.name.toLowerCase()}`}
                            className={cn(
                              !isEditable && 'bg-muted/50 cursor-not-allowed'
                            )}
                          />
                        )}
                      </div>
                      
                      {/* Badges - Only show role if NOT supplier (since most are supplier fields) */}
                      <div className="flex items-center gap-2 mt-3">
                        {!field.assignedTo.includes('supplier') && (
                          <Badge 
                            variant="outline" 
                            className="text-[10px] font-semibold uppercase tracking-wide bg-warning/10 text-warning border-warning/30"
                          >
                            {ownerLabel}
                          </Badge>
                        )}
                        {field.channelColumn === 'online' && (
                          <Badge variant="outline" className="bg-success/10 text-success border-success/30 text-[10px]">
                            <Globe className="w-3 h-3 mr-1" />
                            Online
                          </Badge>
                        )}
                        {field.channelColumn === 'both' && (
                          <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30 text-[10px]">
                            <ShoppingCart className="w-3 h-3 mr-1" />
                            All Channels
                          </Badge>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Section Navigation */}
          <div className="flex items-center justify-between mt-6">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentSectionIndex === 0}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Previous
            </Button>
            <span className="text-sm text-muted-foreground">
              {currentSectionIndex + 1} / {SUPPLIER_FORM_STEPS.length}
            </span>
            <Button
              onClick={handleNext}
              disabled={currentSectionIndex === SUPPLIER_FORM_STEPS.length - 1}
            >
              Next
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </main>
      </div>

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
                      <span className="font-medium">Buyer</span> approved and forwarded to Commercial
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {format(submission.updatedAt, 'dd MMM yyyy HH:mm')}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-4 h-4 text-amber-600" />
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
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
