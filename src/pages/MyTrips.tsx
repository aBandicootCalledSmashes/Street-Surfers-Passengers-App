import { useTrips } from '@/hooks/useTrips';
import { AppLayout } from '@/components/AppLayout';
import { TripCard } from '@/components/TripCard';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Clock } from 'lucide-react';

export default function MyTrips() {
  const { loading, getUpcomingTrips, getPastTrips } = useTrips();

  const upcomingTrips = getUpcomingTrips();
  const pastTrips = getPastTrips();

  return (
    <AppLayout>
      <div className="min-h-screen">
        <div className="bg-card border-b border-border px-4 py-6 safe-top">
          <h1 className="text-2xl font-display font-bold">My Trips</h1>
          <p className="text-muted-foreground text-sm mt-1">View your scheduled and past trips</p>
        </div>

        <div className="p-4">
          <Tabs defaultValue="upcoming">
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="upcoming" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Upcoming
              </TabsTrigger>
              <TabsTrigger value="history" className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                History
              </TabsTrigger>
            </TabsList>

            <TabsContent value="upcoming" className="space-y-4">
              {loading ? (
                Array.from({ length: 2 }).map((_, i) => (
                  <Card key={i}>
                    <CardContent className="p-4 space-y-3">
                      <Skeleton className="h-6 w-32" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-3/4" />
                    </CardContent>
                  </Card>
                ))
              ) : upcomingTrips.length > 0 ? (
                upcomingTrips.map((trip) => (
                  <TripCard key={trip.id} trip={trip} />
                ))
              ) : (
                <Card>
                  <CardContent className="p-6 text-center">
                    <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                    <p className="text-foreground font-medium">No upcoming trips</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Check back later for new assignments
                    </p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="history" className="space-y-4">
              {loading ? (
                <Skeleton className="h-32 w-full" />
              ) : pastTrips.length > 0 ? (
                pastTrips.map((trip) => (
                  <TripCard key={trip.id} trip={trip} showActions={false} compact />
                ))
              ) : (
                <Card>
                  <CardContent className="p-6 text-center">
                    <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                    <p className="text-foreground font-medium">No trip history</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </AppLayout>
  );
}
