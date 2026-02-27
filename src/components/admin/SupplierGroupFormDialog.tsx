import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { MockSupplierGroup } from '@/data/mock/supplierGroups';
import { Wand2 } from 'lucide-react';

const DUMMY_GROUPS = [
  { name: 'Group Nestle', description: 'Nestle branded supplier codes' },
  { name: 'Group P&G', description: 'Procter & Gamble supplier codes' },
  { name: 'Group Unilever', description: 'Unilever all divisions' },
  { name: 'Group Mars', description: 'Mars Petcare and Confectionery' },
  { name: 'Group Colgate', description: 'Colgate-Palmolive supplier codes' },
  { name: 'Group Danone', description: 'Danone dairy and water brands' },
  { name: 'Group Mondelez', description: 'Mondelez snacks and beverages' },
  { name: 'Group Henkel', description: 'Henkel home care and beauty' },
];

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
          <DialogTitle>{isEditing ? 'Edit Partner' : 'New Supplier Partner'}</DialogTitle>
          <DialogDescription>
            {isEditing ? 'Update the partner details.' : 'Create a new supplier partner to organize supplier codes.'}
          </DialogDescription>
        </DialogHeader>
        {!isEditing && (
          <Button variant="outline" size="sm" className="w-fit" onClick={() => {
            const dummy = DUMMY_GROUPS[Math.floor(Math.random() * DUMMY_GROUPS.length)];
            setName(dummy.name);
            setDescription(dummy.description);
          }}>
            <Wand2 className="w-4 h-4 mr-1" /> Auto Fill
          </Button>
        )}
        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="group-name">Supplier Partner Name</Label>
            <Input id="group-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Partner A DKSH" />
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
