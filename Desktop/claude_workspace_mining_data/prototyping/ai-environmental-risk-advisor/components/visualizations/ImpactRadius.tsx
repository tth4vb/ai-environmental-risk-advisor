'use client';

import dynamic from 'next/dynamic';
import { MiningProject } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Home, Trees, Wheat, School, MapPin, Users } from 'lucide-react';
import { useMemo } from 'react';
import { DEFAULT_COORDS } from '@/lib/constants';
import { useTranslation } from '@/lib/i18n';

// Dynamically import map components
const BaseMap = dynamic(() => import('./BaseMap').then(mod => mod.BaseMap), {
  ssr: false,
  loading: () => <div className="h-96 bg-gray-100 animate-pulse rounded-lg" />
});
const RiskOverlay = dynamic(() => import('./BaseMap').then(mod => mod.RiskOverlay), { ssr: false });
const MineMarker = dynamic(() => import('./BaseMap').then(mod => mod.MineMarker), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then(mod => mod.Marker), { ssr: false });
const Popup = dynamic(() => import('react-leaflet').then(mod => mod.Popup), { ssr: false });

interface ImpactRadiusProps {
  project: MiningProject;
}

// Helper to generate random points around center
function generateRandomPoints(center: [number, number], count: number, minRadius: number, maxRadius: number): [number, number][] {
  const points: [number, number][] = [];
  for (let i = 0; i < count; i++) {
    const angle = Math.random() * 2 * Math.PI;
    const radius = minRadius + Math.random() * (maxRadius - minRadius);
    const lat = center[0] + (radius / 111) * Math.cos(angle); // ~111km per degree latitude
    const lng = center[1] + (radius / (111 * Math.cos(center[0] * Math.PI / 180))) * Math.sin(angle);
    points.push([lat, lng]);
  }
  return points;
}

