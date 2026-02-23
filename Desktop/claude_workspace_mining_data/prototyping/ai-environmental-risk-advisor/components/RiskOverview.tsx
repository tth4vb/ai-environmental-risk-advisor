'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import {
  Droplets,
  Trees,
  Users,
  MapPin,
  Wheat,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Info,
  FileText,
  ExternalLink,
  ChevronDown,
  Wind,
  Volume2,
  Mountain,
  Flame,
  Trash2,
  HardHat
} from 'lucide-react';
import { RiskAssessment, RiskLevel } from '@/types';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { SourcesMethodology } from './SourcesMethodology';
import { withGlossaryTerms } from '@/lib/glossary-utils';
import { useTranslation } from '@/lib/i18n';

interface RiskOverviewProps {
  risks: RiskAssessment[];
  projectName?: string;
}

const riskIcons = {
  water: Droplets,
  biodiversity: Trees,
  'community-displacement': Users,
  'indigenous-lands': MapPin,
  'food-security': Wheat,
};

const riskColors = {
  low: 'text-success border-success/50 bg-success/10',
  medium: 'text-warning border-warning/50 bg-warning/10',
  high: 'text-destructive border-destructive/50 bg-destructive/10',
  critical: 'text-destructive border-destructive bg-destructive/20',
};

const riskBadgeColors: Record<RiskLevel, string> = {
  low: 'bg-success/15 text-success border-success/30',
  medium: 'bg-warning/15 text-warning border-warning/30',
  high: 'bg-destructive/15 text-destructive border-destructive/30',
  critical: 'bg-destructive text-destructive-foreground border-destructive',
};

function RiskLevelIcon({ level }: { level: RiskLevel }) {
  switch (level) {
    case 'low':
      return <CheckCircle className="w-5 h-5 text-success" />;
    case 'medium':
      return <AlertTriangle className="w-5 h-5 text-warning" />;
    case 'high':
    case 'critical':
      return <XCircle className="w-5 h-5 text-destructive" />;
  }
}

