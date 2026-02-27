import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { MockModule } from '@/data/mock/tiers';

interface StaffUserFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  availableModules: MockModule[];
  onSubmit: (data: { fullName: string; email: string; assignedModules: string[] }) => void;
}

export function StaffUserFormDialog({ open, onOpenChange, availableModules, onSubmit }: StaffUserFormDialogProps) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [selectedModules, setSelectedModules] = useState<string[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !email.trim()) return;
    onSubmit({ fullName: fullName.trim(), email: email.trim(), assignedModules: selectedModules });
    setFullName('');
    setEmail('');
    setSelectedModules([]);
    onOpenChange(false);
  };

  const toggleModule = (moduleId: string) => {
    setSelectedModules(prev =>
      prev.includes(moduleId) ? prev.filter(m => m !== moduleId) : [...prev, moduleId]
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create Staff User</DialogTitle>
          <DialogDescription>Role will be set to Normal Supplier automatically.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="staff-name">Full Name</Label>
            <Input id="staff-name" value={fullName} onChange={e => setFullName(e.target.value)} placeholder="e.g. Somchai Kaewsai" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="staff-email">Email</Label>
            <Input id="staff-email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="user@supplier.com" required />
          </div>
          {availableModules.length > 0 && (
            <div className="space-y-2">
              <Label>Assign Modules</Label>
              <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto border rounded-md p-3">
                {availableModules.map(mod => (
                  <label key={mod.id} className="flex items-center gap-2 text-sm cursor-pointer">
                    <Checkbox
                      checked={selectedModules.includes(mod.id)}
                      onCheckedChange={() => toggleModule(mod.id)}
                    />
                    <span>{mod.name}</span>
                  </label>
                ))}
              </div>
            </div>
          )}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit">Create User</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
