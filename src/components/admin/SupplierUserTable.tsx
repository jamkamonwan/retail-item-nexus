import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Edit, UserX, UserCheck, KeyRound, Eye } from 'lucide-react';
import { UserProfile } from '@/types/admin';
import { USER_TYPES } from '@/types/npd';
import { format } from 'date-fns';
import { mockSupplierGroups } from '@/data/mock/supplierGroups';
import { mockSuppliers } from '@/data/mock/suppliers';
import { mockTiers } from '@/data/mock/tiers';

interface SupplierUserTableProps {
  users: UserProfile[];
  loading: boolean;
  onEdit: (user: UserProfile) => void;
  onView: (user: UserProfile) => void;
  onDeactivate: (user: UserProfile) => void;
  onActivate: (user: UserProfile) => void;
  onResetPassword: (user: UserProfile) => void;
}

const statusColors: Record<string, string> = {
  active: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  inactive: 'bg-muted text-muted-foreground',
  locked: 'bg-destructive/10 text-destructive',
};

function resolveGroup(supplierGroupId?: string) {
  if (!supplierGroupId) return { groupName: '—', codes: '—' };
  const group = mockSupplierGroups.find(g => g.id === supplierGroupId);
  if (!group) return { groupName: '—', codes: '—' };
  const codes = group.supplierIds
    .map(sid => mockSuppliers.find(s => s.id === sid)?.code)
    .filter(Boolean)
    .join(', ');
  return { groupName: group.name, codes: codes || '—' };
}

function getTierForGroup(groupId?: string) {
  if (!groupId) return undefined;
  return mockTiers.find(t => t.assignedGroups.includes(groupId));
}

export function SupplierUserTable({
  users, loading, onEdit, onView, onDeactivate, onActivate, onResetPassword,
}: SupplierUserTableProps) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        No supplier users found.
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Supplier Partner</TableHead>
            <TableHead>Supplier Codes</TableHead>
            <TableHead>Access Plan</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Last Login</TableHead>
            <TableHead className="w-[70px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => {
            const { groupName, codes } = resolveGroup(user.supplierGroupId);
            return (
              <TableRow key={user.id}>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-medium">{user.fullName || 'No name'}</span>
                    <span className="text-sm text-muted-foreground">{user.email}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary" className="text-xs">
                    {USER_TYPES[user.role]?.label || user.role}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="text-xs">{groupName}</Badge>
                </TableCell>
                <TableCell>
                  <span className="text-sm font-mono">{codes}</span>
                </TableCell>
                <TableCell>
                  {(() => {
                    const tier = getTierForGroup(user.supplierGroupId);
                    return tier ? <Badge className={tier.color}>{tier.name}</Badge> : null;
                  })()}
                </TableCell>
                <TableCell>
                  <Badge className={statusColors[user.status]}>{user.status}</Badge>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {user.lastLoginAt ? format(new Date(user.lastLoginAt), 'MMM d, yyyy') : '—'}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onView(user)}>
                        <Eye className="mr-2 h-4 w-4" /> View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onEdit(user)}>
                        <Edit className="mr-2 h-4 w-4" /> Edit User
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onResetPassword(user)}>
                        <KeyRound className="mr-2 h-4 w-4" /> Reset Password
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      {user.status === 'active' ? (
                        <DropdownMenuItem onClick={() => onDeactivate(user)} className="text-destructive focus:text-destructive">
                          <UserX className="mr-2 h-4 w-4" /> Deactivate
                        </DropdownMenuItem>
                      ) : (
                        <DropdownMenuItem onClick={() => onActivate(user)}>
                          <UserCheck className="mr-2 h-4 w-4" /> Activate
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
