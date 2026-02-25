import { UserType, USER_TYPES } from '@/types/npd';
import { cn } from '@/lib/utils';
import { Building2, Users, Briefcase, Calculator, Truck, Database, DollarSign, ShieldCheck } from 'lucide-react';

interface UserTypeSelectorProps {
  selected: UserType | null;
  onSelect: (userType: UserType) => void;
  isExternal?: boolean;
}

const USER_TYPE_ICONS: Record<UserType, React.ReactNode> = {
  supplier: <Building2 className="w-5 h-5" />,
  buyer: <Users className="w-5 h-5" />,
  commercial: <Briefcase className="w-5 h-5" />,
  finance: <Calculator className="w-5 h-5" />,
  scm: <Truck className="w-5 h-5" />,
  im: <Database className="w-5 h-5" />,
  dc_income: <DollarSign className="w-5 h-5" />,
  admin: <ShieldCheck className="w-5 h-5" />,
  nsd: <Building2 className="w-5 h-5" />,
  supplier_admin: <Building2 className="w-5 h-5" />,
};

export function UserTypeSelector({ selected, onSelect, isExternal = false }: UserTypeSelectorProps) {
  // Filter user types based on external/internal
  const availableTypes = isExternal 
    ? ['supplier'] as UserType[]
    : ['buyer', 'commercial', 'finance', 'scm', 'im', 'dc_income'] as UserType[];

  return (
    <div className="space-y-4">
      <div className="flex gap-4 mb-4">
        <button
          onClick={() => onSelect('supplier')}
          className={cn(
            'flex-1 p-4 rounded-xl border-2 transition-all',
            'hover:border-accent/50',
            isExternal ? 'border-accent bg-accent/5' : 'border-border'
          )}
        >
          <div className="flex items-center gap-3">
            <div className={cn(
              'p-2 rounded-full',
              isExternal ? 'bg-accent text-accent-foreground' : 'bg-muted text-muted-foreground'
            )}>
              <Building2 className="w-5 h-5" />
            </div>
            <div className="text-left">
              <p className="font-semibold">External</p>
              <p className="text-sm text-muted-foreground">Supplier / Vendor</p>
            </div>
          </div>
        </button>

        <button
          onClick={() => onSelect('buyer')}
          className={cn(
            'flex-1 p-4 rounded-xl border-2 transition-all',
            'hover:border-primary/50',
            !isExternal && selected !== 'supplier' ? 'border-primary bg-primary/5' : 'border-border'
          )}
        >
          <div className="flex items-center gap-3">
            <div className={cn(
              'p-2 rounded-full',
              !isExternal && selected !== 'supplier' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
            )}>
              <Users className="w-5 h-5" />
            </div>
            <div className="text-left">
              <p className="font-semibold">Internal</p>
              <p className="text-sm text-muted-foreground">Buyer / Commercial / Finance</p>
            </div>
          </div>
        </button>
      </div>

      {!isExternal && selected !== 'supplier' && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {availableTypes.map((type) => {
            const userType = USER_TYPES[type];
            const isSelected = selected === type;
            return (
              <button
                key={type}
                onClick={() => onSelect(type)}
                className={cn(
                  'flex items-center gap-2 p-3 rounded-lg border transition-all',
                  'hover:border-primary/50 hover:bg-muted/30',
                  isSelected
                    ? 'border-primary bg-primary/5'
                    : 'border-border bg-card'
                )}
              >
                <div className={cn(
                  'p-1.5 rounded-md',
                  isSelected ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                )}>
                  {USER_TYPE_ICONS[type]}
                </div>
                <div className="text-left">
                  <p className={cn(
                    'font-medium text-sm',
                    isSelected ? 'text-primary' : 'text-foreground'
                  )}>
                    {userType.label}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
