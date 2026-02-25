import { useState, useEffect, useMemo } from 'react';
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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { UserProfile, CreateUserData, UpdateUserData, Supplier, UserTypeValue } from '@/types/admin';
import { USER_TYPES, UserType } from '@/types/npd';
import { Wand2, Search, X, Info } from 'lucide-react';

// Dummy data generator
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
  };
};

const userSchema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters').max(100, 'Name too long'),
  email: z.string().email('Invalid email format'),
  userType: z.enum(['internal', 'external']),
  role: z.string().min(1, 'Role is required'),
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
  const [selectedSupplierIds, setSelectedSupplierIds] = useState<string[]>([]);
  const [supplierSearch, setSupplierSearch] = useState('');
  const isEditing = !!user;

  const form = useForm<UserFormValues>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      fullName: '',
      email: '',
      userType: 'internal',
      role: '',
      supplierId: '',
    },
  });

  const watchedRole = form.watch('role');
  const userType = form.watch('userType');
  const isSupplierAdmin = watchedRole === 'supplier_admin';

  // Auto-switch to external when supplier_admin is selected
  useEffect(() => {
    if (isSupplierAdmin) {
      form.setValue('userType', 'external');
    }
  }, [isSupplierAdmin, form]);

  useEffect(() => {
    if (user) {
      form.reset({
        fullName: user.fullName || '',
        email: user.email || '',
        userType: user.userType,
        role: user.role,
        supplierId: user.supplierId || '',
      });
      setSelectedSupplierIds(user.supplierIds || []);
    } else {
      form.reset({
        fullName: '',
        email: '',
        userType: 'internal',
        role: '',
        supplierId: '',
      });
      setSelectedSupplierIds([]);
    }
    setSupplierSearch('');
  }, [user, form]);

  // Filter suppliers for search
  const filteredSuppliers = useMemo(() => {
    if (!supplierSearch.trim()) return suppliers.filter(s => s.isActive);
    const q = supplierSearch.toLowerCase();
    return suppliers.filter(s => 
      s.isActive && 
      (s.code.toLowerCase().includes(q) || s.name.toLowerCase().includes(q))
    );
  }, [suppliers, supplierSearch]);

  const addSupplier = (supplierId: string) => {
    if (!selectedSupplierIds.includes(supplierId)) {
      setSelectedSupplierIds(prev => [...prev, supplierId]);
    }
    setSupplierSearch('');
  };

  const removeSupplier = (supplierId: string) => {
    setSelectedSupplierIds(prev => prev.filter(id => id !== supplierId));
  };

  const handleSubmit = async (values: UserFormValues) => {
    setSubmitting(true);
    try {
      if (isEditing) {
        await onSubmit({
          userId: user!.id,
          fullName: values.fullName,
          userType: values.userType as UserTypeValue,
          role: values.role as UserType,
          supplierId: values.userType === 'external' && !isSupplierAdmin ? values.supplierId : undefined,
          supplierIds: isSupplierAdmin ? selectedSupplierIds : undefined,
        });
      } else {
        await onSubmit({
          email: values.email,
          fullName: values.fullName,
          userType: values.userType as UserTypeValue,
          role: values.role as UserType,
          supplierId: values.userType === 'external' && !isSupplierAdmin ? values.supplierId : undefined,
          supplierIds: isSupplierAdmin ? selectedSupplierIds : undefined,
        });
      }
      onOpenChange(false);
    } finally {
      setSubmitting(false);
    }
  };

  const handleAutoFill = () => {
    const dummyData = generateDummyUser();
    form.reset(dummyData);
    if (dummyData.role === 'supplier_admin') {
      // Pre-select a few random suppliers
      const activeSuppliers = suppliers.filter(s => s.isActive);
      const count = Math.min(3, activeSuppliers.length);
      const shuffled = [...activeSuppliers].sort(() => 0.5 - Math.random());
      setSelectedSupplierIds(shuffled.slice(0, count).map(s => s.id));
    } else {
      setSelectedSupplierIds([]);
    }
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
                disabled={isSupplierAdmin}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="internal" id="internal" disabled={isSupplierAdmin} />
                  <Label htmlFor="internal" className="font-normal">Internal</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="external" id="external" />
                  <Label htmlFor="external" className="font-normal">External (Supplier)</Label>
                </div>
              </RadioGroup>
              {isSupplierAdmin && (
                <p className="text-xs text-muted-foreground">Supplier Admin is always an external user</p>
              )}
            </div>

            {/* Role */}
            <div className="space-y-2">
              <Label>Role *</Label>
              <Select
                value={form.watch('role')}
                onValueChange={(val) => form.setValue('role', val, { shouldValidate: true })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(USER_TYPES).map(([key, value]) => (
                    <SelectItem key={key} value={key}>
                      {value.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {form.formState.errors.role && (
                <p className="text-sm text-destructive">{form.formState.errors.role.message}</p>
              )}
            </div>

            {/* Multi-Supplier Selector for Supplier Admin */}
            {isSupplierAdmin && (
              <div className="space-y-3">
                <Label>Assigned Supplier Codes *</Label>
                
                {/* Search Input */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by supplier code or name..."
                    value={supplierSearch}
                    onChange={(e) => setSupplierSearch(e.target.value)}
                    className="pl-9"
                  />
                </div>

                {/* Search Results Dropdown */}
                {supplierSearch.trim() && (
                  <div className="border rounded-md max-h-40 overflow-y-auto bg-background shadow-sm">
                    {filteredSuppliers.length === 0 ? (
                      <p className="p-3 text-sm text-muted-foreground">No suppliers found</p>
                    ) : (
                      filteredSuppliers
                        .filter(s => !selectedSupplierIds.includes(s.id))
                        .map(s => (
                          <button
                            key={s.id}
                            type="button"
                            onClick={() => addSupplier(s.id)}
                            className="w-full text-left px-3 py-2 hover:bg-accent transition-colors flex items-center gap-3 text-sm border-b last:border-b-0"
                          >
                            <span className="font-mono font-medium text-primary">{s.code}</span>
                            <span className="text-foreground">{s.name}</span>
                          </button>
                        ))
                    )}
                  </div>
                )}

                {/* Selected Suppliers List */}
                {selectedSupplierIds.length > 0 && (
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground font-medium">
                      Selected Suppliers ({selectedSupplierIds.length}):
                    </p>
                    <div className="border rounded-md divide-y">
                      {selectedSupplierIds.map(id => {
                        const supplier = suppliers.find(s => s.id === id);
                        if (!supplier) return null;
                        return (
                          <div key={id} className="flex items-center justify-between px-3 py-2">
                            <div className="flex items-center gap-3">
                              <Badge variant="outline" className="font-mono">{supplier.code}</Badge>
                              <span className="text-sm">{supplier.name}</span>
                            </div>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeSupplier(id)}
                              className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive"
                            >
                              <X className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Info Note */}
                <div className="flex items-start gap-2 rounded-md bg-muted/50 p-3">
                  <Info className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                  <p className="text-xs text-muted-foreground">
                    Supplier Admin does not count toward the tier's normal user limit. 
                    A welcome email with a secure password setup link will be sent upon creation.
                  </p>
                </div>
              </div>
            )}

            {/* Single Supplier (for external non-admin users) */}
            {userType === 'external' && !isSupplierAdmin && (
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
            {submitting ? 'Saving...' : isEditing ? 'Update User' : isSupplierAdmin ? 'Provision & Send' : 'Create User'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
