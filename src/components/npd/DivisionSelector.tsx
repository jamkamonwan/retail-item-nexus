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

// Big C style colorful backgrounds for each division
const DIVISION_COLORS: Record<Division, string> = {
  HL: 'bg-blue-500',
  HOL: 'bg-teal-500',
  DF: 'bg-orange-500',
  NF: 'bg-purple-500',
  SL: 'bg-pink-500',
  FF: 'bg-green-500',
  GS: 'bg-slate-500',
  HB: 'bg-rose-500',
  PH: 'bg-red-500',
};

export function DivisionSelector({ selected, onSelect }: DivisionSelectorProps) {
  return (
    <div className="grid grid-cols-3 sm:grid-cols-5 gap-4">
      {(Object.entries(DIVISIONS) as [Division, typeof DIVISIONS[Division]][]).map(([key, div]) => {
        const isSelected = selected === key;
        return (
          <button
            key={key}
            onClick={() => onSelect(key)}
            className={cn(
              'group relative flex flex-col items-center justify-center p-3 rounded-xl transition-all duration-200',
              'hover:scale-105 hover:shadow-lg',
              isSelected
                ? 'ring-2 ring-primary ring-offset-2 shadow-lg'
                : 'hover:ring-2 hover:ring-accent/50'
            )}
          >
            {/* Colorful circular icon - Big C retail style */}
            <div
              className={cn(
                'w-14 h-14 rounded-full flex items-center justify-center mb-2 text-white shadow-md transition-transform',
                DIVISION_COLORS[key],
                isSelected && 'scale-110'
              )}
            >
              {DIVISION_ICONS[key]}
            </div>
            <span
              className={cn(
                'font-semibold text-sm transition-colors text-center',
                isSelected ? 'text-primary' : 'text-foreground'
              )}
            >
              {div.label}
            </span>
            <span className="text-[10px] text-muted-foreground text-center line-clamp-1">
              {div.fullName}
            </span>
            {isSelected && (
              <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                <span className="text-primary-foreground text-xs">✓</span>
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
}
