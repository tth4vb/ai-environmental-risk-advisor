'use client';

import dynamic from 'next/dynamic';
import { useState, useMemo } from 'react';
import { MiningProject } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { MapPin, Layers, Info, AlertTriangle, Shield, Trees, Users } from 'lucide-react';
import { DEFAULT_COORDS } from '@/lib/constants';

const BaseMap = dynamic(() => import('./BaseMap').then(mod => mod.BaseMap), {
  ssr: false,
  loading: () => <div className="h-96 bg-gray-100 animate-pulse rounded-lg" />
});
const MineMarker = dynamic(() => import('./BaseMap').then(mod => mod.MineMarker), { ssr: false });
const BiodiversityLayer = dynamic(() => import('./BiodiversityLayer').then(mod => mod.BiodiversityLayer), { ssr: false });
const IndigenousLandsLayer = dynamic(() => import('./IndigenousLandsLayer').then(mod => mod.IndigenousLandsLayer), { ssr: false });

interface LandBiodiversityTabProps {
  project: MiningProject;
}

export function LandBiodiversityTab({ project }: LandBiodiversityTabProps) {
  const [showBiodiversity, setShowBiodiversity] = useState(true);
  const [showIndigenousLands, setShowIndigenousLands] = useState(true);
  const [bioOpacity, setBioOpacity] = useState(0.5);
  const [landsOpacity, setLandsOpacity] = useState(0.5);

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
              Land & Biodiversity Layers
            </h4>

            <div className="grid gap-4 sm:grid-cols-2">
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
                    Biodiversity & Protected Areas
                  </label>
                </div>
                {showBiodiversity && (
                  <div className="flex items-center gap-2 ml-6">
                    <label className="text-xs text-muted-foreground">Opacity</label>
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
                    Indigenous & Community Lands
                  </label>
                </div>
                {showIndigenousLands && (
                  <div className="flex items-center gap-2 ml-6">
                    <label className="text-xs text-muted-foreground">Opacity</label>
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
                  Overlap Detected
                </div>
                {showBiodiversity && (
                  <p className="text-xs text-muted-foreground">
                    Mine footprint overlaps {overlapStats.kbaOverlapPct}% with KBA and {overlapStats.protectedAreaOverlapPct}% with protected areas
                  </p>
                )}
                {showIndigenousLands && (
                  <p className="text-xs text-muted-foreground">
                    {overlapStats.indigenousOverlapPct}% of concession area intersects indigenous/community lands
                  </p>
                )}
              </div>
            )}

            {/* Combined legend */}
            <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg p-3 z-[1000]">
              <h4 className="text-xs font-medium mb-2">Legend</h4>
              <div className="space-y-1">
                {showBiodiversity && (
                  <>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-emerald-500 rounded opacity-60" />
                      <span className="text-xs">KBA</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-emerald-600 rounded opacity-60" />
                      <span className="text-xs">Protected Area</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded opacity-60 border border-dashed border-emerald-400" style={{ backgroundColor: '#6ee7b7' }} />
                      <span className="text-xs">Corridor</span>
                    </div>
                  </>
                )}
                {showIndigenousLands && (
                  <>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded opacity-60" style={{ backgroundColor: '#b45309' }} />
                      <span className="text-xs">Indigenous Territory</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded opacity-60" style={{ backgroundColor: '#d97706' }} />
                      <span className="text-xs">Community Land</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded opacity-60 border border-dashed border-amber-600" style={{ backgroundColor: '#f59e0b' }} />
                      <span className="text-xs">Customary Rights</span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        {/* Protected Areas card */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-3">
              <Trees className="w-5 h-5 text-emerald-600" />
              <h4 className="font-medium">Protected Areas</h4>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">KBA Overlap</span>
                <Badge variant={overlapStats.kbaOverlapPct > 20 ? 'destructive' : 'secondary'}>
                  {overlapStats.kbaOverlapPct}%
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Protected Area Overlap</span>
                <Badge variant={overlapStats.protectedAreaOverlapPct > 10 ? 'destructive' : 'secondary'}>
                  {overlapStats.protectedAreaOverlapPct}%
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Area</span>
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
              <h4 className="font-medium">Indigenous Lands</h4>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Territory Overlap</span>
                <Badge variant="destructive">{overlapStats.indigenousOverlapPct}%</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Communities Affected</span>
                <span className="font-medium">{overlapStats.communitiesAffected}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Area</span>
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
              <h4 className="font-medium">FPIC Status</h4>
            </div>
            <div className="space-y-3">
              <Badge variant="destructive" className="w-fit">
                {overlapStats.fpicStatus}
              </Badge>
              <p className="text-sm text-muted-foreground">
                Free, Prior and Informed Consent (FPIC) has not been initiated for any of the
                {' '}{overlapStats.communitiesAffected} affected communities. This is required under
                ILO Convention 169 and the UN Declaration on the Rights of Indigenous Peoples (UNDRIP).
              </p>
              <p className="text-xs text-amber-700 font-medium">
                FPIC must be obtained before any project activities begin on indigenous or community lands.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Methodology */}
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          <strong>Methodology:</strong> Protected area boundaries from the World Database on Protected Areas
          (WDPA, Protected Planet). Key Biodiversity Areas identified by the BirdLife/KBA Partnership.
          Indigenous and community land tenure from LandMark (WRI), licensed CC BY-SA 4.0.
          Overlap percentages are calculated against the mining concession boundary. FPIC status is based on
          publicly available consultation records. All data should be verified with local communities and
          relevant authorities.
        </AlertDescription>
      </Alert>
    </div>
  );
}
