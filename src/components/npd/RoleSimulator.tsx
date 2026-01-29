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
  const isExternal = selectedRole === 'supplier';
  const currentUserType = selectedRole ? USER_TYPES[selectedRole] : null;

  return (
    <div className="p-4 rounded-xl border border-border bg-card">
      <div className="flex items-center gap-3 mb-3">
        <div className="p-2 rounded-full bg-muted">
          <Shield className="w-4 h-4 text-muted-foreground" />
        </div>
        <div className="text-sm text-muted-foreground">
          Role detected by system
        </div>
      </div>

      {selectedRole && currentUserType ? (
        <div className={cn(
          'flex items-center gap-3 p-4 rounded-lg border-2 mb-3',
          isExternal
            ? 'border-accent bg-accent/5'
            : 'border-primary bg-primary/5'
        )}>
          <div className={cn(
            'p-2.5 rounded-full',
            isExternal
              ? 'bg-accent text-accent-foreground'
              : 'bg-primary text-primary-foreground'
          )}>
            {USER_TYPE_ICONS[selectedRole]}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <p className="font-semibold text-foreground">
                {currentUserType.label}
              </p>
              <Badge variant={isExternal ? "secondary" : "default"} className="text-xs">
                {isExternal ? 'External' : 'Internal'}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              {currentUserType.description}
            </p>
          </div>
        </div>
      ) : (
        <div className="p-4 rounded-lg border-2 border-dashed border-muted mb-3">
          <p className="text-sm text-muted-foreground text-center">
            Select a role to simulate
          </p>
        </div>
      )}

      <div className="flex items-center gap-2">
        <span className="text-xs text-muted-foreground italic">Demo Mode:</span>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="h-8 text-xs">
              Simulate Role
              <ChevronDown className="w-3 h-3 ml-1" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56">
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
      </div>
    </div>
  );
}
