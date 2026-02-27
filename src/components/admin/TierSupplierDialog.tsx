import { useState } from 'react';
import { MockTier } from '@/data/mock/tiers';
import { MockSupplierGroup, mockSupplierGroups } from '@/data/mock/supplierGroups';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Search, Plus, X } from 'lucide-react';

interface TierGroupDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tier: MockTier;
  allTiers: MockTier[];
  onAssign: (tierId: string, groupId: string) => void;
  onRemove: (tierId: string, groupId: string) => void;
}

export function TierSupplierDialog({ open, onOpenChange, tier, allTiers, onAssign, onRemove }: TierGroupDialogProps) {
  const [search, setSearch] = useState('');

  const assignedGroups = mockSupplierGroups.filter(g => tier.assignedGroups.includes(g.id));

  const allAssigned = new Set(allTiers.flatMap(t => t.assignedGroups));
  const unassignedGroups = mockSupplierGroups.filter(g => !allAssigned.has(g.id));

  const filteredUnassigned = unassignedGroups.filter(g =>
    g.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Supplier Groups — {tier.name}</DialogTitle>
          <DialogDescription>Manage supplier groups assigned to this tier</DialogDescription>
        </DialogHeader>

        <div className="space-y-2">
          <p className="text-sm font-medium text-foreground">Assigned ({assignedGroups.length})</p>
          {assignedGroups.length === 0 ? (
            <p className="text-sm text-muted-foreground">No groups assigned</p>
          ) : (
            <div className="space-y-1">
              {assignedGroups.map(g => (
                <div key={g.id} className="flex items-center justify-between rounded-md border px-3 py-2">
                  <div>
                    <span className="text-sm font-medium">{g.name}</span>
                    <Badge variant="outline" className="ml-2 text-xs">{g.supplierIds.length} codes</Badge>
                  </div>
                  <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive" onClick={() => onRemove(tier.id, g.id)}>
                    <X className="w-3.5 h-3.5" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-2 border-t pt-3">
          <p className="text-sm font-medium text-foreground">Add Group</p>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search groups…" className="pl-8" value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <ScrollArea className="max-h-40">
            {filteredUnassigned.length === 0 ? (
              <p className="text-sm text-muted-foreground py-2 text-center">No available groups</p>
            ) : (
              <div className="space-y-1">
                {filteredUnassigned.map(g => (
                  <div key={g.id} className="flex items-center justify-between rounded-md px-3 py-2 hover:bg-muted/50 transition-colors">
                    <div>
                      <span className="text-sm">{g.name}</span>
                      <Badge variant="outline" className="ml-2 text-xs">{g.supplierIds.length} codes</Badge>
                    </div>
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => onAssign(tier.id, g.id)}>
                      <Plus className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
}
