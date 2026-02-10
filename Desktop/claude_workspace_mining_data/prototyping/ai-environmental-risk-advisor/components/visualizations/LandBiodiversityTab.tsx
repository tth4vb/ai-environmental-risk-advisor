'use client';

import dynamic from 'next/dynamic';
import { useState, useMemo } from 'react';
import { MiningProject } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { MapPin, Layers, Info, AlertTriangle, Shield, Trees, Users, Mountain } from 'lucide-react';
import { DEFAULT_COORDS } from '@/lib/constants';
import { useTranslation } from '@/lib/i18n';

const BaseMap = dynamic(() => import('./BaseMap').then(mod => mod.BaseMap), {
  ssr: false,
  loading: () => <div className="h-96 bg-gray-100 animate-pulse rounded-lg" />
});
const MineMarker = dynamic(() => import('./BaseMap').then(mod => mod.MineMarker), { ssr: false });
const BiodiversityLayer = dynamic(() => import('./BiodiversityLayer').then(mod => mod.BiodiversityLayer), { ssr: false });
const IndigenousLandsLayer = dynamic(() => import('./IndigenousLandsLayer').then(mod => mod.IndigenousLandsLayer), { ssr: false });
const GeologicalDepositsLayer = dynamic(() => import('./GeologicalDepositsLayer').then(mod => mod.GeologicalDepositsLayer), { ssr: false });

interface LandBiodiversityTabProps {
  project: MiningProject;
}

