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

const riskBadgeVariants = {
  low: 'outline' as const,
  medium: 'outline' as const,
  high: 'destructive' as const,
  critical: 'destructive' as const,
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
            {criticalRisks} critical risk{criticalRisks > 1 ? 's' : ''} identified that require immediate attention.
            These issues could significantly impact community wellbeing and environment.
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
                <Badge variant={riskBadgeVariants[risk.level]} className="w-fit">
                  {risk.level.toUpperCase()} RISK
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
                    {risk.confidence} confidence
                  </Badge>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <Info className="w-4 h-4 mr-1" />
                        Details
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                          <Icon className="w-5 h-5" />
                          {risk.title}
                        </DialogTitle>
                        <Badge variant={riskBadgeVariants[risk.level]} className="w-fit">
                          {risk.level.toUpperCase()} RISK
                        </Badge>
                      </DialogHeader>
                      <div className="space-y-4 pt-4">
                        <div>
                          <h4 className="font-medium mb-2">Assessment Details</h4>
                          <p className="text-sm text-muted-foreground">{withGlossaryTerms(risk.details)}</p>
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="font-medium">Data Source:</span>
                            <p className="text-muted-foreground">{risk.dataSource}</p>
                          </div>
                          <div>
                            <span className="font-medium">Last Updated:</span>
                            <p className="text-muted-foreground">{risk.lastUpdated}</p>
                          </div>
                          <div>
                            <span className="font-medium">Confidence Level:</span>
                            <p className="text-muted-foreground capitalize">{risk.confidence}</p>
                          </div>
                        </div>

                        <Alert>
                          <Info className="h-4 w-4" />
                          <AlertDescription>
                            This assessment is based on publicly available data and should be verified with local knowledge and current conditions.
                          </AlertDescription>
                        </Alert>

                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <FileText className="w-4 h-4 mr-1" />
                            Download Report
                          </Button>
                          <Button variant="outline" size="sm">
                            <ExternalLink className="w-4 h-4 mr-1" />
                            View Data Sources
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
                  <CardTitle className="text-base font-medium">About This Assessment</CardTitle>
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
                  <h4 className="text-sm font-medium mb-2 text-foreground">What&apos;s covered</h4>
                  <ul className="space-y-1.5 text-sm text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <Droplets className="w-3.5 h-3.5 flex-shrink-0" />
                      Water stress &amp; contamination risk
                    </li>
                    <li className="flex items-center gap-2">
                      <Trees className="w-3.5 h-3.5 flex-shrink-0" />
                      Biodiversity &amp; habitat impact
                    </li>
                    <li className="flex items-center gap-2">
                      <Users className="w-3.5 h-3.5 flex-shrink-0" />
                      Community displacement risk
                    </li>
                    <li className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                      Indigenous &amp; traditional lands
                    </li>
                    <li className="flex items-center gap-2">
                      <Wheat className="w-3.5 h-3.5 flex-shrink-0" />
                      Food security impact
                    </li>
                  </ul>
                </div>

                {/* Not yet covered */}
                <div>
                  <h4 className="text-sm font-medium mb-2 text-foreground">Not yet covered</h4>
                  <ul className="space-y-1.5 text-sm text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <Wind className="w-3.5 h-3.5 flex-shrink-0" />
                      Air quality &amp; dust emissions
                    </li>
                    <li className="flex items-center gap-2">
                      <Volume2 className="w-3.5 h-3.5 flex-shrink-0" />
                      Noise &amp; vibration
                    </li>
                    <li className="flex items-center gap-2">
                      <Mountain className="w-3.5 h-3.5 flex-shrink-0" />
                      Seismic &amp; geotechnical risk
                    </li>
                    <li className="flex items-center gap-2">
                      <Flame className="w-3.5 h-3.5 flex-shrink-0" />
                      Greenhouse gas emissions
                    </li>
                    <li className="flex items-center gap-2">
                      <Trash2 className="w-3.5 h-3.5 flex-shrink-0" />
                      Waste &amp; tailings management
                    </li>
                    <li className="flex items-center gap-2">
                      <HardHat className="w-3.5 h-3.5 flex-shrink-0" />
                      Worker health &amp; safety
                    </li>
                  </ul>
                </div>
              </div>

              <p className="text-xs text-muted-foreground border-t pt-3">
                Assessments use publicly available global datasets (WRI Aqueduct, Global Forest Watch, LandMark, and others) and may not reflect local conditions. We recommend consulting local environmental experts and community knowledge to validate findings.
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