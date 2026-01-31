import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Search, X } from 'lucide-react';
import { UserFilters, UserStatus, Department, Supplier } from '@/types/admin';
import { USER_TYPES, UserType } from '@/types/npd';

interface UserFiltersProps {
  filters: UserFilters;
  onFiltersChange: (filters: UserFilters) => void;
  departments: Department[];
  suppliers: Supplier[];
}

const STATUS_OPTIONS: { value: UserStatus; label: string }[] = [
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
  { value: 'locked', label: 'Locked' },
];

export function UserFiltersComponent({ filters, onFiltersChange, departments, suppliers }: UserFiltersProps) {
  const handleSearchChange = (value: string) => {
    onFiltersChange({ ...filters, search: value });
  };

  const handleRoleChange = (value: string) => {
    onFiltersChange({ ...filters, role: value === 'all' ? null : value as UserType });
  };

  const handleDepartmentChange = (value: string) => {
    onFiltersChange({ ...filters, department: value === 'all' ? null : value });
  };

  const handleStatusChange = (value: string) => {
    onFiltersChange({ ...filters, status: value === 'all' ? null : (value as UserStatus) });
  };

  const handleSupplierChange = (value: string) => {
    onFiltersChange({ ...filters, supplierId: value === 'all' ? null : value });
  };

  const clearFilters = () => {
    onFiltersChange({
      search: '',
      role: null,
      department: null,
      status: null,
      supplierId: null,
    });
  };

  const hasActiveFilters =
    filters.search || filters.role || filters.department || filters.status || filters.supplierId;

  return (
    <div className="flex flex-wrap gap-3 items-end">
      {/* Search */}
      <div className="flex-1 min-w-[200px]">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, email, or ID..."
            value={filters.search}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {/* Role Filter */}
      <div className="w-[150px]">
        <Select value={filters.role || 'all'} onValueChange={handleRoleChange}>
          <SelectTrigger>
            <SelectValue placeholder="Role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Roles</SelectItem>
            {Object.entries(USER_TYPES).map(([key, value]) => (
              <SelectItem key={key} value={key}>
                {value.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Department Filter */}
      <div className="w-[150px]">
        <Select value={filters.department || 'all'} onValueChange={handleDepartmentChange}>
          <SelectTrigger>
            <SelectValue placeholder="Department" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Depts</SelectItem>
            {departments.map((dept) => (
              <SelectItem key={dept.code} value={dept.code}>
                {dept.code}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Status Filter */}
      <div className="w-[130px]">
        <Select value={filters.status || 'all'} onValueChange={handleStatusChange}>
          <SelectTrigger>
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            {STATUS_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Supplier Filter */}
      {suppliers.length > 0 && (
        <div className="w-[150px]">
          <Select value={filters.supplierId || 'all'} onValueChange={handleSupplierChange}>
            <SelectTrigger>
              <SelectValue placeholder="Supplier" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Suppliers</SelectItem>
              {suppliers.map((s) => (
                <SelectItem key={s.id} value={s.id}>
                  {s.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Clear Filters */}
      {hasActiveFilters && (
        <Button variant="ghost" size="sm" onClick={clearFilters} className="gap-1">
          <X className="h-4 w-4" />
          Clear
        </Button>
      )}
    </div>
  );
}
