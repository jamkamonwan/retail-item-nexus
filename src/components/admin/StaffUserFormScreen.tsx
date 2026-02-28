import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent } from '@/components/ui/card';
import { MockModule } from '@/data/mock/tiers';
import { ArrowLeft, Wand2 } from 'lucide-react';

const THAI_FIRST_NAMES = ['Somchai', 'Somsak', 'Somporn', 'Siriporn', 'Suwanna', 'Nattapong', 'Kittipong', 'Waraporn', 'Pimchanok', 'Thanawat', 'Aranya', 'Chaiwat', 'Dusit', 'Ekkachai', 'Jiraporn'];
const THAI_LAST_NAMES = ['Kaewsai', 'Srisuk', 'Thongkam', 'Wongchai', 'Rattanapong', 'Bunyasarn', 'Chaiprapat', 'Detcharoen', 'Intaraprasit', 'Jantarasiri'];

function randomPick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

interface StaffUserFormScreenProps {
  availableModules: MockModule[];
  onSubmit: (data: { fullName: string; email: string; assignedModules: string[] }) => void;
  onBack: () => void;
}

export function StaffUserFormScreen({ availableModules, onSubmit, onBack }: StaffUserFormScreenProps) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [selectedModules, setSelectedModules] = useState<string[]>([]);

  const handleAutoFill = () => {
    const first = randomPick(THAI_FIRST_NAMES);
    const last = randomPick(THAI_LAST_NAMES);
    setFullName(`${first} ${last}`);
    setEmail(`${first.toLowerCase()}.${last.toLowerCase()}@supplier.com`);
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
  };

  const toggleModule = (moduleId: string) => {
    setSelectedModules(prev =>
      prev.includes(moduleId) ? prev.filter(m => m !== moduleId) : [...prev, moduleId]
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-foreground">Create Staff User</h1>
          <p className="text-muted-foreground">Role will be set to Normal Supplier automatically.</p>
        </div>
        <Button type="button" variant="outline" size="sm" className="gap-1.5" onClick={handleAutoFill}>
          <Wand2 className="h-3.5 w-3.5" />
          Auto Fill
        </Button>
      </div>

      {/* Form */}
      <Card>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="staff-name">Full Name *</Label>
                <Input id="staff-name" value={fullName} onChange={e => setFullName(e.target.value)} placeholder="e.g. Somchai Kaewsai" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="staff-email">Email *</Label>
                <Input id="staff-email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="user@supplier.com" required />
              </div>
            </div>

            {availableModules.length > 0 && (
              <div className="space-y-2">
                <Label>Assign Modules</Label>
                <div className="grid grid-cols-2 gap-2 border rounded-md p-3">
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

            <div className="flex items-center justify-between pt-2">
              <Button type="button" variant="outline" onClick={onBack} className="gap-2">
                <ArrowLeft className="h-4 w-4" /> Cancel
              </Button>
              <Button type="submit">Create User</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
