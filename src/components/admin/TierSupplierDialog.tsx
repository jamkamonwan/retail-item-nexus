import { useState } from 'react';
import { MockTier } from '@/data/mock/tiers';
import { MockSupplier, mockSuppliers } from '@/data/mock/suppliers';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Search, Plus, X } from 'lucide-react';

interface TierSupplierDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tier: MockTier;
  allTiers: MockTier[];
  onAssign: (tierId: string, supplierId: string) => void;
  onRemove: (tierId: string, supplierId: string) => void;
}

export function TierSupplierDialog({ open, onOpenChange, tier, allTiers, onAssign, onRemove }: TierSupplierDialogProps) {
  const [search, setSearch] = useState('');

  const activeSuppliers = mockSuppliers.filter(s => s.isActive);

  const assignedSuppliers = activeSuppliers.filter(s => tier.assignedSuppliers.includes(s.id));

  // Unassigned = active suppliers not in ANY tier
  const allAssigned = new Set(allTiers.flatMap(t => t.assignedSuppliers));
  const unassignedSuppliers = activeSuppliers.filter(s => !allAssigned.has(s.id));

  const filteredUnassigned = unassignedSuppliers.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.code.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Suppliers — {tier.name}</DialogTitle>
          <DialogDescription>Manage suppliers assigned to this tier</DialogDescription>
        </DialogHeader>

        {/* Assigned */}
        <div className="space-y-2">
          <p className="text-sm font-medium text-foreground">Assigned ({assignedSuppliers.length})</p>
          {assignedSuppliers.length === 0 ? (
            <p className="text-sm text-muted-foreground">No suppliers assigned</p>
          ) : (
            <div className="space-y-1">
              {assignedSuppliers.map(s => (
                <div key={s.id} className="flex items-center justify-between rounded-md border px-3 py-2">
                  <div>
                    <span className="text-sm font-medium">{s.name}</span>
                    <Badge variant="outline" className="ml-2 text-xs">{s.code}</Badge>
                  </div>
                  <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive" onClick={() => onRemove(tier.id, s.id)}>
                    <X className="w-3.5 h-3.5" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Add */}
        <div className="space-y-2 border-t pt-3">
          <p className="text-sm font-medium text-foreground">Add Supplier</p>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search suppliers…" className="pl-8" value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <ScrollArea className="max-h-40">
            {filteredUnassigned.length === 0 ? (
              <p className="text-sm text-muted-foreground py-2 text-center">No available suppliers</p>
            ) : (
              <div className="space-y-1">
                {filteredUnassigned.map(s => (
                  <div key={s.id} className="flex items-center justify-between rounded-md px-3 py-2 hover:bg-muted/50 transition-colors">
                    <div>
                      <span className="text-sm">{s.name}</span>
                      <Badge variant="outline" className="ml-2 text-xs">{s.code}</Badge>
                    </div>
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => onAssign(tier.id, s.id)}>
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
