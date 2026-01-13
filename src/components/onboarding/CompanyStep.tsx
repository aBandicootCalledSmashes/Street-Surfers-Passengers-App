import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Building2, MapPin, ArrowRight, ArrowLeft, Loader2, Check } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import logo from '@/assets/logo.webp';

interface Company {
  id: string;
  company_name: string;
  site_name: string | null;
  street: string;
  building_note: string | null;
  suburb: string | null;
  city: string | null;
  province: string | null;
  latitude: number;
  longitude: number;
}

interface CompanyStepProps {
  initialCompanyId?: string | null;
  onSubmit: (company: Company) => Promise<void>;
  onBack?: () => void;
}

export function CompanyStep({ initialCompanyId, onSubmit, onBack }: CompanyStepProps) {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCompanies() {
      setIsLoading(true);
      setError(null);
      
      try {
        const { data, error: fetchError } = await supabase
          .from('companies')
          .select('*')
          .eq('is_active', true)
          .order('company_name', { ascending: true });

        if (fetchError) throw fetchError;

        setCompanies(data || []);
        
        // Pre-select if initial company provided
        if (initialCompanyId && data) {
          const initial = data.find(c => c.id === initialCompanyId);
          if (initial) setSelectedCompany(initial);
        }
      } catch (err) {
        console.error('Failed to fetch companies:', err);
        setError('Failed to load companies. Please try again.');
      } finally {
        setIsLoading(false);
      }
    }

    fetchCompanies();
  }, [initialCompanyId]);

  const handleConfirm = async () => {
    if (!selectedCompany) return;
    
    setIsSubmitting(true);
    try {
      await onSubmit(selectedCompany);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatCompanyAddress = (company: Company) => {
    const parts = [company.street];
    if (company.building_note) parts.push(`(${company.building_note})`);
    if (company.suburb) parts.push(company.suburb);
    if (company.city) parts.push(company.city);
    return parts.join(', ');
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="safe-top px-6 pt-8 pb-4 text-center">
        <img src={logo} alt="Street Surfers" className="h-12 w-auto mx-auto mb-6" />
        <h1 className="text-2xl font-display font-bold text-foreground mb-2">
          Select Your Workplace
        </h1>
        <p className="text-muted-foreground">
          Choose your company and work location
        </p>
      </div>

      <div className="flex-1 px-5 pb-8">
        <Card className="bg-card border-border rounded-2xl">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full gradient-accent flex items-center justify-center">
                <Building2 className="w-6 h-6 text-accent-foreground" />
              </div>
              <div>
                <CardTitle className="text-lg font-display">Company / Worksite</CardTitle>
                <CardDescription>Your destination for work trips</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 text-accent animate-spin" />
              </div>
            ) : error ? (
              <div className="text-center py-8">
                <p className="text-destructive mb-4">{error}</p>
                <Button variant="outline" onClick={() => window.location.reload()}>
                  Try Again
                </Button>
              </div>
            ) : companies.length === 0 ? (
              <div className="text-center py-8">
                <Building2 className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                <p className="text-muted-foreground">
                  No companies available. Please contact your administrator.
                </p>
              </div>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {companies.map((company) => (
                  <button
                    key={company.id}
                    onClick={() => setSelectedCompany(company)}
                    className={`w-full p-4 rounded-xl text-left transition-all ${
                      selectedCompany?.id === company.id
                        ? 'bg-accent/20 border-2 border-accent'
                        : 'bg-secondary border-2 border-transparent hover:bg-muted'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                        selectedCompany?.id === company.id 
                          ? 'gradient-accent' 
                          : 'bg-muted'
                      }`}>
                        {selectedCompany?.id === company.id ? (
                          <Check className="w-5 h-5 text-accent-foreground" />
                        ) : (
                          <Building2 className="w-5 h-5 text-muted-foreground" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-foreground">
                          {company.company_name}
                          {company.site_name && (
                            <span className="text-muted-foreground"> – {company.site_name}</span>
                          )}
                        </p>
                        <div className="flex items-start gap-1 mt-1">
                          <MapPin className="w-3 h-3 text-muted-foreground mt-0.5 shrink-0" />
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {formatCompanyAddress(company)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* Selected Company Confirmation */}
            {selectedCompany && (
              <div className="bg-secondary/50 border border-accent/30 rounded-xl p-4 mt-4">
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-accent mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-foreground mb-1">
                      Selected: {selectedCompany.company_name}
                      {selectedCompany.site_name && ` – ${selectedCompany.site_name}`}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      This will be your drop-off location for work trips
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
                disabled={!selectedCompany || isSubmitting}
                className="flex-1 h-14 gradient-accent text-accent-foreground font-display font-semibold rounded-xl glow-accent disabled:opacity-50"
              >
                {isSubmitting ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    Continue
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