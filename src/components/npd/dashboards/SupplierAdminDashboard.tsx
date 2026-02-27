import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { StaffUserFormDialog } from '@/components/admin/StaffUserFormDialog';
import { StaffModuleDialog } from '@/components/admin/StaffModuleDialog';
import { useSupplierStaff } from '@/hooks/useSupplierStaff';
import { MockUser } from '@/data/mock/users';
import { UserPlus, Users, Shield, Settings2, ToggleLeft, ToggleRight, AlertTriangle } from 'lucide-react';

interface SupplierAdminDashboardProps {
  userId?: string;
  supplierGroupId?: string;
}

export function SupplierAdminDashboard({ userId, supplierGroupId }: SupplierAdminDashboardProps) {
  const {
    group, tier, staffUsers, activeCount, maxUsers, canCreateUser,
    availableModules, createStaffUser, toggleUserStatus, updateModules,
  } = useSupplierStaff({ id: userId, supplierGroupId });

  const [createOpen, setCreateOpen] = useState(false);
  const [moduleUser, setModuleUser] = useState<MockUser | null>(null);

  const usagePercent = maxUsers > 0 ? (activeCount / maxUsers) * 100 : 0;
  const limitReached = !canCreateUser;

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
                {tier ? `${tier.name} — ${tier.description}` : 'No tier assigned'}
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
          <div className="flex items-center gap-4">
            <Users className="h-4 w-4 text-muted-foreground" />
            <div className="flex-1 space-y-1">
              <div className="flex justify-between text-sm">
                <span>Active Users</span>
                <span className={limitReached ? 'text-destructive font-semibold' : ''}>
                  {activeCount} / {maxUsers}
                  {limitReached && ' — LIMIT REACHED'}
                </span>
              </div>
              <Progress value={usagePercent} className="h-2" />
            </div>
          </div>
          {limitReached && (
            <div className="mt-3 flex items-center gap-2 text-sm text-destructive">
              <AlertTriangle className="h-4 w-4" />
              Toggle a resigned user to "Inactive" before creating a new staff user.
            </div>
          )}
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
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Modules</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {staffUsers.map(user => (
                  <TableRow key={user.id}>
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
                    <TableCell className="text-right space-x-1">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon" onClick={() => toggleUserStatus(user.id)}>
                              {user.status === 'active'
                                ? <ToggleRight className="h-4 w-4 text-primary" />
                                : <ToggleLeft className="h-4 w-4 text-muted-foreground" />
                              }
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>{user.status === 'active' ? 'Deactivate' : 'Activate'}</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      <Button variant="ghost" size="icon" onClick={() => setModuleUser(user)}>
                        <Settings2 className="h-4 w-4" />
                      </Button>
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
