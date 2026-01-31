import { useAuth } from '@/hooks/useAuth';
import { USER_TYPES, UserType } from '@/types/npd';
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
import { LogOut, User, Building2, Users, Briefcase, Calculator, Truck, Database, DollarSign, ShieldCheck } from 'lucide-react';
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
};

export function UserMenu() {
  const { user, role, signOut } = useAuth();

  const handleSignOut = async () => {
    const { error } = await signOut();
    if (error) {
      toast.error(error.message);
    } else {
      toast.success('Signed out successfully');
    }
  };

  const initials = user?.user_metadata?.full_name
    ?.split(' ')
    .map((n: string) => n[0])
    .join('')
    .toUpperCase() || user?.email?.[0].toUpperCase() || 'U';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-9 gap-2 px-2">
          <Avatar className="h-7 w-7">
            <AvatarImage src={user?.user_metadata?.avatar_url} />
            <AvatarFallback className="text-xs">{initials}</AvatarFallback>
          </Avatar>
          <div className="hidden sm:flex items-center gap-2">
            <span className="text-sm font-medium">
              {user?.user_metadata?.full_name || user?.email}
            </span>
            {role && (
              <Badge variant="secondary" className="text-xs gap-1">
                {ROLE_ICONS[role]}
                {USER_TYPES[role]?.label}
              </Badge>
            )}
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>
          <div className="flex flex-col">
            <span>{user?.user_metadata?.full_name || 'User'}</span>
            <span className="text-xs text-muted-foreground font-normal">
              {user?.email}
            </span>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {role && (
          <DropdownMenuItem disabled>
            <div className="flex items-center gap-2">
              {ROLE_ICONS[role]}
              <span>Role: {USER_TYPES[role]?.label}</span>
            </div>
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut} className="text-destructive">
          <LogOut className="w-4 h-4 mr-2" />
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
