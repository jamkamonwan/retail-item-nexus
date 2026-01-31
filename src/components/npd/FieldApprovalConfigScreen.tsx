import { useState, useMemo } from 'react';
import { useFieldApprovalConfig } from '@/hooks/useFieldApprovalConfig';
import { ALL_NPD_FIELDS } from '@/data/npd-fields';
import { UserType, USER_TYPES, Division, DIVISIONS, FORM_SECTIONS, FormSection } from '@/types/npd';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Trash2, Search, Settings2, Filter } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

// Secondary approver roles (excluding supplier and buyer who are in primary flow)
const SECONDARY_ROLES: UserType[] = ['commercial', 'finance', 'scm', 'im', 'dc_income'];

export function FieldApprovalConfigScreen() {
  const { configs, loading, addConfig, removeConfig } = useFieldApprovalConfig();
  const [searchQuery, setSearchQuery] = useState('');
  const [sectionFilter, setSectionFilter] = useState<FormSection | 'all'>('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  // Add form state
  const [selectedFieldId, setSelectedFieldId] = useState<string>('');
  const [selectedRole, setSelectedRole] = useState<UserType | ''>('');
  const [selectedDivision, setSelectedDivision] = useState<string>('all');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filter fields based on search and section
  const filteredFields = useMemo(() => {
    return ALL_NPD_FIELDS.filter((field) => {
      const matchesSearch =
        searchQuery === '' ||
        field.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        field.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (field.nameTh && field.nameTh.includes(searchQuery));

      const matchesSection = sectionFilter === 'all' || field.section === sectionFilter;

      return matchesSearch && matchesSection;
    });
  }, [searchQuery, sectionFilter]);

  // Group configs by field
  const configsByField = useMemo(() => {
    const grouped: Record<string, typeof configs> = {};
    configs.forEach((config) => {
      if (!grouped[config.fieldId]) {
        grouped[config.fieldId] = [];
      }
      grouped[config.fieldId].push(config);
    });
    return grouped;
  }, [configs]);

  const handleAddConfig = async () => {
    if (!selectedFieldId || !selectedRole) return;

    setIsSubmitting(true);
    const division = selectedDivision === 'all' ? null : selectedDivision;
    const success = await addConfig(selectedFieldId, selectedRole as UserType, division);

    if (success) {
      setSelectedFieldId('');
      setSelectedRole('');
      setSelectedDivision('all');
      setIsAddDialogOpen(false);
    }
    setIsSubmitting(false);
  };

  const handleRemoveConfig = async (configId: string) => {
    await removeConfig(configId);
  };

  const getFieldInfo = (fieldId: string) => {
    return ALL_NPD_FIELDS.find((f) => f.id === fieldId);
  };

  const getRoleBadgeColor = (role: UserType): string => {
    const colors: Record<UserType, string> = {
      supplier: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
      buyer: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
      commercial: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
      finance: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300',
      scm: 'bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-300',
      im: 'bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300',
      dc_income: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
      admin: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
    };
    return colors[role] || 'bg-muted text-muted-foreground';
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Settings2 className="w-6 h-6" />
            Field Approval Configuration
          </h2>
          <p className="text-muted-foreground mt-1">
            Configure which fields require secondary approval from specific roles
          </p>
        </div>

        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Approval Rule
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Add Field Approval Rule</DialogTitle>
              <DialogDescription>
                Select a field and the role that must approve it during the secondary approval phase.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              {/* Field Selection */}
              <div className="space-y-2">
                <Label>Field</Label>
                <Select value={selectedFieldId} onValueChange={setSelectedFieldId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a field..." />
                  </SelectTrigger>
                  <SelectContent className="max-h-60">
                    {Object.entries(FORM_SECTIONS).map(([sectionKey, section]) => {
                      const sectionFields = ALL_NPD_FIELDS.filter(
                        (f) => f.section === sectionKey
                      );
                      if (sectionFields.length === 0) return null;

                      return (
                        <div key={sectionKey}>
                          <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground bg-muted/50">
                            {section.title}
                          </div>
                          {sectionFields.map((field) => (
                            <SelectItem key={field.id} value={field.id}>
                              {field.name}
                              {field.nameTh && (
                                <span className="text-muted-foreground ml-2">
                                  ({field.nameTh})
                                </span>
                              )}
                            </SelectItem>
                          ))}
                        </div>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>

              {/* Role Selection */}
              <div className="space-y-2">
                <Label>Required Approver Role</Label>
                <Select value={selectedRole} onValueChange={(v) => setSelectedRole(v as UserType)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a role..." />
                  </SelectTrigger>
                  <SelectContent>
                    {SECONDARY_ROLES.map((role) => (
                      <SelectItem key={role} value={role}>
                        {USER_TYPES[role].label}
                        <span className="text-muted-foreground ml-2">
                          - {USER_TYPES[role].description}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Division Scope */}
              <div className="space-y-2">
                <Label>Division Scope</Label>
                <Select value={selectedDivision} onValueChange={setSelectedDivision}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Divisions</SelectItem>
                    {Object.entries(DIVISIONS).map(([key, div]) => (
                      <SelectItem key={key} value={key}>
                        {div.label} - {div.fullName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  Leave as "All Divisions" to apply this rule universally
                </p>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleAddConfig}
                disabled={!selectedFieldId || !selectedRole || isSubmitting}
              >
                {isSubmitting ? 'Adding...' : 'Add Rule'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search fields..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-muted-foreground" />
              <Select
                value={sectionFilter}
                onValueChange={(v) => setSectionFilter(v as FormSection | 'all')}
              >
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sections</SelectItem>
                  {Object.entries(FORM_SECTIONS).map(([key, section]) => (
                    <SelectItem key={key} value={key}>
                      {section.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Fields Table */}
      <Card>
        <CardHeader>
          <CardTitle>Fields with Approval Rules</CardTitle>
          <CardDescription>
            {configs.length} approval rule{configs.length !== 1 ? 's' : ''} configured across{' '}
            {Object.keys(configsByField).length} field{Object.keys(configsByField).length !== 1 ? 's' : ''}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[300px]">Field</TableHead>
                <TableHead>Section</TableHead>
                <TableHead>Approval Rules</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredFields.map((field) => {
                const fieldConfigs = configsByField[field.id] || [];
                const hasConfigs = fieldConfigs.length > 0;

                return (
                  <TableRow key={field.id} className={cn(!hasConfigs && 'opacity-60')}>
                    <TableCell>
                      <div>
                        <span className="font-medium">{field.name}</span>
                        {field.nameTh && (
                          <span className="text-muted-foreground text-sm ml-2">
                            ({field.nameTh})
                          </span>
                        )}
                        <div className="text-xs text-muted-foreground">{field.id}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{FORM_SECTIONS[field.section].title}</Badge>
                    </TableCell>
                    <TableCell>
                      {hasConfigs ? (
                        <div className="flex flex-wrap gap-2">
                          {fieldConfigs.map((config) => (
                            <div
                              key={config.id}
                              className="flex items-center gap-1.5 bg-muted rounded-md px-2 py-1"
                            >
                              <Badge className={getRoleBadgeColor(config.requiredRole)}>
                                {USER_TYPES[config.requiredRole].label}
                              </Badge>
                              {config.division && (
                                <span className="text-xs text-muted-foreground">
                                  ({config.division})
                                </span>
                              )}
                              <button
                                onClick={() => handleRemoveConfig(config.id)}
                                className="ml-1 text-muted-foreground hover:text-destructive transition-colors"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <span className="text-muted-foreground text-sm">No rules configured</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedFieldId(field.id);
                          setIsAddDialogOpen(true);
                        }}
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>

          {filteredFields.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No fields match your search criteria
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
