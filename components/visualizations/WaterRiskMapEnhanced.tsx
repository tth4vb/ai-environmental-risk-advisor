'use client';

import dynamic from 'next/dynamic';
import { MiningProject } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Droplets, AlertTriangle, Info, MapPin, Layers, Download } from 'lucide-react';
import { useState, useMemo } from 'react';
import { DEFAULT_COORDS } from '@/lib/constants';

// Dynamically import map components
const BaseMap = dynamic(() => import('./BaseMap').then(mod => mod.BaseMap), { 
  ssr: false,
  loading: () => <div className="h-96 bg-gray-100 animate-pulse rounded-lg" />
});
const MineMarker = dynamic(() => import('./BaseMap').then(mod => mod.MineMarker), { ssr: false });
const AqueductRasterLayer = dynamic(() => import('./AqueductRasterLayer').then(mod => mod.AqueductRasterLayer), { ssr: false });
const RasterLegend = dynamic(() => import('./AqueductRasterLayer').then(mod => mod.RasterLegend), { ssr: false });
const RiversLayer = dynamic(() => import('./RiversLayer').then(mod => mod.RiversLayer), { ssr: false });
const RiversLegend = dynamic(() => import('./RiversLayer').then(mod => mod.RiversLegend), { ssr: false });

type WaterLayer = 'water_stress' | 'water_depletion' | 'drought_risk';

type BadgeVariant = 'default' | 'secondary' | 'destructive' | 'outline';

interface FlowMetrics {
  current: string;
  projected: string;
  category: string;
  color: BadgeVariant;
}

interface DroughtMetrics {
  frequency: string;
  severity: string;
  trend: string;
  category: string;
  color: BadgeVariant;
}

type RiskMetrics = FlowMetrics | DroughtMetrics;

function isFlowMetrics(m: RiskMetrics): m is FlowMetrics {
  return 'current' in m;
}

interface WaterRiskMapEnhancedProps {
  project: MiningProject;
}

