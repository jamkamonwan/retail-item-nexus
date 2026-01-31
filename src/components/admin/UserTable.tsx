import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Edit, UserX, UserCheck, KeyRound, Eye } from 'lucide-react';
import { UserProfile } from '@/types/admin';
import { USER_TYPES } from '@/types/npd';
import { format } from 'date-fns';

interface UserTableProps {
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

export function UserTable({
  users,
  loading,
  onEdit,
  onView,
  onDeactivate,
  onActivate,
  onResetPassword,
}: UserTableProps) {
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
        No users found matching your criteria.
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User</TableHead>
            <TableHead>Role(s)</TableHead>
            <TableHead>Department(s)</TableHead>
            <TableHead>Supplier</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Last Login</TableHead>
            <TableHead>Created</TableHead>
            <TableHead className="w-[70px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell>
                <div className="flex flex-col">
                  <span className="font-medium">{user.full_name || 'No name'}</span>
                  <span className="text-sm text-muted-foreground">{user.email}</span>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex flex-wrap gap-1">
                  {user.roles.map((role) => (
                    <Badge key={role} variant="secondary" className="text-xs">
                      {USER_TYPES[role as keyof typeof USER_TYPES]?.label || role}
                    </Badge>
                  ))}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex flex-wrap gap-1">
                  {user.departments.length > 0 ? (
                    user.departments.map((dept) => (
                      <Badge key={dept} variant="outline" className="text-xs">
                        {dept}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-muted-foreground text-sm">—</span>
                  )}
                </div>
              </TableCell>
              <TableCell>
                {user.supplier ? (
                  <Badge variant="outline" className="text-xs">
                    {user.supplier.name}
                  </Badge>
                ) : (
                  <span className="text-muted-foreground text-sm">—</span>
                )}
              </TableCell>
              <TableCell>
                <Badge className={statusColors[user.status]}>{user.status}</Badge>
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {user.last_login_at ? format(new Date(user.last_login_at), 'MMM d, yyyy') : '—'}
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {format(new Date(user.created_at), 'MMM d, yyyy')}
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
                      <Eye className="mr-2 h-4 w-4" />
                      View Details
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onEdit(user)}>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit User
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onResetPassword(user)}>
                      <KeyRound className="mr-2 h-4 w-4" />
                      Reset Password
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    {user.status === 'active' ? (
                      <DropdownMenuItem
                        onClick={() => onDeactivate(user)}
                        className="text-destructive focus:text-destructive"
                      >
                        <UserX className="mr-2 h-4 w-4" />
                        Deactivate
                      </DropdownMenuItem>
                    ) : (
                      <DropdownMenuItem onClick={() => onActivate(user)}>
                        <UserCheck className="mr-2 h-4 w-4" />
                        Activate
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
