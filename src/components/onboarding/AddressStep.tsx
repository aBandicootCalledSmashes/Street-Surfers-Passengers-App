import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Home, Building2, Search, MapPin, Check, Loader2, ArrowRight, ArrowLeft } from 'lucide-react';
import logo from '@/assets/logo.webp';

interface PhotonResult {
  geometry: {
    coordinates: [number, number]; // [lon, lat]
  };
  properties: {
    osm_id: number;
    name?: string;
    street?: string;
    housenumber?: string;
    postcode?: string;
    city?: string;
    state?: string;
    country?: string;
    locality?: string;
    district?: string;
  };
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

// Format Photon result into a readable address
function formatPhotonAddress(properties: PhotonResult['properties']): string {
  const parts: string[] = [];
  
  // Build address from available parts
  if (properties.housenumber && properties.street) {
    parts.push(`${properties.housenumber} ${properties.street}`);
  } else if (properties.street) {
    parts.push(properties.street);
  } else if (properties.name) {
    parts.push(properties.name);
  }
  
  if (properties.locality) {
    parts.push(properties.locality);
  } else if (properties.district) {
    parts.push(properties.district);
  }
  
  if (properties.city) {
    parts.push(properties.city);
  }
  
  if (properties.state) {
    parts.push(properties.state);
  }
  
  if (properties.postcode) {
    parts.push(properties.postcode);
  }
  
  if (properties.country) {
    parts.push(properties.country);
  }
  
  return parts.filter(Boolean).join(', ') || 'Unknown Address';
}

export function AddressStep({ addressType, initialAddress, onSubmit, onBack }: AddressStepProps) {
  const [searchQuery, setSearchQuery] = useState(initialAddress || '');
  const [results, setResults] = useState<PhotonResult[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<AddressData | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  const searchAddresses = useCallback(async (query: string) => {
    if (query.length < 3) {
      setResults([]);
      setSearchError(null);
      return;
    }

    setIsSearching(true);
    setHasSearched(true);
    setSearchError(null);
    
    try {
      // Using Photon API with South Africa bounding box
      // South Africa bbox: lon_min=16.3, lat_min=-35.0, lon_max=33.0, lat_max=-22.0
      const response = await fetch(
        `https://photon.komoot.io/api/?q=${encodeURIComponent(query)}&limit=5&bbox=16.3,-35.0,33.0,-22.0&lang=en`
      );
      
      if (response.ok) {
        const data = await response.json();
        
        // Filter to only South African results
        const saResults = (data.features || []).filter(
          (feature: PhotonResult) => 
            feature.properties.country === 'South Africa' || 
            feature.properties.country === 'ZA'
        );
        
        if (saResults.length === 0 && data.features?.length > 0) {
          // If bbox returned results but none in SA, show message
          setResults([]);
          setSearchError('No matching address found in South Africa. Try refining your search.');
        } else if (saResults.length === 0) {
          setResults([]);
          setSearchError('No matching address found. Try refining your search.');
        } else {
          setResults(saResults);
        }
      } else {
        setSearchError('Address search failed. Please try again.');
      }
    } catch (error) {
      console.error('Address search failed:', error);
      setSearchError('Address search failed. Please check your connection and try again.');
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
    }, 400);

    return () => clearTimeout(timer);
  }, [searchQuery, searchAddresses]);

  const handleSelect = (result: PhotonResult) => {
    const formattedAddress = formatPhotonAddress(result.properties);
    const [lon, lat] = result.geometry.coordinates;
    
    setSelectedAddress({
      address: formattedAddress,
      lat: lat,
      lng: lon,
    });
    setSearchQuery(formattedAddress);
    setResults([]);
    setSearchError(null);
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
                  setSearchError(null);
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
                {results.map((result, index) => (
                  <button
                    key={`${result.properties.osm_id}-${index}`}
                    onClick={() => handleSelect(result)}
                    className="w-full p-4 text-left hover:bg-muted transition-colors flex items-start gap-3"
                  >
                    <MapPin className="w-5 h-5 text-accent mt-0.5 shrink-0" />
                    <span className="text-sm text-foreground line-clamp-2">
                      {formatPhotonAddress(result.properties)}
                    </span>
                  </button>
                ))}
              </div>
            )}

            {/* Error/No results message */}
            {hasSearched && !isSearching && results.length === 0 && searchQuery.length >= 3 && !selectedAddress && (
              <div className="text-center py-6 text-muted-foreground">
                <MapPin className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">
                  {searchError || 'No matching address found. Try refining your search.'}
                </p>
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
                    <p className="text-xs text-muted-foreground/70 mt-1">
                      Coordinates: {selectedAddress.lat.toFixed(6)}, {selectedAddress.lng.toFixed(6)}
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
