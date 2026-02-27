import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { StaffUserFormDialog } from '@/components/admin/StaffUserFormDialog';
import { StaffModuleDialog } from '@/components/admin/StaffModuleDialog';
import { useSupplierStaff } from '@/hooks/useSupplierStaff';
import { MockUser } from '@/data/mock/users';
import { UserPlus, Users, Shield, AlertTriangle, KeyRound, UserCheck, UserX } from 'lucide-react';

interface SupplierAdminDashboardProps {
  userId?: string;
  supplierGroupId?: string;
}

export function SupplierAdminDashboard({ userId, supplierGroupId }: SupplierAdminDashboardProps) {
  const {
    group, tier, staffUsers, activeCount, maxUsers, canCreateUser,
    availableModules, createStaffUser, toggleUserStatus, updateModules,
    resetPassword, bulkSetStatus,
  } = useSupplierStaff({ id: userId, supplierGroupId });

  const [createOpen, setCreateOpen] = useState(false);
  const [moduleUser, setModuleUser] = useState<MockUser | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const limitReached = !canCreateUser;
  const allSelected = staffUsers.length > 0 && selectedIds.length === staffUsers.length;
  const someSelected = selectedIds.length > 0;

  const toggleSelectAll = () => {
    setSelectedIds(allSelected ? [] : staffUsers.map(u => u.id));
  };

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const handleBulkAction = (action: 'reset' | 'active' | 'inactive') => {
    if (action === 'reset') resetPassword(selectedIds);
    else bulkSetStatus(selectedIds, action);
    setSelectedIds([]);
  };

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                {group?.name ?? 'My Group'}
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Manage your team members and module access
              </p>
            </div>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span>
                    <Button
                      onClick={() => setCreateOpen(true)}
                      disabled={limitReached}
                      className="gap-2"
                    >
                      <UserPlus className="h-4 w-4" />
                      Create Staff User
                    </Button>
                  </span>
                </TooltipTrigger>
                {limitReached && (
                  <TooltipContent>
                    <p>User limit reached. Deactivate a user first.</p>
                  </TooltipContent>
                )}
              </Tooltip>
            </TooltipProvider>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">Active Users</span>
            <span className={`text-lg font-bold ${limitReached ? 'text-destructive' : ''}`}>
              {activeCount} / {maxUsers}
            </span>
            {limitReached && <span className="text-xs font-semibold text-destructive">LIMIT REACHED</span>}
          </div>
          {limitReached && (
            <div className="mt-3 flex items-center gap-2 text-sm text-destructive">
              <AlertTriangle className="h-4 w-4" />
              Toggle a resigned user to "Inactive" before creating a new staff user.
            </div>
          )}
        </CardContent>
      </Card>

      {/* Bulk Action Toolbar */}
      <Card>
        <CardContent className="py-3">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-sm font-medium">{selectedIds.length} selected</span>
              <Button variant="outline" size="sm" className="gap-1.5" disabled={!someSelected} onClick={() => handleBulkAction('reset')}>
                <KeyRound className="h-3.5 w-3.5" />
                Reset Password
              </Button>
              <Button variant="outline" size="sm" className="gap-1.5" disabled={!someSelected} onClick={() => handleBulkAction('active')}>
                <UserCheck className="h-3.5 w-3.5" />
                Set Active
              </Button>
              <Button variant="outline" size="sm" className="gap-1.5" disabled={!someSelected} onClick={() => handleBulkAction('inactive')}>
                <UserX className="h-3.5 w-3.5" />
                Set Inactive
              </Button>
            </div>
          </CardContent>
        </Card>

      {/* Staff Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Staff Users</CardTitle>
        </CardHeader>
        <CardContent>
          {staffUsers.length === 0 ? (
            <p className="text-sm text-muted-foreground py-8 text-center">No staff users yet. Create one to get started.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-10">
                    <Checkbox
                      checked={allSelected}
                      onCheckedChange={toggleSelectAll}
                    />
                  </TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Modules</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {staffUsers.map(user => (
                  <TableRow key={user.id} data-state={selectedIds.includes(user.id) ? 'selected' : undefined}>
                    <TableCell>
                      <Checkbox
                        checked={selectedIds.includes(user.id)}
                        onCheckedChange={() => toggleSelect(user.id)}
                      />
                    </TableCell>
                    <TableCell className="font-medium">{user.fullName}</TableCell>
                    <TableCell className="text-muted-foreground">{user.email}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="cursor-pointer" onClick={() => setModuleUser(user)}>
                        {(user.assignedModules?.length ?? 0)} of {availableModules.length}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={user.status === 'active' ? 'default' : 'outline'}>
                        {user.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Dialogs */}
      <StaffUserFormDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        availableModules={availableModules}
        onSubmit={createStaffUser}
      />
      <StaffModuleDialog
        open={!!moduleUser}
        onOpenChange={open => { if (!open) setModuleUser(null); }}
        user={moduleUser}
        availableModules={availableModules}
        onSave={updateModules}
      />
    </div>
  );
}
