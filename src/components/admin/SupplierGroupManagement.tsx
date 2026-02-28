import { useState } from 'react';
import { useSupplierGroups } from '@/hooks/useSupplierGroups';
import { mockSuppliers } from '@/data/mock/suppliers';
import { MockSupplierGroup } from '@/data/mock/supplierGroups';
import { mockTiers } from '@/data/mock/tiers';
import { SupplierGroupFormDialog } from './SupplierGroupFormDialog';
import { GroupSupplierDialog } from './GroupSupplierDialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Plus, Trash2, UserPlus, X, Star, Pencil, Save } from 'lucide-react';
import { format } from 'date-fns';

interface SupplierGroupManagementProps {
  onBack: () => void;
}

export function SupplierGroupManagement({ onBack }: SupplierGroupManagementProps) {
  const { groups, createGroup, updateGroup, deleteGroup, assignSupplier, removeSupplier, setMainSupplier } = useSupplierGroups();
  const [formOpen, setFormOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState<MockSupplierGroup | null>(null);
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
  const [supplierDialogOpen, setSupplierDialogOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [editDescription, setEditDescription] = useState('');

  const selectedGroup = groups.find((g) => g.id === selectedGroupId);

  const getSupplierInfo = (id: string) => mockSuppliers.find((s) => s.id === id);
  const getTierForGroup = (groupId: string) => mockTiers.find((t) => t.assignedGroups.includes(groupId));

  const handleFormSubmit = (data: { name: string; description: string }) => {
    createGroup(data.name, data.description);
  };

  const handleStartEdit = () => {
    if (selectedGroup) {
      setEditName(selectedGroup.name);
      setEditDescription(selectedGroup.description || '');
      setIsEditing(true);
    }
  };

  const handleSaveEdit = () => {
    if (selectedGroup && editName.trim()) {
      updateGroup(selectedGroup.id, { name: editName.trim(), description: editDescription.trim() });
      setIsEditing(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  const handleConfirmDelete = () => {
    if (deleteTarget) {
      deleteGroup(deleteTarget);
      setDeleteTarget(null);
    }
  };

  // --- Detail View ---
  if (selectedGroup) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => setSelectedGroupId(null)}>
            <ArrowLeft className="w-4 h-4 mr-1" /> Back to Groups
          </Button>
        </div>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="flex-1">
              {isEditing ? (
                <div className="space-y-3">
                  <Input value={editName} onChange={(e) => setEditName(e.target.value)} className="text-xl font-semibold" />
                  <Textarea value={editDescription} onChange={(e) => setEditDescription(e.target.value)} placeholder="Optional description" rows={2} />
                </div>
              ) : (
                <>
                  <CardTitle className="text-xl">{selectedGroup.name}</CardTitle>
                  {selectedGroup.description && <p className="text-muted-foreground text-sm mt-1">{selectedGroup.description}</p>}
                </>
              )}
              {(() => {
                const tier = getTierForGroup(selectedGroup.id);
                return tier ? <Badge className={`mt-2 ${tier.color}`}>{tier.name}</Badge> : null;
              })()}
            </div>
            <div className="flex gap-2">
              {isEditing ? (
                <>
                  <Button variant="outline" size="sm" onClick={handleCancelEdit}>Cancel</Button>
                  <Button size="sm" onClick={handleSaveEdit} disabled={!editName.trim()}>
                    <Save className="w-4 h-4 mr-1" /> Save
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="outline" size="sm" onClick={handleStartEdit}>
                    <Pencil className="w-4 h-4 mr-1" /> Edit
                  </Button>
                  <Button size="sm" onClick={() => setSupplierDialogOpen(true)}>
                    <UserPlus className="w-4 h-4 mr-1" /> Add Supplier
                  </Button>
                </>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {selectedGroup.supplierIds.length === 0 ? (
              <p className="text-muted-foreground text-sm py-4 text-center">No suppliers assigned yet. Click "Add Supplier" to get started.</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[60px]">Main</TableHead>
                    <TableHead>Code</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead className="w-[80px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {selectedGroup.supplierIds.map((sid) => {
                    const s = getSupplierInfo(sid);
                    const isMain = selectedGroup.mainSupplierId === sid;
                    return (
                      <TableRow key={sid}>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => setMainSupplier(selectedGroup.id, isMain ? undefined : sid)}
                            title={isMain ? 'Remove main supplier' : 'Set as main supplier'}
                          >
                            <Star className={`w-4 h-4 ${isMain ? 'fill-yellow-400 text-yellow-500' : 'text-muted-foreground'}`} />
                          </Button>
                        </TableCell>
                        <TableCell className="font-mono font-medium">{s?.code ?? sid}</TableCell>
                        <TableCell>{s?.name ?? '—'}</TableCell>
                        <TableCell className="text-muted-foreground text-sm">{s?.contactEmail ?? '—'}</TableCell>
                        <TableCell>
                          <Button variant="ghost" size="icon" onClick={() => removeSupplier(selectedGroup.id, sid)}>
                            <X className="w-4 h-4 text-destructive" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        <GroupSupplierDialog open={supplierDialogOpen} onOpenChange={setSupplierDialogOpen} group={selectedGroup} allGroups={groups} onAssign={assignSupplier} />
        <GroupSupplierDialog open={supplierDialogOpen} onOpenChange={setSupplierDialogOpen} group={selectedGroup} allGroups={groups} onAssign={assignSupplier} />
      </div>
    );
  }

  // --- List View ---
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Supplier Partners</h2>
          <p className="text-muted-foreground text-sm">Organize supplier codes into supplier partners for portal access</p>
        </div>
        <Button onClick={() => { setFormOpen(true); }}>
          <Plus className="w-4 h-4 mr-1" /> New Supplier Partner
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Supplier Partner Name</TableHead>
                <TableHead>Access Plan</TableHead>
                <TableHead>Suppliers</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="w-[120px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {groups.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground py-8">No supplier partners yet. Click "New Supplier Partner" to create one.</TableCell>
                </TableRow>
              )}
              {groups.map((g) => (
                <TableRow key={g.id} className="cursor-pointer" onClick={() => setSelectedGroupId(g.id)}>
                  <TableCell className="font-medium">{g.name}</TableCell>
                  <TableCell>{(() => { const tier = getTierForGroup(g.id); return tier ? <Badge className={tier.color}>{tier.name}</Badge> : null; })()}</TableCell>
                  <TableCell><Badge variant="secondary">{g.supplierIds.length} codes</Badge></TableCell>
                  <TableCell className="text-muted-foreground text-sm">{format(g.createdAt, 'dd MMM yyyy')}</TableCell>
                  <TableCell>
                    <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
                      <Button variant="ghost" size="icon" onClick={() => setDeleteTarget(g.id)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <SupplierGroupFormDialog open={formOpen} onOpenChange={setFormOpen} onSubmit={handleFormSubmit} />

      <AlertDialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Group?</AlertDialogTitle>
            <AlertDialogDescription>
              {(() => {
                const g = groups.find((g) => g.id === deleteTarget);
                return g && g.supplierIds.length > 0
                  ? `This group has ${g.supplierIds.length} supplier(s) assigned. Remove them first.`
                  : 'This action cannot be undone.';
              })()}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
