import { FormSection, SupplierFormSection, FORM_SECTIONS, SUPPLIER_FORM_SECTIONS } from '@/types/npd';
import { cn } from '@/lib/utils';
import { Check, Image, FileText, Settings, DollarSign, Ruler, Truck, ShieldCheck, Store, PlusCircle, Package, List } from 'lucide-react';

// Combined section type for flexibility
type AnyFormSection = FormSection | SupplierFormSection;

interface ProgressStepperProps {
  steps: AnyFormSection[];
  currentStep: number;
  completedSteps: AnyFormSection[];
  onStepClick: (stepIndex: number) => void;
  sectionInfo?: Record<string, { title: string; titleTh: string; icon?: string; fieldCount?: number }>;
}

// Combined icons for all section types
const SECTION_ICONS: Record<string, React.ReactNode> = {
  // Legacy sections
  product_images: <Image className="w-4 h-4" />,
  basic_info: <FileText className="w-4 h-4" />,
  specifications: <Settings className="w-4 h-4" />,
  pricing: <DollarSign className="w-4 h-4" />,
  dimensions: <Ruler className="w-4 h-4" />,
  logistics: <Truck className="w-4 h-4" />,
  compliance: <ShieldCheck className="w-4 h-4" />,
  store_allocation: <Store className="w-4 h-4" />,
  additional: <PlusCircle className="w-4 h-4" />,
  // New supplier sections
  product_identification: <Package className="w-4 h-4" />,
  basic_attributes: <List className="w-4 h-4" />,
};

export function ProgressStepper({ steps, currentStep, completedSteps, onStepClick, sectionInfo }: ProgressStepperProps) {
  // Use provided sectionInfo or fall back to defaults
  const getSectionInfo = (step: AnyFormSection) => {
    if (sectionInfo && sectionInfo[step]) {
      return sectionInfo[step];
    }
    // Fall back to legacy FORM_SECTIONS or SUPPLIER_FORM_SECTIONS
    if (step in SUPPLIER_FORM_SECTIONS) {
      return SUPPLIER_FORM_SECTIONS[step as SupplierFormSection];
    }
    if (step in FORM_SECTIONS) {
      return FORM_SECTIONS[step as FormSection];
    }
    return { title: step, titleTh: '' };
  };

  return (
    <div className="relative">
      {/* Mobile View - Horizontal Scroll */}
      <div className="sm:hidden overflow-x-auto pb-4 -mx-4 px-4">
        <div className="flex gap-2 min-w-max">
          {steps.map((step, index) => {
            const section = getSectionInfo(step);
            const isCompleted = completedSteps.includes(step);
            const isCurrent = index === currentStep;
            
            return (
              <button
                key={step}
                onClick={() => onStepClick(index)}
                className={cn(
                  'flex items-center gap-2 px-3 py-2 rounded-lg transition-all whitespace-nowrap',
                  isCurrent
                    ? 'bg-primary text-primary-foreground'
                    : isCompleted
                    ? 'bg-success/10 text-success border border-success/30'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                )}
              >
                {isCompleted ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <span className="w-4 h-4 flex items-center justify-center text-xs font-bold">
                    {index + 1}
                  </span>
                )}
                <span className="text-sm font-medium">{section.title}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Desktop View - Vertical Stepper */}
      <div className="hidden sm:block space-y-1">
        {steps.map((step, index) => {
          const section = getSectionInfo(step);
          const isCompleted = completedSteps.includes(step);
          const isCurrent = index === currentStep;
          const fieldCount = 'fieldCount' in section ? section.fieldCount : undefined;

          return (
            <button
              key={step}
              onClick={() => onStepClick(index)}
              className={cn(
                'w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-left',
                'hover:bg-muted/50',
                isCurrent && 'bg-primary/10 border-l-4 border-primary',
                isCompleted && !isCurrent && 'opacity-70'
              )}
            >
              <div
                className={cn(
                  'w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-colors',
                  isCurrent
                    ? 'bg-primary text-primary-foreground'
                    : isCompleted
                    ? 'bg-success text-success-foreground'
                    : 'bg-muted text-muted-foreground'
                )}
              >
                {isCompleted ? (
                  <Check className="w-4 h-4" />
                ) : (
                  SECTION_ICONS[step] || <FileText className="w-4 h-4" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p
                    className={cn(
                      'font-medium text-sm truncate',
                      isCurrent ? 'text-primary' : 'text-foreground'
                    )}
                  >
                    {section.title}
                  </p>
                  {fieldCount !== undefined && (
                    <span className="text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                      {fieldCount}
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground truncate">
                  {section.titleTh}
                </p>
              </div>
              {isCompleted && (
                <span className="text-xs text-success font-medium">✓</span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
