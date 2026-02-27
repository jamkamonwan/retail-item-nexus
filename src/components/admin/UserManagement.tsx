import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { UserPlus, ArrowLeft, ShieldPlus } from 'lucide-react';
import { UserFiltersComponent } from './UserFilters';
import { UserTable } from './UserTable';
import { SupplierUserTable } from './SupplierUserTable';
import { UserFormScreen } from './UserFormScreen';
import { SupplierAdminWizard } from './SupplierAdminWizard';
import { useUsers } from '@/hooks/useUsers';
import { useSuppliers } from '@/hooks/useSuppliers';
import { useTiers } from '@/hooks/useTiers';
import { UserProfile, CreateUserData, UpdateUserData } from '@/types/admin';

type ViewState = 
  | { type: 'list' }
  | { type: 'create-user' }
  | { type: 'edit-user'; user: UserProfile }
  | { type: 'create-supplier-admin' };

interface UserManagementProps {
  onBack: () => void;
}

export function UserManagement({ onBack }: UserManagementProps) {
  const { users, loading, filters, setFilters, createUser, updateUser, deactivateUser, activateUser, resetPassword } = useUsers();
  const { suppliers } = useSuppliers();
  const { tiers } = useTiers();

  const supplierUsers = users.filter(u => u.role === 'supplier' || u.role === 'supplier_admin');
  const internalUsers = users.filter(u => u.role !== 'supplier' && u.role !== 'supplier_admin');

  const [view, setView] = useState<ViewState>({ type: 'list' });
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean; title: string; description: string; action: () => Promise<void>;
  }>({ open: false, title: '', description: '', action: async () => {} });

  const handleEdit = (user: UserProfile) => setView({ type: 'edit-user', user });
  const handleView = (user: UserProfile) => setView({ type: 'edit-user', user });
  const handleCreateNew = () => setView({ type: 'create-user' });
  const handleBackToList = () => setView({ type: 'list' });

  const handleFormSubmit = async (data: CreateUserData | UpdateUserData) => {
    if ('email' in data) {
      await createUser(data as CreateUserData);
    } else {
      await updateUser(data as UpdateUserData);
    }
  };

  const handleDeactivate = (user: UserProfile) => {
    setConfirmDialog({
      open: true, title: 'Deactivate User',
      description: `Are you sure you want to deactivate ${user.fullName || user.email}? They will no longer be able to log in.`,
      action: async () => { await deactivateUser(user.id); setConfirmDialog(prev => ({ ...prev, open: false })); },
    });
  };

  const handleActivate = (user: UserProfile) => {
    setConfirmDialog({
      open: true, title: 'Activate User',
      description: `Are you sure you want to activate ${user.fullName || user.email}?`,
      action: async () => { await activateUser(user.id); setConfirmDialog(prev => ({ ...prev, open: false })); },
    });
  };

  const handleResetPassword = (user: UserProfile) => {
    setConfirmDialog({
      open: true, title: 'Reset Password',
      description: `Are you sure you want to reset the password for ${user.fullName || user.email}?`,
      action: async () => { await resetPassword(user.id); setConfirmDialog(prev => ({ ...prev, open: false })); },
    });
  };

  const handleBulkResetPassword = (userIds: string[]) => {
    setConfirmDialog({
      open: true, title: 'Bulk Reset Password',
      description: `Are you sure you want to reset passwords for ${userIds.length} user(s)?`,
      action: async () => { for (const id of userIds) await resetPassword(id); setConfirmDialog(prev => ({ ...prev, open: false })); },
    });
  };

  const handleBulkDeactivate = (userIds: string[]) => {
    setConfirmDialog({
      open: true, title: 'Bulk Deactivate Users',
      description: `Are you sure you want to deactivate ${userIds.length} user(s)?`,
      action: async () => { for (const id of userIds) await deactivateUser(id); setConfirmDialog(prev => ({ ...prev, open: false })); },
    });
  };

  // Render based on current view
  if (view.type === 'create-supplier-admin') {
    return (
      <SupplierAdminWizard
        tiers={tiers}
        onSubmit={async (data) => { await createUser(data); }}
        onBack={handleBackToList}
      />
    );
  }

  if (view.type === 'create-user' || view.type === 'edit-user') {
    return (
      <UserFormScreen
        user={view.type === 'edit-user' ? view.user : null}
        suppliers={suppliers}
        onSubmit={handleFormSubmit}
        onBack={handleBackToList}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">User Management</h1>
            <p className="text-muted-foreground">Manage user accounts, roles, and permissions</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setView({ type: 'create-supplier-admin' })} className="gap-2">
            <ShieldPlus className="h-4 w-4" />
            Create Supplier Admin
          </Button>
          <Button onClick={handleCreateNew} className="gap-2">
            <UserPlus className="h-4 w-4" />
            Create User
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <UserFiltersComponent filters={filters} onFiltersChange={setFilters} />
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="supplier" className="space-y-4">
        <TabsList>
          <TabsTrigger value="supplier">Supplier Users ({supplierUsers.length})</TabsTrigger>
          <TabsTrigger value="internal">Internal Users ({internalUsers.length})</TabsTrigger>
        </TabsList>
        <TabsContent value="supplier">
          <Card>
            <CardHeader><CardTitle>Supplier Users</CardTitle></CardHeader>
            <CardContent>
              <SupplierUserTable users={supplierUsers} loading={loading} onEdit={handleEdit} onView={handleView}
                onDeactivate={handleDeactivate} onActivate={handleActivate} onResetPassword={handleResetPassword}
                onBulkResetPassword={handleBulkResetPassword} onBulkDeactivate={handleBulkDeactivate} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="internal">
          <Card>
            <CardHeader><CardTitle>Internal Users</CardTitle></CardHeader>
            <CardContent>
              <UserTable users={internalUsers} loading={loading} onEdit={handleEdit} onView={handleView}
                onDeactivate={handleDeactivate} onActivate={handleActivate} onResetPassword={handleResetPassword}
                onBulkResetPassword={handleBulkResetPassword} onBulkDeactivate={handleBulkDeactivate} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Confirmation Dialog */}
      <AlertDialog open={confirmDialog.open} onOpenChange={(open) => setConfirmDialog(prev => ({ ...prev, open }))}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{confirmDialog.title}</AlertDialogTitle>
            <AlertDialogDescription>{confirmDialog.description}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDialog.action}>Confirm</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
