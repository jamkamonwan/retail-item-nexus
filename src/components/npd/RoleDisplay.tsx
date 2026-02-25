import { UserType, USER_TYPES } from '@/types/npd';
import { cn } from '@/lib/utils';
import { Building2, Users, Briefcase, Calculator, Truck, Database, DollarSign, Shield, ShieldCheck } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface RoleDisplayProps {
  role: UserType;
  isExternal: boolean;
}

const USER_TYPE_ICONS: Record<UserType, React.ReactNode> = {
  supplier: <Building2 className="w-4 h-4" />,
  buyer: <Users className="w-4 h-4" />,
  commercial: <Briefcase className="w-4 h-4" />,
  finance: <Calculator className="w-4 h-4" />,
  scm: <Truck className="w-4 h-4" />,
  im: <Database className="w-4 h-4" />,
  dc_income: <DollarSign className="w-4 h-4" />,
  admin: <ShieldCheck className="w-4 h-4" />,
  nsd: <Shield className="w-4 h-4" />,
  supplier_admin: <Building2 className="w-4 h-4" />,
};

export function RoleDisplay({ role, isExternal }: RoleDisplayProps) {
  const userType = USER_TYPES[role];
  
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
      
      <div className={cn(
        'flex items-center gap-3 p-4 rounded-lg border-2',
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
          {USER_TYPE_ICONS[role]}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <p className="font-semibold text-foreground">
              {userType.label}
            </p>
            <Badge variant={isExternal ? "secondary" : "default"} className="text-xs">
              {isExternal ? 'External' : 'Internal'}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            {userType.description}
          </p>
        </div>
      </div>
      
      <p className="text-xs text-muted-foreground mt-3 italic">
        * For demo purposes, click below to simulate different roles
      </p>
    </div>
  );
}
