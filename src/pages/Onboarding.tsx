import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { WelcomeStep } from '@/components/onboarding/WelcomeStep';
import { AddressStep } from '@/components/onboarding/AddressStep';
import { ScheduleStep } from '@/components/onboarding/ScheduleStep';
import { Card, CardContent } from '@/components/ui/card';
import { Check, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import logo from '@/assets/logo.webp';

type OnboardingStep = 'welcome' | 'home-address' | 'work-address' | 'schedule' | 'complete';

export default function Onboarding() {
  const { profile, passenger, user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState<OnboardingStep>('welcome');

  const handleProfileSubmit = async (data: { full_name: string; phone: string; company: string }) => {
    if (!user || !passenger) return;

    try {
      // Update profile
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          full_name: data.full_name,
          phone: data.phone,
        })
        .eq('user_id', user.id);

      if (profileError) throw profileError;

      // Update passenger company
      const { error: passengerError } = await supabase
        .from('passengers')
        .update({
          company: data.company,
        })
        .eq('user_id', user.id);

      if (passengerError) throw passengerError;

      setCurrentStep('home-address');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: 'Error',
        description: 'Failed to save profile. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleHomeAddressSubmit = async (data: { address: string; lat: number; lng: number }) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('passengers')
        .update({
          home_address: data.address,
          home_lat: data.lat,
          home_lng: data.lng,
        })
        .eq('user_id', user.id);

      if (error) throw error;

      setCurrentStep('work-address');
    } catch (error) {
      console.error('Error updating home address:', error);
      toast({
        title: 'Error',
        description: 'Failed to save home address. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleWorkAddressSubmit = async (data: { address: string; lat: number; lng: number }) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('passengers')
        .update({
          work_address: data.address,
          work_lat: data.lat,
          work_lng: data.lng,
        })
        .eq('user_id', user.id);

      if (error) throw error;

      setCurrentStep('schedule');
    } catch (error) {
      console.error('Error updating work address:', error);
      toast({
        title: 'Error',
        description: 'Failed to save work address. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleScheduleSubmit = async (schedules: { dayOfWeek: number; inboundTime: string | null; outboundTime: string | null }[]) => {
    if (!user || !passenger) return;

    try {
      // Insert availability requests
      const { error: scheduleError } = await supabase
        .from('availability_requests')
        .insert(
          schedules.map((schedule) => ({
            passenger_id: passenger.id,
            day_of_week: schedule.dayOfWeek,
            inbound_time: schedule.inboundTime,
            outbound_time: schedule.outboundTime,
            status: 'pending',
          }))
        );

      if (scheduleError) throw scheduleError;

      // Mark onboarding as complete
      const { error: onboardingError } = await supabase
        .from('passengers')
        .update({
          onboarding_completed: true,
        })
        .eq('user_id', user.id);

      if (onboardingError) throw onboardingError;

      setCurrentStep('complete');

      // Redirect after showing success
      setTimeout(() => {
        navigate('/');
        window.location.reload(); // Refresh to get updated passenger data
      }, 2000);
    } catch (error) {
      console.error('Error submitting schedule:', error);
      toast({
        title: 'Error',
        description: 'Failed to submit schedule. Please try again.',
        variant: 'destructive',
      });
    }
  };

  // Completed state
  if (currentStep === 'complete') {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center px-5">
        <img src={logo} alt="Street Surfers" className="h-12 w-auto mb-8" />
        <Card className="bg-card border-border rounded-2xl w-full max-w-md">
          <CardContent className="p-8 text-center">
            <div className="w-20 h-20 rounded-full gradient-accent flex items-center justify-center mx-auto mb-6 glow-accent">
              <Check className="w-10 h-10 text-accent-foreground" />
            </div>
            <h1 className="text-2xl font-display font-bold text-foreground mb-3">
              You're All Set!
            </h1>
            <p className="text-muted-foreground mb-4">
              Your schedule has been submitted for dispatch approval.
            </p>
            <div className="flex items-center justify-center gap-2 text-muted-foreground">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="text-sm">Redirecting to dashboard...</span>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Get ride type from passenger, default to dual
  const rideType = (passenger?.ride_type || 'dual') as 'inbound' | 'outbound' | 'dual';

  switch (currentStep) {
    case 'welcome':
      return (
        <WelcomeStep
          initialData={{
            full_name: profile?.full_name || null,
            phone: profile?.phone || null,
            email: profile?.email || null,
            company: passenger?.company || null,
          }}
          onSubmit={handleProfileSubmit}
        />
      );

    case 'home-address':
      return (
        <AddressStep
          addressType="home"
          initialAddress={passenger?.home_address}
          onSubmit={handleHomeAddressSubmit}
          onBack={() => setCurrentStep('welcome')}
        />
      );

    case 'work-address':
      return (
        <AddressStep
          addressType="work"
          initialAddress={passenger?.work_address}
          onSubmit={handleWorkAddressSubmit}
          onBack={() => setCurrentStep('home-address')}
        />
      );

    case 'schedule':
      return (
        <ScheduleStep
          rideType={rideType}
          onSubmit={handleScheduleSubmit}
          onBack={() => setCurrentStep('work-address')}
        />
      );

    default:
      return null;
  }
}
