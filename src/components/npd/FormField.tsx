import { NPDFormField } from '@/types/npd';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { Upload, AlertCircle, HelpCircle } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface FormFieldProps {
  field: NPDFormField;
  value: string | number | File | null;
  onChange: (value: string | number | File | null) => void;
  error?: string;
  disabled?: boolean;
}

export function FormField({ field, value, onChange, error, disabled }: FormFieldProps) {
  const isRequired = field.requirement === 'mandatory';
  const isConditional = field.requirement === 'conditional';

  const labelClasses = cn(
    'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
    isRequired && 'field-mandatory',
    isConditional && 'field-conditional'
  );

  const renderInput = () => {
    switch (field.inputType) {
      case 'dropdown':
        return (
          <Select
            value={value as string}
            onValueChange={(val) => onChange(val)}
            disabled={disabled}
          >
            <SelectTrigger className={cn('w-full bg-card', error && 'border-destructive')}>
              <SelectValue placeholder={`Select ${field.name}`} />
            </SelectTrigger>
            <SelectContent className="bg-popover border shadow-lg z-50">
              {field.dropdownOptions?.map((option) => (
                <SelectItem key={option} value={option} className="hover:bg-muted">
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      case 'textarea':
        return (
          <Textarea
            value={value as string || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={field.placeholder}
            disabled={disabled}
            className={cn('min-h-[80px] bg-card resize-none', error && 'border-destructive')}
          />
        );

      case 'file':
        return (
          <div
            className={cn(
              'border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors',
              'hover:border-primary/50 hover:bg-muted/30',
              error ? 'border-destructive' : 'border-border',
              disabled && 'opacity-50 cursor-not-allowed'
            )}
          >
            <input
              type="file"
              id={field.id}
              className="hidden"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0] || null;
                onChange(file);
              }}
              disabled={disabled}
            />
            <label htmlFor={field.id} className="cursor-pointer block">
              <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                {value instanceof File ? value.name : 'Click to upload or drag and drop'}
              </span>
            </label>
          </div>
        );

      case 'number':
        return (
          <Input
            type="number"
            value={value as number || ''}
            onChange={(e) => onChange(e.target.value ? Number(e.target.value) : null)}
            placeholder={field.placeholder}
            disabled={disabled}
            className={cn('bg-card', error && 'border-destructive')}
          />
        );

      default:
        return (
          <Input
            type="text"
            value={value as string || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={field.placeholder}
            maxLength={field.maxLength}
            disabled={disabled}
            className={cn('bg-card', error && 'border-destructive')}
          />
        );
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Label htmlFor={field.id} className={labelClasses}>
          {field.name}
          {field.nameTh && (
            <span className="text-muted-foreground font-normal ml-1">
              ({field.nameTh})
            </span>
          )}
        </Label>
        {field.helpText && (
          <Tooltip>
            <TooltipTrigger asChild>
              <HelpCircle className="w-4 h-4 text-muted-foreground cursor-help" />
            </TooltipTrigger>
            <TooltipContent className="bg-popover border shadow-lg">
              <p className="max-w-xs text-sm">{field.helpText}</p>
            </TooltipContent>
          </Tooltip>
        )}
      </div>

      {renderInput()}

      {error && (
        <div className="flex items-center gap-1 text-destructive text-sm">
          <AlertCircle className="w-4 h-4" />
          <span>{error}</span>
        </div>
      )}

      {field.maxLength && field.inputType === 'text' && (
        <p className="text-xs text-muted-foreground text-right">
          {(value as string)?.length || 0} / {field.maxLength}
        </p>
      )}
    </div>
  );
}
