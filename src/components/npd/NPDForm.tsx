import { useState, useMemo, useEffect } from 'react';
import { Division, UserType, SupplierFormSection, SUPPLIER_FORM_SECTIONS, DIVISIONS, ChannelType, NPDFormField, SUPPLIER_FORM_STEPS } from '@/types/npd';
import { NPDSubmission } from '@/types/workflow';
import { getFieldsForSectionAndDivision, PRODUCT_CATEGORIES } from '@/data/npd-fields-supplier';
import { getVisibleFields } from '@/utils/conditional-fields';
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
const generateDummyValue = (field: NPDFormField, formData: Record<string, string | number | File | null>): string | number => {
  // If dropdown, pick first option or context-aware option
  if (field.inputType === 'dropdown' && field.dropdownOptions?.length) {
    // For sub_category, pick based on selected category
    if (field.id === 'sub_category') {
      const category = formData['category'] as string;
      const subCategories = PRODUCT_CATEGORIES[category];
      if (subCategories?.length) return subCategories[0];
    }
    return field.dropdownOptions[0];
  }

  // Handle specific field types
  switch (field.inputType) {
    case 'number':
      if (field.id.includes('price') || field.id.includes('cost') || field.id === 'srp') return 199.99;
      if (field.id.includes('weight_net')) return 500;
      if (field.id.includes('weight_gross')) return 550;
      if (field.id.includes('weight')) return 5.5;
      if (field.id.includes('dimension_l') || field.id.includes('carton_dimension_l')) return 30;
      if (field.id.includes('dimension_w') || field.id.includes('carton_dimension_w')) return 20;
      if (field.id.includes('dimension_h') || field.id.includes('carton_dimension_h')) return 25;
      if (field.id.includes('moq')) return 100;
      if (field.id.includes('lead_time')) return 7;
      if (field.id.includes('shelf_life')) return 365;
      if (field.id.includes('qty')) return 12;
      if (field.id.includes('pack_per')) return 8;
      if (field.id.includes('layer')) return 5;
      if (field.id.includes('allowance')) return 2;
      if (field.id.includes('multiple')) return 10;
      if (field.id.includes('safety_stock')) return 14;
      return 100;
    
    case 'date':
      const date = new Date();
      date.setMonth(date.getMonth() + 1);
      return date.toISOString().split('T')[0];
    
    case 'textarea':
      if (field.id.includes('ingredient')) return 'Water, Sugar, Salt, Natural Flavoring, Preservatives (E211)';
      if (field.id.includes('allergen')) return 'Contains: Milk, Soy. May contain traces of nuts.';
      if (field.id.includes('nutrition')) return 'Per 100g: Calories 120kcal, Fat 3g, Carbs 18g, Protein 5g';
      if (field.id.includes('warning')) return 'Keep out of reach of children. Store in cool, dry place.';
      if (field.id.includes('usage')) return 'For best results, follow package instructions.';
      if (field.id.includes('remarks')) return 'Special handling required for temperature-sensitive items.';
      return 'Sample description text for testing purposes.';
    
    case 'file':
    case 'readonly':
    case 'calculated':
      return ''; // Handled separately
    
    default: // text
      if (field.id === 'barcode') return '8851234567890';
      if (field.id === 'product_name_th') return 'สินค้าทดสอบ ตัวอย่าง';
      if (field.id === 'product_name_en') return 'Test Sample Product';
      if (field.id === 'brand') return 'TestBrand Premium';
      if (field.id === 'model') return 'TB-2025-PRO';
      if (field.id === 'supplier_code') return 'SUP-ITEM-001';
      if (field.id === 'supplier_name') return 'Demo Supplier Co., Ltd.';
      if (field.id === 'tisi_number') return 'มอก. 1234-2567';
      if (field.id === 'fda_number') return '10-1-12345-1-0001';
      if (field.id === 'iso_cert') return 'ISO 9001:2015, ISO 22000:2018';
      if (field.id === 'size') return '500ml';
      if (field.id === 'color') return 'White / Black';
      if (field.id === 'hex_color_code') return '#FFFFFF';
      if (field.id === 'material') return 'Cotton 100%';
      if (field.id === 'manufacturer') return 'Thai Manufacturing Co., Ltd.';
      if (field.id === 'pack_size') return '6 pcs/pack';
      if (field.id === 'season_code') return 'SS25';
      if (field.id === 'article_number') return 'ART-2025-0001';
      if (field.id === 'group_name') return 'Color Variants Group';
      if (field.id === 'sku_reference') return 'SKU-REF-001';
      if (field.id === 'group_barcode') return '8851234567899';
      return 'Sample Value';
  }
};