export function ImpactRadius({ project }: ImpactRadiusProps) {
  const { t } = useTranslation();

  // Get coordinates
  const coordinates = useMemo((): [number, number] => {
    if (project.location.coordinates) {
      return [project.location.coordinates.lat, project.location.coordinates.lng];
    }
    return DEFAULT_COORDS[project.location.country] || [-20, 20];
  }, [project]);

  // Generate random asset locations for demo
  const assetLocations = useMemo(() => {
    const size = project.size ?? 'medium';
    const multiplier = size === 'large' ? 1.5 : 1;
    return {
      households: generateRandomPoints(coordinates, Math.floor(12 * multiplier), 1, 5),
      schools: generateRandomPoints(coordinates, Math.floor(3 * multiplier), 2, 8),
      farmland: generateRandomPoints(coordinates, Math.floor(8 * multiplier), 0, 10),
      forest: generateRandomPoints(coordinates, Math.floor(5 * multiplier), 0, 15),
    };
  }, [coordinates, project.size]);

  const size = project.size ?? 'medium';
  const impactedAssets = [
    { icon: Home, label: t('impactRadius.households'), count: size === 'large' ? '1,200' : '400', distance: '0-5km', color: '#3b82f6' },
    { icon: School, label: t('impactRadius.schools'), count: size === 'large' ? '3' : '1', distance: '2-8km', color: '#8b5cf6' },
    { icon: Wheat, label: t('impactRadius.farmland'), count: size === 'large' ? '2,000 ha' : '500 ha', distance: '0-10km', color: '#f59e0b' },
    { icon: Trees, label: t('impactRadius.forest'), count: size === 'large' ? '500 ha' : '100 ha', distance: '0-15km', color: '#10b981' },
  ];

  // Create custom icons for different asset types
  const createAssetIcon = (color: string, IconComponent: any) => {
    if (typeof window !== 'undefined') {
      const L = require('leaflet'); // dynamic import for client-side only
      return new L.DivIcon({
        html: `
          <div style="
            background-color: ${color};
            width: 24px;
            height: 24px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            border: 2px solid white;
            box-shadow: 0 2px 4px rgba(0,0,0,0.3);
          ">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="white" stroke="white" stroke-width="2">
              ${IconComponent === Home ? '<path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>' :
                IconComponent === School ? '<path d="M12 2v20M2 5h20M2 12h20M2 19h20M5 5v14M9 5v14M15 5v14M19 5v14"/>' :
                IconComponent === Wheat ? '<path d="M2 22 16 8M17 2l4 4-4 4M22 2l-4 4 4 4M12 12l5 5M7 7l5 5"/>' :
                '<path d="M12 20v-10M12 10a8 8 0 0 1 5.5-7.5"/>'}
            </svg>
          </div>
        `,
        className: '',
        iconSize: [24, 24],
        iconAnchor: [12, 12],
      });
    }
    return null;
  };

  return (
    <div className="space-y-4">
      {/* Location Info */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <MapPin className="w-4 h-4" />
        <span>
          {project.location.nearestCity}, {project.location.region}, {project.location.country}
        </span>
      </div>

      <Card>
        <CardContent className="p-0">
          <BaseMap center={coordinates} zoom={10}>
            {/* Mine location */}
            <MineMarker
              position={coordinates}
              label={project.projectName || `${project.mineralType} Mining Project`}
            />

            {/* Impact zones */}
            <RiskOverlay
              center={coordinates}
              radiusKm={5}
              color="#dc2626"
              fillOpacity={0.2}
              label={t('impactRadius.directImpactZone')}
            />
            <RiskOverlay
              center={coordinates}
              radiusKm={15}
              color="#f59e0b"
              fillOpacity={0.1}
              label={t('impactRadius.indirectImpactZone')}
            />

            {/* Asset markers */}
            {typeof window !== 'undefined' && (
              <>
                {assetLocations.households.map((pos, i) => (
                  <Marker key={`house-${i}`} position={pos} icon={createAssetIcon('#3b82f6', Home)}>
                    <Popup>{t('impactRadius.householdSettlement')}</Popup>
                  </Marker>
                ))}
                {assetLocations.schools.map((pos, i) => (
                  <Marker key={`school-${i}`} position={pos} icon={createAssetIcon('#8b5cf6', School)}>
                    <Popup>{t('impactRadius.school')}</Popup>
                  </Marker>
                ))}
                {assetLocations.farmland.map((pos, i) => (
                  <Marker key={`farm-${i}`} position={pos} icon={createAssetIcon('#f59e0b', Wheat)}>
                    <Popup>{t('impactRadius.agriculturalLand')}</Popup>
                  </Marker>
                ))}
                {assetLocations.forest.map((pos, i) => (
                  <Marker key={`forest-${i}`} position={pos} icon={createAssetIcon('#10b981', Trees)}>
                    <Popup>{t('impactRadius.forestArea')}</Popup>
                  </Marker>
                ))}
              </>
            )}
          </BaseMap>

          {/* Legend */}
          <div className="absolute top-4 right-4 bg-white rounded-lg shadow-lg p-3 space-y-2 z-[1000]">
            <div className="text-xs font-medium mb-1">{t('impactRadius.impactZones')}</div>
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs">
                <div className="w-3 h-3 bg-destructive/60 rounded" />
                <span>{t('impactRadius.direct')}</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <div className="w-3 h-3 bg-warning/60 rounded" />
                <span>{t('impactRadius.indirect')}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Impact Summary */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {impactedAssets.map(({ icon: Icon, label, count, distance, color }) => (
          <Card key={label}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: `${color}20` }}
                >
                  <Icon className="w-5 h-5" style={{ color }} />
                </div>
                <Badge variant="outline" className="text-xs">{distance}</Badge>
              </div>
              <div className="space-y-1">
                <p className="text-2xl font-bold">{count}</p>
                <p className="text-sm text-muted-foreground">{label} {t('impactRadius.affected')}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Additional Context */}
      <Card className="bg-muted/30">
        <CardContent className="pt-6">
          <div className="flex items-start gap-2">
            <Users className="w-5 h-5 text-muted-foreground mt-0.5" />
            <div className="space-y-1 text-sm">
              <p className="font-medium">{t('impactRadius.communityImpact')}</p>
              <p className="text-muted-foreground">
                {t('impactRadius.communityImpactDesc')}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
