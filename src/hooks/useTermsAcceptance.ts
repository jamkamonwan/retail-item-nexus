import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { logAuditEvent } from '@/hooks/useAuditLogs';

export interface TermsAcceptanceRecord {
  id: string;
  user_id: string;
  terms_version_id: string;
  status: 'ACCEPTED' | 'REJECTED';
  accepted_at: string | null;
  ip_address: string | null;
  created_at: string;
}

export interface PublishedTerms {
  id: string;
  version: string;
  title: string;
  content: string;
  published_at: string | null;
}

export function useTermsAcceptance(userId?: string, userEmail?: string, userName?: string) {
  const [hasAccepted, setHasAccepted] = useState<boolean | null>(null); // null = loading
  const [publishedTerms, setPublishedTerms] = useState<PublishedTerms | null>(null);
  const [loading, setLoading] = useState(true);

  const checkAcceptance = useCallback(async () => {
    if (!userId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      // Get latest published terms
      const { data: termsData, error: termsError } = await supabase
        .from('terms_versions')
        .select('id, version, title, content, published_at')
        .eq('status', 'PUBLISHED')
        .limit(1)
        .single();

      if (termsError || !termsData) {
        // No published terms — no gate needed
        setHasAccepted(true);
        setPublishedTerms(null);
        setLoading(false);
        return;
      }

      setPublishedTerms(termsData as PublishedTerms);

      // Check if user accepted this version
      const { data: acceptData } = await supabase
        .from('user_terms_acceptance')
        .select('status')
        .eq('user_id', userId)
        .eq('terms_version_id', (termsData as PublishedTerms).id)
        .eq('status', 'ACCEPTED')
        .limit(1)
        .maybeSingle();

      setHasAccepted(!!acceptData);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    checkAcceptance();
  }, [checkAcceptance]);

  const acceptTerms = async () => {
    if (!userId || !publishedTerms) return false;

    const { error } = await supabase
      .from('user_terms_acceptance')
      .upsert({
        user_id: userId,
        terms_version_id: publishedTerms.id,
        status: 'ACCEPTED',
        accepted_at: new Date().toISOString(),
        ip_address: null, // Could be captured server-side
      }, { onConflict: 'user_id,terms_version_id' });

    if (error) {
      console.error('Error accepting terms:', error);
      return false;
    }

    await logAuditEvent({
      eventType: 'TERMS_ACCEPTED',
      actorId: userId,
      entityType: 'terms',
      entityId: publishedTerms.id,
      metadata: { version: publishedTerms.version, user_name: userName, user_email: userEmail },
    });

    setHasAccepted(true);
    return true;
  };

  const rejectTerms = async () => {
    if (!userId || !publishedTerms) return false;

    const { error } = await supabase
      .from('user_terms_acceptance')
      .upsert({
        user_id: userId,
        terms_version_id: publishedTerms.id,
        status: 'REJECTED',
        accepted_at: new Date().toISOString(),
        ip_address: null,
      }, { onConflict: 'user_id,terms_version_id' });

    if (error) {
      console.error('Error rejecting terms:', error);
      return false;
    }

    await logAuditEvent({
      eventType: 'TERMS_REJECTED',
      actorId: userId,
      entityType: 'terms',
      entityId: publishedTerms.id,
      metadata: { version: publishedTerms.version },
    });

    setHasAccepted(false);
    return true;
  };

  return {
    hasAccepted,
    publishedTerms,
    loading,
    acceptTerms,
    rejectTerms,
    recheckAcceptance: checkAcceptance,
  };
}