// Fetch a random product image from Picsum and convert to File
const fetchRandomProductImage = async (fieldId: string): Promise<File | null> => {
  try {
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

// Calculate CBM from carton dimensions
const calculateCBM = (l: number, w: number, h: number): number => {
  return (l * w * h) / 1000000; // Convert cm³ to m³
};

interface NPDFormProps {
  userRole: UserType;
  editingSubmission?: NPDSubmission | null;
  onSubmitSuccess?: () => void;
  onCancel?: () => void;
}

export function NPDForm({ userRole, editingSubmission, onSubmitSuccess, onCancel }: NPDFormProps) {
  const { createSubmission, updateFormData } = useSubmissions();
  
  // Draft tracking state
  const [currentSubmissionId, setCurrentSubmissionId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  
  // Setup State
  const [setupComplete, setSetupComplete] = useState(false);
  const [selectedDivision, setSelectedDivision] = useState<Division | null>(null);
  const [pendingDivision, setPendingDivision] = useState<Division | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const channel: ChannelType = 'both';

  // Form State
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<Record<string, string | number | File | null>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [completedSections, setCompletedSections] = useState<SupplierFormSection[]>([]);

  // Initialize form when editing an existing submission
  useEffect(() => {
    if (editingSubmission) {
      setCurrentSubmissionId(editingSubmission.id);
      setSelectedDivision(editingSubmission.division);
      setSetupComplete(true);
      setFormData(editingSubmission.formData || {});
      if (Object.keys(editingSubmission.formData || {}).length > 0) {
        setCompletedSections(['product_identification']);
      }
    }
  }, [editingSubmission]);

  // Handle division selection with confirmation
  const handleDivisionSelect = (division: Division) => {
    setPendingDivision(division);
  };

  const handleConfirmDivision = () => {
    if (pendingDivision) {
      setSelectedDivision(pendingDivision);
      setSetupComplete(true);
      setPendingDivision(null);
      // Auto-populate supplier name
      setFormData(prev => ({
        ...prev,
        supplier_name: 'Demo Supplier Co., Ltd.',
      }));
    }
  };

  const handleCancelDivision = () => {
    setPendingDivision(null);
  };

  // Get current section and fields
  const currentSection = SUPPLIER_FORM_STEPS[currentStep];
  
  // Get all fields for current section, then apply conditional filtering
  const allSectionFields = useMemo(() => {
    if (!selectedDivision) return [];
    return getFieldsForSectionAndDivision(currentSection, selectedDivision);
  }, [selectedDivision, currentSection]);
  
  // Apply conditional visibility filtering based on form data
  const currentFields = useMemo(() => {
    if (!selectedDivision) return [];
    return getVisibleFields(allSectionFields, formData, selectedDivision);
  }, [selectedDivision, allSectionFields, formData]);

  // Calculate CBM when carton dimensions change
  const calculatedCBM = useMemo(() => {
    const l = formData['carton_dimension_l'] as number || 0;
    const w = formData['carton_dimension_w'] as number || 0;
    const h = formData['carton_dimension_h'] as number || 0;
    if (l && w && h) {
      return calculateCBM(l, w, h);
    }
    return null;
  }, [formData]);

  // Calculate progress
  const progress = useMemo(() => {
    const totalSteps = SUPPLIER_FORM_STEPS.length;
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

    // Handle category change - reset sub_category
    if (fieldId === 'category') {
      setFormData(prev => ({ ...prev, [fieldId]: value, sub_category: '' }));
    }
  };

  // Get dynamic dropdown options for sub_category
  const getSubCategoryOptions = (): string[] => {
    const category = formData['category'] as string;
    return PRODUCT_CATEGORIES[category] || [];
  };

  // Validate current section - only validates visible fields
  const validateCurrentSection = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    // Only validate currently visible fields
    currentFields.forEach(field => {
      // Validate mandatory fields
      if (field.requirement === 'mandatory' && field.inputType !== 'readonly' && field.inputType !== 'calculated') {
        const value = formData[field.id];
        if (!value || (typeof value === 'string' && value.trim() === '')) {
          newErrors[field.id] = `${field.name} is required`;
        }
      }
      
      // Conditional fields become mandatory when visible
      if (field.requirement === 'conditional') {
        const value = formData[field.id];
        if (!value || (typeof value === 'string' && value.trim() === '')) {
          newErrors[field.id] = `${field.name} is required when triggered`;
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
      setIsSaving(true);
      try {
        const productNameEn = (formData['product_name_en'] as string) || 'New Product';
        const productNameTh = (formData['product_name_th'] as string) || '';
        
        // Cast division to match mock data type
        const result = await createSubmission(
          selectedDivision! as 'HL' | 'DF' | 'SL' | 'FF' | 'GS' | 'HB',
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
    if (currentStep < SUPPLIER_FORM_STEPS.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleStepClick = (stepIndex: number) => {
    if (stepIndex <= currentStep || completedSections.includes(SUPPLIER_FORM_STEPS[stepIndex])) {
      setCurrentStep(stepIndex);
    }
  };

  // Save draft manually
  const handleSaveDraft = async () => {
    if (!currentSubmissionId) {
      toast.info('Complete Product Identification first to create a draft');
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
    for (let i = 0; i < SUPPLIER_FORM_STEPS.length; i++) {
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
        selectedDivision as 'HL' | 'DF' | 'SL' | 'FF' | 'GS' | 'HB',
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
    setFormData({ supplier_name: 'Demo Supplier Co., Ltd.' });
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
    const nonFileFields = currentFields.filter(f => f.inputType !== 'file' && f.inputType !== 'readonly' && f.inputType !== 'calculated');
    
    // Fill non-file fields immediately
    nonFileFields.forEach(field => {
      // Handle sub_category with dynamic options
      if (field.id === 'sub_category') {
        const category = newData['category'] as string || formData['category'] as string;
        const subCategories = PRODUCT_CATEGORIES[category];
        if (subCategories?.length) {
          newData[field.id] = subCategories[0];
        }
      } else {
        newData[field.id] = generateDummyValue(field, newData);
      }
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

  // Prepare fields with dynamic dropdown options
  const preparedFields = useMemo(() => {
    return currentFields.map(field => {
      if (field.id === 'sub_category') {
        return {
          ...field,
          dropdownOptions: getSubCategoryOptions(),
        };
      }
      return field;
    });
  }, [currentFields, formData['category']]);

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
              New Product Registration
            </h1>
            <p className="text-muted-foreground max-w-lg mx-auto">
              Episode 1: Supplier Initial Registration (80 Fields)
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              เริ่มต้นกรอกข้อมูลสินค้าใหม่ กรุณาเลือกประเภทสินค้า
            </p>
          </div>

          {/* Division Selection */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Select Product Division</CardTitle>
              <CardDescription>
                เลือกประเภทสินค้าที่ต้องการเพิ่ม - Different divisions show different fields
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
                80 fields across 6 sections • Conditional fields based on division
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
                    {' '}({DIVISIONS[pendingDivision].category}) as a{' '}
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
                <Badge variant="outline" className="text-xs">
                  {DIVISIONS[selectedDivision!].category}
                </Badge>
                <span className="text-sm text-muted-foreground hidden sm:inline">
                  {userRole.toUpperCase()} • 80 Fields
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
                Form Sections (6)
              </h3>
              <ProgressStepper
                steps={SUPPLIER_FORM_STEPS}
                currentStep={currentStep}
                completedSteps={completedSections}
                onStepClick={handleStepClick}
                sectionInfo={SUPPLIER_FORM_SECTIONS}
              />
            </div>
          </aside>

          {/* Form Content */}
          <main className="flex-1 min-w-0">
            {/* Mobile Progress */}
            <div className="lg:hidden mb-6">
              <ProgressStepper
                steps={SUPPLIER_FORM_STEPS}
                currentStep={currentStep}
                completedSteps={completedSections}
                onStepClick={handleStepClick}
                sectionInfo={SUPPLIER_FORM_SECTIONS}
              />
            </div>

            {/* Form Card */}
            <Card>
              <CardContent className="p-6 sm:p-8">
                {/* Auto Fill Button */}
                <div className="flex justify-between items-center mb-6">
                  <div className="text-sm text-muted-foreground">
                    Section {currentStep + 1} of {SUPPLIER_FORM_STEPS.length} • {SUPPLIER_FORM_SECTIONS[currentSection].fieldCount} fields
                  </div>
                  <Button 
                    variant="secondary" 
                    size="sm" 
                    onClick={handleAutoFill}
                    disabled={isAutoFilling}
                  >
                    <Wand2 className={cn("w-4 h-4 mr-2", isAutoFilling && "animate-spin")} />
                    {isAutoFilling ? 'Fetching Images...' : 'Auto Fill Section'}
                  </Button>
                </div>
                
                <FormSectionComponent
                  section={currentSection}
                  fields={preparedFields}
                  values={formData}
                  errors={errors}
                  onChange={handleFieldChange}
                  calculatedValues={{
                    cbm_per_carton: calculatedCBM,
                  }}
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
                {currentStep === SUPPLIER_FORM_STEPS.length - 1 ? (
                  <Button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="bg-accent hover:bg-accent/90 text-accent-foreground"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    {isSubmitting ? 'Submitting...' : 'Submit for Review'}
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
