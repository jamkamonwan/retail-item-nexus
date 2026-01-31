import { useState, useMemo } from 'react';
import { Division, UserType, FormSection, FORM_SECTIONS, DIVISIONS, ChannelType } from '@/types/npd';
import { getFieldsForContext } from '@/data/npd-fields';
import { DivisionSelector } from './DivisionSelector';
import { RoleSimulator } from './RoleSimulator';
import { ProgressStepper } from './ProgressStepper';
import { FormSectionComponent } from './FormSection';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ArrowLeft, ArrowRight, Save, Send, FileDown, RotateCcw, Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { useSubmissions } from '@/hooks/useSubmissions';

// Form steps
const FORM_STEPS: FormSection[] = [
  'basic_info',
  'product_images',
  'specifications',
  'dimensions',
  'pricing',
  'compliance',
  'logistics',
];

interface NPDFormProps {
  onSubmitSuccess?: () => void;
}

export function NPDForm({ onSubmitSuccess }: NPDFormProps = {}) {
  const { createSubmission } = useSubmissions();
  
  // Setup State
  const [setupComplete, setSetupComplete] = useState(false);
  const [selectedDivision, setSelectedDivision] = useState<Division | null>(null);
  const [selectedUserType, setSelectedUserType] = useState<UserType | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  // Channel defaults to 'both' since items can be sold online and offline
  const channel: ChannelType = 'both';

  // Form State
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<Record<string, string | number | File | null>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [completedSections, setCompletedSections] = useState<FormSection[]>([]);

  // Get current section and fields
  const currentSection = FORM_STEPS[currentStep];
  
  const currentFields = useMemo(() => {
    if (!selectedDivision || !selectedUserType) return [];
    
    const contextFields = getFieldsForContext(selectedDivision, selectedUserType, channel);
    return contextFields.filter(field => field.section === currentSection);
  }, [selectedDivision, selectedUserType, channel, currentSection]);

  // Calculate progress
  const progress = useMemo(() => {
    const totalSteps = FORM_STEPS.length;
    const completed = completedSections.length;
    return Math.round((completed / totalSteps) * 100);
  }, [completedSections]);

  // Handle field change
  const handleFieldChange = (fieldId: string, value: string | number | File | null) => {
    setFormData(prev => ({ ...prev, [fieldId]: value }));
    // Clear error when field is updated
    if (errors[fieldId]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[fieldId];
        return newErrors;
      });
    }
  };

  // Validate current section
  const validateCurrentSection = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    currentFields.forEach(field => {
      if (field.requirement === 'mandatory') {
        const value = formData[field.id];
        if (!value || (typeof value === 'string' && value.trim() === '')) {
          newErrors[field.id] = `${field.name} is required`;
        }
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Navigate steps
  const handleNext = () => {
    if (validateCurrentSection()) {
      if (!completedSections.includes(currentSection)) {
        setCompletedSections(prev => [...prev, currentSection]);
      }
      if (currentStep < FORM_STEPS.length - 1) {
        setCurrentStep(prev => prev + 1);
      }
    } else {
      toast.error('Please fill in all required fields');
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleStepClick = (stepIndex: number) => {
    // Allow navigation to previous or completed steps
    if (stepIndex <= currentStep || completedSections.includes(FORM_STEPS[stepIndex])) {
      setCurrentStep(stepIndex);
    }
  };

  // Save draft
  const handleSaveDraft = () => {
    toast.success('Draft saved successfully');
  };

  // Submit form
  const handleSubmit = async () => {
    if (!selectedDivision) {
      toast.error('Please select a division');
      return;
    }

    // Validate all sections
    let allValid = true;
    for (let i = 0; i < FORM_STEPS.length; i++) {
      setCurrentStep(i);
      if (!validateCurrentSection()) {
        allValid = false;
        break;
      }
    }

    if (!allValid) {
      toast.error('Please complete all required fields before submitting');
      return;
    }

    setIsSubmitting(true);
    
    try {
      const productNameEn = (formData['product_name_en'] as string) || 'New Product';
      const productNameTh = (formData['product_name_th'] as string) || '';
      
      const result = await createSubmission(
        selectedDivision,
        productNameEn,
        productNameTh,
        formData
      );
      
      if (result) {
        toast.success('Form submitted successfully!');
        onSubmitSuccess?.();
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reset form
  const handleReset = () => {
    setFormData({});
    setErrors({});
    setCompletedSections([]);
    setCurrentStep(0);
    toast.info('Form has been reset');
  };

  // Start Over
  const handleStartOver = () => {
    setSetupComplete(false);
    setSelectedDivision(null);
    setSelectedUserType(null);
    handleReset();
  };

  // Setup Screen
  if (!setupComplete) {
    return (
      <div className="min-h-screen bg-background py-8">
        <div className="container max-w-4xl mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary mb-4">
              <FileDown className="w-8 h-8 text-primary-foreground" />
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              New Product Development
            </h1>
            <p className="text-muted-foreground max-w-lg mx-auto">
              เริ่มต้นกรอกข้อมูลสินค้าใหม่ กรุณาเลือกประเภทสินค้าและบทบาทของท่าน
            </p>
          </div>

          {/* Step 1: Division Selection */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                  1
                </span>
                Select Product Division
              </CardTitle>
              <CardDescription>
                เลือกประเภทสินค้าที่ต้องการเพิ่ม
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DivisionSelector
                selected={selectedDivision}
                onSelect={setSelectedDivision}
              />
            </CardContent>
          </Card>

          {/* Step 2: Role Detection (Simulated) */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className={cn(
                  'w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold',
                  selectedDivision ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                )}>
                  2
                </span>
                Your Role
              </CardTitle>
              <CardDescription>
                ระบบจะตรวจสอบบทบาทของท่านโดยอัตโนมัติ
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RoleSimulator
                selectedRole={selectedUserType}
                onRoleChange={setSelectedUserType}
              />
            </CardContent>
          </Card>

          {/* Channel Info Banner */}
          <div className="mb-8 p-4 rounded-xl border border-border bg-muted/30 flex items-start gap-3">
            <Info className="w-5 h-5 text-muted-foreground mt-0.5" />
            <div>
              <p className="font-medium text-foreground">Channel: Online & Offline</p>
              <p className="text-sm text-muted-foreground">
                สินค้าจะถูกจำหน่ายทั้งช่องทางออนไลน์และออฟไลน์ ข้อมูลที่ต้องกรอกจะครอบคลุมทั้งสองช่องทาง
              </p>
            </div>
          </div>

          {/* Start Button */}
          <div className="flex justify-center">
            <Button
              size="lg"
              onClick={() => setSetupComplete(true)}
              disabled={!selectedDivision || !selectedUserType}
              className="px-8 bg-accent hover:bg-accent/90 text-accent-foreground"
            >
              Start Form Entry
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Main Form Screen
  return (
    <div className="min-h-screen bg-background">
      {/* Top Bar */}
      <header className="sticky top-0 z-50 bg-card border-b border-border">
        <div className="container max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" onClick={handleStartOver}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Change Selection
              </Button>
              <div className="h-6 w-px bg-border" />
              <div className="flex items-center gap-2">
                <Badge className={cn('division-badge', DIVISIONS[selectedDivision!].color)}>
                  {DIVISIONS[selectedDivision!].label}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  {selectedUserType?.toUpperCase()} • Online & Offline
                </span>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              {/* Progress */}
              <div className="hidden sm:flex items-center gap-2">
                <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-success transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <span className="text-sm font-medium text-muted-foreground">
                  {progress}%
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={handleSaveDraft}>
                  <Save className="w-4 h-4 mr-2" />
                  Save Draft
                </Button>
                <Button variant="outline" size="sm" onClick={handleReset}>
                  <RotateCcw className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container max-w-7xl mx-auto px-4 py-6">
        <div className="flex gap-6">
          {/* Sidebar - Progress Steps */}
          <aside className="hidden lg:block w-72 shrink-0">
            <div className="sticky top-24 bg-card rounded-xl border border-border p-4">
              <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider mb-4">
                Form Sections
              </h3>
              <ProgressStepper
                steps={FORM_STEPS}
                currentStep={currentStep}
                completedSteps={completedSections}
                onStepClick={handleStepClick}
              />
            </div>
          </aside>

          {/* Form Content */}
          <main className="flex-1 min-w-0">
            {/* Mobile Progress */}
            <div className="lg:hidden mb-6">
              <ProgressStepper
                steps={FORM_STEPS}
                currentStep={currentStep}
                completedSteps={completedSections}
                onStepClick={handleStepClick}
              />
            </div>

            {/* Form Card */}
            <Card>
              <CardContent className="p-6 sm:p-8">
                <FormSectionComponent
                  section={currentSection}
                  fields={currentFields}
                  values={formData}
                  errors={errors}
                  onChange={handleFieldChange}
                />
              </CardContent>
            </Card>

            {/* Navigation */}
            <div className="flex items-center justify-between mt-6">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentStep === 0}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Previous
              </Button>

              <div className="flex items-center gap-3">
                {currentStep === FORM_STEPS.length - 1 ? (
                  <Button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="bg-accent hover:bg-accent/90 text-accent-foreground"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    {isSubmitting ? 'Submitting...' : 'Submit Form'}
                  </Button>
                ) : (
                  <Button onClick={handleNext}>
                    Next
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                )}
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
