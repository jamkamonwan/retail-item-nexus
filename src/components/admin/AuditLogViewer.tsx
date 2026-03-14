import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ArrowLeft, Search, ChevronLeft, ChevronRight, Eye, RefreshCw, X } from 'lucide-react';
import { useAuditLogs, AuditLogEntry, AUDIT_EVENT_TYPES, ENTITY_TYPES } from '@/hooks/useAuditLogs';
import { format } from 'date-fns';

interface AuditLogViewerProps {
  onBack: () => void;
}

const EVENT_CATEGORY_COLORS: Record<string, string> = {
  USER_LOGIN: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  FIRST_LOGIN: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  FAILED_LOGIN: 'bg-destructive/10 text-destructive',
  PASSWORD_RESET_REQUEST: 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200',
  PASSWORD_RESET_SUCCESS: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  USER_CREATED: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  USER_ACTIVATED: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  USER_DEACTIVATED: 'bg-destructive/10 text-destructive',
  USER_ROLE_ASSIGNED: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
  USER_ROLE_REMOVED: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
  SUPPLIER_USER_ASSIGNED: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
  SUPPLIER_USER_REMOVED: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
  TERMS_ACCEPTED: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  TERMS_REJECTED: 'bg-destructive/10 text-destructive',
  ITEM_CREATED: 'bg-sky-100 text-sky-800 dark:bg-sky-900 dark:text-sky-200',
  ITEM_APPROVED: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  ITEM_REJECTED: 'bg-destructive/10 text-destructive',
};

function getEventBadgeClass(eventType: string) {
  return EVENT_CATEGORY_COLORS[eventType] || 'bg-muted text-muted-foreground';
}

function getMetaField(log: AuditLogEntry, field: string): string {
  const meta = log.metadata as Record<string, unknown> | null;
  return (meta?.[field] as string) || '';
}

function getDescription(log: AuditLogEntry): string {
  const meta = log.metadata as Record<string, unknown> | null;
  if (!meta) return '';
  
  switch (log.event_type) {
    case 'USER_CREATED':
      return `Created ${meta.user_name} (${meta.email}) as ${meta.role}`;
    case 'USER_ROLE_ASSIGNED':
      if (meta.action === 'module_assigned') return `Assigned module "${meta.module_name}" to ${meta.user_name}`;
      return `Assigned role "${meta.role}" to ${meta.user_name}`;
    case 'USER_ROLE_REMOVED':
      return `Removed role "${meta.role}" from ${meta.user_name}${meta.reason ? ` — ${meta.reason}` : ''}`;
    case 'USER_INVITATION_SENT':
      return `Invitation sent to ${meta.user_name} (${meta.email})`;
    case 'USER_ACTIVATED':
      return `Activated ${meta.user_name}${meta.reason ? ` — ${meta.reason}` : ''}`;
    case 'USER_DEACTIVATED':
      return `Deactivated ${meta.user_name}${meta.reason ? ` — ${meta.reason}` : ''}`;
    case 'SUPPLIER_USER_ASSIGNED':
      return `Assigned ${meta.user_name} to ${meta.supplier_name} (${meta.supplier_code})`;
    case 'SUPPLIER_USER_REMOVED':
      return `Removed ${meta.user_name} from ${meta.supplier_name}${meta.reason ? ` — ${meta.reason}` : ''}`;
    case 'USER_LOGIN':
      return `${meta.user_name} logged in`;
    case 'FIRST_LOGIN':
      return `First login by ${meta.user_name} (${meta.email})`;
    case 'FAILED_LOGIN':
      return `Failed login attempt for ${meta.email} — ${meta.reason}`;
    case 'PASSWORD_RESET_REQUEST':
      return `Password reset requested by ${meta.user_name}`;
    case 'PASSWORD_RESET_SUCCESS':
      return `Password reset completed for ${meta.user_name}`;
    case 'TERMS_VIEWED':
      return `${meta.user_name} viewed "${meta.document}" ${meta.version}`;
    case 'TERMS_ACCEPTED':
      return `${meta.user_name} accepted "${meta.document}" ${meta.version}`;
    case 'TERMS_REJECTED':
      return `${meta.user_name} rejected Terms ${meta.version}${meta.reason ? ` — ${meta.reason}` : ''}`;
    case 'ITEM_CREATED':
      return `Created item "${meta.product_name_en || meta.product_name}" by ${meta.created_by}`;
    case 'ITEM_SUBMITTED':
      return `Submitted "${meta.product_name}" for review`;
    case 'ITEM_APPROVED':
      return `"${meta.product_name}" approved by ${meta.approved_by} (${meta.approved_by_role})`;
    case 'ITEM_REJECTED':
      return `"${meta.product_name}" rejected by ${meta.rejected_by} — ${meta.reason}`;
    case 'ITEM_UPDATED':
      return `"${meta.product_name}" updated by ${meta.updated_by} — fields: ${Array.isArray(meta.fields_updated) ? (meta.fields_updated as string[]).join(', ') : ''}`;
    case 'DOCUMENT_UPLOADED':
      return `Uploaded "${meta.file_name}" (${meta.file_size_kb}KB) for ${meta.product_name}`;
    default:
      return '';
  }
}

