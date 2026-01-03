import { useAuth } from '@/hooks/useAuth';
import { AppLayout } from '@/components/AppLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User, Mail, Phone, MapPin, LogOut, Shield, Briefcase } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import logo from '@/assets/logo.webp';

export default function Profile() {
  const { profile, passenger, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  return (
    <AppLayout showSOS={false}>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <div className="bg-card border-b border-border px-4 py-6 safe-top">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-display font-bold text-foreground">Profile</h1>
            <img src={logo} alt="Street Surfers" className="h-8 w-auto opacity-50" />
          </div>
        </div>

        <div className="p-4 space-y-4">
          {/* Profile Card */}
          <Card className="bg-card border-border rounded-2xl overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16 border-2 border-accent">
                  <AvatarImage src={profile?.avatar_url || undefined} />
                  <AvatarFallback className="gradient-accent text-accent-foreground text-xl font-bold">
                    {profile?.full_name?.charAt(0) || <User />}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-xl font-display font-semibold text-foreground">
                    {profile?.full_name || 'Passenger'}
                  </h2>
                  {passenger?.employee_id && (
                    <div className="flex items-center gap-2 mt-1">
                      <Briefcase className="h-3 w-3 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">
                        ID: {passenger.employee_id}
                      </p>
                    </div>
                  )}
                  {passenger?.department && (
                    <p className="text-xs text-accent font-medium mt-0.5">
                      {passenger.department}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Info */}
          <Card className="bg-card border-border rounded-2xl">
            <CardHeader className="pb-2">
              <CardTitle className="text-base text-foreground">Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-secondary rounded-xl">
                <Mail className="h-4 w-4 text-accent" />
                <span className="text-sm text-foreground">{profile?.email || 'Not set'}</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-secondary rounded-xl">
                <Phone className="h-4 w-4 text-accent" />
                <span className="text-sm text-foreground">{profile?.phone || 'Not set'}</span>
              </div>
            </CardContent>
          </Card>

          {/* Addresses */}
          {passenger && (
            <Card className="bg-card border-border rounded-2xl">
              <CardHeader className="pb-2">
                <CardTitle className="text-base text-foreground">Addresses</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-3 p-3 bg-secondary rounded-xl">
                  <div className="w-8 h-8 rounded-full bg-success/20 flex items-center justify-center mt-0.5">
                    <MapPin className="h-4 w-4 text-success" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wide">Home</p>
                    <p className="text-sm text-foreground">{passenger.home_address || 'Not set'}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-secondary rounded-xl">
                  <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center mt-0.5">
                    <MapPin className="h-4 w-4 text-accent" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wide">Work</p>
                    <p className="text-sm text-foreground">{passenger.work_address || 'Not set'}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Emergency Contact */}
          {passenger?.emergency_contact_name && (
            <Card className="bg-card border-accent/30 border-2 rounded-2xl">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2 text-foreground">
                  <Shield className="h-4 w-4 text-accent" />
                  Emergency Contact
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-semibold text-foreground">{passenger.emergency_contact_name}</p>
                <p className="text-sm text-muted-foreground">{passenger.emergency_contact_phone}</p>
              </CardContent>
            </Card>
          )}

          {/* Sign Out */}
          <Button 
            variant="outline" 
            className="w-full h-12 rounded-xl border-border text-foreground hover:bg-secondary hover:text-foreground" 
            onClick={handleSignOut}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </div>
    </AppLayout>
  );
}