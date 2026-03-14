import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowLeft, Loader2, RefreshCw } from 'lucide-react';
import { format } from 'date-fns';

interface TermsAcceptanceReportProps {
  onBack: () => void;
}

interface AcceptanceRow {
  id: string;
  user_id: string;
  terms_version_id: string;
  status: string;
  accepted_at: string | null;
  created_at: string;
}

interface VersionOption {
  id: string;
  version: string;
  title: string;
}

interface AuditLogEntry {
  event_type: string;
  actor_id: string | null;
  entity_id: string | null;
  metadata: Record<string, any> | null;
  created_at: string | null;
}

export function TermsAcceptanceReport({ onBack }: TermsAcceptanceReportProps) {
  const [logs, setLogs] = useState<AuditLogEntry[]>([]);
  const [versions, setVersions] = useState<VersionOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [filterVersion, setFilterVersion] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [search, setSearch] = useState('');

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      // Fetch versions for filter dropdown and version label
      const { data: vData } = await supabase
        .from('terms_versions')
        .select('id, version, title')
        .order('created_at', { ascending: false });
      setVersions((vData as VersionOption[]) || []);

      // Fetch audit logs for terms events
      let query = supabase
        .from('audit_logs')
        .select('*')
        .in('event_type', ['TERMS_ACCEPTED', 'TERMS_REJECTED', 'TERMS_VIEWED'])
        .order('created_at', { ascending: false });

      if (filterStatus !== 'all') {
        query = query.eq('event_type', filterStatus);
      }

      const { data, error } = await query;
      if (error) {
        console.error('Error fetching terms logs:', error);
        return;
      }

      let filtered = (data as AuditLogEntry[]) || [];

      // Filter by version if selected
      if (filterVersion !== 'all') {
        filtered = filtered.filter(l => l.entity_id === filterVersion);
      }

      setLogs(filtered);
    } finally {
      setLoading(false);
    }
  }, [filterVersion, filterStatus]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const getVersionLabel = (entityId: string | null) => {
    if (!entityId) return '—';
    const v = versions.find(ver => ver.id === entityId);
    return v?.version || entityId.substring(0, 8);
  };

  const getVersionTitle = (entityId: string | null) => {
    if (!entityId) return '—';
    const v = versions.find(ver => ver.id === entityId);
    return v?.title || '—';
  };

  const getActionLabel = (eventType: string) => {
    switch (eventType) {
      case 'TERMS_ACCEPTED': return 'Accepted';
      case 'TERMS_REJECTED': return 'Rejected';
      case 'TERMS_VIEWED': return 'Viewed';
      default: return eventType;
    }
  };

  const getActionBadge = (eventType: string) => {
    switch (eventType) {
      case 'TERMS_ACCEPTED': return 'bg-green-100 text-green-800 border-green-300';
      case 'TERMS_REJECTED': return 'bg-red-100 text-red-800 border-red-300';
      case 'TERMS_VIEWED': return 'bg-blue-100 text-blue-800 border-blue-300';
      default: return '';
    }
  };

  const getUserName = (log: AuditLogEntry) => {
    return (log.metadata as any)?.user_name || (log.metadata as any)?.name || '—';
  };

  const getUserEmail = (log: AuditLogEntry) => {
    return (log.metadata as any)?.user_email || (log.metadata as any)?.email || '—';
  };

  const filteredLogs = logs.filter(l => {
    if (!search) return true;
    const name = getUserName(l).toLowerCase();
    const email = getUserEmail(l).toLowerCase();
    const s = search.toLowerCase();
    return name.includes(s) || email.includes(s);
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-1" /> Back
          </Button>
          <h2 className="text-2xl font-bold text-foreground">Terms & Conditions Log</h2>
        </div>
        <Button variant="outline" onClick={fetchData} className="gap-2">
          <RefreshCw className="w-4 h-4" /> Refresh
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 flex-wrap">
            <Input
              placeholder="Search by name or email..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="max-w-xs"
            />
            <Select value={filterVersion} onValueChange={setFilterVersion}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All Versions" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Versions</SelectItem>
                {versions.map(v => (
                  <SelectItem key={v.id} value={v.id}>{v.version}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All Actions" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Actions</SelectItem>
                <SelectItem value="TERMS_ACCEPTED">Accepted</SelectItem>
                <SelectItem value="TERMS_REJECTED">Rejected</SelectItem>
                <SelectItem value="TERMS_VIEWED">Viewed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          {loading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            </div>
          ) : filteredLogs.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">No terms acceptance records found.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Version</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>User Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Date / Time</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLogs.map((log, idx) => (
                  <TableRow key={idx}>
                    <TableCell className="font-mono font-medium">{getVersionLabel(log.entity_id)}</TableCell>
                    <TableCell>{getVersionTitle(log.entity_id)}</TableCell>
                    <TableCell>{getUserName(log)}</TableCell>
                    <TableCell className="text-sm">{getUserEmail(log)}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={getActionBadge(log.event_type)}>
                        {getActionLabel(log.event_type)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {log.created_at ? format(new Date(log.created_at), 'dd MMM yyyy HH:mm') : '—'}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
