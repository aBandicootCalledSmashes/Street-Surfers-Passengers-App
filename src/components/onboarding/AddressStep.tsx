import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Home, Building2, Search, MapPin, Check, Loader2, ArrowRight, ArrowLeft } from 'lucide-react';
import logo from '@/assets/logo.webp';

interface AddressResult {
  display_name: string;
  lat: string;
  lon: string;
  place_id: number;
}

interface AddressData {
  address: string;
  lat: number;
  lng: number;
}

interface AddressStepProps {
  addressType: 'home' | 'work';
  initialAddress?: string | null;
  onSubmit: (data: AddressData) => Promise<void>;
  onBack?: () => void;
}

export function AddressStep({ addressType, initialAddress, onSubmit, onBack }: AddressStepProps) {
  const [searchQuery, setSearchQuery] = useState(initialAddress || '');
  const [results, setResults] = useState<AddressResult[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<AddressData | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const searchAddresses = useCallback(async (query: string) => {
    if (query.length < 3) {
      setResults([]);
      return;
    }

    setIsSearching(true);
    setHasSearched(true);
    
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5&addressdetails=1&countrycodes=za`,
        {
          headers: {
            'User-Agent': 'StreetSurfersPassengerApp/1.0',
          },
        }
      );
      
      if (response.ok) {
        const data = await response.json();
        setResults(data);
      }
    } catch (error) {
      console.error('Address search failed:', error);
    } finally {
      setIsSearching(false);
    }
  }, []);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery.length >= 3) {
        searchAddresses(searchQuery);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery, searchAddresses]);

  const handleSelect = (result: AddressResult) => {
    setSelectedAddress({
      address: result.display_name,
      lat: parseFloat(result.lat),
      lng: parseFloat(result.lon),
    });
    setSearchQuery(result.display_name);
    setResults([]);
  };

  const handleConfirm = async () => {
    if (!selectedAddress) return;
    
    setIsSubmitting(true);
    try {
      await onSubmit(selectedAddress);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isHome = addressType === 'home';
  const Icon = isHome ? Home : Building2;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="safe-top px-6 pt-8 pb-4 text-center">
        <img src={logo} alt="Street Surfers" className="h-12 w-auto mx-auto mb-6" />
        <h1 className="text-2xl font-display font-bold text-foreground mb-2">
          {isHome ? 'Set Your Pickup Address' : 'Set Your Destination'}
        </h1>
        <p className="text-muted-foreground">
          {isHome 
            ? 'Where should we pick you up each morning?' 
            : 'Where do you need to be dropped off? (e.g. your workplace)'
          }
        </p>
      </div>

      <div className="flex-1 px-5 pb-8">
        <Card className="bg-card border-border rounded-2xl">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full gradient-accent flex items-center justify-center">
                <Icon className="w-6 h-6 text-accent-foreground" />
              </div>
              <div>
                <CardTitle className="text-lg font-display">
                  {isHome ? 'Pickup Address' : 'Destination Address'}
                </CardTitle>
                <CardDescription>
                  {isHome 
                    ? 'Search for your home or pickup location' 
                    : 'Search for your work or drop-off location'
                  }
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setSelectedAddress(null);
                }}
                placeholder="Search for your address..."
                className="h-14 pl-12 bg-input border-border rounded-xl text-foreground placeholder:text-muted-foreground"
              />
              {isSearching && (
                <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground animate-spin" />
              )}
            </div>

            {/* Search Results */}
            {results.length > 0 && (
              <div className="bg-secondary rounded-xl overflow-hidden divide-y divide-border max-h-64 overflow-y-auto">
                {results.map((result) => (
                  <button
                    key={result.place_id}
                    onClick={() => handleSelect(result)}
                    className="w-full p-4 text-left hover:bg-muted transition-colors flex items-start gap-3"
                  >
                    <MapPin className="w-5 h-5 text-accent mt-0.5 shrink-0" />
                    <span className="text-sm text-foreground line-clamp-2">
                      {result.display_name}
                    </span>
                  </button>
                ))}
              </div>
            )}

            {/* No results message */}
            {hasSearched && !isSearching && results.length === 0 && searchQuery.length >= 3 && !selectedAddress && (
              <div className="text-center py-6 text-muted-foreground">
                <MapPin className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No addresses found. Try a different search.</p>
              </div>
            )}

            {/* Selected Address Confirmation */}
            {selectedAddress && (
              <div className="bg-secondary/50 border border-accent/30 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-accent mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-foreground mb-1">Selected Address</p>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {selectedAddress.address}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="flex gap-3 pt-4">
              {onBack && (
                <Button
                  variant="outline"
                  onClick={onBack}
                  className="flex-1 h-14 border-border text-foreground rounded-xl"
                >
                  <ArrowLeft className="w-5 h-5 mr-2" />
                  Back
                </Button>
              )}
              <Button
                onClick={handleConfirm}
                disabled={!selectedAddress || isSubmitting}
                className="flex-1 h-14 gradient-accent text-accent-foreground font-display font-semibold rounded-xl glow-accent disabled:opacity-50"
              >
                {isSubmitting ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    Confirm Address
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
