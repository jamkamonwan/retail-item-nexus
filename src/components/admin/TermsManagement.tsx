import { useState, useRef } from 'react';
import { useTermsVersions, TermsVersion } from '@/hooks/useTermsVersions';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ArrowLeft, Plus, Edit, Send, Eye, Loader2, Paperclip, X, FileText } from 'lucide-react';
import { format } from 'date-fns';
import { RichTextEditor } from './RichTextEditor';
import { toast } from 'sonner';

interface TermsManagementProps {
  onBack: () => void;
}

interface Attachment {
  name: string;
  url: string;
  size: number;
}

const STATUS_BADGES: Record<string, string> = {
  DRAFT: 'bg-yellow-100 text-yellow-800 border-yellow-300',
  PUBLISHED: 'bg-green-100 text-green-800 border-green-300',
  ARCHIVED: 'bg-muted text-muted-foreground border-border',
};

function getNextVersion(versions: TermsVersion[]): string {
  if (versions.length === 0) return 'v1.0';
  // Find highest version number
  let maxMajor = 0;
  let maxMinor = 0;
  for (const v of versions) {
    const match = v.version.match(/v?(\d+)\.(\d+)/);
    if (match) {
      const major = parseInt(match[1]);
      const minor = parseInt(match[2]);
      if (major > maxMajor || (major === maxMajor && minor > maxMinor)) {
        maxMajor = major;
        maxMinor = minor;
      }
    }
  }
  return `v${maxMajor}.${maxMinor + 1}`;
}

export function TermsManagement({ onBack }: TermsManagementProps) {
  const { versions, loading, createVersion, updateVersion, publishVersion } = useTermsVersions();
  const { user } = useAuth();
  const [formOpen, setFormOpen] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [publishConfirmId, setPublishConfirmId] = useState<string | null>(null);
  const [editingVersion, setEditingVersion] = useState<TermsVersion | null>(null);
  const [previewVersion, setPreviewVersion] = useState<TermsVersion | null>(null);
  const [formData, setFormData] = useState({ version: '', title: '', content: '' });
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const openCreate = () => {
    setEditingVersion(null);
    const nextVer = getNextVersion(versions);
    setFormData({ version: nextVer, title: 'Supplier Portal Terms & Conditions', content: '' });
    setAttachments([]);
    setFormOpen(true);
  };

  const openEdit = (v: TermsVersion) => {
    setEditingVersion(v);
    setFormData({ version: v.version, title: v.title, content: v.content });
    const existing = (v as any).attachments;
    setAttachments(Array.isArray(existing) ? existing : []);
    setFormOpen(true);
  };

  const openPreview = (v: TermsVersion) => {
    setPreviewVersion(v);
    setPreviewOpen(true);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    try {
      for (const file of Array.from(files)) {
        const fileExt = file.name.split('.').pop();
        const filePath = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;

        const { error } = await supabase.storage
          .from('terms-attachments')
          .upload(filePath, file);

        if (error) {
          toast.error(`Failed to upload ${file.name}`);
          continue;
        }

        const { data: urlData } = supabase.storage
          .from('terms-attachments')
          .getPublicUrl(filePath);

        setAttachments(prev => [...prev, {
          name: file.name,
          url: urlData.publicUrl,
          size: file.size,
        }]);
      }
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    if (!formData.version || !formData.title || !formData.content) return;

    if (editingVersion) {
      // Update version + attachments
      const { error } = await supabase
        .from('terms_versions')
        .update({ ...formData, attachments: attachments as any })
        .eq('id', editingVersion.id);
      if (error) {
        toast.error('Failed to update');
        return;
      }
      toast.success('Terms version updated');
    } else {
      // Create with attachments
      const { error } = await supabase
        .from('terms_versions')
        .insert([{
          version: formData.version,
          title: formData.title,
          content: formData.content,
          status: 'DRAFT',
          created_by: user?.id || null,
          attachments,
        }]);
      if (error) {
        toast.error('Failed to create');
        return;
      }
      toast.success('Terms version created as draft');
    }
    setFormOpen(false);
    // Refetch via hook
    window.location.reload(); // Simple refresh to sync
  };

  const handlePublish = async () => {
    if (!publishConfirmId) return;
    await publishVersion(publishConfirmId, user?.id);
    setPublishConfirmId(null);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
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
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
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
              <RichTextEditor
                content={formData.content}
                onChange={(html) => setFormData(f => ({ ...f, content: html }))}
              />
            </div>

            {/* Attachments */}
            <div className="space-y-2">
              <Label>Attachments</Label>
              <div className="space-y-2">
                {attachments.map((att, i) => (
                  <div key={i} className="flex items-center gap-2 p-2 bg-muted/50 rounded-md">
                    <FileText className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                    <a href={att.url} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline truncate flex-1">
                      {att.name}
                    </a>
                    <span className="text-xs text-muted-foreground">{formatFileSize(att.size)}</span>
                    <Button type="button" variant="ghost" size="sm" onClick={() => removeAttachment(i)} className="h-6 w-6 p-0">
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                ))}
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="gap-2"
                >
                  {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Paperclip className="w-4 h-4" />}
                  {uploading ? 'Uploading...' : 'Attach File'}
                </Button>
              </div>
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
        <DialogContent className="max-w-3xl max-h-[80vh]">
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
            <div
              className="prose prose-sm max-w-none"
              dangerouslySetInnerHTML={{ __html: previewVersion?.content || '' }}
            />
          </ScrollArea>
          {/* Show attachments in preview */}
          {(() => {
            const atts = (previewVersion as any)?.attachments;
            if (!Array.isArray(atts) || atts.length === 0) return null;
            return (
              <div className="border-t border-border pt-3 mt-3 space-y-1">
                <Label className="text-xs text-muted-foreground">Attachments</Label>
                {atts.map((att: Attachment, i: number) => (
                  <div key={i} className="flex items-center gap-2">
                    <FileText className="w-3 h-3 text-muted-foreground" />
                    <a href={att.url} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline">
                      {att.name}
                    </a>
                  </div>
                ))}
              </div>
            );
          })()}
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
