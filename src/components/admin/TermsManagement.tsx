import { useState, useRef } from 'react';
import { useTermsVersions, TermsVersion } from '@/hooks/useTermsVersions';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ArrowLeft, Plus, Edit, Send, Eye, Loader2, Paperclip, X, FileText, Save } from 'lucide-react';
import { format } from 'date-fns';
import { RichTextEditor } from './RichTextEditor';
import { TermsAcceptanceReport } from './TermsAcceptanceReport';
import { toast } from 'sonner';

interface TermsManagementProps {
  onBack: () => void;
}

interface Attachment {
  name: string;
  url: string;
  size: number;
}

type View = 'list' | 'create' | 'edit';

const STATUS_BADGES: Record<string, string> = {
  DRAFT: 'bg-yellow-100 text-yellow-800 border-yellow-300',
  PUBLISHED: 'bg-green-100 text-green-800 border-green-300',
  ARCHIVED: 'bg-muted text-muted-foreground border-border',
};

const DEFAULT_CONTENT = `<h2>1. Acceptance of Terms</h2>
<p>By accessing and using the Supplier Portal, you agree to be bound by these Terms and Conditions. If you do not agree, you must discontinue use immediately.</p>

<h2>2. User Accounts</h2>
<p>Each user is responsible for maintaining the confidentiality of their login credentials. Sharing accounts is strictly prohibited.</p>
<ol>
<li>You must provide accurate and complete registration information.</li>
<li>You are responsible for all activities under your account.</li>
<li>Notify us immediately of any unauthorised use.</li>
</ol>

<h2>3. Data Submission</h2>
<p>All product data submitted through the portal must be accurate, complete, and comply with applicable regulations. You warrant that you have the right to submit such data.</p>

<h2>4. Intellectual Property</h2>
<p>All content, trademarks, and data on this portal are the property of the Company or its licensors. You may not reproduce, distribute, or create derivative works without prior written consent.</p>

<h2>5. Confidentiality</h2>
<p>You agree to keep confidential all non-public information accessed through the portal, including pricing, product specifications, and business processes.</p>

<h2>6. Data Protection</h2>
<p>We process personal data in accordance with applicable data protection laws. By using the portal, you consent to the collection and processing of data as described in our Privacy Policy.</p>

<h2>7. Limitation of Liability</h2>
<p>The Company shall not be liable for any indirect, incidental, or consequential damages arising from your use of the portal. Our total liability shall not exceed the fees paid in the preceding 12 months.</p>

<h2>8. Modifications</h2>
<p>We reserve the right to modify these terms at any time. Continued use after changes constitutes acceptance of the revised terms. You will be notified of material changes.</p>

<h2>9. Governing Law</h2>
<p>These terms shall be governed by and construed in accordance with the laws of the applicable jurisdiction, without regard to conflict of law principles.</p>

<h2>10. Contact</h2>
<p>For questions regarding these terms, please contact the procurement team through the portal's support channel.</p>`;

function getNextVersion(versions: TermsVersion[]): string {
  if (versions.length === 0) return 'v1.0';
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

const isValidUuid = (id: string) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);

