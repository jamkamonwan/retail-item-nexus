import { useState, useMemo } from 'react';
import { Division, UserType, FormSection, FORM_SECTIONS, DIVISIONS, ChannelType, NPDFormField } from '@/types/npd';
import { getFieldsForContext } from '@/data/npd-fields';
import { DivisionSelector } from './DivisionSelector';
import { ProgressStepper } from './ProgressStepper';
import { FormSectionComponent } from './FormSection';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { ArrowLeft, ArrowRight, Save, Send, FileDown, RotateCcw, Info, Wand2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { useSubmissions } from '@/hooks/useSubmissions';

// Generate dummy data based on field type
const generateDummyValue = (field: NPDFormField): string | number => {
  // If dropdown, pick first option
  if (field.inputType === 'dropdown' && field.dropdownOptions?.length) {
    return field.dropdownOptions[0];
  }

  // Handle specific field types
  switch (field.inputType) {
    case 'number':
      if (field.id.includes('price') || field.id.includes('cost')) return 199.99;
      if (field.id.includes('weight')) return 1.5;
      if (field.id.includes('width') || field.id.includes('length') || field.id.includes('height')) return 25;
      if (field.id.includes('wattage')) return 1500;
      if (field.id.includes('qty') || field.id.includes('size')) return 10;
      if (field.id.includes('gp')) return 25;
      if (field.id.includes('shelf_life')) return 365;
      return 100;
    
    case 'date':
      const date = new Date();
      date.setMonth(date.getMonth() + 1);
      return date.toISOString().split('T')[0];
    
    case 'textarea':
      if (field.id.includes('ingredient')) return 'Water, Sugar, Salt, Natural Flavoring';
      return 'Sample description text for testing purposes.';
    
    case 'file':
      return ''; // Handled separately in async function
    
    default: // text
      if (field.id.includes('barcode')) return '8851234567890';
      if (field.id.includes('product_name_th')) return 'สินค้าทดสอบ';
      if (field.id.includes('product_name_en')) return 'Test Product';
      if (field.id.includes('brand')) return 'TestBrand';
      if (field.id.includes('model')) return 'Model-X100';
      if (field.id.includes('tis')) return 'TIS-12345-2567';
      if (field.id.includes('fda')) return 'FDA-67890-2567';
      if (field.id.includes('size')) return 'M';
      if (field.id.includes('age')) return '18-45';
      if (field.id.includes('material')) return 'Cotton 100%';
      if (field.id.includes('supplier')) return 'Test Supplier Co., Ltd.';
      return 'Sample Value';
  }
};

// Fetch a random product image from Picsum and convert to File
const fetchRandomProductImage = async (fieldId: string): Promise<File | null> => {
  try {
    // Use Picsum for random images - 1400x1400 as specified in the image fields
    const randomSeed = Math.floor(Math.random() * 1000);
    const imageUrl = `https://picsum.photos/seed/${randomSeed}/1400/1400`;
    
    const response = await fetch(imageUrl);
    if (!response.ok) throw new Error('Failed to fetch image');
    
    const blob = await response.blob();
    const fileName = `${fieldId}_${randomSeed}.jpg`;
    
    return new File([blob], fileName, { type: 'image/jpeg' });
  } catch (error) {
    console.error('Error fetching random image:', error);
    return null;
  }
};

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
  userRole: UserType;
  onSubmitSuccess?: () => void;
  onCancel?: () => void;
}

