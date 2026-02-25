import { useState } from 'react';
import { useTiers } from '@/hooks/useTiers';
import { SYSTEM_MODULES, MockTier } from '@/data/mock/tiers';
import { mockSuppliers } from '@/data/mock/suppliers';
import { TierFormDialog } from './TierFormDialog';
import { TierSupplierDialog } from './TierSupplierDialog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { ArrowLeft, Plus, Pencil, Trash2, Package, Users } from 'lucide-react';

interface TierManagementProps {
  onBack: () => void;
}

export function TierManagement({ onBack }: TierManagementProps) {
  const { tiers, createTier, updateTier, deleteTier, toggleModule, assignSupplier, removeSupplier } = useTiers();
  const [formOpen, setFormOpen] = useState(false);
  const [editingTier, setEditingTier] = useState<MockTier | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<MockTier | null>(null);
  const [selectedTierId, setSelectedTierId] = useState<string | null>(null);
  const [supplierDialogOpen, setSupplierDialogOpen] = useState(false);

  const selectedTier = tiers.find(t => t.id === selectedTierId) ?? null;

  const handleCreate = () => { setEditingTier(null); setFormOpen(true); };
  const handleEdit = (tier: MockTier) => { setEditingTier(tier); setFormOpen(true); };

  const handleFormSubmit = (data: { name: string; description: string; color: string; maxUsers: number; activeModules: string[] }) => {
    if (editingTier) updateTier(editingTier.id, data);
    else createTier(data);
  };

  const handleConfirmDelete = () => {
    if (deleteTarget) { deleteTier(deleteTarget.id); setDeleteTarget(null); }
  };

  const getSupplierNames = (ids: string[]) =>
    ids.map(id => mockSuppliers.find(s => s.id === id)).filter(Boolean);

  // ── Detail View ──
  if (selectedTier) {
    const assignedSuppliers = getSupplierNames(selectedTier.assignedSuppliers);
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => setSelectedTierId(null)}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-bold text-foreground">{selectedTier.name}</h2>
                <Badge variant="outline" className={selectedTier.color + ' text-xs'}>{selectedTier.name}</Badge>
              </div>
              <p className="text-muted-foreground">{selectedTier.description}</p>
              <p className="text-sm text-muted-foreground mt-1">
                <Users className="w-3.5 h-3.5 inline mr-1" />
                Max User Limit: <span className="font-medium text-foreground">{selectedTier.maxUsers}</span> normal supplier users per supplier
              </p>
            </div>
          </div>
          <Button variant="outline" className="gap-2" onClick={() => handleEdit(selectedTier)}>
            <Pencil className="w-4 h-4" /> Edit Tier
          </Button>
        </div>

        {/* Module Access */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Module Access ({selectedTier.activeModules.length} of {SYSTEM_MODULES.length} active)</CardTitle>
            <CardDescription>Toggle modules for this tier. Changes apply to all {selectedTier.assignedSuppliers.length} assigned suppliers.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-1">
            {SYSTEM_MODULES.map(mod => {
              const checked = selectedTier.activeModules.includes(mod.id);
              return (
                <label key={mod.id} className="flex items-center gap-3 rounded-md px-3 py-2.5 hover:bg-muted/50 cursor-pointer transition-colors">
                  <Checkbox checked={checked} onCheckedChange={() => toggleModule(selectedTier.id, mod.id)} />
                  <div>
                    <p className="text-sm font-medium">{mod.name}</p>
                    <p className="text-xs text-muted-foreground">{mod.description}</p>
                  </div>
                </label>
              );
            })}
          </CardContent>
        </Card>

        {/* Assigned Suppliers */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Assigned Suppliers ({assignedSuppliers.length})</CardTitle>
              <Button size="sm" variant="outline" className="gap-1.5" onClick={() => setSupplierDialogOpen(true)}>
                <Plus className="w-3.5 h-3.5" /> Manage Suppliers
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {assignedSuppliers.length === 0 ? (
              <p className="text-sm text-muted-foreground">No suppliers assigned to this tier.</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Code</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {assignedSuppliers.map(s => s && (
                    <TableRow key={s.id}>
                      <TableCell className="font-medium">{s.name}</TableCell>
                      <TableCell><Badge variant="outline" className="text-xs">{s.code}</Badge></TableCell>
                      <TableCell className="text-sm text-muted-foreground">{s.contactEmail ?? '—'}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive h-7 text-xs" onClick={() => removeSupplier(selectedTier.id, s.id)}>
                          Remove
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        <TierFormDialog open={formOpen} onOpenChange={setFormOpen} tier={editingTier} onSubmit={handleFormSubmit} />
        <TierSupplierDialog
          open={supplierDialogOpen}
          onOpenChange={setSupplierDialogOpen}
          tier={selectedTier}
          allTiers={tiers}
          onAssign={assignSupplier}
          onRemove={removeSupplier}
        />
      </div>
    );
  }

  // ── List View ──
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h2 className="text-2xl font-bold text-foreground">Tier & Module Configuration</h2>
            <p className="text-muted-foreground">Manage service tiers and control module access per tier</p>
          </div>
        </div>
        <Button onClick={handleCreate} className="gap-2">
          <Plus className="w-4 h-4" /> New Tier
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="text-center">Modules</TableHead>
                <TableHead className="text-center">Suppliers</TableHead>
                <TableHead className="text-center">Max Users</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tiers.map(tier => (
                <TableRow key={tier.id} className="cursor-pointer" onClick={() => setSelectedTierId(tier.id)}>
                  <TableCell>
                    <Badge variant="outline" className={tier.color + ' text-xs font-semibold'}>{tier.name}</Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{tier.description}</TableCell>
                  <TableCell className="text-center">
                    <span className="flex items-center justify-center gap-1 text-sm">
                      <Package className="w-3.5 h-3.5 text-muted-foreground" /> {tier.activeModules.length}
                    </span>
                  </TableCell>
                  <TableCell className="text-center">
                    <span className="flex items-center justify-center gap-1 text-sm">
                      <Users className="w-3.5 h-3.5 text-muted-foreground" /> {tier.assignedSuppliers.length}
                    </span>
                  </TableCell>
                  <TableCell className="text-center">
                    <span className="text-sm">{tier.maxUsers}</span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1" onClick={e => e.stopPropagation()}>
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEdit(tier)}>
                        <Pencil className="w-3.5 h-3.5" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => setDeleteTarget(tier)}>
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <TierFormDialog open={formOpen} onOpenChange={setFormOpen} tier={editingTier} onSubmit={handleFormSubmit} />

      <AlertDialog open={!!deleteTarget} onOpenChange={v => !v && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {deleteTarget?.name}?</AlertDialogTitle>
            <AlertDialogDescription>
              {deleteTarget && deleteTarget.assignedSuppliers.length > 0
                ? `This tier has ${deleteTarget.assignedSuppliers.length} suppliers assigned. You must reassign them before deleting.`
                : 'This action cannot be undone. The tier will be permanently removed.'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
