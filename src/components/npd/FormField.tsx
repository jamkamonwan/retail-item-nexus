import { useState, useEffect } from 'react';
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
import { Upload, AlertCircle, HelpCircle, X, Calendar, Lock, Calculator } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';

interface FormFieldProps {
  field: NPDFormField;
  value: string | number | File | null;
  onChange: (value: string | number | File | null) => void;
  error?: string;
  disabled?: boolean;
  calculatedValue?: number | null;
}

export function FormField({ field, value, onChange, error, disabled, calculatedValue }: FormFieldProps) {
  const isRequired = field.requirement === 'mandatory';
  const isConditional = field.requirement === 'conditional';
  const isReadonly = field.inputType === 'readonly';
  const isCalculated = field.inputType === 'calculated';
  
  // File preview URL - hooks must be at top level
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  
  useEffect(() => {
    if (value instanceof File) {
      const url = URL.createObjectURL(value);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setPreviewUrl(null);
    }
  }, [value]);

  const labelClasses = cn(
    'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
    isRequired && 'field-mandatory',
    isConditional && 'field-conditional'
  );

  const renderInput = () => {
    switch (field.inputType) {
      case 'readonly':
        return (
          <div className="flex items-center gap-2">
            <Input
              type="text"
              value={value as string || ''}
              disabled
              className="bg-muted/50 text-muted-foreground cursor-not-allowed"
            />
            <Lock className="w-4 h-4 text-muted-foreground" />
          </div>
        );

      case 'calculated':
        return (
          <div className="flex items-center gap-2">
            <Input
              type="number"
              value={calculatedValue ?? ''}
              disabled
              className="bg-muted/50 text-muted-foreground cursor-not-allowed"
              placeholder="Auto-calculated"
            />
            <Calculator className="w-4 h-4 text-muted-foreground" />
          </div>
        );

      case 'date':
        const dateValue = value ? new Date(value as string) : undefined;
        return (
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  'w-full justify-start text-left font-normal bg-card',
                  !value && 'text-muted-foreground',
                  error && 'border-destructive'
                )}
                disabled={disabled}
              >
                <Calendar className="mr-2 h-4 w-4" />
                {value ? format(new Date(value as string), 'PPP') : 'Select date'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 bg-popover" align="start">
              <CalendarComponent
                mode="single"
                selected={dateValue}
                onSelect={(date) => onChange(date ? date.toISOString().split('T')[0] : null)}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        );

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
            <SelectContent className="bg-popover border shadow-lg z-50 max-h-60">
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
          <div className="space-y-2">
            {previewUrl ? (
              <div className="relative group">
                <img
                  src={previewUrl}
                  alt={field.name}
                  className="w-full h-48 object-cover rounded-lg border border-border"
                />
                {!disabled && (
                  <button
                    type="button"
                    onClick={() => onChange(null)}
                    className="absolute top-2 right-2 p-1 bg-destructive text-destructive-foreground rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
                <div className="absolute bottom-2 left-2 bg-background/80 backdrop-blur-sm rounded px-2 py-1">
                  <span className="text-xs text-foreground">
                    {value instanceof File ? value.name : 'Image'}
                  </span>
                </div>
              </div>
            ) : (
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
                    Click to upload or drag and drop
                  </span>
                  {field.helpText && (
                    <span className="block text-xs text-muted-foreground/70 mt-1">
                      {field.helpText}
                    </span>
                  )}
                </label>
              </div>
            )}
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
            disabled={disabled || isReadonly}
            className={cn(
              'bg-card', 
              error && 'border-destructive',
              isReadonly && 'bg-muted/50 cursor-not-allowed'
            )}
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
        {(isReadonly || isCalculated) && (
          <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded">
            {isCalculated ? 'Auto' : 'Read-only'}
          </span>
        )}
        {field.helpText && field.inputType !== 'file' && (
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
