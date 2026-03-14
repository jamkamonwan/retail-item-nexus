import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Lock, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const VALID_PASSCODE = 'kmit';

interface PasscodeGateProps {
  onSuccess: () => void;
}

export function PasscodeGate({ onSuccess }: PasscodeGateProps) {
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      if (password === VALID_PASSCODE) {
        sessionStorage.setItem('app_authenticated', 'true');
        toast.success('Access granted');
        onSuccess();
      } else {
        toast.error('Invalid password');
      }
      setIsLoading(false);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-accent via-accent/90 to-success flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-primary shadow-lg mb-4">
            <span className="text-3xl font-bold text-primary-foreground">NPD</span>
          </div>
          <h1 className="text-2xl font-bold text-accent-foreground">ระบบสินค้าใหม่</h1>
          <p className="text-accent-foreground/80">New Product Development Workflow</p>
        </div>

        <Card>
          <CardHeader className="text-center pb-2">
            <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
              <Lock className="w-6 h-6 text-primary" />
            </div>
            <p className="text-sm text-muted-foreground">Enter password to access the system</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="passcode">Password</Label>
                <Input
                  id="passcode"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoFocus
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Enter
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
