import { useState } from 'react';
import { useTiers } from '@/hooks/useTiers';
import { SYSTEM_MODULES, MockTier } from '@/data/mock/tiers';
import { TierFormDialog } from './TierFormDialog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { ArrowLeft, Plus, Pencil, Trash2, Package, Users } from 'lucide-react';

interface TierManagementProps {
  onBack: () => void;
}

export function TierManagement({ onBack }: TierManagementProps) {
  const { tiers, createTier, updateTier, deleteTier, toggleModule } = useTiers();
  const [formOpen, setFormOpen] = useState(false);
  const [editingTier, setEditingTier] = useState<MockTier | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<MockTier | null>(null);

  const handleCreate = () => {
    setEditingTier(null);
    setFormOpen(true);
  };

  const handleEdit = (tier: MockTier) => {
    setEditingTier(tier);
    setFormOpen(true);
  };

  const handleFormSubmit = (data: { name: string; description: string; color: string; activeModules: string[] }) => {
    if (editingTier) {
      updateTier(editingTier.id, data);
    } else {
      createTier(data);
    }
  };

  const handleConfirmDelete = () => {
    if (deleteTarget) {
      deleteTier(deleteTarget.id);
      setDeleteTarget(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
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
          <Plus className="w-4 h-4" />
          New Tier
        </Button>
      </div>

      {/* Tier Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {tiers.map(tier => (
          <Card key={tier.id} className="relative">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <Badge variant="outline" className={tier.color + ' text-sm font-semibold'}>
                  {tier.name}
                </Badge>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleEdit(tier)}>
                    <Pencil className="w-3.5 h-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-destructive hover:text-destructive"
                    onClick={() => setDeleteTarget(tier)}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
              <CardDescription className="text-xs mt-1">{tier.description}</CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex items-center gap-4 text-sm">
                <span className="flex items-center gap-1.5 text-muted-foreground">
                  <Package className="w-4 h-4" />
                  {tier.activeModules.length} modules
                </span>
                <span className="flex items-center gap-1.5 text-muted-foreground">
                  <Users className="w-4 h-4" />
                  {tier.supplierCount} suppliers
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Module Matrix */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Module Access Matrix</CardTitle>
          <CardDescription>Toggle module access per tier. Changes apply immediately to all assigned suppliers.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[200px]">Module</TableHead>
                  {tiers.map(tier => (
                    <TableHead key={tier.id} className="text-center min-w-[100px]">
                      <Badge variant="outline" className={tier.color + ' text-xs'}>
                        {tier.name}
                      </Badge>
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {SYSTEM_MODULES.map(mod => (
                  <TableRow key={mod.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium text-sm">{mod.name}</p>
                        <p className="text-xs text-muted-foreground">{mod.description}</p>
                      </div>
                    </TableCell>
                    {tiers.map(tier => (
                      <TableCell key={tier.id} className="text-center">
                        <Checkbox
                          checked={tier.activeModules.includes(mod.id)}
                          onCheckedChange={() => toggleModule(tier.id, mod.id)}
                        />
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Form Dialog */}
      <TierFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        tier={editingTier}
        onSubmit={handleFormSubmit}
      />

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteTarget} onOpenChange={v => !v && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {deleteTarget?.name}?</AlertDialogTitle>
            <AlertDialogDescription>
              {deleteTarget && deleteTarget.supplierCount > 0
                ? `This tier has ${deleteTarget.supplierCount} suppliers assigned. You must reassign them before deleting.`
                : 'This action cannot be undone. The tier will be permanently removed.'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
