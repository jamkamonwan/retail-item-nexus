import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { logAuditEvent } from '@/hooks/useAuditLogs';
import { toast } from 'sonner';

export interface TermsVersion {
  id: string;
  version: string;
  title: string;
  content: string;
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  created_by: string | null;
  published_at: string | null;
  created_at: string;
}

export function useTermsVersions() {
  const [versions, setVersions] = useState<TermsVersion[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchVersions = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('terms_versions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching terms versions:', error);
        return;
      }
      setVersions((data as TermsVersion[]) || []);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchVersions();
  }, [fetchVersions]);

  const createVersion = async (params: { version: string; title: string; content: string; createdBy?: string }) => {
    const { data, error } = await supabase
      .from('terms_versions')
      .insert([{
        version: params.version,
        title: params.title,
        content: params.content,
        status: 'DRAFT',
        created_by: params.createdBy || null,
      }])
      .select()
      .single();

    if (error) {
      console.error('Error creating terms version:', error);
      toast.error('Failed to create terms version');
      return null;
    }

    await logAuditEvent({
      eventType: 'TERMS_CREATED',
      actorId: params.createdBy,
      entityType: 'terms',
      entityId: (data as TermsVersion).id,
      metadata: { version: params.version, title: params.title },
    });

    toast.success('Terms version created as draft');
    await fetchVersions();
    return data as TermsVersion;
  };

  const updateVersion = async (id: string, params: { title?: string; content?: string; version?: string }, actorId?: string) => {
    // Only allow editing drafts
    const existing = versions.find(v => v.id === id);
    if (existing && existing.status !== 'DRAFT') {
      toast.error('Only draft versions can be edited');
      return false;
    }

    const { error } = await supabase
      .from('terms_versions')
      .update(params)
      .eq('id', id);

    if (error) {
      console.error('Error updating terms version:', error);
      toast.error('Failed to update terms version');
      return false;
    }

    await logAuditEvent({
      eventType: 'TERMS_UPDATED',
      actorId,
      entityType: 'terms',
      entityId: id,
      metadata: params,
    });

    toast.success('Terms version updated');
    await fetchVersions();
    return true;
  };

  const publishVersion = async (id: string, actorId?: string) => {
    // Archive current published version
    const currentPublished = versions.find(v => v.status === 'PUBLISHED');
    if (currentPublished) {
      await supabase
        .from('terms_versions')
        .update({ status: 'ARCHIVED' })
        .eq('id', currentPublished.id);

      await logAuditEvent({
        eventType: 'TERMS_ARCHIVED',
        actorId,
        entityType: 'terms',
        entityId: currentPublished.id,
        metadata: { version: currentPublished.version },
      });
    }

    // Publish the new version
    const { error } = await supabase
      .from('terms_versions')
      .update({ status: 'PUBLISHED', published_at: new Date().toISOString() })
      .eq('id', id);

    if (error) {
      console.error('Error publishing terms version:', error);
      toast.error('Failed to publish terms version');
      return false;
    }

    const version = versions.find(v => v.id === id);
    await logAuditEvent({
      eventType: 'TERMS_PUBLISHED',
      actorId,
      entityType: 'terms',
      entityId: id,
      metadata: { version: version?.version },
    });

    toast.success('Terms version published');
    await fetchVersions();
    return true;
  };

  return {
    versions,
    loading,
    createVersion,
    updateVersion,
    publishVersion,
    refetch: fetchVersions,
  };
}
