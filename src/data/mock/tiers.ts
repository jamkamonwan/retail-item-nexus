export interface MockModule {
  id: string;
  name: string;
  description: string;
  icon: string;
}

export interface MockTier {
  id: string;
  name: string;
  description: string;
  color: string;
  maxUsers: number;
  activeModules: string[];
  assignedGroups: string[];
  createdAt: Date;
}

export const SYSTEM_MODULES: MockModule[] = [
  { id: 'new_item', name: 'New Item Creation', description: 'Create and manage new product listings', icon: 'PackagePlus' },
  { id: 'supply_chain', name: 'Supply Chain Management', description: 'Track and manage supply chain operations', icon: 'Truck' },
  { id: 'pricing', name: 'Pricing & Promotions', description: 'Manage pricing rules and promotional campaigns', icon: 'Tag' },
  { id: 'compliance', name: 'Compliance & Certification', description: 'Handle regulatory compliance and certifications', icon: 'ShieldCheck' },
  { id: 'analytics', name: 'Analytics & Reports', description: 'Access dashboards and generate reports', icon: 'BarChart3' },
  { id: 'ecommerce', name: 'E-Commerce Integration', description: 'Manage online storefront and listings', icon: 'Globe' },
  { id: 'inventory', name: 'Inventory Management', description: 'Monitor stock levels and replenishment', icon: 'Warehouse' },
  { id: 'dc_ops', name: 'DC Operations', description: 'Distribution center logistics and operations', icon: 'Building2' },
];

export const mockTiers: MockTier[] = [
  {
    id: 'tier_a',
    name: 'Tier A',
    description: 'Premium — Full access to all modules',
    color: 'bg-primary/10 text-primary border-primary/30',
    maxUsers: 20,
    activeModules: ['new_item', 'supply_chain', 'pricing', 'compliance', 'analytics', 'ecommerce', 'inventory', 'dc_ops'],
    assignedGroups: ['group-001'],
    createdAt: new Date('2025-01-15'),
  },
  {
    id: 'tier_b',
    name: 'Tier B',
    description: 'Standard — Core operational modules',
    color: 'bg-secondary/80 text-secondary-foreground border-secondary/30',
    maxUsers: 10,
    activeModules: ['new_item', 'supply_chain', 'pricing', 'ecommerce', 'inventory'],
    assignedGroups: ['group-002'],
    createdAt: new Date('2025-02-01'),
  },
  {
    id: 'tier_c',
    name: 'Tier C',
    description: 'Basic — Essential modules only',
    color: 'bg-muted text-muted-foreground border-border',
    maxUsers: 5,
    activeModules: ['new_item', 'ecommerce'],
    assignedGroups: [],
    createdAt: new Date('2025-03-10'),
  },
];
