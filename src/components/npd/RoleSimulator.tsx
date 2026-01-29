import { UserType, USER_TYPES } from '@/types/npd';
import { cn } from '@/lib/utils';
import { Building2, Users, Briefcase, Calculator, Truck, Database, DollarSign, ChevronDown, Shield } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface RoleSimulatorProps {
  selectedRole: UserType | null;
  onRoleChange: (role: UserType) => void;
}

const USER_TYPE_ICONS: Record<UserType, React.ReactNode> = {
  supplier: <Building2 className="w-4 h-4" />,
  buyer: <Users className="w-4 h-4" />,
  commercial: <Briefcase className="w-4 h-4" />,
  finance: <Calculator className="w-4 h-4" />,
  scm: <Truck className="w-4 h-4" />,
  im: <Database className="w-4 h-4" />,
  dc_income: <DollarSign className="w-4 h-4" />,
};

const EXTERNAL_ROLES: UserType[] = ['supplier'];
const INTERNAL_ROLES: UserType[] = ['buyer', 'commercial', 'finance', 'scm', 'im', 'dc_income'];

export function RoleSimulator({ selectedRole, onRoleChange }: RoleSimulatorProps) {
  const currentUserType = selectedRole ? USER_TYPES[selectedRole] : null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 gap-2">
          {selectedRole && USER_TYPE_ICONS[selectedRole]}
          <span className="font-medium">
            {currentUserType?.label || 'Select Role'}
          </span>
          <ChevronDown className="w-3 h-3" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="text-xs text-muted-foreground">External</DropdownMenuLabel>
        {EXTERNAL_ROLES.map((role) => (
          <DropdownMenuItem
            key={role}
            onClick={() => onRoleChange(role)}
            className={cn(selectedRole === role && 'bg-accent/10')}
          >
            <div className="flex items-center gap-2">
              {USER_TYPE_ICONS[role]}
              <span>{USER_TYPES[role].label}</span>
            </div>
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuLabel className="text-xs text-muted-foreground">Internal</DropdownMenuLabel>
        {INTERNAL_ROLES.map((role) => (
          <DropdownMenuItem
            key={role}
            onClick={() => onRoleChange(role)}
            className={cn(selectedRole === role && 'bg-primary/10')}
          >
            <div className="flex items-center gap-2">
              {USER_TYPE_ICONS[role]}
              <span>{USER_TYPES[role].label}</span>
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
