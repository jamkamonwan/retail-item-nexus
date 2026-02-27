import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent } from '@/components/ui/card';
import { Check, ArrowLeft, ArrowRight, Send, Wand2, Users, Layers, Package, CheckCircle2 } from 'lucide-react';
import { MockTier, SYSTEM_MODULES } from '@/data/mock/tiers';
import { mockSupplierGroups } from '@/data/mock/supplierGroups';
import { CreateUserData } from '@/types/admin';
import { cn } from '@/lib/utils';

const THAI_FIRST_NAMES = ['Somchai', 'Siriporn', 'Thanakorn', 'Nattaya', 'Kittipong', 'Prawit', 'Arunee', 'Boonsri'];
const THAI_LAST_NAMES = ['Rattanapong', 'Srisombat', 'Jantarawong', 'Kumkrong', 'Chaiyasit', 'Thongsuk'];

const WIZARD_STEPS = [
  { key: 'access_plan', label: 'Access Plan', icon: Layers },
  { key: 'supplier_partner', label: 'Supplier Partner', icon: Package },
  { key: 'create_user', label: 'Create User', icon: Users },
  { key: 'review', label: 'Review & Send', icon: Send },
] as const;

interface SupplierAdminWizardProps {
  tiers: MockTier[];
  onSubmit: (data: CreateUserData) => Promise<void>;
  onBack: () => void;
}

