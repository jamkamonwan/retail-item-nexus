import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { MockModule } from '@/data/mock/tiers';
import { Wand2 } from 'lucide-react';

const THAI_FIRST_NAMES = ['Somchai', 'Somsak', 'Somporn', 'Siriporn', 'Suwanna', 'Nattapong', 'Kittipong', 'Waraporn', 'Pimchanok', 'Thanawat', 'Aranya', 'Chaiwat', 'Dusit', 'Ekkachai', 'Jiraporn'];
const THAI_LAST_NAMES = ['Kaewsai', 'Srisuk', 'Thongkam', 'Wongchai', 'Rattanapong', 'Bunyasarn', 'Chaiprapat', 'Detcharoen', 'Intaraprasit', 'Jantarasiri'];

function randomPick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

interface StaffUserFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  availableModules: MockModule[];
  onSubmit: (data: { fullName: string; email: string; assignedModules: string[] }) => void;
}

export function StaffUserFormDialog({ open, onOpenChange, availableModules, onSubmit }: StaffUserFormDialogProps) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [selectedModules, setSelectedModules] = useState<string[]>([]);

  const handleAutoFill = () => {
    const first = randomPick(THAI_FIRST_NAMES);
    const last = randomPick(THAI_LAST_NAMES);
    const name = `${first} ${last}`;
    setFullName(name);
    setEmail(`${first.toLowerCase()}.${last.toLowerCase()}@supplier.com`);
    // Pick 1-3 random modules
    if (availableModules.length > 0) {
      const count = Math.min(Math.floor(Math.random() * 3) + 1, availableModules.length);
      const shuffled = [...availableModules].sort(() => Math.random() - 0.5);
      setSelectedModules(shuffled.slice(0, count).map(m => m.id));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !email.trim()) return;
    onSubmit({ fullName: fullName.trim(), email: email.trim(), assignedModules: selectedModules });
    setFullName('');
    setEmail('');
    setSelectedModules([]);
    onOpenChange(false);
  };

  const toggleModule = (moduleId: string) => {
    setSelectedModules(prev =>
      prev.includes(moduleId) ? prev.filter(m => m !== moduleId) : [...prev, moduleId]
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle>Create Staff User</DialogTitle>
              <DialogDescription>Role will be set to Normal Supplier automatically.</DialogDescription>
            </div>
            <Button type="button" variant="outline" size="sm" className="gap-1.5" onClick={handleAutoFill}>
              <Wand2 className="h-3.5 w-3.5" />
              Auto Fill
            </Button>
          </div>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="staff-name">Full Name</Label>
            <Input id="staff-name" value={fullName} onChange={e => setFullName(e.target.value)} placeholder="e.g. Somchai Kaewsai" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="staff-email">Email</Label>
            <Input id="staff-email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="user@supplier.com" required />
          </div>
          {availableModules.length > 0 && (
            <div className="space-y-2">
              <Label>Assign Modules</Label>
              <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto border rounded-md p-3">
                {availableModules.map(mod => (
                  <label key={mod.id} className="flex items-center gap-2 text-sm cursor-pointer">
                    <Checkbox
                      checked={selectedModules.includes(mod.id)}
                      onCheckedChange={() => toggleModule(mod.id)}
                    />
                    <span>{mod.name}</span>
                  </label>
                ))}
              </div>
            </div>
          )}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit">Create User</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
