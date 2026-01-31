import { Division, DIVISIONS } from '@/types/npd';
import { cn } from '@/lib/utils';
import { Package, ShoppingBag, Snowflake, Shirt, Cpu, Heart, Store, Home, Pill, ShoppingCart } from 'lucide-react';

interface DivisionSelectorProps {
  selected: Division | null;
  onSelect: (division: Division) => void;
}

const DIVISION_ICONS: Record<Division, React.ReactNode> = {
  HL: <Cpu className="w-6 h-6" />,
  HOL: <Home className="w-6 h-6" />,
  DF: <Snowflake className="w-6 h-6" />,
  NF: <Package className="w-6 h-6" />,
  SL: <Shirt className="w-6 h-6" />,
  FF: <ShoppingBag className="w-6 h-6" />,
  GS: <Store className="w-6 h-6" />,
  HB: <Heart className="w-6 h-6" />,
  PH: <Pill className="w-6 h-6" />,
};

export function DivisionSelector({ selected, onSelect }: DivisionSelectorProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
      {(Object.entries(DIVISIONS) as [Division, typeof DIVISIONS[Division]][]).map(([key, div]) => {
        const isSelected = selected === key;
        return (
          <button
            key={key}
            onClick={() => onSelect(key)}
            className={cn(
              'group relative flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all duration-200',
              'hover:border-primary/50 hover:shadow-md',
              isSelected
                ? 'border-primary bg-primary/5 shadow-md'
                : 'border-border bg-card hover:bg-muted/30'
            )}
          >
            <div
              className={cn(
                'mb-2 p-2 rounded-full transition-colors',
                isSelected ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary'
              )}
            >
              {DIVISION_ICONS[key]}
            </div>
            <span
              className={cn(
                'font-semibold text-lg transition-colors',
                isSelected ? 'text-primary' : 'text-foreground'
              )}
            >
              {div.label}
            </span>
            <span className="text-xs text-muted-foreground text-center mt-1">
              {div.fullName}
            </span>
            <span className={cn(
              'text-[10px] px-1.5 py-0.5 rounded mt-1',
              div.category === 'food' ? 'bg-success/10 text-success' : 
              div.category === 'health' ? 'bg-warning/10 text-warning' :
              'bg-muted text-muted-foreground'
            )}>
              {div.category}
            </span>
            {isSelected && (
              <div className="absolute top-2 right-2 w-3 h-3 rounded-full bg-primary animate-pulse" />
            )}
          </button>
        );
      })}
    </div>
  );
}