export function AuditLogViewer({ onBack }: AuditLogViewerProps) {
  const { logs, loading, filters, setFilters, page, setPage, pageSize, totalCount, refetch } = useAuditLogs();
  const [detailLog, setDetailLog] = useState<AuditLogEntry | null>(null);

  const totalPages = Math.ceil(totalCount / pageSize);

  const clearFilters = () => {
    setFilters({ search: '', eventType: null, entityType: null, dateFrom: null, dateTo: null });
    setPage(0);
  };

  const hasActiveFilters = filters.search || filters.eventType || filters.entityType || filters.dateFrom || filters.dateTo;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Audit Logs</h1>
            <p className="text-muted-foreground">
              System activity log • {totalCount} record{totalCount !== 1 ? 's' : ''}
            </p>
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={refetch} className="gap-2">
          <RefreshCw className="h-4 w-4" />
          Refresh
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-wrap gap-3 items-end">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search events, entities..."
                  value={filters.search}
                  onChange={(e) => { setFilters(f => ({ ...f, search: e.target.value })); setPage(0); }}
                  className="pl-10"
                />
              </div>
            </div>
            <Select
              value={filters.eventType || 'all'}
              onValueChange={(v) => { setFilters(f => ({ ...f, eventType: v === 'all' ? null : v })); setPage(0); }}
            >
              <SelectTrigger className="w-[220px]">
                <SelectValue placeholder="Event type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Events</SelectItem>
                {AUDIT_EVENT_TYPES.map((et) => (
                  <SelectItem key={et} value={et}>{et}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={filters.entityType || 'all'}
              onValueChange={(v) => { setFilters(f => ({ ...f, entityType: v === 'all' ? null : v })); setPage(0); }}
            >
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Entity type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Entities</SelectItem>
                {ENTITY_TYPES.map((et) => (
                  <SelectItem key={et} value={et}>{et}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              type="date"
              value={filters.dateFrom || ''}
              onChange={(e) => { setFilters(f => ({ ...f, dateFrom: e.target.value || null })); setPage(0); }}
              className="w-[160px]"
              placeholder="From date"
            />
            <Input
              type="date"
              value={filters.dateTo || ''}
              onChange={(e) => { setFilters(f => ({ ...f, dateTo: e.target.value || null })); setPage(0); }}
              className="w-[160px]"
              placeholder="To date"
            />
            {hasActiveFilters && (
              <Button variant="ghost" size="sm" onClick={clearFilters} className="gap-1">
                <X className="h-3 w-3" /> Clear
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Activity Log</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
            </div>
          ) : logs.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              No audit log entries found
            </div>
          ) : (
            <ScrollArea className="w-full">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[170px]">Timestamp</TableHead>
                    <TableHead className="w-[200px]">Event</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead className="w-[140px]">By</TableHead>
                    <TableHead className="w-[200px]">Email</TableHead>
                    <TableHead className="w-[50px]" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {logs.map((log) => {
                    const meta = log.metadata as Record<string, unknown> | null;
                    const email = (meta?.email as string) || '';
                    return (
                      <TableRow key={log.id} className="cursor-pointer hover:bg-muted/50" onClick={() => setDetailLog(log)}>
                        <TableCell className="text-xs text-muted-foreground font-mono">
                          {format(new Date(log.created_at), 'yyyy-MM-dd HH:mm')}
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary" className={`text-xs ${getEventBadgeClass(log.event_type)}`}>
                            {log.event_type}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm max-w-[400px]">
                          <span className="text-foreground">{getDescription(log)}</span>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {getMetaField(log, 'created_by') || getMetaField(log, 'assigned_by') || getMetaField(log, 'approved_by') || getMetaField(log, 'rejected_by') || getMetaField(log, 'removed_by') || getMetaField(log, 'deactivated_by') || getMetaField(log, 'activated_by') || getMetaField(log, 'sent_by') || getMetaField(log, 'updated_by') || getMetaField(log, 'submitted_by') || getMetaField(log, 'uploaded_by') || getMetaField(log, 'user_name') || '—'}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {email || '—'}
                        </TableCell>
                        <TableCell>
                          <Button variant="ghost" size="icon" className="h-7 w-7">
                            <Eye className="h-3.5 w-3.5" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </ScrollArea>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4 pt-4 border-t">
              <span className="text-sm text-muted-foreground">
                Page {page + 1} of {totalPages}
              </span>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" disabled={page === 0} onClick={() => setPage(p => p - 1)}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" disabled={page >= totalPages - 1} onClick={() => setPage(p => p + 1)}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Detail Dialog */}
      <Dialog open={!!detailLog} onOpenChange={(open) => !open && setDetailLog(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Audit Log Detail</DialogTitle>
          </DialogHeader>
          {detailLog && (
            <div className="space-y-3 text-sm">
              <div className="grid grid-cols-[120px_1fr] gap-2">
                <span className="text-muted-foreground font-medium">Event:</span>
                <Badge variant="secondary" className={`w-fit ${getEventBadgeClass(detailLog.event_type)}`}>
                  {detailLog.event_type}
                </Badge>

                <span className="text-muted-foreground font-medium">Timestamp:</span>
                <span className="font-mono">{format(new Date(detailLog.created_at), 'yyyy-MM-dd HH:mm:ss')}</span>

                <span className="text-muted-foreground font-medium">Actor ID:</span>
                <span className="font-mono text-xs">{detailLog.actor_id || '—'}</span>

                <span className="text-muted-foreground font-medium">Target User:</span>
                <span className="font-mono text-xs">{detailLog.target_user_id || '—'}</span>

                <span className="text-muted-foreground font-medium">Entity Type:</span>
                <span>{detailLog.entity_type || '—'}</span>

                <span className="text-muted-foreground font-medium">Entity ID:</span>
                <span className="font-mono text-xs">{detailLog.entity_id || '—'}</span>

                <span className="text-muted-foreground font-medium">IP Address:</span>
                <span className="font-mono text-xs">{detailLog.ip_address || '—'}</span>

                <span className="text-muted-foreground font-medium">User Agent:</span>
                <span className="text-xs break-all">{detailLog.user_agent || '—'}</span>
              </div>

              {detailLog.metadata && Object.keys(detailLog.metadata).length > 0 && (
                <div>
                  <span className="text-muted-foreground font-medium block mb-1">Metadata:</span>
                  <pre className="bg-muted rounded-md p-3 text-xs overflow-auto max-h-48 font-mono">
                    {JSON.stringify(detailLog.metadata, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