export function RiskOverview({ risks, projectName }: RiskOverviewProps) {
  const { t } = useTranslation();
  const criticalRisks = risks.filter(r => r.level === 'critical').length;
  const highRisks = risks.filter(r => r.level === 'high').length;
  const [isDisclosureOpen, setIsDisclosureOpen] = useState(false);

  return (
    <div className="space-y-6">
      {/* Summary Alert */}
      {criticalRisks > 0 && (
        <Alert className="border-destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription className="font-medium">
            {t('riskOverview.criticalAlert', { count: criticalRisks, plural: criticalRisks > 1 ? 's' : '' })}
          </AlertDescription>
        </Alert>
      )}

      {/* Risk Cards Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {risks.map((risk) => {
          const Icon = riskIcons[risk.category];

          return (
            <Card key={risk.category} className={`border-2 ${riskColors[risk.level]}`}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <Icon className="w-5 h-5" />
                    <CardTitle className="text-lg">{risk.title}</CardTitle>
                  </div>
                  <RiskLevelIcon level={risk.level} />
                </div>
                <Badge variant="outline" className={`w-fit ${riskBadgeColors[risk.level]}`}>
                  {t('riskOverview.riskLabel', { level: risk.level.toUpperCase() })}
                </Badge>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm">{withGlossaryTerms(risk.summary)}</p>

                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <FileText className="w-3 h-3" />
                  <span>{risk.dataSource}</span>
                </div>

                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="text-xs">
                    {t('riskOverview.confidence', { level: risk.confidence })}
                  </Badge>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <Info className="w-4 h-4 mr-1" />
                        {t('common.details')}
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                          <Icon className="w-5 h-5" />
                          {risk.title}
                        </DialogTitle>
                        <Badge variant="outline" className={`w-fit ${riskBadgeColors[risk.level]}`}>
                          {t('riskOverview.riskLabel', { level: risk.level.toUpperCase() })}
                        </Badge>
                      </DialogHeader>
                      <div className="space-y-4 pt-4">
                        <div>
                          <h4 className="font-medium mb-2">{t('riskOverview.assessmentDetails')}</h4>
                          <p className="text-sm text-muted-foreground">{withGlossaryTerms(risk.details)}</p>
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="font-medium">{t('riskOverview.dataSource')}</span>
                            <p className="text-muted-foreground">{risk.dataSource}</p>
                          </div>
                          <div>
                            <span className="font-medium">{t('riskOverview.lastUpdated')}</span>
                            <p className="text-muted-foreground">{risk.lastUpdated}</p>
                          </div>
                          <div>
                            <span className="font-medium">{t('riskOverview.confidenceLevel')}</span>
                            <p className="text-muted-foreground capitalize">{risk.confidence}</p>
                          </div>
                        </div>

                        <Alert>
                          <Info className="h-4 w-4" />
                          <AlertDescription>
                            {t('riskOverview.verificationAlert')}
                          </AlertDescription>
                        </Alert>

                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <FileText className="w-4 h-4 mr-1" />
                            {t('common.downloadReport')}
                          </Button>
                          <Button variant="outline" size="sm">
                            <ExternalLink className="w-4 h-4 mr-1" />
                            {t('common.viewDataSources')}
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* About This Assessment — Scope Disclosure (below the fold) */}
      <Collapsible open={isDisclosureOpen} onOpenChange={setIsDisclosureOpen}>
        <Card className="border bg-muted/30">
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer select-none pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Info className="w-5 h-5 text-muted-foreground" />
                  <CardTitle className="text-base font-medium">{t('riskOverview.aboutAssessment')}</CardTitle>
                </div>
                <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${isDisclosureOpen ? 'rotate-180' : ''}`} />
              </div>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="pt-0 space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                {/* What's covered */}
                <div>
                  <h4 className="text-sm font-medium mb-2 text-foreground">{t('riskOverview.whatsCovered')}</h4>
                  <ul className="space-y-1.5 text-sm text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <Droplets className="w-3.5 h-3.5 flex-shrink-0" />
                      {t('riskOverview.waterStressContamination')}
                    </li>
                    <li className="flex items-center gap-2">
                      <Trees className="w-3.5 h-3.5 flex-shrink-0" />
                      {t('riskOverview.biodiversityHabitat')}
                    </li>
                    <li className="flex items-center gap-2">
                      <Users className="w-3.5 h-3.5 flex-shrink-0" />
                      {t('riskOverview.communityDisplacement')}
                    </li>
                    <li className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                      {t('riskOverview.indigenousLands')}
                    </li>
                    <li className="flex items-center gap-2">
                      <Wheat className="w-3.5 h-3.5 flex-shrink-0" />
                      {t('riskOverview.foodSecurityImpact')}
                    </li>
                  </ul>
                </div>

                {/* Not yet covered */}
                <div>
                  <h4 className="text-sm font-medium mb-2 text-foreground">{t('riskOverview.notYetCovered')}</h4>
                  <ul className="space-y-1.5 text-sm text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <Wind className="w-3.5 h-3.5 flex-shrink-0" />
                      {t('riskOverview.airQualityDust')}
                    </li>
                    <li className="flex items-center gap-2">
                      <Volume2 className="w-3.5 h-3.5 flex-shrink-0" />
                      {t('riskOverview.noiseVibration')}
                    </li>
                    <li className="flex items-center gap-2">
                      <Mountain className="w-3.5 h-3.5 flex-shrink-0" />
                      {t('riskOverview.seismicGeotech')}
                    </li>
                    <li className="flex items-center gap-2">
                      <Flame className="w-3.5 h-3.5 flex-shrink-0" />
                      {t('riskOverview.ghgEmissions')}
                    </li>
                    <li className="flex items-center gap-2">
                      <Trash2 className="w-3.5 h-3.5 flex-shrink-0" />
                      {t('riskOverview.wasteTailings')}
                    </li>
                    <li className="flex items-center gap-2">
                      <HardHat className="w-3.5 h-3.5 flex-shrink-0" />
                      {t('riskOverview.workerSafety')}
                    </li>
                  </ul>
                </div>
              </div>

              <p className="text-xs text-muted-foreground border-t pt-3">
                {t('riskOverview.disclaimerText')}
              </p>
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>

      {/* Sources & Methodology */}
      <SourcesMethodology risks={risks} projectName={projectName} />
    </div>
  );
}
