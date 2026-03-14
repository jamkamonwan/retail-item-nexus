import { useState } from 'react';
import { useTermsVersions, TermsVersion } from '@/hooks/useTermsVersions';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ArrowLeft, Plus, Edit, Send, Eye, Loader2 } from 'lucide-react';
import { format } from 'date-fns';

interface TermsManagementProps {
  onBack: () => void;
}

const STATUS_BADGES: Record<string, string> = {
  DRAFT: 'bg-yellow-100 text-yellow-800 border-yellow-300',
  PUBLISHED: 'bg-green-100 text-green-800 border-green-300',
  ARCHIVED: 'bg-muted text-muted-foreground border-border',
};

export function TermsManagement({ onBack }: TermsManagementProps) {
  const { versions, loading, createVersion, updateVersion, publishVersion } = useTermsVersions();
  const { user } = useAuth();
  const [formOpen, setFormOpen] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [publishConfirmId, setPublishConfirmId] = useState<string | null>(null);
  const [editingVersion, setEditingVersion] = useState<TermsVersion | null>(null);
  const [previewVersion, setPreviewVersion] = useState<TermsVersion | null>(null);
  const [formData, setFormData] = useState({ version: '', title: '', content: '' });

  const openCreate = () => {
    setEditingVersion(null);
    setFormData({ version: '', title: '', content: '' });
    setFormOpen(true);
  };

  const openEdit = (v: TermsVersion) => {
    setEditingVersion(v);
    setFormData({ version: v.version, title: v.title, content: v.content });
    setFormOpen(true);
  };

  const openPreview = (v: TermsVersion) => {
    setPreviewVersion(v);
    setPreviewOpen(true);
  };

  const handleSave = async () => {
    if (!formData.version || !formData.title || !formData.content) return;

    if (editingVersion) {
      await updateVersion(editingVersion.id, formData, user?.id);
    } else {
      await createVersion({ ...formData, createdBy: user?.id });
    }
    setFormOpen(false);
  };

  const handlePublish = async () => {
    if (!publishConfirmId) return;
    await publishVersion(publishConfirmId, user?.id);
    setPublishConfirmId(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-1" /> Back
          </Button>
          <h2 className="text-2xl font-bold text-foreground">Terms & Conditions Management</h2>
        </div>
        <Button onClick={openCreate} className="gap-2">
          <Plus className="w-4 h-4" /> Create New Version
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Version History</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            </div>
          ) : versions.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">No terms versions yet. Create your first one.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Version</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Published</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {versions.map(v => (
                  <TableRow key={v.id}>
                    <TableCell className="font-mono font-medium">{v.version}</TableCell>
                    <TableCell>{v.title}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={STATUS_BADGES[v.status] || ''}>
                        {v.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{format(new Date(v.created_at), 'dd MMM yyyy')}</TableCell>
                    <TableCell>{v.published_at ? format(new Date(v.published_at), 'dd MMM yyyy') : '—'}</TableCell>
                    <TableCell className="text-right space-x-1">
                      <Button variant="ghost" size="sm" onClick={() => openPreview(v)}>
                        <Eye className="w-4 h-4" />
                      </Button>
                      {v.status === 'DRAFT' && (
                        <>
                          <Button variant="ghost" size="sm" onClick={() => openEdit(v)}>
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => setPublishConfirmId(v.id)} className="gap-1">
                            <Send className="w-3 h-3" /> Publish
                          </Button>
                        </>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Create/Edit Dialog */}
      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingVersion ? 'Edit Terms Version' : 'Create New Terms Version'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Version</Label>
                <Input
                  placeholder="e.g. v1.0"
                  value={formData.version}
                  onChange={e => setFormData(f => ({ ...f, version: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label>Title</Label>
                <Input
                  placeholder="Terms & Conditions"
                  value={formData.title}
                  onChange={e => setFormData(f => ({ ...f, title: e.target.value }))}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Content</Label>
              <Textarea
                placeholder="Enter the full terms and conditions text..."
                value={formData.content}
                onChange={e => setFormData(f => ({ ...f, content: e.target.value }))}
                className="min-h-[300px]"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setFormOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={!formData.version || !formData.title || !formData.content}>
              {editingVersion ? 'Save Changes' : 'Create Draft'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Preview Dialog */}
      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {previewVersion?.title}
              <Badge variant="outline" className={STATUS_BADGES[previewVersion?.status || ''] || ''}>
                {previewVersion?.status}
              </Badge>
            </DialogTitle>
          </DialogHeader>
          <div className="text-sm text-muted-foreground mb-2">
            Version {previewVersion?.version}
            {previewVersion?.published_at && ` • Published ${format(new Date(previewVersion.published_at), 'dd MMM yyyy')}`}
          </div>
          <ScrollArea className="max-h-[50vh]">
            <div className="whitespace-pre-wrap text-sm">{previewVersion?.content}</div>
          </ScrollArea>
        </DialogContent>
      </Dialog>

      {/* Publish Confirmation */}
      <AlertDialog open={!!publishConfirmId} onOpenChange={() => setPublishConfirmId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Publish Terms Version?</AlertDialogTitle>
            <AlertDialogDescription>
              Publishing will make this the active version. Any previously published version will be archived. All supplier users will need to accept the new terms.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handlePublish}>Publish</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