export function LandBiodiversityTab({ project }: LandBiodiversityTabProps) {
  const { t } = useTranslation();
  const [showBiodiversity, setShowBiodiversity] = useState(true);
  const [showIndigenousLands, setShowIndigenousLands] = useState(true);
  const [bioOpacity, setBioOpacity] = useState(0.5);
  const [landsOpacity, setLandsOpacity] = useState(0.5);
  const [showDeposits, setShowDeposits] = useState(false);
  const [depositsOpacity, setDepositsOpacity] = useState(0.7);

  const coordinates = useMemo((): [number, number] => {
    if (project.location.coordinates) {
      return [project.location.coordinates.lat, project.location.coordinates.lng];
    }
    return DEFAULT_COORDS[project.location.country] || [-20, 20];
  }, [project]);

  // Mock overlap stats derived from project properties
  const overlapStats = useMemo(() => {
    const hasProtected = project.hasProtectedAreas;
    return {
      kbaOverlapPct: hasProtected ? 34 : 12,
      protectedAreaOverlapPct: hasProtected ? 18 : 5,
      totalBioKm2: 587,
      indigenousOverlapPct: 67,
      communitiesAffected: 3,
      totalIndigenousKm2: 275,
      fpicStatus: 'Not initiated' as const,
      depositCount: 7,
      nearestDepositKm: 4.2,
      primaryCommodities: 'Copper, Nickel, Lithium',
    };
  }, [project]);

  return (
    <div className="space-y-4">
      {/* Location Info */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <MapPin className="w-4 h-4" />
        <span>
          {project.location.nearestCity}, {project.location.region}, {project.location.country}
        </span>
      </div>

      {/* Layer Controls */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <h4 className="text-sm font-medium flex items-center gap-2">
              <Layers className="w-4 h-4" />
              {t('landBio.layersTitle')}
            </h4>

            <div className="grid gap-4 sm:grid-cols-3">
              {/* Biodiversity toggle */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={showBiodiversity}
                    onChange={(e) => setShowBiodiversity(e.target.checked)}
                    className="rounded"
                  />
                  <label className="text-sm font-medium flex items-center gap-1">
                    <Trees className="w-4 h-4 text-emerald-600" />
                    {t('landBio.biodiversityProtected')}
                  </label>
                </div>
                {showBiodiversity && (
                  <div className="flex items-center gap-2 ml-6">
                    <label className="text-xs text-muted-foreground">{t('common.opacity')}</label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={bioOpacity * 100}
                      onChange={(e) => setBioOpacity(Number(e.target.value) / 100)}
                      className="flex-1"
                    />
                    <span className="text-xs w-8">{Math.round(bioOpacity * 100)}%</span>
                  </div>
                )}
              </div>

              {/* Indigenous Lands toggle */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={showIndigenousLands}
                    onChange={(e) => setShowIndigenousLands(e.target.checked)}
                    className="rounded"
                  />
                  <label className="text-sm font-medium flex items-center gap-1">
                    <Users className="w-4 h-4 text-amber-600" />
                    {t('landBio.indigenousCommunity')}
                  </label>
                </div>
                {showIndigenousLands && (
                  <div className="flex items-center gap-2 ml-6">
                    <label className="text-xs text-muted-foreground">{t('common.opacity')}</label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={landsOpacity * 100}
                      onChange={(e) => setLandsOpacity(Number(e.target.value) / 100)}
                      className="flex-1"
                    />
                    <span className="text-xs w-8">{Math.round(landsOpacity * 100)}%</span>
                  </div>
                )}
              </div>

              {/* Geological Deposits toggle */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={showDeposits}
                    onChange={(e) => setShowDeposits(e.target.checked)}
                    className="rounded"
                  />
                  <label className="text-sm font-medium flex items-center gap-1">
                    <Mountain className="w-4 h-4 text-stone-600" />
                    {t('landBio.geologicalDeposits')}
                  </label>
                </div>
                {showDeposits && (
                  <div className="flex items-center gap-2 ml-6">
                    <label className="text-xs text-muted-foreground">{t('common.opacity')}</label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={depositsOpacity * 100}
                      onChange={(e) => setDepositsOpacity(Number(e.target.value) / 100)}
                      className="flex-1"
                    />
                    <span className="text-xs w-8">{Math.round(depositsOpacity * 100)}%</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Map */}
      <div className="relative">
        <Card className="border-2">
          <CardContent className="p-0">
            <BaseMap center={coordinates} zoom={9}>
              {showBiodiversity && (
                <BiodiversityLayer opacity={bioOpacity} center={coordinates} />
              )}
              {showIndigenousLands && (
                <IndigenousLandsLayer opacity={landsOpacity} center={coordinates} />
              )}
              {showDeposits && (
                <GeologicalDepositsLayer opacity={depositsOpacity} center={coordinates} />
              )}
              <MineMarker
                position={coordinates}
                label={project.projectName || `${project.mineralType} Mining Project`}
              />
            </BaseMap>

            {/* Overlap alert overlay */}
            {(showBiodiversity || showIndigenousLands) && (
              <div className="absolute top-4 left-4 bg-white/95 rounded-lg shadow-lg p-3 z-[1000] max-w-xs space-y-1">
                <div className="text-sm font-medium flex items-center gap-1">
                  <AlertTriangle className="w-4 h-4 text-amber-500" />
                  {t('landBio.overlapDetected')}
                </div>
                {showBiodiversity && (
                  <p className="text-xs text-muted-foreground">
                    {t('landBio.kbaOverlap', { kba: overlapStats.kbaOverlapPct, protected: overlapStats.protectedAreaOverlapPct })}
                  </p>
                )}
                {showIndigenousLands && (
                  <p className="text-xs text-muted-foreground">
                    {t('landBio.indigenousOverlap', { pct: overlapStats.indigenousOverlapPct })}
                  </p>
                )}
              </div>
            )}

            {/* Combined legend */}
            <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg p-3 z-[1000]">
              <h4 className="text-xs font-medium mb-2">{t('common.legend')}</h4>
              <div className="space-y-1">
                {showBiodiversity && (
                  <>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-emerald-500 rounded opacity-60" />
                      <span className="text-xs">{t('landBio.kba')}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-emerald-600 rounded opacity-60" />
                      <span className="text-xs">{t('landBio.protectedArea')}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded opacity-60 border border-dashed border-emerald-400" style={{ backgroundColor: '#6ee7b7' }} />
                      <span className="text-xs">{t('landBio.corridor')}</span>
                    </div>
                  </>
                )}
                {showIndigenousLands && (
                  <>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded opacity-60" style={{ backgroundColor: '#b45309' }} />
                      <span className="text-xs">{t('landBio.indigenousTerritory')}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded opacity-60" style={{ backgroundColor: '#d97706' }} />
                      <span className="text-xs">{t('landBio.communityLand')}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded opacity-60 border border-dashed border-amber-600" style={{ backgroundColor: '#f59e0b' }} />
                      <span className="text-xs">{t('landBio.customaryRights')}</span>
                    </div>
                  </>
                )}
                {showDeposits && (
                  <>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full opacity-70" style={{ backgroundColor: '#b87333' }} />
                      <span className="text-xs">{t('landBio.depositCopper')}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full opacity-70" style={{ backgroundColor: '#7cb342' }} />
                      <span className="text-xs">{t('landBio.depositNickel')}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full opacity-70" style={{ backgroundColor: '#9c27b0' }} />
                      <span className="text-xs">{t('landBio.depositLithium')}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full opacity-70" style={{ backgroundColor: '#1565c0' }} />
                      <span className="text-xs">{t('landBio.depositCobalt')}</span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        {/* Protected Areas card */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-3">
              <Trees className="w-5 h-5 text-emerald-600" />
              <h4 className="font-medium">{t('landBio.protectedAreasTitle')}</h4>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t('landBio.kbaOverlapLabel')}</span>
                <Badge variant={overlapStats.kbaOverlapPct > 20 ? 'destructive' : 'secondary'}>
                  {overlapStats.kbaOverlapPct}%
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t('landBio.protectedAreaOverlap')}</span>
                <Badge variant={overlapStats.protectedAreaOverlapPct > 10 ? 'destructive' : 'secondary'}>
                  {overlapStats.protectedAreaOverlapPct}%
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t('landBio.totalArea')}</span>
                <span className="font-medium">{overlapStats.totalBioKm2} km²</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Indigenous Lands card */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-3">
              <Users className="w-5 h-5 text-amber-600" />
              <h4 className="font-medium">{t('landBio.indigenousLandsTitle')}</h4>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t('landBio.territoryOverlap')}</span>
                <Badge variant="destructive">{overlapStats.indigenousOverlapPct}%</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t('landBio.communitiesAffected')}</span>
                <span className="font-medium">{overlapStats.communitiesAffected}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t('landBio.totalArea')}</span>
                <span className="font-medium">{overlapStats.totalIndigenousKm2} km²</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* FPIC Status card */}
        <Card className="border-amber-200 bg-amber-50/50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-3">
              <Shield className="w-5 h-5 text-amber-600" />
              <h4 className="font-medium">{t('landBio.fpicStatus')}</h4>
            </div>
            <div className="space-y-3">
              <Badge variant="destructive" className="w-fit">
                {t('landBio.fpicNotInitiated')}
              </Badge>
              <p className="text-sm text-muted-foreground">
                {t('landBio.fpicDescription', { count: overlapStats.communitiesAffected })}
              </p>
              <p className="text-xs text-amber-700 font-medium">
                {t('landBio.fpicRequired')}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Known Deposits card */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-3">
              <Mountain className="w-5 h-5 text-stone-600" />
              <h4 className="font-medium">{t('landBio.depositsTitle')}</h4>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t('landBio.knownDeposits')}</span>
                <span className="font-medium">{overlapStats.depositCount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t('landBio.nearestDeposit')}</span>
                <span className="font-medium">{overlapStats.nearestDepositKm} km</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t('landBio.primaryCommodities')}</span>
                <span className="font-medium text-right">{overlapStats.primaryCommodities}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Methodology */}
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          <strong>{t('common.methodology')}:</strong> {t('landBio.methodologyText')}
        </AlertDescription>
      </Alert>
    </div>
  );
}
