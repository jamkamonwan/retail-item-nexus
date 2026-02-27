import { useState, useMemo } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Search, Plus, AlertCircle } from 'lucide-react';
import { mockSuppliers } from '@/data/mock/suppliers';
import { MockSupplierGroup } from '@/data/mock/supplierGroups';

interface GroupSupplierDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  group: MockSupplierGroup;
  allGroups: MockSupplierGroup[];
  onAssign: (groupId: string, supplierId: string) => void;
}

export function GroupSupplierDialog({ open, onOpenChange, group, allGroups, onAssign }: GroupSupplierDialogProps) {
  const [search, setSearch] = useState('');

  const activeSuppliers = useMemo(() => mockSuppliers.filter((s) => s.isActive), []);

  const assignedElsewhere = useMemo(() => {
    const map: Record<string, string> = {};
    allGroups.forEach((g) => {
      if (g.id !== group.id) {
        g.supplierIds.forEach((sid) => { map[sid] = g.name; });
      }
    });
    return map;
  }, [allGroups, group.id]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return activeSuppliers
      .filter((s) => !group.supplierIds.includes(s.id))
      .filter((s) => s.name.toLowerCase().includes(q) || s.code.toLowerCase().includes(q));
  }, [activeSuppliers, group.supplierIds, search]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Add Supplier to {group.name}</DialogTitle>
          <DialogDescription>Search and select supplier codes to assign to this group.</DialogDescription>
        </DialogHeader>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input className="pl-9" placeholder="Search by code or name..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <ScrollArea className="h-64">
          {filtered.length === 0 && (
            <p className="text-center text-muted-foreground py-8 text-sm">No matching suppliers found</p>
          )}
          <div className="space-y-1">
            {filtered.map((s) => {
              const takenBy = assignedElsewhere[s.id];
              return (
                <div key={s.id} className={`flex items-center justify-between px-3 py-2 rounded-md ${takenBy ? 'opacity-50' : 'hover:bg-muted cursor-pointer'}`}>
                  <div>
                    <span className="font-medium text-sm">{s.code}</span>
                    <span className="text-muted-foreground text-sm ml-2">{s.name}</span>
                    {takenBy && (
                      <Badge variant="secondary" className="ml-2 text-xs gap-1">
                        <AlertCircle className="w-3 h-3" /> Already in: {takenBy}
                      </Badge>
                    )}
                  </div>
                  {!takenBy && (
                    <Button size="sm" variant="ghost" onClick={() => onAssign(group.id, s.id)}>
                      <Plus className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
