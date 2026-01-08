import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Loader2 } from 'lucide-react';
import { LockedDashboard } from '@/components/LockedDashboard';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requirePassenger?: boolean;
  requireOnboarding?: boolean;
}

export function ProtectedRoute({ 
  children, 
  requirePassenger = true,
  requireOnboarding = true 
}: ProtectedRouteProps) {
  const { user, passenger, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <Loader2 className="h-10 w-10 animate-spin text-accent mx-auto" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  if (requirePassenger && !passenger) {
    return <Navigate to="/auth" state={{ from: location, noPassengerRecord: true }} replace />;
  }

  // Check access control - suspended or unpaid accounts
  if (passenger && requireOnboarding) {
    if (passenger.account_status === 'suspended') {
      return <LockedDashboard reason="suspended" />;
    }
    if (passenger.payment_status === 'unpaid') {
      return <LockedDashboard reason="unpaid" />;
    }
  }

  // Check onboarding status - redirect to onboarding if not completed
  if (passenger && requireOnboarding && !passenger.onboarding_completed) {
    return <Navigate to="/onboarding" replace />;
  }

  return <>{children}</>;
}
