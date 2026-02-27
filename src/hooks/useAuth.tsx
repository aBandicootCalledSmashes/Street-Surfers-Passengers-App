import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface Passenger {
  id: string;
  user_id: string;
  employee_id: string | null;
  department: string | null;
  home_address: string | null;
  work_address: string | null;
  pickup_notes: string | null;
  emergency_contact_name: string | null;
  emergency_contact_phone: string | null;
  is_active: boolean;
  payment_status: string;
  account_status: string;
  ride_type: string;
  onboarding_completed: boolean;
  home_lat: number | null;
  home_lng: number | null;
  work_lat: number | null;
  work_lng: number | null;
  company: string | null;
  company_id: string | null;
  branch_id: string | null;
  shift_type: string | null;
  home_house_number: string | null;
  home_street: string | null;
  home_suburb: string | null;
  home_city: string | null;
  home_province: string | null;
  address_confidence: string | null;
  // Scholar fields
  passenger_type: string;
  is_minor: boolean;
  school_id: string | null;
  school_address: string | null;
  school_lat: number | null;
  school_lng: number | null;
  school_street: string | null;
  school_suburb: string | null;
  school_city: string | null;
  school_province: string | null;
}

interface ScholarProfile {
  id: string;
  passenger_id: string;
  school_name: string | null;
  grade_year: string | null;
  guardian_full_name: string;
  guardian_phone: string;
  guardian_email: string | null;
}

interface Profile {
  id: string;
  user_id: string;
  email: string | null;
  full_name: string | null;
  phone: string | null;
  avatar_url: string | null;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  passenger: Passenger | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string, fullName: string, extraData?: {
    phone?: string;
    shift_type?: string;
    company_id?: string;
  }) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  isPassenger: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [passenger, setPassenger] = useState<Passenger | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUserData = async (userId: string) => {
    try {
      // Fetch profile
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();
      
      setProfile(profileData);

      // Fetch passenger record
      const { data: passengerData } = await supabase
        .from('passenger_profiles')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();
      
      setPassenger(passengerData);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        // Defer data fetching with setTimeout to avoid deadlocks
        if (session?.user) {
          setTimeout(() => {
            fetchUserData(session.user.id);
          }, 0);
        } else {
          setProfile(null);
          setPassenger(null);
        }
        
        setLoading(false);
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        fetchUserData(session.user.id);
      }
      
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { error };
  };

  const signUp = async (email: string, password: string, fullName: string, extraData?: {
    phone?: string;
    shift_type?: string;
    company_id?: string;
  }) => {
    const redirectUrl = `${window.location.origin}/`;
    
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: {
          full_name: fullName,
          phone: extraData?.phone,
          shift_type: extraData?.shift_type,
          company_id: extraData?.company_id,
        },
      },
    });
    return { error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setProfile(null);
    setPassenger(null);
  };

  const value = {
    user,
    session,
    profile,
    passenger,
    loading,
    signIn,
    signUp,
    signOut,
    isPassenger: !!passenger,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
