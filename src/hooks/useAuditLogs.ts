import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface AuditLogEntry {
  id: string;
  event_type: string;
  actor_id: string | null;
  target_user_id: string | null;
  entity_type: string | null;
  entity_id: string | null;
  metadata: Record<string, unknown> | null;
  ip_address: string | null;
  user_agent: string | null;
  created_at: string;
}

export interface AuditLogFilters {
  search: string;
  eventType: string | null;
  entityType: string | null;
  dateFrom: string | null;
  dateTo: string | null;
}

// All defined event types
export const AUDIT_EVENT_TYPES = [
  'USER_LOGIN', 'FIRST_LOGIN', 'FAILED_LOGIN',
  'PASSWORD_RESET_REQUEST', 'PASSWORD_RESET_SUCCESS', 'EMAIL_CHANGED',
  'USER_CREATED', 'USER_INVITATION_SENT', 'USER_INVITATION_RESENT',
  'USER_ACTIVATED', 'USER_DEACTIVATED',
  'USER_ROLE_ASSIGNED', 'USER_ROLE_REMOVED',
  'SUPPLIER_USER_ASSIGNED', 'SUPPLIER_USER_REMOVED',
  'TERMS_CREATED', 'TERMS_UPDATED', 'TERMS_PUBLISHED', 'TERMS_ARCHIVED',
  'TERMS_VIEWED', 'TERMS_ACCEPTED', 'TERMS_REJECTED',
] as const;

export const ENTITY_TYPES = ['user', 'user_role', 'supplier', 'terms'] as const;

export function useAuditLogs() {
  const [logs, setLogs] = useState<AuditLogEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(0);
  const pageSize = 25;
  const [filters, setFilters] = useState<AuditLogFilters>({
    search: '',
    eventType: null,
    entityType: null,
    dateFrom: null,
    dateTo: null,
  });

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('audit_logs')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(page * pageSize, (page + 1) * pageSize - 1);

      if (filters.eventType) {
        query = query.eq('event_type', filters.eventType);
      }
      if (filters.entityType) {
        query = query.eq('entity_type', filters.entityType);
      }
      if (filters.dateFrom) {
        query = query.gte('created_at', filters.dateFrom);
      }
      if (filters.dateTo) {
        query = query.lte('created_at', filters.dateTo + 'T23:59:59Z');
      }
      if (filters.search) {
        query = query.or(
          `event_type.ilike.%${filters.search}%,entity_id.ilike.%${filters.search}%,entity_type.ilike.%${filters.search}%`
        );
      }

      const { data, error, count } = await query;

      if (error) {
        console.error('Error fetching audit logs:', error);
        return;
      }

      setLogs((data as AuditLogEntry[]) || []);
      setTotalCount(count || 0);
    } finally {
      setLoading(false);
    }
  }, [filters, page]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  return {
    logs,
    loading,
    filters,
    setFilters,
    page,
    setPage,
    pageSize,
    totalCount,
    refetch: fetchLogs,
  };
}

// Utility to log an audit event from the frontend
export async function logAuditEvent(params: {
  eventType: string;
  actorId?: string;
  targetUserId?: string;
  entityType?: string;
  entityId?: string;
  metadata?: Record<string, unknown>;
}) {
  const { error } = await supabase.from('audit_logs').insert([{
    event_type: params.eventType,
    actor_id: params.actorId || null,
    target_user_id: params.targetUserId || null,
    entity_type: params.entityType || null,
    entity_id: params.entityId || null,
    metadata: (params.metadata || {}) as Record<string, string | number | boolean | null>,
    user_agent: navigator.userAgent,
  }]);

  if (error) {
    console.error('Failed to log audit event:', error);
  }
}
