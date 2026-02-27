import { NPDSubmission } from '@/types/workflow';
import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Settings2, 
  Users, 
  Layers,
} from 'lucide-react';

interface AdminDashboardProps {
  submissions: NPDSubmission[];
  loading: boolean;
  onViewSubmission: (submission: NPDSubmission) => void;
  onNavigateToConfig: () => void;
  onNavigateToUsers: () => void;
  onNavigateToTiers: () => void;
}

export function AdminDashboard({
  onNavigateToConfig,
  onNavigateToUsers,
  onNavigateToTiers,
  loading,
}: AdminDashboardProps) {
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Admin Dashboard</h2>
          <p className="text-muted-foreground">System overview and configuration</p>
        </div>
        <Button onClick={onNavigateToConfig} variant="outline" className="gap-2">
          <Settings2 className="w-4 h-4" />
          Field Approval Config
        </Button>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="hover:bg-accent/50 cursor-pointer transition-colors" onClick={onNavigateToConfig}>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Settings2 className="w-5 h-5 text-primary" />
              Field Approval Configuration
            </CardTitle>
            <CardDescription>
              Configure which roles can approve specific fields
            </CardDescription>
          </CardHeader>
        </Card>
        
        <Card className="hover:bg-accent/50 cursor-pointer transition-colors" onClick={onNavigateToUsers}>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              User Management
            </CardTitle>
            <CardDescription>
              Manage users and role assignments
            </CardDescription>
          </CardHeader>
        </Card>
        
        <Card className="hover:bg-accent/50 cursor-pointer transition-colors" onClick={onNavigateToTiers}>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Layers className="w-5 h-5 text-primary" />
              Tier & Module Config
            </CardTitle>
            <CardDescription>
              Define service tiers and map modules to each tier
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
}