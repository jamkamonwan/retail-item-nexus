import { useState, useEffect } from 'react';
import { useTiers } from '@/hooks/useTiers';
import { SYSTEM_MODULES, MockTier } from '@/data/mock/tiers';
import { mockSupplierGroups } from '@/data/mock/supplierGroups';
import { TierFormDialog } from './TierFormDialog';
import { TierSupplierDialog } from './TierSupplierDialog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { ArrowLeft, Plus, Pencil, Trash2, Package, Users, FolderTree } from 'lucide-react';

interface TierManagementProps {
  onBack: () => void;
}

export function TierManagement({ onBack }: TierManagementProps) {
  const { tiers, createTier, updateTier, deleteTier, toggleModule, assignGroup, removeGroup } = useTiers();
  const [formOpen, setFormOpen] = useState(false);
  const [editingTier, setEditingTier] = useState<MockTier | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<MockTier | null>(null);
  const [selectedTierId, setSelectedTierId] = useState<string | null>(null);
  const [groupDialogOpen, setGroupDialogOpen] = useState(false);

  // Auto-select first tier
  useEffect(() => {
    if (!selectedTierId && tiers.length > 0) {
      setSelectedTierId(tiers[0].id);
    }
  }, [tiers, selectedTierId]);

  const selectedTier = tiers.find(t => t.id === selectedTierId) ?? null;

  const handleCreate = () => { setEditingTier(null); setFormOpen(true); };
  const handleEdit = (tier: MockTier) => { setEditingTier(tier); setFormOpen(true); };

  const handleFormSubmit = (data: { name: string; description: string; color: string; maxUsers: number; activeModules: string[] }) => {
    if (editingTier) updateTier(editingTier.id, data);
    else createTier(data);
  };

  const handleConfirmDelete = () => {
    if (deleteTarget) {
      deleteTier(deleteTarget.id);
      if (selectedTierId === deleteTarget.id) setSelectedTierId(null);
      setDeleteTarget(null);
    }
  };

  const getGroupInfo = (ids: string[]) =>
    ids.map(id => mockSupplierGroups.find(g => g.id === id)).filter(Boolean);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h2 className="text-2xl font-bold text-foreground">Access Plan & Module Configuration</h2>
          <p className="text-muted-foreground">Manage access plans and control module access per plan</p>
        </div>
      </div>

      {/* 2-Column Layout */}
      <div className="flex gap-0 border rounded-lg overflow-hidden bg-card min-h-[600px]">
        {/* Left Panel – Tier List */}
        <div className="w-80 border-r flex flex-col">
          <div className="p-3 border-b">
            <Button onClick={handleCreate} className="w-full gap-2" size="sm">
              <Plus className="w-4 h-4" /> Create Access Plan
            </Button>
          </div>
          <ScrollArea className="flex-1">
            <div className="p-2 space-y-1">
              {tiers.map(tier => (
                <div
                  key={tier.id}
                  className={`flex items-center justify-between rounded-md px-3 py-2.5 cursor-pointer transition-colors group ${
                    selectedTierId === tier.id ? 'bg-accent' : 'hover:bg-muted/50'
                  }`}
                  onClick={() => setSelectedTierId(tier.id)}
                >
                  <div className="min-w-0">
                    <Badge variant="outline" className={tier.color + ' text-xs font-semibold'}>{tier.name}</Badge>
                    <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><Package className="w-3 h-3" />{tier.activeModules.length}</span>
                      <span className="flex items-center gap-1"><FolderTree className="w-3 h-3" />{tier.assignedGroups.length}</span>
                    </div>
                  </div>
                  <div className="flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity" onClick={e => e.stopPropagation()}>
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleEdit(tier)}>
                      <Pencil className="w-3 h-3" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive" onClick={() => setDeleteTarget(tier)}>
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* Right Panel – Tier Detail */}
        <div className="flex-1 overflow-auto">
          {selectedTier ? (
            <div className="p-6 space-y-6">
              {/* Tier header */}
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-bold text-foreground">{selectedTier.name}</h3>
                    <Badge variant="outline" className={selectedTier.color + ' text-xs'}>{selectedTier.name}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mt-0.5">{selectedTier.description}</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    <Users className="w-3.5 h-3.5 inline mr-1" />
                    Max Users: <span className="font-medium text-foreground">{selectedTier.maxUsers}</span> per supplier
                  </p>
                </div>
                <Button variant="outline" size="sm" className="gap-1.5" onClick={() => handleEdit(selectedTier)}>
                  <Pencil className="w-3.5 h-3.5" /> Edit
                </Button>
              </div>

              {/* Module Access */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Allowed Modules ({selectedTier.activeModules.length})</CardTitle>
                </CardHeader>
                <CardContent className="space-y-1">
                  {(() => {
                    const activeModules = SYSTEM_MODULES.filter(mod => selectedTier.activeModules.includes(mod.id));
                    if (activeModules.length === 0) return <p className="text-sm text-muted-foreground">No modules enabled.</p>;
                    return activeModules.map(mod => (
                      <div key={mod.id} className="flex items-center gap-3 rounded-md px-3 py-2">
                        <Package className="w-4 h-4 text-primary" />
                        <div>
                          <p className="text-sm font-medium">{mod.name}</p>
                          <p className="text-xs text-muted-foreground">{mod.description}</p>
                        </div>
                      </div>
                    ));
                  })()}
                </CardContent>
              </Card>

              {/* Assigned Supplier Groups */}
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">Assigned Supplier Partners ({selectedTier.assignedGroups.length})</CardTitle>
                    <Button size="sm" variant="outline" className="gap-1.5" onClick={() => setGroupDialogOpen(true)}>
                      <Plus className="w-3.5 h-3.5" /> Add Partner
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {(() => {
                    const groups = getGroupInfo(selectedTier.assignedGroups);
                    if (groups.length === 0) return <p className="text-sm text-muted-foreground">No supplier partners assigned.</p>;
                    return (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Group</TableHead>
                            <TableHead>Suppliers</TableHead>
                            <TableHead className="text-right">Action</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {groups.map(g => g && (
                            <TableRow key={g.id}>
                              <TableCell className="font-medium">{g.name}</TableCell>
                              <TableCell><Badge variant="outline" className="text-xs">{g.supplierIds.length} codes</Badge></TableCell>
                              <TableCell className="text-right">
                                <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive h-7 text-xs" onClick={() => removeGroup(selectedTier.id, g.id)}>
                                  Remove
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    );
                  })()}
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              <p>Select an access plan to view details</p>
            </div>
          )}
        </div>
      </div>

      {/* Dialogs */}
      <TierFormDialog open={formOpen} onOpenChange={setFormOpen} tier={editingTier} onSubmit={handleFormSubmit} />
      {selectedTier && (
        <TierSupplierDialog
          open={groupDialogOpen}
          onOpenChange={setGroupDialogOpen}
          tier={selectedTier}
          allTiers={tiers}
          onAssign={assignGroup}
          onRemove={removeGroup}
        />
      )}
      <AlertDialog open={!!deleteTarget} onOpenChange={v => !v && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {deleteTarget?.name}?</AlertDialogTitle>
            <AlertDialogDescription>
              {deleteTarget && deleteTarget.assignedGroups.length > 0
                ? `This access plan has ${deleteTarget.assignedGroups.length} supplier partners assigned. You must reassign them before deleting.`
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
