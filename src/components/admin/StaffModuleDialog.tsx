import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { MockModule } from '@/data/mock/tiers';
import { MockUser } from '@/data/mock/users';

interface StaffModuleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: MockUser | null;
  availableModules: MockModule[];
  onSave: (userId: string, modules: string[]) => void;
}

export function StaffModuleDialog({ open, onOpenChange, user, availableModules, onSave }: StaffModuleDialogProps) {
  const [selected, setSelected] = useState<string[]>([]);

  useEffect(() => {
    if (user) setSelected(user.assignedModules ?? []);
  }, [user]);

  const toggle = (id: string) => {
    setSelected(prev => prev.includes(id) ? prev.filter(m => m !== id) : [...prev, id]);
  };

  const handleSave = () => {
    if (user) {
      onSave(user.id, selected);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Modules — {user?.fullName}</DialogTitle>
          <DialogDescription>Select modules this user can access within the tier.</DialogDescription>
        </DialogHeader>
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {availableModules.map(mod => (
            <label key={mod.id} className="flex items-start gap-3 p-2 rounded-md hover:bg-muted cursor-pointer">
              <Checkbox checked={selected.includes(mod.id)} onCheckedChange={() => toggle(mod.id)} className="mt-0.5" />
              <div>
                <p className="text-sm font-medium">{mod.name}</p>
                <p className="text-xs text-muted-foreground">{mod.description}</p>
              </div>
            </label>
          ))}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSave}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
