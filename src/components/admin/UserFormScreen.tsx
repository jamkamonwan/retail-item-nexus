import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UserProfile, CreateUserData, UpdateUserData, Supplier, UserTypeValue } from '@/types/admin';
import { USER_TYPES, UserType } from '@/types/npd';
import { mockSupplierGroups } from '@/data/mock/supplierGroups';
import { Wand2, Info, ArrowLeft } from 'lucide-react';

const DUMMY_FIRST_NAMES = ['John', 'Jane', 'Michael', 'Sarah', 'David', 'Emma', 'Chris', 'Lisa', 'Robert', 'Anna'];
const DUMMY_LAST_NAMES = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Martinez', 'Wilson'];
const DUMMY_ROLES: UserType[] = ['buyer', 'commercial', 'finance', 'scm', 'im', 'admin', 'supplier_admin'];

const generateDummyUser = () => {
  const firstName = DUMMY_FIRST_NAMES[Math.floor(Math.random() * DUMMY_FIRST_NAMES.length)];
  const lastName = DUMMY_LAST_NAMES[Math.floor(Math.random() * DUMMY_LAST_NAMES.length)];
  const role = DUMMY_ROLES[Math.floor(Math.random() * DUMMY_ROLES.length)];
  const timestamp = Date.now().toString().slice(-4);
  return {
    fullName: `${firstName} ${lastName}`,
    email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}.${timestamp}@example.com`,
    userType: role === 'supplier_admin' ? 'external' as const : 'internal' as const,
    role: role,
    supplierId: '',
    supplierGroupId: '',
  };
};

const userSchema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters').max(100, 'Name too long'),
  email: z.string().email('Invalid email format'),
  userType: z.enum(['internal', 'external']),
  role: z.string().min(1, 'Role is required'),
  supplierId: z.string().optional(),
  supplierGroupId: z.string().optional(),
});

type UserFormValues = z.infer<typeof userSchema>;

interface UserFormScreenProps {
  user?: UserProfile | null;
  suppliers: Supplier[];
  onSubmit: (data: CreateUserData | UpdateUserData) => Promise<void>;
  onBack: () => void;
}

export function UserFormScreen({ user, suppliers, onSubmit, onBack }: UserFormScreenProps) {
  const [submitting, setSubmitting] = useState(false);
  const isEditing = !!user;

  const form = useForm<UserFormValues>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      fullName: '', email: '', userType: 'internal', role: '', supplierId: '', supplierGroupId: '',
    },
  });

  const watchedRole = form.watch('role');
  const userType = form.watch('userType');
  const isSupplierAdmin = watchedRole === 'supplier_admin';

  useEffect(() => {
    if (isSupplierAdmin) form.setValue('userType', 'external');
  }, [isSupplierAdmin, form]);

  useEffect(() => {
    if (user) {
      form.reset({
        fullName: user.fullName || '', email: user.email || '', userType: user.userType,
        role: user.role, supplierId: user.supplierId || '', supplierGroupId: (user as any).supplierGroupId || '',
      });
    } else {
      form.reset({ fullName: '', email: '', userType: 'internal', role: '', supplierId: '', supplierGroupId: '' });
    }
  }, [user, form]);

  const handleSubmit = async (values: UserFormValues) => {
    setSubmitting(true);
    try {
      if (isEditing) {
        await onSubmit({
          userId: user!.id, fullName: values.fullName, userType: values.userType as UserTypeValue,
          role: values.role as UserType,
          supplierId: values.userType === 'external' && !isSupplierAdmin ? values.supplierId : undefined,
          supplierGroupId: isSupplierAdmin ? values.supplierGroupId : undefined,
        });
      } else {
        await onSubmit({
          email: values.email, fullName: values.fullName, userType: values.userType as UserTypeValue,
          role: values.role as UserType,
          supplierId: values.userType === 'external' && !isSupplierAdmin ? values.supplierId : undefined,
          supplierGroupId: isSupplierAdmin ? values.supplierGroupId : undefined,
        });
      }
      onBack();
    } finally {
      setSubmitting(false);
    }
  };

  const handleAutoFill = () => {
    const dummyData = generateDummyUser();
    dummyData.role = 'supplier_admin';
    dummyData.userType = 'external';
    const randomGroup = mockSupplierGroups[Math.floor(Math.random() * mockSupplierGroups.length)];
    dummyData.supplierGroupId = randomGroup?.id || '';
    form.reset(dummyData);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">{isEditing ? 'Edit User' : 'Create New User'}</h1>
            <p className="text-muted-foreground">{isEditing ? 'Update user account details' : 'Set up a new user account'}</p>
          </div>
        </div>
        {!isEditing && (
          <Button type="button" variant="outline" size="sm" onClick={handleAutoFill} className="gap-2">
            <Wand2 className="h-4 w-4" /> Auto Fill
          </Button>
        )}
      </div>

      {/* Form */}
      <Card>
        <CardHeader>
          <CardTitle>User Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            {/* Basic Info */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name *</Label>
                <Input id="fullName" {...form.register('fullName')} placeholder="Enter full name" />
                {form.formState.errors.fullName && <p className="text-sm text-destructive">{form.formState.errors.fullName.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input id="email" type="email" {...form.register('email')} placeholder="Enter email" disabled={isEditing} />
                {form.formState.errors.email && <p className="text-sm text-destructive">{form.formState.errors.email.message}</p>}
              </div>
            </div>

            {/* User Type */}
            <div className="space-y-2">
              <Label>User Type *</Label>
              <RadioGroup value={userType} onValueChange={(val) => form.setValue('userType', val as 'internal' | 'external')} className="flex gap-4" disabled={isSupplierAdmin}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="internal" id="internal" disabled={isSupplierAdmin} />
                  <Label htmlFor="internal" className="font-normal">Internal</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="external" id="external" />
                  <Label htmlFor="external" className="font-normal">External (Supplier)</Label>
                </div>
              </RadioGroup>
              {isSupplierAdmin && <p className="text-xs text-muted-foreground">Supplier Admin is always an external user</p>}
            </div>

            {/* Role */}
            <div className="space-y-2">
              <Label>Role *</Label>
              <Select value={form.watch('role')} onValueChange={(val) => form.setValue('role', val, { shouldValidate: true })}>
                <SelectTrigger><SelectValue placeholder="Select a role" /></SelectTrigger>
                <SelectContent>
                  {Object.entries(USER_TYPES).map(([key, value]) => (
                    <SelectItem key={key} value={key}>{value.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {form.formState.errors.role && <p className="text-sm text-destructive">{form.formState.errors.role.message}</p>}
            </div>

            {/* Supplier Partner for Supplier Admin */}
            {isSupplierAdmin && (
              <div className="space-y-3">
                <Label>Supplier Partner *</Label>
                <Select value={form.watch('supplierGroupId') || ''} onValueChange={(val) => form.setValue('supplierGroupId', val)}>
                  <SelectTrigger><SelectValue placeholder="Select a supplier partner" /></SelectTrigger>
                  <SelectContent>
                    {mockSupplierGroups.map((group) => (
                      <SelectItem key={group.id} value={group.id}>{group.name} ({group.supplierIds.length} codes)</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="flex items-start gap-2 rounded-md bg-muted/50 p-3">
                  <Info className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                  <p className="text-xs text-muted-foreground">
                    Supplier Admin does not count toward the tier's normal user limit. A welcome email with a secure password setup link will be sent upon creation.
                  </p>
                </div>
              </div>
            )}

            {/* Single Supplier */}
            {userType === 'external' && !isSupplierAdmin && (
              <div className="space-y-2">
                <Label>Supplier</Label>
                <Select value={form.watch('supplierId') || ''} onValueChange={(val) => form.setValue('supplierId', val)}>
                  <SelectTrigger><SelectValue placeholder="Select supplier" /></SelectTrigger>
                  <SelectContent>
                    {suppliers.map((s) => (
                      <SelectItem key={s.id} value={s.id}>{s.name} ({s.code})</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t">
              <Button type="button" variant="outline" onClick={onBack} disabled={submitting}>Cancel</Button>
              <Button type="submit" disabled={submitting}>
                {submitting ? 'Saving...' : isEditing ? 'Update User' : isSupplierAdmin ? 'Provision & Send' : 'Create User'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