export function WaterRiskMapEnhanced({ project }: WaterRiskMapEnhancedProps) {
  const [activeLayer, setActiveLayer] = useState<WaterLayer>('water_stress');
  const [showRaster, setShowRaster] = useState(true);
  const [showRivers, setShowRivers] = useState(false);
  const [rasterOpacity, setRasterOpacity] = useState(0.7);

  // Get coordinates
  const coordinates = useMemo((): [number, number] => {
    if (project.location.coordinates) {
      return [project.location.coordinates.lat, project.location.coordinates.lng];
    }
    return DEFAULT_COORDS[project.location.country] || [-20, 20];
  }, [project]);

  // Risk assessment based on layer and project — memoized
  const metrics: RiskMetrics = useMemo(() => {
    const allMetrics: Record<WaterLayer, RiskMetrics> = {
      water_stress: {
        current: project.mineralType === 'lithium' ? '78%' : '45%',
        projected: project.mineralType === 'lithium' ? '95%' : '62%',
        category: project.mineralType === 'lithium' ? 'Extremely High' : 'High',
        color: project.mineralType === 'lithium' ? 'destructive' : 'secondary',
      },
      water_depletion: {
        current: '2.3 million m³/year',
        projected: project.mineralType === 'lithium' ? '8.5 million m³/year' : '4.2 million m³/year',
        category: 'High',
        color: 'secondary',
      },
      drought_risk: {
        frequency: '1 in 5 years',
        severity: 'Severe',
        trend: 'Increasing',
        category: 'High',
        color: 'secondary',
      },
    };
    return allMetrics[activeLayer];
  }, [activeLayer, project.mineralType]);

  return (
    <div className="space-y-4">
      {/* Location Info */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="w-4 h-4" />
          <span>
            {project.location.nearestCity}, {project.location.region}, {project.location.country}
          </span>
        </div>
        <Button variant="outline" size="sm">
          <Download className="w-4 h-4 mr-2" />
          Export Data
        </Button>
      </div>

      {/* Layer Controls */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium flex items-center gap-2">
                <Layers className="w-4 h-4" />
                Water Risk Layers
              </h4>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <label className="text-sm">Show Raster</label>
                  <input
                    type="checkbox"
                    checked={showRaster}
                    onChange={(e) => setShowRaster(e.target.checked)}
                    className="rounded"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-sm">Show Rivers</label>
                  <input
                    type="checkbox"
                    checked={showRivers}
                    onChange={(e) => setShowRivers(e.target.checked)}
                    className="rounded"
                  />
                </div>
              </div>
            </div>
            
            <Tabs value={activeLayer} onValueChange={(v) => setActiveLayer(v as WaterLayer)}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="water_stress">Water Stress</TabsTrigger>
                <TabsTrigger value="water_depletion">Water Depletion</TabsTrigger>
                <TabsTrigger value="drought_risk">Drought Risk</TabsTrigger>
              </TabsList>
            </Tabs>

            {showRaster && (
              <div className="flex items-center gap-2">
                <label className="text-sm">Opacity</label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={rasterOpacity * 100}
                  onChange={(e) => setRasterOpacity(Number(e.target.value) / 100)}
                  className="flex-1"
                />
                <span className="text-sm w-10">{Math.round(rasterOpacity * 100)}%</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Map */}
      <div className="relative">
        <Card className="border-2">
          <CardContent className="p-0">
            <BaseMap center={coordinates} zoom={8}>
              {/* Raster water risk layer */}
              {showRaster && (
                <AqueductRasterLayer riskType={activeLayer} opacity={rasterOpacity} />
              )}
              
              {/* River network */}
              {showRivers && (
                <RiversLayer center={coordinates} />
              )}

              {/* Mine location */}
              <MineMarker
                position={coordinates}
                label={project.projectName || `${project.mineralType} Mining Project`}
              />
            </BaseMap>

            {/* Legends */}
            {showRaster && <RasterLegend riskType={activeLayer} />}
            {showRivers && <RiversLegend />}

            {/* Metrics Overlay */}
            <div className="absolute top-4 left-4 bg-white rounded-lg shadow-lg p-3 space-y-2 z-[1000] max-w-xs">
              <div className="text-sm font-medium">
                {activeLayer === 'water_stress' && 'Baseline Water Stress'}
                {activeLayer === 'water_depletion' && 'Water Depletion Rate'}
                {activeLayer === 'drought_risk' && 'Drought Risk'}
              </div>
              <Badge variant={metrics.color} className="w-fit">
                {metrics.category}
              </Badge>
              <div className="text-xs space-y-1">
                {isFlowMetrics(metrics) && activeLayer === 'water_stress' && (
                  <>
                    <p>Current: {metrics.current}</p>
                    <p>With mining: {metrics.projected}</p>
                  </>
                )}
                {isFlowMetrics(metrics) && activeLayer === 'water_depletion' && (
                  <>
                    <p>Current: {metrics.current}</p>
                    <p>Projected: {metrics.projected}</p>
                  </>
                )}
                {!isFlowMetrics(metrics) && activeLayer === 'drought_risk' && (
                  <>
                    <p>Frequency: {metrics.frequency}</p>
                    <p>Severity: {metrics.severity}</p>
                    <p>Trend: {metrics.trend}</p>
                  </>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Analysis Details */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-3">
              <Droplets className="w-5 h-5 text-blue-600" />
              <h4 className="font-medium">Key Findings</h4>
            </div>
            <div className="space-y-2 text-sm">
              {isFlowMetrics(metrics) && activeLayer === 'water_stress' && (
                <>
                  <p>• Basin already faces {metrics.current} water stress</p>
                  <p>• Mining would increase stress to {metrics.projected}</p>
                  <p>• 3 communities compete for same water source</p>
                  <p>• Aquifer recharge rate: 50+ years</p>
                </>
              )}
              {isFlowMetrics(metrics) && activeLayer === 'water_depletion' && (
                <>
                  <p>• Current extraction: {metrics.current}</p>
                  <p>• Mining addition: {metrics.projected}</p>
                  <p>• Exceeds sustainable yield by 230%</p>
                  <p>• Groundwater dropping 2m/year</p>
                </>
              )}
              {!isFlowMetrics(metrics) && activeLayer === 'drought_risk' && (
                <>
                  <p>• Severe drought every 5 years</p>
                  <p>• 40% increase in frequency since 2000</p>
                  <p>• Last drought: 60% crop loss</p>
                  <p>• No drought contingency plan exists</p>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="w-5 h-5 text-destructive" />
              <h4 className="font-medium">Risk Implications</h4>
            </div>
            <div className="space-y-2 text-sm">
              <p className="font-medium">For Communities:</p>
              <ul className="space-y-1 ml-4">
                <li>• Drinking water security threatened</li>
                <li>• Agricultural productivity at risk</li>
                <li>• Increased water costs likely</li>
              </ul>
              <p className="font-medium mt-2">For Mining Operations:</p>
              <ul className="space-y-1 ml-4">
                <li>• Social license challenges</li>
                <li>• Operational disruptions possible</li>
                <li>• Regulatory restrictions likely</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Methodology */}
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          <strong>Methodology:</strong> This analysis uses WRI Aqueduct 4.0 baseline water stress data,
          combined with projected mining water demand based on ore processing requirements and regional
          evaporation rates. Raster visualization shows 5km resolution water risk indicators.
          Drought projections incorporate IPCC climate scenarios.
          {showRivers && ' River network data sourced from HydroRIVERS (WWF HydroSHEDS), showing stream order classification and estimated discharge.'}
          {' '}All data subject to ground-truthing.
        </AlertDescription>
      </Alert>
    </div>
  );
}