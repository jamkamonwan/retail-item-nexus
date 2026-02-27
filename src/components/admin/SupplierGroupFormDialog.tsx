import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { MockSupplierGroup } from '@/data/mock/supplierGroups';

interface SupplierGroupFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  group?: MockSupplierGroup | null;
  onSubmit: (data: { name: string; description: string }) => void;
}

export function SupplierGroupFormDialog({ open, onOpenChange, group, onSubmit }: SupplierGroupFormDialogProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const isEditing = !!group;

  const handleOpenChange = (v: boolean) => {
    if (v && group) {
      setName(group.name);
      setDescription(group.description || '');
    } else if (v) {
      setName('');
      setDescription('');
    }
    onOpenChange(v);
  };

  const handleSubmit = () => {
    if (!name.trim()) return;
    onSubmit({ name: name.trim(), description: description.trim() });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Group' : 'New Supplier Group'}</DialogTitle>
          <DialogDescription>
            {isEditing ? 'Update the group details.' : 'Create a new supplier group to organize supplier codes.'}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="group-name">Group Name</Label>
            <Input id="group-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Group A DKSH" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="group-desc">Description</Label>
            <Textarea id="group-desc" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Optional description" rows={3} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={!name.trim()}>{isEditing ? 'Update' : 'Create'}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