export function TermsManagement({ onBack }: TermsManagementProps) {
  const { versions, loading, publishVersion, refetch } = useTermsVersions();
  const { user } = useAuth();

  const [view, setView] = useState<View>('list');
  const [editingVersion, setEditingVersion] = useState<TermsVersion | null>(null);
  const [formData, setFormData] = useState({ version: '', title: '', content: '' });
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [publishConfirmAction, setPublishConfirmAction] = useState<'publish' | 'save-publish' | null>(null);
  const [publishTargetId, setPublishTargetId] = useState<string | null>(null);
  const [previewVersion, setPreviewVersion] = useState<TermsVersion | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const createdBy = user?.id && isValidUuid(user.id) ? user.id : null;

  const openCreate = () => {
    setEditingVersion(null);
    setFormData({
      version: getNextVersion(versions),
      title: 'Supplier Portal Terms & Conditions',
      content: DEFAULT_CONTENT,
    });
    setAttachments([]);
    setView('create');
  };

  const openEdit = (v: TermsVersion) => {
    setEditingVersion(v);
    setFormData({ version: v.version, title: v.title, content: v.content });
    const existing = (v as any).attachments;
    setAttachments(Array.isArray(existing) ? existing : []);
    setView('edit');
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploading(true);
    try {
      for (const file of Array.from(files)) {
        const fileExt = file.name.split('.').pop();
        const filePath = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
        const { error } = await supabase.storage.from('terms-attachments').upload(filePath, file);
        if (error) { toast.error(`Failed to upload ${file.name}`); continue; }
        const { data: urlData } = supabase.storage.from('terms-attachments').getPublicUrl(filePath);
        setAttachments(prev => [...prev, { name: file.name, url: urlData.publicUrl, size: file.size }]);
      }
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const handleSaveDraft = async () => {
    if (!formData.version || !formData.title || !formData.content) return;
    setSaving(true);
    try {
      if (editingVersion) {
        const { error } = await supabase.from('terms_versions')
          .update({ version: formData.version, title: formData.title, content: formData.content, attachments: attachments as any })
          .eq('id', editingVersion.id);
        if (error) { toast.error('Failed to update'); return; }
        toast.success('Draft saved');
      } else {
        const { error } = await supabase.from('terms_versions')
          .insert([{ version: formData.version, title: formData.title, content: formData.content, status: 'DRAFT', created_by: createdBy, attachments: attachments as any }]);
        if (error) { toast.error('Failed to create: ' + error.message); return; }
        toast.success('Draft created');
      }
      await refetch();
      setView('list');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveAndPublish = async () => {
    if (!formData.version || !formData.title || !formData.content) return;
    setSaving(true);
    try {
      let targetId = editingVersion?.id;
      if (editingVersion) {
        const { error } = await supabase.from('terms_versions')
          .update({ version: formData.version, title: formData.title, content: formData.content, attachments: attachments as any })
          .eq('id', editingVersion.id);
        if (error) { toast.error('Failed to update'); return; }
      } else {
        const { data, error } = await supabase.from('terms_versions')
          .insert([{ version: formData.version, title: formData.title, content: formData.content, status: 'DRAFT', created_by: createdBy, attachments: attachments as any }])
          .select().single();
        if (error || !data) { toast.error('Failed to create: ' + (error?.message || '')); return; }
        targetId = (data as any).id;
      }
      await refetch();
      if (targetId) {
        await publishVersion(targetId, createdBy || undefined);
      }
      setView('list');
    } finally {
      setSaving(false);
    }
  };

  const handlePublishExisting = async () => {
    if (!publishTargetId) return;
    await publishVersion(publishTargetId, createdBy || undefined);
    setPublishConfirmAction(null);
    setPublishTargetId(null);
  };

  const confirmPublish = () => {
    setPublishConfirmAction('save-publish');
  };

  // ─── FORM VIEW ───
  if (view === 'create' || view === 'edit') {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={() => setView('list')}>
            <ArrowLeft className="w-4 h-4 mr-1" /> Back to list
          </Button>
          <h2 className="text-2xl font-bold text-foreground">
            {view === 'create' ? 'Create New Terms Version' : 'Edit Terms Version'}
          </h2>
          {editingVersion && (
            <Badge variant="outline" className={STATUS_BADGES[editingVersion.status]}>
              {editingVersion.status}
            </Badge>
          )}
        </div>

        <Card>
          <CardContent className="pt-6 space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Version</Label>
                <Input value={formData.version} onChange={e => setFormData(f => ({ ...f, version: e.target.value }))} placeholder="e.g. v1.0" />
              </div>
              <div className="space-y-2">
                <Label>Title</Label>
                <Input value={formData.title} onChange={e => setFormData(f => ({ ...f, title: e.target.value }))} placeholder="Terms & Conditions" />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Content</Label>
              <RichTextEditor content={formData.content} onChange={(html) => setFormData(f => ({ ...f, content: html }))} />
            </div>

            {/* Attachments */}
            <div className="space-y-2">
              <Label>Attachments</Label>
              {attachments.map((att, i) => (
                <div key={i} className="flex items-center gap-2 p-2 bg-muted/50 rounded-md">
                  <FileText className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                  <a href={att.url} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline truncate flex-1">{att.name}</a>
                  <span className="text-xs text-muted-foreground">{formatFileSize(att.size)}</span>
                  <Button type="button" variant="ghost" size="sm" onClick={() => removeAttachment(i)} className="h-6 w-6 p-0"><X className="w-3 h-3" /></Button>
                </div>
              ))}
              <input ref={fileInputRef} type="file" multiple onChange={handleFileUpload} className="hidden" />
              <Button type="button" variant="outline" size="sm" onClick={() => fileInputRef.current?.click()} disabled={uploading} className="gap-2">
                {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Paperclip className="w-4 h-4" />}
                {uploading ? 'Uploading...' : 'Attach File'}
              </Button>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-3 pt-4 border-t border-border">
              <Button variant="outline" onClick={() => setView('list')}>Cancel</Button>
              <Button variant="secondary" onClick={handleSaveDraft} disabled={saving || !formData.version || !formData.title || !formData.content} className="gap-2">
                <Save className="w-4 h-4" /> Save Draft
              </Button>
              <Button onClick={confirmPublish} disabled={saving || !formData.version || !formData.title || !formData.content} className="gap-2 bg-green-600 hover:bg-green-700 text-white">
                <Send className="w-4 h-4" /> Publish
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Publish confirmation from form */}
        <AlertDialog open={publishConfirmAction === 'save-publish'} onOpenChange={() => setPublishConfirmAction(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Publish Terms Version?</AlertDialogTitle>
              <AlertDialogDescription>
                This will save and publish this version immediately. Any previously published version will be archived. All supplier users will need to accept the new terms.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleSaveAndPublish}>Publish</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    );
  }

  // ─── LIST VIEW ───
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
        <CardHeader><CardTitle>Version History</CardTitle></CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8"><Loader2 className="w-6 h-6 animate-spin text-muted-foreground" /></div>
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
                      <Badge variant="outline" className={STATUS_BADGES[v.status] || ''}>{v.status}</Badge>
                    </TableCell>
                    <TableCell>{format(new Date(v.created_at), 'dd MMM yyyy')}</TableCell>
                    <TableCell>{v.published_at ? format(new Date(v.published_at), 'dd MMM yyyy') : '—'}</TableCell>
                    <TableCell className="text-right space-x-1">
                      <Button variant="ghost" size="sm" onClick={() => setPreviewVersion(v)}><Eye className="w-4 h-4" /></Button>
                      {v.status === 'DRAFT' && (
                        <>
                          <Button variant="ghost" size="sm" onClick={() => openEdit(v)}><Edit className="w-4 h-4" /></Button>
                          <Button variant="outline" size="sm" onClick={() => { setPublishTargetId(v.id); setPublishConfirmAction('publish'); }} className="gap-1">
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

      {/* Preview Dialog */}
      <Dialog open={!!previewVersion} onOpenChange={() => setPreviewVersion(null)}>
        <DialogContent className="max-w-3xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {previewVersion?.title}
              <Badge variant="outline" className={STATUS_BADGES[previewVersion?.status || ''] || ''}>{previewVersion?.status}</Badge>
            </DialogTitle>
          </DialogHeader>
          <div className="text-sm text-muted-foreground mb-2">
            Version {previewVersion?.version}
            {previewVersion?.published_at && ` • Published ${format(new Date(previewVersion.published_at), 'dd MMM yyyy')}`}
          </div>
          <ScrollArea className="max-h-[50vh]">
            <div className="prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: previewVersion?.content || '' }} />
          </ScrollArea>
          {(() => {
            const atts = (previewVersion as any)?.attachments;
            if (!Array.isArray(atts) || atts.length === 0) return null;
            return (
              <div className="border-t border-border pt-3 mt-3 space-y-1">
                <Label className="text-xs text-muted-foreground">Attachments</Label>
                {atts.map((att: Attachment, i: number) => (
                  <div key={i} className="flex items-center gap-2">
                    <FileText className="w-3 h-3 text-muted-foreground" />
                    <a href={att.url} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline">{att.name}</a>
                  </div>
                ))}
              </div>
            );
          })()}
        </DialogContent>
      </Dialog>

      {/* Publish confirmation from list */}
      <AlertDialog open={publishConfirmAction === 'publish'} onOpenChange={() => { setPublishConfirmAction(null); setPublishTargetId(null); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Publish Terms Version?</AlertDialogTitle>
            <AlertDialogDescription>
              Publishing will make this the active version. Any previously published version will be archived. All supplier users will need to accept the new terms.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handlePublishExisting}>Publish</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
