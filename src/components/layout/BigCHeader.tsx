import { useState } from 'react';
import { Search, MapPin, ChevronDown, Menu, ShoppingCart } from 'lucide-react';
import { UserMenu } from '@/components/auth';
import { RoleSimulator } from '@/components/npd/RoleSimulator';
import { UserType } from '@/types/npd';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface BigCHeaderProps {
  demoRole: UserType;
  onRoleChange: (role: UserType) => void;
}

export function BigCHeader({ demoRole, onRoleChange }: BigCHeaderProps) {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <header className="sticky top-0 z-50">
      {/* Top Utility Bar */}
      <div className="bg-muted border-b border-border">
        <div className="container max-w-7xl mx-auto px-4 py-1.5">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <MapPin className="w-3.5 h-3.5" />
                <span>ศูนย์กระจายสินค้า</span>
              </div>
              <span className="text-muted-foreground hidden sm:inline">|</span>
              <span className="text-muted-foreground hidden sm:inline">NPD System v2.0</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-muted-foreground text-xs hidden sm:inline">TH / EN</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="bg-accent">
        <div className="container max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center gap-4">
            {/* Logo */}
            <div className="flex-shrink-0">
              <div className="bg-primary text-primary-foreground px-4 py-2 rounded-lg font-bold text-xl shadow-md">
                NPD
              </div>
            </div>

            {/* Category Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  className="hidden md:flex items-center gap-2 text-accent-foreground hover:bg-accent/80"
                >
                  <Menu className="w-4 h-4" />
                  <span>หมวดหมู่</span>
                  <ChevronDown className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-48">
                <DropdownMenuItem>DF - Dairy & Frozen</DropdownMenuItem>
                <DropdownMenuItem>NF - Non-Food</DropdownMenuItem>
                <DropdownMenuItem>FF - Fresh Food</DropdownMenuItem>
                <DropdownMenuItem>SL - Soft Line</DropdownMenuItem>
                <DropdownMenuItem>HL - Hard Line</DropdownMenuItem>
                <DropdownMenuItem>HOL - Home & Living</DropdownMenuItem>
                <DropdownMenuItem>PH - Pharmacy</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Search Bar */}
            <div className="flex-1 flex items-center max-w-2xl">
              <div className="relative flex-1">
                <Input
                  type="text"
                  placeholder="ค้นหาสินค้า, รหัสสินค้า..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pr-12 bg-card border-0 rounded-r-none focus-visible:ring-0 focus-visible:ring-offset-0"
                />
              </div>
              <Button 
                className="rounded-l-none bg-warning text-warning-foreground hover:bg-warning/90 px-4"
              >
                <Search className="w-5 h-5" />
              </Button>
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center gap-3">
              {/* Demo Role Switcher */}
              <Card className="py-1.5 px-3 bg-card/90 border-0 hidden lg:block">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">Role:</span>
                  <RoleSimulator 
                    selectedRole={demoRole} 
                    onRoleChange={onRoleChange}
                  />
                </div>
              </Card>

              {/* User Menu */}
              <UserMenu />

              {/* Cart Icon (decorative for retail feel) */}
              <Button variant="ghost" size="icon" className="text-accent-foreground hover:bg-accent/80 hidden sm:flex">
                <ShoppingCart className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
