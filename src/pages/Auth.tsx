import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, AlertCircle, Bus, Shield, MapPin } from 'lucide-react';
import { z } from 'zod';

const emailSchema = z.string().email('Please enter a valid email');
const passwordSchema = z.string().min(6, 'Password must be at least 6 characters');
const phoneSchema = z.string().regex(/^[\d\s\-+()]*$/, 'Please enter a valid phone number').optional();

export default function Auth() {
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn, signUp, user, passenger, loading } = useAuth();
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Login fields
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  
  // Signup fields - Enhanced with more details
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupConfirmPassword, setSignupConfirmPassword] = useState('');
  const [signupFullName, setSignupFullName] = useState('');
  const [signupPhone, setSignupPhone] = useState('');
  const [signupEmployeeId, setSignupEmployeeId] = useState('');
  const [signupDepartment, setSignupDepartment] = useState('');
  const [signupHomeAddress, setSignupHomeAddress] = useState('');

  const noPassengerRecord = location.state?.noPassengerRecord;

  // Redirect if already logged in as passenger
  if (!loading && user && passenger) {
    navigate('/', { replace: true });
    return null;
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    try {
      emailSchema.parse(loginEmail);
      passwordSchema.parse(loginPassword);
    } catch (err) {
      if (err instanceof z.ZodError) {
        setError(err.errors[0].message);
        return;
      }
    }

    setIsLoading(true);
    
    const { error: signInError } = await signIn(loginEmail, loginPassword);
    
    if (signInError) {
      setError(signInError.message);
      setIsLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    try {
      emailSchema.parse(signupEmail);
      passwordSchema.parse(signupPassword);
      if (!signupFullName.trim()) throw new Error('Please enter your full name');
      if (signupPassword !== signupConfirmPassword) throw new Error('Passwords do not match');
      if (signupPhone) phoneSchema.parse(signupPhone);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Validation error');
      return;
    }

    setIsLoading(true);
    
    const { error: signUpError } = await signUp(signupEmail, signupPassword, signupFullName, {
      phone: signupPhone,
      employee_id: signupEmployeeId,
      department: signupDepartment,
      home_address: signupHomeAddress,
    });
    
    if (signUpError) {
      setError(signUpError.message);
    }
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col dark">
      {/* Hero Section */}
      <div className="px-6 pt-16 pb-8 text-center">
        {/* Logo */}
        <div className="w-20 h-20 rounded-2xl bg-accent flex items-center justify-center mx-auto mb-6 glow-accent">
          <Bus className="w-10 h-10 text-accent-foreground" />
        </div>
        
        <h1 className="text-4xl font-display font-bold text-foreground mb-2">
          Street Surfers
        </h1>
        <p className="text-muted-foreground text-lg">Passenger App</p>

        {/* Feature Pills */}
        <div className="flex flex-wrap justify-center gap-3 mt-6">
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-card border border-border">
            <MapPin className="w-4 h-4 text-accent" />
            <span className="text-sm text-foreground">Live Tracking</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-card border border-border">
            <Shield className="w-4 h-4 text-accent" />
            <span className="text-sm text-foreground">Safe Rides</span>
          </div>
        </div>
      </div>

      {/* Auth Card */}
      <div className="flex-1 px-5 pb-8">
        {noPassengerRecord && (
          <Alert variant="destructive" className="mb-4 rounded-xl">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              No passenger record found. Please contact your administrator.
            </AlertDescription>
          </Alert>
        )}

        <Card className="bg-card border-border rounded-2xl overflow-hidden">
          <CardContent className="p-0">
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2 p-1 m-4 mb-0 bg-muted rounded-xl" style={{ width: 'calc(100% - 32px)' }}>
                <TabsTrigger 
                  value="login" 
                  className="rounded-lg data-[state=active]:bg-background data-[state=active]:text-foreground"
                >
                  Sign In
                </TabsTrigger>
                <TabsTrigger 
                  value="signup"
                  className="rounded-lg data-[state=active]:bg-background data-[state=active]:text-foreground"
                >
                  Sign Up
                </TabsTrigger>
              </TabsList>

              {error && (
                <Alert variant="destructive" className="mx-4 mt-4 rounded-xl">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {/* Login Form */}
              <TabsContent value="login" className="p-5 pt-4">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email" className="text-foreground">Email</Label>
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="you@company.com"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      disabled={isLoading}
                      className="h-12 rounded-xl bg-muted border-border text-foreground placeholder:text-muted-foreground"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="login-password" className="text-foreground">Password</Label>
                    <Input
                      id="login-password"
                      type="password"
                      placeholder="••••••••"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      disabled={isLoading}
                      className="h-12 rounded-xl bg-muted border-border text-foreground"
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full h-12 rounded-xl bg-accent hover:bg-accent/90 text-accent-foreground font-semibold text-base"
                    disabled={isLoading}
                  >
                    {isLoading ? <Loader2 className="h-5 w-5 animate-spin mr-2" /> : null}
                    Sign In
                  </Button>
                </form>
              </TabsContent>

              {/* Signup Form - Enhanced */}
              <TabsContent value="signup" className="p-5 pt-4">
                <form onSubmit={handleSignup} className="space-y-4">
                  {/* Personal Info Section */}
                  <div className="space-y-4">
                    <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Personal Information</p>
                    
                    <div className="space-y-2">
                      <Label htmlFor="signup-name" className="text-foreground">
                        Full Name <span className="text-accent">*</span>
                      </Label>
                      <Input
                        id="signup-name"
                        placeholder="John Doe"
                        value={signupFullName}
                        onChange={(e) => setSignupFullName(e.target.value)}
                        disabled={isLoading}
                        className="h-12 rounded-xl bg-muted border-border text-foreground placeholder:text-muted-foreground"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="signup-email" className="text-foreground">
                        Email <span className="text-accent">*</span>
                      </Label>
                      <Input
                        id="signup-email"
                        type="email"
                        placeholder="you@company.com"
                        value={signupEmail}
                        onChange={(e) => setSignupEmail(e.target.value)}
                        disabled={isLoading}
                        className="h-12 rounded-xl bg-muted border-border text-foreground placeholder:text-muted-foreground"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="signup-phone" className="text-foreground">Phone Number</Label>
                      <Input
                        id="signup-phone"
                        type="tel"
                        placeholder="+1 (555) 123-4567"
                        value={signupPhone}
                        onChange={(e) => setSignupPhone(e.target.value)}
                        disabled={isLoading}
                        className="h-12 rounded-xl bg-muted border-border text-foreground placeholder:text-muted-foreground"
                      />
                    </div>
                  </div>

                  {/* Work Info Section */}
                  <div className="space-y-4 pt-2">
                    <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Work Information</p>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <Label htmlFor="signup-employee-id" className="text-foreground">Employee ID</Label>
                        <Input
                          id="signup-employee-id"
                          placeholder="EMP001"
                          value={signupEmployeeId}
                          onChange={(e) => setSignupEmployeeId(e.target.value)}
                          disabled={isLoading}
                          className="h-12 rounded-xl bg-muted border-border text-foreground placeholder:text-muted-foreground"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="signup-department" className="text-foreground">Department</Label>
                        <Input
                          id="signup-department"
                          placeholder="Engineering"
                          value={signupDepartment}
                          onChange={(e) => setSignupDepartment(e.target.value)}
                          disabled={isLoading}
                          className="h-12 rounded-xl bg-muted border-border text-foreground placeholder:text-muted-foreground"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="signup-home-address" className="text-foreground">Home Address</Label>
                      <Input
                        id="signup-home-address"
                        placeholder="123 Main St, City, State"
                        value={signupHomeAddress}
                        onChange={(e) => setSignupHomeAddress(e.target.value)}
                        disabled={isLoading}
                        className="h-12 rounded-xl bg-muted border-border text-foreground placeholder:text-muted-foreground"
                      />
                    </div>
                  </div>

                  {/* Security Section */}
                  <div className="space-y-4 pt-2">
                    <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Security</p>
                    
                    <div className="space-y-2">
                      <Label htmlFor="signup-password" className="text-foreground">
                        Password <span className="text-accent">*</span>
                      </Label>
                      <Input
                        id="signup-password"
                        type="password"
                        placeholder="Min 6 characters"
                        value={signupPassword}
                        onChange={(e) => setSignupPassword(e.target.value)}
                        disabled={isLoading}
                        className="h-12 rounded-xl bg-muted border-border text-foreground placeholder:text-muted-foreground"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="signup-confirm-password" className="text-foreground">
                        Confirm Password <span className="text-accent">*</span>
                      </Label>
                      <Input
                        id="signup-confirm-password"
                        type="password"
                        placeholder="••••••••"
                        value={signupConfirmPassword}
                        onChange={(e) => setSignupConfirmPassword(e.target.value)}
                        disabled={isLoading}
                        className="h-12 rounded-xl bg-muted border-border text-foreground placeholder:text-muted-foreground"
                      />
                    </div>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full h-12 rounded-xl bg-accent hover:bg-accent/90 text-accent-foreground font-semibold text-base mt-2"
                    disabled={isLoading}
                  >
                    {isLoading ? <Loader2 className="h-5 w-5 animate-spin mr-2" /> : null}
                    Create Account
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <p className="text-center text-xs text-muted-foreground mt-6">
          By continuing, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
}
