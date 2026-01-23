import { useState, useEffect, useCallback } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MapPin, Loader2, X, Check } from 'lucide-react';

interface PhotonResult {
  properties: {
    name?: string;
    street?: string;
    housenumber?: string;
    city?: string;
    state?: string;
    country?: string;
    postcode?: string;
    suburb?: string;
    locality?: string;
    district?: string;
  };
  geometry: {
    coordinates: [number, number]; // [lng, lat]
  };
}

export interface AddressSelection {
  formatted_address: string;
  latitude: number;
  longitude: number;
  street?: string;
  suburb?: string;
  city?: string;
  province?: string;
}

type AddressContext = 'home' | 'company' | 'school';

interface AddressAutocompleteProps {
  address_context: AddressContext;
  value?: string;
  onSelect: (selection: AddressSelection) => void;
  onClear?: () => void;
  placeholder?: string;
  label?: string;
  required?: boolean;
  error?: string;
  disabled?: boolean;
}

const contextLabels: Record<AddressContext, string> = {
  home: 'Home Address',
  company: 'Company Address',
  school: 'School Address',
};

const contextPlaceholders: Record<AddressContext, string> = {
  home: 'Search for your home address...',
  company: 'Search for company address...',
  school: 'Search for school address...',
};

function formatPhotonAddress(properties: PhotonResult['properties']): string {
  const parts: string[] = [];
  
  if (properties.housenumber && properties.street) {
    parts.push(`${properties.housenumber} ${properties.street}`);
  } else if (properties.street) {
    parts.push(properties.street);
  } else if (properties.name) {
    parts.push(properties.name);
  }
  
  if (properties.suburb) {
    parts.push(properties.suburb);
  } else if (properties.locality) {
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
  
  if (properties.country) {
    parts.push(properties.country);
  }
  
  return parts.filter(Boolean).join(', ') || 'Unknown Address';
}

export function AddressAutocomplete({
  address_context,
  value = '',
  onSelect,
  onClear,
  placeholder,
  label,
  required = false,
  error,
  disabled = false,
}: AddressAutocompleteProps) {
  // Guard: Do not render if address_context is missing
  if (!address_context) {
    return null;
  }

  const [searchQuery, setSearchQuery] = useState(value);
  const [results, setResults] = useState<PhotonResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<AddressSelection | null>(null);
  const [showResults, setShowResults] = useState(false);

  // Update search query when value prop changes
  useEffect(() => {
    if (value && value !== searchQuery) {
      setSearchQuery(value);
    }
  }, [value]);

  const searchAddresses = useCallback(async (query: string) => {
    if (query.length < 3) {
      setResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const response = await fetch(
        `https://photon.komoot.io/api/?q=${encodeURIComponent(query)}&limit=8&bbox=16.3,-35.0,33.0,-22.0&lang=en`
      );
      
      if (response.ok) {
        const data = await response.json();
        // Filter to South Africa only
        const zaResults = (data.features || []).filter(
          (feature: PhotonResult) => 
            feature.properties.country === 'South Africa' || 
            feature.properties.country === 'ZA'
        );
        setResults(zaResults);
        setShowResults(true);
      }
    } catch (err) {
      console.error('Address search failed:', err);
      setResults([]);
    } finally {
      setIsSearching(false);
    }
  }, []);

  useEffect(() => {
    if (selectedAddress) return; // Don't search if already selected
    
    if (searchQuery.length < 3) {
      setResults([]);
      setShowResults(false);
      return;
    }
    
    const timer = setTimeout(() => {
      searchAddresses(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, searchAddresses, selectedAddress]);

  const handleSelect = (result: PhotonResult) => {
    const [lng, lat] = result.geometry.coordinates;
    const props = result.properties;
    const formattedAddress = formatPhotonAddress(props);
    
    const selection: AddressSelection = {
      formatted_address: formattedAddress,
      latitude: lat,
      longitude: lng,
      street: props.street || props.name,
      suburb: props.suburb || props.locality || props.district,
      city: props.city,
      province: props.state,
    };
    
    setSelectedAddress(selection);
    setSearchQuery(formattedAddress);
    setResults([]);
    setShowResults(false);
    onSelect(selection);
  };

  const handleClear = () => {
    setSearchQuery('');
    setSelectedAddress(null);
    setResults([]);
    setShowResults(false);
    onClear?.();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setSearchQuery(newValue);
    // Clear selection when user starts typing again
    if (selectedAddress) {
      setSelectedAddress(null);
      onClear?.();
    }
  };

  const displayLabel = label || contextLabels[address_context];
  const displayPlaceholder = placeholder || contextPlaceholders[address_context];

  return (
    <div className="space-y-2">
      {displayLabel && (
        <Label className="text-foreground font-medium">
          {displayLabel} {required && <span className="text-accent">*</span>}
        </Label>
      )}
      
      <div className="relative">
        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <Input
          placeholder={displayPlaceholder}
          value={searchQuery}
          onChange={handleInputChange}
          onFocus={() => {
            if (results.length > 0 && !selectedAddress) {
              setShowResults(true);
            }
          }}
          disabled={disabled}
          className={`pl-10 pr-10 h-12 bg-secondary border-border rounded-xl text-foreground ${
            error ? 'border-destructive' : selectedAddress ? 'border-accent' : ''
          }`}
        />
        
        {isSearching && (
          <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 animate-spin text-muted-foreground" />
        )}
        
        {!isSearching && searchQuery && !selectedAddress && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="w-4 h-4" />
          </button>
        )}
        
        {selectedAddress && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-accent hover:text-foreground"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Results Dropdown */}
      {showResults && results.length > 0 && !selectedAddress && (
        <div className="bg-card border border-border rounded-xl overflow-hidden shadow-lg z-50 relative">
          <div className="max-h-48 overflow-y-auto">
            {results.map((result, index) => (
              <button
                key={index}
                type="button"
                onClick={() => handleSelect(result)}
                className="w-full p-3 text-left hover:bg-muted transition-colors border-b border-border last:border-b-0 flex items-start gap-3"
              >
                <MapPin className="w-4 h-4 text-accent mt-0.5 shrink-0" />
                <p className="text-sm text-foreground">{formatPhotonAddress(result.properties)}</p>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* No results message */}
      {searchQuery.length >= 3 && !isSearching && results.length === 0 && !selectedAddress && showResults && (
        <p className="text-sm text-muted-foreground px-1">
          No addresses found in South Africa. Try a different search term.
        </p>
      )}

      {/* Selected Address Confirmation */}
      {selectedAddress && (
        <div className="bg-accent/10 border border-accent/30 rounded-xl p-3">
          <div className="flex items-start gap-2">
            <Check className="w-4 h-4 text-accent mt-0.5 shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground">
                {selectedAddress.formatted_address}
              </p>
              <p className="text-xs text-muted-foreground">
                GPS: {selectedAddress.latitude.toFixed(6)}, {selectedAddress.longitude.toFixed(6)}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <p className="text-sm text-destructive px-1">{error}</p>
      )}
    </div>
  );
}
