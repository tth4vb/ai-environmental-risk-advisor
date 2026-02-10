'use client';

import { MiningProject, RiskAssessment } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { WaterRiskMapEnhanced } from './WaterRiskMapEnhanced';

import { ImpactRadius } from './ImpactRadius';
import { ComparativeAnalysis } from './ComparativeAnalysis';
import { LandBiodiversityTab } from './LandBiodiversityTab';
import { MapPin, Droplets, BarChart3, Leaf } from 'lucide-react';
import { useTranslation } from '@/lib/i18n';

interface DataVisualizationsProps {
  project: MiningProject;
  risks: RiskAssessment[];
}

export function DataVisualizations({ project, risks }: DataVisualizationsProps) {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{t('visualizations.title')}</CardTitle>
          <CardDescription>
            {t('visualizations.description')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="water" className="space-y-4">
            <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4">
              <TabsTrigger value="water">
                <Droplets className="w-4 h-4 mr-1" />
                {t('visualizations.tabWaterRisk')}
              </TabsTrigger>
              <TabsTrigger value="land">
                <Leaf className="w-4 h-4 mr-1" />
                {t('visualizations.tabLandBiodiversity')}
              </TabsTrigger>
              <TabsTrigger value="impact">
                <MapPin className="w-4 h-4 mr-1" />
                {t('visualizations.tabImpactZone')}
              </TabsTrigger>

              <TabsTrigger value="comparison">
                <BarChart3 className="w-4 h-4 mr-1" />
                {t('visualizations.tabComparison')}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="water" className="space-y-4">
              <WaterRiskMapEnhanced project={project} />
            </TabsContent>

            <TabsContent value="land" className="space-y-4">
              <LandBiodiversityTab project={project} />
            </TabsContent>

            <TabsContent value="impact" className="space-y-4">
              <ImpactRadius project={project} />
            </TabsContent>


            <TabsContent value="comparison" className="space-y-4">
              <ComparativeAnalysis project={project} risks={risks} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