export function NPDForm({ userRole, onSubmitSuccess, onCancel }: NPDFormProps) {
  const { createSubmission, updateFormData } = useSubmissions();
  
  // Draft tracking state
  const [currentSubmissionId, setCurrentSubmissionId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  
  // Setup State
  const [setupComplete, setSetupComplete] = useState(false);
  const [selectedDivision, setSelectedDivision] = useState<Division | null>(null);
  const [pendingDivision, setPendingDivision] = useState<Division | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  // Channel defaults to 'both' since items can be sold online and offline
  const channel: ChannelType = 'both';

  // Handle division selection with confirmation
  const handleDivisionSelect = (division: Division) => {
    setPendingDivision(division);
  };

  const handleConfirmDivision = () => {
    if (pendingDivision) {
      setSelectedDivision(pendingDivision);
      setSetupComplete(true);
      setPendingDivision(null);
    }
  };

  const handleCancelDivision = () => {
    setPendingDivision(null);
  };

  // Form State
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<Record<string, string | number | File | null>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [completedSections, setCompletedSections] = useState<FormSection[]>([]);

  // Get current section and fields
  const currentSection = FORM_STEPS[currentStep];
  
  const currentFields = useMemo(() => {
    if (!selectedDivision) return [];
    
    const contextFields = getFieldsForContext(selectedDivision, userRole, channel);
    return contextFields.filter(field => field.section === currentSection);
  }, [selectedDivision, userRole, channel, currentSection]);

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

  // Navigate steps with auto-save
  const handleNext = async () => {
    if (!validateCurrentSection()) {
      toast.error('Please fill in all required fields');
      return;
    }

    // Mark section as completed
    if (!completedSections.includes(currentSection)) {
      setCompletedSections(prev => [...prev, currentSection]);
    }

    // Auto-save logic
    if (currentStep === 0 && !currentSubmissionId) {
      // First step (Basic Information) - create draft
      setIsSaving(true);
      try {
        const productNameEn = (formData['product_name_en'] as string) || 'New Product';
        const productNameTh = (formData['product_name_th'] as string) || '';
        
        const result = await createSubmission(
          selectedDivision!,
          productNameEn,
          productNameTh,
          formData
        );
        
        if (result) {
          setCurrentSubmissionId(result.id);
          toast.success('Draft created');
        }
      } catch (error) {
        console.error('Error creating draft:', error);
        toast.error('Failed to save draft');
      } finally {
        setIsSaving(false);
      }
    } else if (currentSubmissionId) {
      // Subsequent steps - update existing draft
      setIsSaving(true);
      try {
        const success = await updateFormData(currentSubmissionId, formData);
        if (success) {
          toast.success('Progress saved');
        }
      } catch (error) {
        console.error('Error updating draft:', error);
      } finally {
        setIsSaving(false);
      }
    }

    // Navigate to next step
    if (currentStep < FORM_STEPS.length - 1) {
      setCurrentStep(prev => prev + 1);
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

  // Save draft manually
  const handleSaveDraft = async () => {
    if (!currentSubmissionId) {
      toast.info('Complete Basic Information first to create a draft');
      return;
    }
    
    setIsSaving(true);
    try {
      const success = await updateFormData(currentSubmissionId, formData);
      if (success) {
        toast.success('Draft saved successfully');
      }
    } catch (error) {
      console.error('Error saving draft:', error);
      toast.error('Failed to save draft');
    } finally {
      setIsSaving(false);
    }
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
    setCurrentSubmissionId(null);
    toast.info('Form has been reset');
  };

  // Auto-fill current section with dummy data
  const [isAutoFilling, setIsAutoFilling] = useState(false);
  
  const handleAutoFill = async () => {
    setIsAutoFilling(true);
    const newData: Record<string, string | number | File | null> = { ...formData };
    
    const fileFields = currentFields.filter(f => f.inputType === 'file');
    const nonFileFields = currentFields.filter(f => f.inputType !== 'file');
    
    // Fill non-file fields immediately
    nonFileFields.forEach(field => {
      newData[field.id] = generateDummyValue(field);
    });
    
    // Fetch random images for file fields in parallel
    if (fileFields.length > 0) {
      toast.info(`Fetching ${fileFields.length} random product image(s)...`);
      
      const imagePromises = fileFields.map(async (field) => {
        const file = await fetchRandomProductImage(field.id);
        return { fieldId: field.id, file };
      });
      
      const imageResults = await Promise.all(imagePromises);
      
      imageResults.forEach(({ fieldId, file }) => {
        if (file) {
          newData[fieldId] = file;
        }
      });
    }
    
    setFormData(newData);
    setErrors({});
    
    const filledCount = nonFileFields.length + fileFields.filter(f => newData[f.id]).length;
    toast.success(`Auto-filled ${filledCount} fields with dummy data`);
    setIsAutoFilling(false);
  };

  // Start Over
  const handleStartOver = () => {
    setSetupComplete(false);
    setSelectedDivision(null);
    handleReset();
  };

  // Setup Screen
  if (!setupComplete) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container max-w-4xl mx-auto px-4 py-8">
          {/* Back Button */}
          <Button variant="outline" size="sm" onClick={onCancel} className="mb-8">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
          
          {/* Header */}
          <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary mb-4">
                <FileDown className="w-8 h-8 text-primary-foreground" />
              </div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                New Product Development
              </h1>
              <p className="text-muted-foreground max-w-lg mx-auto">
              เริ่มต้นกรอกข้อมูลสินค้าใหม่ กรุณาเลือกประเภทสินค้า
            </p>
          </div>

          {/* Division Selection */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Select Product Division</CardTitle>
              <CardDescription>
                เลือกประเภทสินค้าที่ต้องการเพิ่ม
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DivisionSelector
                selected={null}
                onSelect={handleDivisionSelect}
              />
            </CardContent>
          </Card>

          {/* Role Info Banner */}
          <div className="p-4 rounded-xl border border-border bg-muted/30 flex items-start gap-3">
            <Info className="w-5 h-5 text-muted-foreground mt-0.5" />
            <div>
              <p className="font-medium text-foreground">
                Your Role: <span className="text-primary">{userRole.toUpperCase()}</span> • Channel: Online & Offline
              </p>
              <p className="text-sm text-muted-foreground">
                บทบาทของท่านถูกกำหนดจาก Demo Role ด้านบน
              </p>
            </div>
          </div>
        </div>

        {/* Confirmation Dialog */}
        <AlertDialog open={!!pendingDivision} onOpenChange={(open) => !open && handleCancelDivision()}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirm Division Selection</AlertDialogTitle>
              <AlertDialogDescription>
                {pendingDivision && (
                  <>
                    You are about to create a new product for{' '}
                    <span className="font-semibold text-foreground">
                      {DIVISIONS[pendingDivision].label} - {DIVISIONS[pendingDivision].fullName}
                    </span>
                    {' '}as a{' '}
                    <span className="font-semibold text-foreground">{userRole.toUpperCase()}</span>.
                    <br /><br />
                    ยืนยันการเลือกประเภทสินค้านี้?
                  </>
                )}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleConfirmDivision}>
                Continue
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
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
                  {userRole.toUpperCase()} • Online & Offline
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
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleSaveDraft}
                  disabled={isSaving || !currentSubmissionId}
                >
                  <Save className={cn("w-4 h-4 mr-2", isSaving && "animate-spin")} />
                  {isSaving ? 'Saving...' : 'Save Draft'}
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
                {/* Auto Fill Button */}
                <div className="flex justify-end mb-6">
                  <Button 
                    variant="secondary" 
                    size="sm" 
                    onClick={handleAutoFill}
                    disabled={isAutoFilling}
                  >
                    <Wand2 className={cn("w-4 h-4 mr-2", isAutoFilling && "animate-spin")} />
                    {isAutoFilling ? 'Fetching Images...' : 'Auto Fill with Dummy Data'}
                  </Button>
                </div>
                
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
                  <Button onClick={handleNext} disabled={isSaving}>
                    {isSaving ? 'Saving...' : 'Next'}
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
