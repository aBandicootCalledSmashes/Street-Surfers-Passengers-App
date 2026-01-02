import { AppLayout } from '@/components/AppLayout';
import { useTrips } from '@/hooks/useTrips';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin } from 'lucide-react';

export default function LiveMap() {
  const { getUpcomingTrips } = useTrips();
  const activeTrip = getUpcomingTrips().find(t => 
    t.status === 'driver_assigned' || t.status === 'in_progress'
  );

  return (
    <AppLayout tripId={activeTrip?.id}>
      <div className="min-h-screen">
        <div className="bg-card border-b border-border px-4 py-6 safe-top">
          <h1 className="text-2xl font-display font-bold">Live Tracking</h1>
          <p className="text-muted-foreground text-sm mt-1">Track your shuttle in real-time</p>
        </div>

        <div className="p-4">
          {activeTrip ? (
            <Card>
              <CardContent className="p-6 text-center">
                <MapPin className="h-12 w-12 text-accent mx-auto mb-3" />
                <p className="text-foreground font-medium">Live tracking available</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Map integration with Leaflet will display driver location here
                </p>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-6 text-center">
                <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-foreground font-medium">No active trip</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Live tracking will be available when your driver starts the trip
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
