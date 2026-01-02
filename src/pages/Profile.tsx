import { useAuth } from '@/hooks/useAuth';
import { AppLayout } from '@/components/AppLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User, Mail, Phone, MapPin, LogOut, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Profile() {
  const { profile, passenger, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  return (
    <AppLayout showSOS={false}>
      <div className="min-h-screen">
        <div className="bg-card border-b border-border px-4 py-6 safe-top">
          <h1 className="text-2xl font-display font-bold">Profile</h1>
        </div>

        <div className="p-4 space-y-4">
          {/* Profile Card */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={profile?.avatar_url || undefined} />
                  <AvatarFallback className="bg-accent text-accent-foreground text-xl">
                    {profile?.full_name?.charAt(0) || <User />}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-xl font-display font-semibold">
                    {profile?.full_name || 'Passenger'}
                  </h2>
                  {passenger?.employee_id && (
                    <p className="text-sm text-muted-foreground">
                      ID: {passenger.employee_id}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{profile?.email || 'Not set'}</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{profile?.phone || 'Not set'}</span>
              </div>
            </CardContent>
          </Card>

          {/* Addresses */}
          {passenger && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Addresses</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-3">
                  <MapPin className="h-4 w-4 text-success mt-0.5" />
                  <div>
                    <p className="text-xs text-muted-foreground">Home</p>
                    <p className="text-sm">{passenger.home_address || 'Not set'}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="h-4 w-4 text-accent mt-0.5" />
                  <div>
                    <p className="text-xs text-muted-foreground">Work</p>
                    <p className="text-sm">{passenger.work_address || 'Not set'}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Emergency Contact */}
          {passenger?.emergency_contact_name && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Shield className="h-4 w-4 text-destructive" />
                  Emergency Contact
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-medium">{passenger.emergency_contact_name}</p>
                <p className="text-sm text-muted-foreground">{passenger.emergency_contact_phone}</p>
              </CardContent>
            </Card>
          )}

          {/* Sign Out */}
          <Button 
            variant="outline" 
            className="w-full" 
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
