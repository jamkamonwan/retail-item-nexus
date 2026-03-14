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
}

export function TermsAcceptanceReport({ onBack }: TermsAcceptanceReportProps) {
  const [records, setRecords] = useState<AcceptanceRow[]>([]);
  const [versions, setVersions] = useState<VersionOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [filterVersion, setFilterVersion] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [search, setSearch] = useState('');

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      // Fetch versions for filter dropdown
      const { data: vData } = await supabase
        .from('terms_versions')
        .select('id, version')
        .order('created_at', { ascending: false });
      setVersions((vData as VersionOption[]) || []);

      // Fetch acceptance records
      let query = supabase
        .from('user_terms_acceptance')
        .select('*')
        .order('created_at', { ascending: false });

      if (filterVersion !== 'all') {
        query = query.eq('terms_version_id', filterVersion);
      }
      if (filterStatus !== 'all') {
        query = query.eq('status', filterStatus);
      }

      const { data, error } = await query;
      if (error) {
        console.error('Error fetching acceptance records:', error);
        return;
      }
      setRecords((data as AcceptanceRow[]) || []);
    } finally {
      setLoading(false);
    }
  }, [filterVersion, filterStatus]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const getVersionLabel = (versionId: string) => {
    const v = versions.find(ver => ver.id === versionId);
    return v?.version || versionId.substring(0, 8);
  };

  const filteredRecords = records.filter(r => {
    if (!search) return true;
    return r.user_id.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-1" /> Back
          </Button>
          <h2 className="text-2xl font-bold text-foreground">Terms Acceptance Report</h2>
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
              placeholder="Search by user ID..."
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
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="ACCEPTED">Accepted</SelectItem>
                <SelectItem value="REJECTED">Rejected</SelectItem>
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
          ) : filteredRecords.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">No acceptance records found.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User ID</TableHead>
                  <TableHead>Version</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRecords.map(r => (
                  <TableRow key={r.id}>
                    <TableCell className="font-mono text-xs">{r.user_id.substring(0, 12)}...</TableCell>
                    <TableCell className="font-mono">{getVersionLabel(r.terms_version_id)}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={
                        r.status === 'ACCEPTED'
                          ? 'bg-green-100 text-green-800 border-green-300'
                          : 'bg-red-100 text-red-800 border-red-300'
                      }>
                        {r.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {r.accepted_at ? format(new Date(r.accepted_at), 'dd MMM yyyy HH:mm') : '—'}
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
