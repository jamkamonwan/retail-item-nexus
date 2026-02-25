import { useState } from 'react';
import { MockTier, SYSTEM_MODULES } from '@/data/mock/tiers';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';

interface TierFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tier?: MockTier | null;
  onSubmit: (data: { name: string; description: string; color: string; maxUsers: number; activeModules: string[] }) => void;
}

const COLOR_OPTIONS = [
  { value: 'bg-primary/10 text-primary border-primary/30', label: 'Primary', preview: 'bg-primary' },
  { value: 'bg-success/10 text-success border-success/30', label: 'Green', preview: 'bg-success' },
  { value: 'bg-warning/10 text-warning border-warning/30', label: 'Amber', preview: 'bg-warning' },
  { value: 'bg-destructive/10 text-destructive border-destructive/30', label: 'Red', preview: 'bg-destructive' },
  { value: 'bg-secondary/80 text-secondary-foreground border-secondary/30', label: 'Secondary', preview: 'bg-secondary' },
  { value: 'bg-muted text-muted-foreground border-border', label: 'Muted', preview: 'bg-muted-foreground' },
];

export function TierFormDialog({ open, onOpenChange, tier, onSubmit }: TierFormDialogProps) {
  const [name, setName] = useState(tier?.name || '');
  const [description, setDescription] = useState(tier?.description || '');
  const [color, setColor] = useState(tier?.color || COLOR_OPTIONS[0].value);
  const [maxUsers, setMaxUsers] = useState(tier?.maxUsers ?? 10);
  const [activeModules, setActiveModules] = useState<string[]>(tier?.activeModules || []);

  const isEditing = !!tier;

  const handleOpenChange = (v: boolean) => {
    if (v) {
      setName(tier?.name || '');
      setDescription(tier?.description || '');
      setColor(tier?.color || COLOR_OPTIONS[0].value);
      setMaxUsers(tier?.maxUsers ?? 10);
      setActiveModules(tier?.activeModules || []);
    }
    onOpenChange(v);
  };

  const toggleModule = (moduleId: string) => {
    setActiveModules(prev =>
      prev.includes(moduleId) ? prev.filter(m => m !== moduleId) : [...prev, moduleId]
    );
  };

  const handleSubmit = () => {
    if (!name.trim()) return;
    onSubmit({ name: name.trim(), description: description.trim(), color, maxUsers, activeModules });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Tier' : 'Create New Tier'}</DialogTitle>
          <DialogDescription>
            {isEditing ? 'Update tier details and module assignments.' : 'Define a new service tier with module access.'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="tier-name">Tier Name</Label>
            <Input id="tier-name" value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Tier D" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tier-desc">Description</Label>
            <Input id="tier-desc" value={description} onChange={e => setDescription(e.target.value)} placeholder="e.g. Enterprise — full access" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tier-max-users">Max User Limit</Label>
            <Input
              id="tier-max-users"
              type="number"
              min={1}
              value={maxUsers}
              onChange={e => setMaxUsers(Math.max(1, parseInt(e.target.value) || 1))}
              placeholder="e.g. 10"
            />
            <p className="text-xs text-muted-foreground">Maximum normal supplier users per supplier</p>
          </div>

          <div className="space-y-2">
            <Label>Color</Label>
            <div className="flex gap-2 flex-wrap">
              {COLOR_OPTIONS.map(opt => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setColor(opt.value)}
                  className={`w-8 h-8 rounded-full ${opt.preview} border-2 transition-all ${
                    color === opt.value ? 'ring-2 ring-ring ring-offset-2' : 'border-transparent'
                  }`}
                  title={opt.label}
                />
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Active Modules ({activeModules.length}/{SYSTEM_MODULES.length})</Label>
            <div className="border rounded-lg divide-y max-h-56 overflow-y-auto">
              {SYSTEM_MODULES.map(mod => (
                <label
                  key={mod.id}
                  className="flex items-center gap-3 px-3 py-2.5 hover:bg-accent/50 cursor-pointer transition-colors"
                >
                  <Checkbox
                    checked={activeModules.includes(mod.id)}
                    onCheckedChange={() => toggleModule(mod.id)}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{mod.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{mod.description}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={!name.trim()}>
            {isEditing ? 'Update Tier' : 'Create Tier'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
