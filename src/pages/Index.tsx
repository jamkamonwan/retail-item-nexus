import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { PasscodeGate } from '@/components/auth/PasscodeGate';
import { AuthenticatedWorkflowApp } from '@/components/npd/AuthenticatedWorkflowApp';
import { Loader2 } from 'lucide-react';

const Index = () => {
  const { user, loading, setMockRole } = useAuth();
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => sessionStorage.getItem('app_authenticated') === 'true'
  );

  const handlePasscodeSuccess = () => {
    setIsAuthenticated(true);
    setMockRole('buyer'); // Auto-login as default user
  };

  if (!isAuthenticated) {
    return <PasscodeGate onSuccess={handlePasscodeSuccess} />;
  }

  // If authenticated but no user (e.g. page refresh), restore default
  if (!user && !loading) {
    setMockRole('buyer');
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return <AuthenticatedWorkflowApp />;
};

export default Index;
