'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import dynamic from 'next/dynamic';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import { CaseStudySelector } from '@/components/map/CaseStudySelector';
import { sampleMines, SampleMine } from '@/lib/dummy-data';
import { MiningProject } from '@/types';
import { MapPin, Loader2, ArrowLeft, ArrowRight, Search } from 'lucide-react';
import { useTranslation } from '@/lib/i18n';

// ── Nominatim types ──
interface NominatimResult {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
  address: {
    city?: string;
    town?: string;
    village?: string;
    county?: string;
    state?: string;
    country?: string;
    country_code?: string;
  };
}

// ── Location Search Component ──
function LocationSearch({ onSelect }: { onSelect: (result: NominatimResult) => void }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<NominatimResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation();

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const searchNominatim = useCallback(async (q: string) => {
    if (q.length < 2) {
      setResults([]);
      return;
    }
    setIsSearching(true);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&limit=5&featuretype=settlement&q=${encodeURIComponent(q)}`,
        { headers: { 'Accept-Language': 'en' } }
      );
      const data: NominatimResult[] = await res.json();
      setResults(data);
      setShowDropdown(data.length > 0);
    } catch {
      setResults([]);
    } finally {
      setIsSearching(false);
    }
  }, []);

  const handleInputChange = (value: string) => {
    setQuery(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => searchNominatim(value), 300);
  };

  const handleSelect = (result: NominatimResult) => {
    setQuery(result.display_name);
    setShowDropdown(false);
    onSelect(result);
  };

  return (
    <div ref={wrapperRef} className="relative">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => handleInputChange(e.target.value)}
          onFocus={() => results.length > 0 && setShowDropdown(true)}
          placeholder={t('mapInput.searchPlaceholder')}
          className="pl-9 h-10"
        />
        {isSearching && (
          <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 animate-spin text-muted-foreground" />
        )}
      </div>
      {showDropdown && (
        <div className="absolute z-50 mt-1 w-full bg-white border rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {results.map((r) => (
            <button
              key={r.place_id}
              onClick={() => handleSelect(r)}
              className="w-full text-left px-3 py-2.5 hover:bg-gray-50 border-b last:border-b-0 transition-colors"
            >
              <p className="text-sm font-medium truncate">{r.display_name.split(',').slice(0, 3).join(',')}</p>
              <p className="text-xs text-muted-foreground truncate">{r.display_name}</p>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// Dynamically import map component to avoid SSR issues
const MapLocationPicker = dynamic(
  () => import('@/components/map/MapLocationPicker').then((mod) => mod.MapLocationPicker),
  { ssr: false, loading: () => <div className="flex items-center justify-center h-full bg-gray-100 rounded-lg"><Loader2 className="w-5 h-5 animate-spin mr-2 text-muted-foreground" /><span className="text-muted-foreground">Loading map...</span></div> }
);

const formSchema = z.object({
  mineralType: z.enum(['copper', 'nickel', 'lithium', 'cobalt']),
  stage: z.enum(['exploration', 'feasibility', 'environmental-assessment', 'permitting', 'construction']).optional(),
  country: z.string().optional(),
  region: z.string().optional(),
  nearestCity: z.string().optional(),
  size: z.enum(['small', 'medium', 'large']).optional(),
  waterSource: z.enum(['groundwater', 'surface', 'both', 'unknown']).optional(),
  communityDistance: z.enum(['near', 'medium', 'far']).optional(),
  hasProtectedAreas: z.enum(['yes', 'no', 'unknown']).optional(),
  projectName: z.string().optional(),
  companyName: z.string().optional(),
  coordinates: z.object({
    lat: z.number(),
    lng: z.number(),
  }),
});

interface ProjectMapInputProps {
  onStepChange?: (step: number) => void;
}

export function ProjectMapInput({ onStepChange }: ProjectMapInputProps) {
  const router = useRouter();
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedSampleId, setSelectedSampleId] = useState<string | undefined>();
  const [locationSelected, setLocationSelected] = useState(false);
  const [selectedLocationName, setSelectedLocationName] = useState<string>('');
  const [internalStep, setInternalStep] = useState(0); // 0 = pick location, 1 = add details
  const [flyTo, setFlyTo] = useState<{ lat: number; lng: number; zoom?: number } | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      mineralType: undefined,
      stage: undefined,
      country: '',
      region: '',
      nearestCity: '',
      size: undefined,
      waterSource: undefined,
      communityDistance: undefined,
      hasProtectedAreas: undefined,
      projectName: '',
      companyName: '',
      coordinates: undefined,
    },
  });

  const goToStep = (step: number) => {
    setInternalStep(step);
    onStepChange?.(step);
  };

  const handleSampleSelect = (sample: SampleMine) => {
    setSelectedSampleId(sample.id);
    setLocationSelected(true);
    setSelectedLocationName(sample.location);

    form.setValue('mineralType', sample.mineralType);
    form.setValue('stage', sample.projectStage);
    form.setValue('country', sample.country);
    form.setValue('region', sample.region);
    form.setValue('nearestCity', sample.nearestCity);
    form.setValue('size', sample.size);
    form.setValue('waterSource', sample.waterSource);
    form.setValue('communityDistance', sample.communityDistance);
    form.setValue('hasProtectedAreas', sample.hasProtectedAreas ? 'yes' : 'no');
    form.setValue('companyName', sample.companyName || '');
    form.setValue('projectName', sample.name);
    form.setValue('coordinates', sample.coordinates);
  };

  const handleLocationSelect = (locationData: any) => {
    setLocationSelected(true);
    form.setValue('coordinates', locationData.coordinates);

    if (locationData.clickType === 'map' || locationData.clickType === 'manual') {
      setSelectedSampleId(undefined);
      const coords = locationData.coordinates;
      setSelectedLocationName(`${coords.lat.toFixed(4)}, ${coords.lng.toFixed(4)}`);
    }
  };

  const handleChangeLocation = () => {
    setLocationSelected(false);
    setSelectedSampleId(undefined);
    setSelectedLocationName('');
    form.reset();
    goToStep(0);
  };

  const handleNext = () => {
    goToStep(1);
  };

  const handleSearchSelect = (result: NominatimResult) => {
    const coords = { lat: parseFloat(result.lat), lng: parseFloat(result.lon) };
    // Place marker and fly to location
    setLocationSelected(true);
    setSelectedSampleId(undefined);
    form.setValue('coordinates', coords);

    // Build a readable name from address parts
    const addr = result.address;
    const city = addr.city || addr.town || addr.village || '';
    const state = addr.state || addr.county || '';
    const country = addr.country || '';
    const nameParts = [city, state, country].filter(Boolean);
    setSelectedLocationName(nameParts.join(', ') || result.display_name.split(',').slice(0, 2).join(','));

    // Auto-fill location fields for step 2
    form.setValue('country', country);
    form.setValue('region', state);
    form.setValue('nearestCity', city);

    // Fly the map to this location
    setFlyTo({ lat: coords.lat, lng: coords.lng, zoom: 10 });
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    goToStep(2);

    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Apply sensible defaults for optional fields
    const stage = values.stage ?? 'exploration';
    const size = values.size ?? 'medium';
    const waterSource = values.waterSource ?? 'unknown';
    const communityDistance = values.communityDistance ?? 'medium';
    const hasProtectedAreasRaw = values.hasProtectedAreas ?? 'unknown';

    const project: MiningProject = {
      id: Date.now().toString(),
      mineralType: values.mineralType,
      stage,
      location: {
        country: values.country || '',
        region: values.region || '',
        nearestCity: values.nearestCity || '',
        coordinates: values.coordinates,
      },
      size,
      waterSource,
      communityDistance,
      hasProtectedAreas:
        hasProtectedAreasRaw === 'yes'
          ? true
          : hasProtectedAreasRaw === 'no'
          ? false
          : null,
      projectName: values.projectName,
      companyName: values.companyName,
    };

    sessionStorage.setItem('currentProject', JSON.stringify(project));
    router.push(`/assessment/${project.id}`);
  };

  // ── Step 1: Pick Location ──
  if (internalStep === 0) {
    return (
      <div className="space-y-4">
        {/* Search bar */}
        <LocationSearch onSelect={handleSearchSelect} />

        {/* Case Studies + Map side by side */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1 lg:max-h-[50vh] lg:overflow-y-auto">
            <CaseStudySelector
              samples={sampleMines}
              onSelect={handleSampleSelect}
              selectedId={selectedSampleId}
            />
          </div>

          <div className="lg:col-span-3 h-[50vh] rounded-lg overflow-hidden border">
            <MapLocationPicker
              sampleLocations={sampleMines}
              onLocationSelect={handleLocationSelect}
              initialCoordinates={form.watch('coordinates')}
              showSampleMarkers={true}
              flyTo={flyTo}
            />
          </div>
        </div>

        {/* Location confirmation + Next */}
        {locationSelected && (
          <div className="flex items-center justify-between bg-white border rounded-lg px-5 py-4">
            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-primary" />
              <div>
                <p className="font-medium">{selectedLocationName}</p>
                <button
                  onClick={handleChangeLocation}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {t('mapInput.changeLocation')}
                </button>
              </div>
            </div>
            <Button onClick={handleNext} size="lg">
              {t('mapInput.nextAddDetails')}
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </div>
        )}
      </div>
    );
  }

  // ── Step 2: Add Details ──
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">{t('mapInput.projectDetails')}</CardTitle>
            <CardDescription className="flex items-center gap-2 mt-1">
              <MapPin className="w-4 h-4 text-primary" />
              <span className="font-medium text-foreground">{selectedLocationName}</span>
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Required: Mineral type */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="mineralType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm">{t('mapInput.mineralType')}</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="h-9">
                          <SelectValue placeholder={t('mapInput.selectMineral')} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="copper">{t('mapInput.copper')}</SelectItem>
                        <SelectItem value="nickel">{t('mapInput.nickel')}</SelectItem>
                        <SelectItem value="lithium">{t('mapInput.lithium')}</SelectItem>
                        <SelectItem value="cobalt">{t('mapInput.cobalt')}</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Optional details */}
            <Accordion type="single" collapsible>
              <AccordionItem value="optional-details" className="border rounded-lg">
                <AccordionTrigger className="px-4 text-sm font-medium text-muted-foreground hover:text-foreground hover:no-underline">
                  {t('mapInput.additionalDetails')}
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4">
                  <p className="text-xs text-muted-foreground mb-4">
                    {t('mapInput.additionalDetailsDescription')}
                  </p>
                  <div className="space-y-4">
                    {/* Row: Project context */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      <FormField
                        control={form.control}
                        name="stage"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm">{t('mapInput.projectStage')}</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger className="h-9">
                                  <SelectValue placeholder={t('mapInput.selectStage')} />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="exploration">{t('mapInput.exploration')}</SelectItem>
                                <SelectItem value="feasibility">{t('mapInput.feasibilityStudy')}</SelectItem>
                                <SelectItem value="environmental-assessment">{t('mapInput.environmentalAssessment')}</SelectItem>
                                <SelectItem value="permitting">{t('mapInput.permitting')}</SelectItem>
                                <SelectItem value="construction">{t('mapInput.construction')}</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="size"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm">{t('mapInput.projectSize')}</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger className="h-9">
                                  <SelectValue placeholder={t('mapInput.selectSize')} />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="small">{t('mapInput.small')}</SelectItem>
                                <SelectItem value="medium">{t('mapInput.medium')}</SelectItem>
                                <SelectItem value="large">{t('mapInput.large')}</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="waterSource"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm">{t('mapInput.waterSource')}</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger className="h-9">
                                  <SelectValue placeholder={t('mapInput.selectSource')} />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="groundwater">{t('mapInput.groundwater')}</SelectItem>
                                <SelectItem value="surface">{t('mapInput.surfaceWater')}</SelectItem>
                                <SelectItem value="both">{t('mapInput.both')}</SelectItem>
                                <SelectItem value="unknown">{t('common.unknown')}</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Row: Environmental context */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      <FormField
                        control={form.control}
                        name="communityDistance"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm">{t('mapInput.communityDistance')}</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger className="h-9">
                                  <SelectValue placeholder={t('mapInput.selectDistance')} />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="near">{t('mapInput.near')}</SelectItem>
                                <SelectItem value="medium">{t('mapInput.mediumDist')}</SelectItem>
                                <SelectItem value="far">{t('mapInput.far')}</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="hasProtectedAreas"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm">{t('mapInput.protectedAreas')}</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger className="h-9">
                                  <SelectValue placeholder={t('mapInput.selectOption')} />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="yes">{t('common.yes')}</SelectItem>
                                <SelectItem value="no">{t('common.no')}</SelectItem>
                                <SelectItem value="unknown">{t('common.unknown')}</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Row: Location details */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      <FormField
                        control={form.control}
                        name="country"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm">{t('mapInput.country')}</FormLabel>
                            <FormControl>
                              <Input className="h-9" placeholder={t('mapInput.countryPlaceholder')} {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="region"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm">{t('mapInput.regionProvince')}</FormLabel>
                            <FormControl>
                              <Input className="h-9" placeholder={t('mapInput.regionPlaceholder')} {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="nearestCity"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm">{t('mapInput.nearestCity')}</FormLabel>
                            <FormControl>
                              <Input className="h-9" placeholder={t('mapInput.cityPlaceholder')} {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Row: Project & company names */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="projectName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm">{t('mapInput.projectNameOptional')}</FormLabel>
                            <FormControl>
                              <Input className="h-9" placeholder={t('mapInput.ifKnown')} {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="companyName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm">{t('mapInput.companyNameOptional')}</FormLabel>
                            <FormControl>
                              <Input className="h-9" placeholder={t('mapInput.ifKnown')} {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            <div className="flex items-center gap-3">
              <Button type="button" variant="outline" size="lg" onClick={() => goToStep(0)} disabled={isLoading}>
                <ArrowLeft className="mr-2 w-4 h-4" />
                {t('common.back')}
              </Button>
              <Button type="submit" size="lg" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t('mapInput.analyzing')}
                  </>
                ) : (
                  t('mapInput.getAssessment')
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