export function SupplierAdminWizard({ tiers, onSubmit, onBack }: SupplierAdminWizardProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedTierId, setSelectedTierId] = useState<string | null>(null);
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const selectedTier = useMemo(() => tiers.find(t => t.id === selectedTierId), [tiers, selectedTierId]);
  const selectedGroup = useMemo(() => mockSupplierGroups.find(g => g.id === selectedGroupId), [selectedGroupId]);

  const availableGroups = useMemo(() => {
    if (!selectedTier) return [];
    return mockSupplierGroups.filter(g => selectedTier.assignedGroups.includes(g.id));
  }, [selectedTier]);

  const tierModules = useMemo(() => {
    if (!selectedTier) return [];
    return SYSTEM_MODULES.filter(m => selectedTier.activeModules.includes(m.id));
  }, [selectedTier]);

  const canProceed = () => {
    switch (currentStep) {
      case 0: return !!selectedTierId;
      case 1: return !!selectedGroupId;
      case 2: return fullName.trim().length >= 2 && email.includes('@');
      case 3: return true;
      default: return false;
    }
  };

  const getStepSubtitle = (stepIndex: number) => {
    switch (stepIndex) {
      case 0: return selectedTier ? `${selectedTier.name} selected` : 'Select a plan';
      case 1: return selectedGroup ? selectedGroup.name : 'Choose partner';
      case 2: return 'Fill user details';
      case 3: return 'Confirm & invite';
      default: return '';
    }
  };

  const handleNext = () => { if (currentStep < 3) setCurrentStep(currentStep + 1); };
  const handleBack = () => { if (currentStep > 0) setCurrentStep(currentStep - 1); };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      await onSubmit({
        email,
        fullName,
        role: 'supplier_admin',
        userType: 'external',
        supplierGroupId: selectedGroupId!,
      });
      setSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  };

  const handleAutoFill = () => {
    const first = THAI_FIRST_NAMES[Math.floor(Math.random() * THAI_FIRST_NAMES.length)];
    const last = THAI_LAST_NAMES[Math.floor(Math.random() * THAI_LAST_NAMES.length)];
    const ts = Date.now().toString().slice(-4);
    setFullName(`${first} ${last}`);
    setEmail(`${first.toLowerCase()}.${last.toLowerCase().charAt(0)}.${ts}@example.com`);
  };

  const handleTierSelect = (tierId: string) => {
    setSelectedTierId(tierId);
    const tier = tiers.find(t => t.id === tierId);
    if (tier && selectedGroupId && !tier.assignedGroups.includes(selectedGroupId)) {
      setSelectedGroupId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Create Supplier Admin</h1>
          <p className="text-muted-foreground">Setup wizard for provisioning a new supplier admin user</p>
        </div>
      </div>

      {/* Stepper */}
      <Card>
        <CardContent className="pt-6 pb-4">
          <p className="text-xs font-mono text-muted-foreground mb-4 tracking-wider uppercase">
            Setup Wizard — Create Supplier Admin User
          </p>
          <div className="flex items-start justify-between gap-2">
            {WIZARD_STEPS.map((step, idx) => {
              const isCompleted = idx < currentStep;
              const isCurrent = idx === currentStep;
              return (
                <button
                  key={step.key}
                  onClick={() => idx < currentStep && setCurrentStep(idx)}
                  disabled={idx > currentStep}
                  className={cn(
                    'flex flex-col items-center gap-1.5 flex-1 group transition-colors',
                    idx > currentStep && 'opacity-40 cursor-not-allowed',
                    idx < currentStep && 'cursor-pointer',
                  )}
                >
                  <div className={cn(
                    'w-9 h-9 rounded-full flex items-center justify-center text-sm font-medium border-2 transition-all',
                    isCompleted && 'bg-primary border-primary text-primary-foreground',
                    isCurrent && 'border-primary text-primary bg-background',
                    !isCompleted && !isCurrent && 'border-muted-foreground/30 text-muted-foreground',
                  )}>
                    {isCompleted ? <Check className="h-4 w-4" /> : idx + 1}
                  </div>
                  <span className={cn(
                    'text-xs font-medium',
                    isCurrent || isCompleted ? 'text-primary' : 'text-muted-foreground',
                  )}>{step.label}</span>
                  <span className="text-[10px] text-muted-foreground leading-tight">
                    {getStepSubtitle(idx)}
                  </span>
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Step Content */}
      <Card>
        <CardContent className="pt-6">
          {/* Step 1: Access Plan */}
          {currentStep === 0 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold">Step 1 — Select Access Plan</h3>
                <p className="text-sm text-muted-foreground">Choose the access plan that determines which modules this supplier admin will manage.</p>
              </div>
              <RadioGroup value={selectedTierId || ''} onValueChange={handleTierSelect} className="space-y-3">
                {tiers.map(tier => {
                  const moduleCount = tier.activeModules.length;
                  const groupCount = tier.assignedGroups.length;
                  return (
                    <label key={tier.id} className={cn(
                      'flex items-start gap-4 p-4 rounded-lg border-2 cursor-pointer transition-all',
                      selectedTierId === tier.id ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/40',
                    )}>
                      <RadioGroupItem value={tier.id} className="mt-1" />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold">{tier.name}</span>
                          <Badge variant="outline" className={tier.color}>{tier.description.split('—')[0].trim()}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{tier.description}</p>
                        <div className="flex gap-4 mt-2 text-xs text-muted-foreground">
                          <span>{moduleCount} modules</span>
                          <span>{tier.maxUsers} max users</span>
                          <span>{groupCount} partner{groupCount !== 1 ? 's' : ''} assigned</span>
                        </div>
                      </div>
                    </label>
                  );
                })}
              </RadioGroup>
            </div>
          )}

          {/* Step 2: Supplier Partner */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold">Step 2 — Select Supplier Partner</h3>
                  <p className="text-sm text-muted-foreground">Only partners in {selectedTier?.name} are shown.</p>
                </div>
                <Badge variant="outline" className={selectedTier?.color}>{selectedTier?.name}</Badge>
              </div>
              {availableGroups.length === 0 ? (
                <Card><CardContent className="py-8 text-center text-muted-foreground">
                  <p>No supplier partners are assigned to {selectedTier?.name} yet.</p>
                  <p className="text-sm mt-1">Go to Supplier Partner Management to assign groups first.</p>
                </CardContent></Card>
              ) : (
                <RadioGroup value={selectedGroupId || ''} onValueChange={setSelectedGroupId} className="space-y-3">
                  {availableGroups.map(group => (
                    <label key={group.id} className={cn(
                      'flex items-start gap-4 p-4 rounded-lg border-2 cursor-pointer transition-all',
                      selectedGroupId === group.id ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/40',
                    )}>
                      <RadioGroupItem value={group.id} className="mt-1" />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold">{group.name}</span>
                          <Badge variant="secondary">{group.supplierIds.length} codes</Badge>
                        </div>
                        {group.description && <p className="text-sm text-muted-foreground">{group.description}</p>}
                      </div>
                    </label>
                  ))}
                </RadioGroup>
              )}
            </div>
          )}

          {/* Step 3: Create User */}
          {currentStep === 2 && (
            <div className="space-y-5">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold">Step 3 — Create Supplier Admin</h3>
                  <p className="text-sm text-muted-foreground">Fill in the user's details. Role will be set to Supplier Admin automatically.</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">Context:</span>
                  <Badge variant="outline" className={selectedTier?.color}>{selectedTier?.name}</Badge>
                  <span className="text-xs text-muted-foreground">›</span>
                  <span className="text-sm font-medium">{selectedGroup?.name}</span>
                </div>
              </div>

              <div className="flex justify-end">
                <Button type="button" variant="outline" size="sm" onClick={handleAutoFill} className="gap-2">
                  <Wand2 className="h-4 w-4" /> Auto Fill
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Full Name *</Label>
                  <Input value={fullName} onChange={e => setFullName(e.target.value)} placeholder="Enter full name" />
                </div>
                <div className="space-y-2">
                  <Label>Email Address *</Label>
                  <Input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Enter email" />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Role</Label>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-lg border-2 border-primary bg-primary/5">
                    <p className="font-medium text-sm">Supplier Admin</p>
                    <p className="text-xs text-muted-foreground">Manages team & module access for their group</p>
                  </div>
                  <div className="p-3 rounded-lg border border-border opacity-50">
                    <p className="font-medium text-sm text-muted-foreground">Supplier User</p>
                    <p className="text-xs text-muted-foreground">Created by Supplier Admin after setup</p>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Supplier Partner *</Label>
                <div className="flex items-center justify-between p-3 rounded-lg border bg-muted/30">
                  <span className="font-medium">{selectedGroup?.name}</span>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className={selectedTier?.color}>{selectedTier?.name}</Badge>
                    <span className="text-sm text-muted-foreground">{selectedGroup?.supplierIds.length} codes</span>
                  </div>
                </div>
              </div>

              <Card className="bg-muted/20">
                <CardContent className="pt-4 pb-4">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-xs font-mono uppercase tracking-wider text-muted-foreground font-semibold">Modules this user will access</p>
                    <Badge variant="outline" className={selectedTier?.color}>{selectedTier?.name} — {selectedTier?.description.split('—')[0].trim()}</Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {tierModules.map(mod => (
                      <div key={mod.id} className="flex items-center gap-2 text-sm">
                        <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                        <span>{mod.name}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Step 4: Review & Send */}
          {currentStep === 3 && !submitted && (
            <div className="space-y-5">
              <div>
                <h3 className="text-lg font-semibold">Step 4 — Review & Send Invitation</h3>
                <p className="text-sm text-muted-foreground">Review the details below and confirm to create the account and send the welcome email.</p>
              </div>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">Full Name</p>
                    <p className="font-medium">{fullName}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">Email</p>
                    <p className="font-medium">{email}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">Role</p>
                    <p className="font-medium">Supplier Admin</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">User Type</p>
                    <p className="font-medium">External</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">Access Plan</p>
                    <Badge variant="outline" className={selectedTier?.color}>{selectedTier?.name}</Badge>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">Supplier Partner</p>
                    <p className="font-medium">{selectedGroup?.name} ({selectedGroup?.supplierIds.length} codes)</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">Modules ({tierModules.length})</p>
                  <div className="flex flex-wrap gap-2">
                    {tierModules.map(mod => <Badge key={mod.id} variant="secondary">{mod.name}</Badge>)}
                  </div>
                </div>
              </div>
              <Card className="bg-muted/30 border-dashed">
                <CardContent className="py-3 text-sm text-muted-foreground">
                  A welcome email with a secure password setup link will be sent to <strong>{email}</strong>. This account does not count toward the tier's user limit.
                </CardContent>
              </Card>
            </div>
          )}

          {/* Success Screen */}
          {currentStep === 3 && submitted && (
            <div className="py-8 text-center space-y-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
                <CheckCircle2 className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Supplier Admin Created!</h3>
              <p className="text-sm text-muted-foreground max-w-md mx-auto">
                A welcome email has been sent to <strong>{email}</strong> with instructions to set up their password and access the portal.
              </p>
              <div className="flex items-center justify-center gap-4 text-sm">
                <Badge variant="outline" className={selectedTier?.color}>{selectedTier?.name}</Badge>
                <span className="text-muted-foreground">›</span>
                <span className="font-medium">{selectedGroup?.name}</span>
                <span className="text-muted-foreground">›</span>
                <span className="font-medium">{fullName}</span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Footer Navigation */}
      <div className="flex items-center justify-between">
        {!submitted ? (
          <>
            <Button variant="outline" onClick={currentStep === 0 ? onBack : handleBack} className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              {currentStep === 0 ? 'Cancel' : 'Back'}
            </Button>
            {currentStep < 3 ? (
              <Button onClick={handleNext} disabled={!canProceed()} className="gap-2">
                {WIZARD_STEPS[currentStep + 1]?.label || 'Next'}
                <ArrowRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button onClick={handleSubmit} disabled={submitting} className="gap-2">
                {submitting ? 'Creating...' : 'Create & Send Invite'}
                <Send className="h-4 w-4" />
              </Button>
            )}
          </>
        ) : (
          <div className="flex-1 flex justify-end">
            <Button onClick={onBack}>Back to User Management</Button>
          </div>
        )}
      </div>
    </div>
  );
}
