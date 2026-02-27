import { USER_TYPES, UserType } from '@/types/npd';
import { mockUsers, getUserByRole } from '@/data/mock';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { LogOut, Building2, Users, Briefcase, Calculator, Truck, Database, DollarSign, ShieldCheck, Store } from 'lucide-react';
import { toast } from 'sonner';

const ROLE_ICONS: Record<UserType, React.ReactNode> = {
  supplier: <Building2 className="w-4 h-4" />,
  buyer: <Users className="w-4 h-4" />,
  commercial: <Briefcase className="w-4 h-4" />,
  finance: <Calculator className="w-4 h-4" />,
  scm: <Truck className="w-4 h-4" />,
  im: <Database className="w-4 h-4" />,
  dc_income: <DollarSign className="w-4 h-4" />,
  admin: <ShieldCheck className="w-4 h-4" />,
  nsd: <Store className="w-4 h-4" />,
  supplier_admin: <Building2 className="w-4 h-4" />,
};

interface UserMenuProps {
  demoRole: UserType;
}

export function UserMenu({ demoRole }: UserMenuProps) {
  // Get mock user matching the current demo role
  const mockUser = getUserByRole(demoRole);

  const handleSignOut = () => {
    toast.success('Signed out successfully');
  };

  const displayName = mockUser?.fullName || 'User';
  const displayEmail = mockUser?.email || 'user@company.com';
  const initials = displayName
    .split(' ')
    .map((n: string) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-9 gap-2 px-2">
          <Avatar className="h-7 w-7">
            <AvatarImage src={mockUser?.avatarUrl} />
            <AvatarFallback className="text-xs">{initials}</AvatarFallback>
          </Avatar>
          <div className="hidden sm:flex items-center gap-2">
            <span className="text-sm font-medium">
              {displayName}
            </span>
            <Badge variant="secondary" className="text-xs gap-1">
              {ROLE_ICONS[demoRole]}
              {USER_TYPES[demoRole]?.label}
            </Badge>
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>
          <div className="flex flex-col">
            <span>{displayName}</span>
            <span className="text-xs text-muted-foreground font-normal">
              {displayEmail}
            </span>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem disabled>
          <div className="flex items-center gap-2">
            {ROLE_ICONS[demoRole]}
            <span>Role: {USER_TYPES[demoRole]?.label}</span>
          </div>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut} className="text-destructive">
          <LogOut className="w-4 h-4 mr-2" />
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
