import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { UserProfile, CreateUserData, UpdateUserData, Department, Supplier, UserTypeValue } from '@/types/admin';
import { USER_TYPES, UserType } from '@/types/npd';
import { Wand2 } from 'lucide-react';

// Dummy data generator
const DUMMY_FIRST_NAMES = ['John', 'Jane', 'Michael', 'Sarah', 'David', 'Emma', 'Chris', 'Lisa', 'Robert', 'Anna'];
const DUMMY_LAST_NAMES = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Martinez', 'Wilson'];
const DUMMY_ROLES = ['buyer', 'commercial', 'finance', 'scm', 'im', 'admin'];

const generateDummyUser = () => {
  const firstName = DUMMY_FIRST_NAMES[Math.floor(Math.random() * DUMMY_FIRST_NAMES.length)];
  const lastName = DUMMY_LAST_NAMES[Math.floor(Math.random() * DUMMY_LAST_NAMES.length)];
  const role = DUMMY_ROLES[Math.floor(Math.random() * DUMMY_ROLES.length)];
  const timestamp = Date.now().toString().slice(-4);
  
  return {
    fullName: `${firstName} ${lastName}`,
    email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}.${timestamp}@example.com`,
    userType: 'internal' as const,
    roles: [role],
    supplierId: '',
  };
};
const userSchema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters').max(100, 'Name too long'),
  email: z.string().email('Invalid email format'),
  userType: z.enum(['internal', 'external']),
  roles: z.array(z.string()).min(1, 'At least one role required'),
  supplierId: z.string().optional(),
});

type UserFormValues = z.infer<typeof userSchema>;

interface UserFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user?: UserProfile | null;
  suppliers: Supplier[];
  onSubmit: (data: CreateUserData | UpdateUserData) => Promise<void>;
}

export function UserFormDialog({
  open,
  onOpenChange,
  user,
  suppliers,
  onSubmit,
}: UserFormDialogProps) {
  const [submitting, setSubmitting] = useState(false);
  const isEditing = !!user;

  const form = useForm<UserFormValues>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      fullName: '',
      email: '',
      userType: 'internal',
      roles: [],
      supplierId: '',
    },
  });

  const userType = form.watch('userType');

  useEffect(() => {
    if (user) {
      form.reset({
        fullName: user.full_name || '',
        email: user.email || '',
        userType: user.user_type,
        roles: user.roles,
        supplierId: user.supplier?.id || '',
      });
    } else {
      form.reset({
        fullName: '',
        email: '',
        userType: 'internal',
        roles: [],
        supplierId: '',
      });
    }
  }, [user, form]);

  const handleSubmit = async (values: UserFormValues) => {
    setSubmitting(true);
    try {
      if (isEditing) {
        await onSubmit({
          userId: user!.user_id,
          fullName: values.fullName,
          userType: values.userType as UserTypeValue,
          roles: values.roles,
          supplierId: values.userType === 'external' ? values.supplierId : undefined,
        });
      } else {
        await onSubmit({
          email: values.email,
          fullName: values.fullName,
          userType: values.userType as UserTypeValue,
          roles: values.roles,
          supplierId: values.userType === 'external' ? values.supplierId : undefined,
        });
      }
      onOpenChange(false);
    } finally {
      setSubmitting(false);
    }
  };

  const toggleRole = (role: string) => {
    const current = form.getValues('roles');
    const updated = current.includes(role)
      ? current.filter((r) => r !== role)
      : [...current, role];
    form.setValue('roles', updated, { shouldValidate: true });
  };

  const selectedRoles = form.watch('roles');

  const handleAutoFill = () => {
    const dummyData = generateDummyUser();
    form.reset(dummyData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh]">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>{isEditing ? 'Edit User' : 'Create New User'}</DialogTitle>
            {!isEditing && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAutoFill}
                className="gap-2"
              >
                <Wand2 className="h-4 w-4" />
                Auto Fill
              </Button>
            )}
          </div>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh] pr-4">
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            {/* Basic Info */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name *</Label>
                <Input
                  id="fullName"
                  {...form.register('fullName')}
                  placeholder="Enter full name"
                />
                {form.formState.errors.fullName && (
                  <p className="text-sm text-destructive">{form.formState.errors.fullName.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  {...form.register('email')}
                  placeholder="Enter email"
                  disabled={isEditing}
                />
                {form.formState.errors.email && (
                  <p className="text-sm text-destructive">{form.formState.errors.email.message}</p>
                )}
              </div>
            </div>

            {/* User Type */}
            <div className="space-y-2">
              <Label>User Type *</Label>
              <RadioGroup
                value={userType}
                onValueChange={(val) => form.setValue('userType', val as 'internal' | 'external')}
                className="flex gap-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="internal" id="internal" />
                  <Label htmlFor="internal" className="font-normal">Internal</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="external" id="external" />
                  <Label htmlFor="external" className="font-normal">External (Supplier)</Label>
                </div>
              </RadioGroup>
            </div>

            {/* Roles */}
            <div className="space-y-2">
              <Label>Roles * (select at least one)</Label>
              <div className="grid grid-cols-4 gap-2 p-3 border rounded-md bg-muted/30">
                {Object.entries(USER_TYPES).map(([key, value]) => (
                  <div key={key} className="flex items-center space-x-2">
                    <Checkbox
                      id={`role-${key}`}
                      checked={selectedRoles.includes(key)}
                      onCheckedChange={() => toggleRole(key)}
                    />
                    <Label htmlFor={`role-${key}`} className="font-normal text-sm">
                      {value.label}
                    </Label>
                  </div>
                ))}
              </div>
              {form.formState.errors.roles && (
                <p className="text-sm text-destructive">{form.formState.errors.roles.message}</p>
              )}
            </div>

            {/* Supplier (for external users) */}
            {userType === 'external' && (
              <div className="space-y-2">
                <Label>Supplier</Label>
                <Select
                  value={form.watch('supplierId') || ''}
                  onValueChange={(val) => form.setValue('supplierId', val)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select supplier" />
                  </SelectTrigger>
                  <SelectContent>
                    {suppliers.map((s) => (
                      <SelectItem key={s.id} value={s.id}>
                        {s.name} ({s.code})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </form>
        </ScrollArea>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={submitting}>
            Cancel
          </Button>
          <Button onClick={form.handleSubmit(handleSubmit)} disabled={submitting}>
            {submitting ? 'Saving...' : isEditing ? 'Update User' : 'Create User'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
