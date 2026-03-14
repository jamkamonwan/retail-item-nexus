import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { AuthForm } from '@/components/auth/AuthForm';
import { PasscodeGate } from '@/components/auth/PasscodeGate';
import { AuthenticatedWorkflowApp } from '@/components/npd/AuthenticatedWorkflowApp';
import { Loader2 } from 'lucide-react';

const Index = () => {
  const { user, loading } = useAuth();
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => sessionStorage.getItem('app_authenticated') === 'true'
  );

  if (!isAuthenticated) {
    return <PasscodeGate onSuccess={() => setIsAuthenticated(true)} />;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return <AuthForm />;
  }

  return <AuthenticatedWorkflowApp />;
};

export default Index;
