'use client';

import { useState } from 'react';
import { RiskAssessment } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  BookOpen,
  Copy,
  Check,
  Database,
  FlaskConical,
  ShieldCheck,
  Info,
} from 'lucide-react';
import { useTranslation } from '@/lib/i18n';

interface SourcesMethodologyProps {
  risks: RiskAssessment[];
  projectName?: string;
}

export function SourcesMethodology({ risks, projectName }: SourcesMethodologyProps) {
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);

  const confidenceDescriptions: Record<string, string> = {
    high: t('sources.confidenceHigh'),
    medium: t('sources.confidenceMedium'),
    low: t('sources.confidenceLow'),
  };

  const methodologyByCategory: Record<string, { title: string; description: string }> = {
    water: {
      title: t('sources.waterRisk'),
      description: t('sources.waterRiskDesc'),
    },
    biodiversity: {
      title: t('sources.biodiversityHabitat'),
      description: t('sources.biodiversityHabitatDesc'),
    },
    'community-displacement': {
      title: t('sources.communityDisplacement'),
      description: t('sources.communityDisplacementDesc'),
    },
    'indigenous-lands': {
      title: t('sources.indigenousTerritory'),
      description: t('sources.indigenousTerritoryDesc'),
    },
    'food-security': {
      title: t('sources.foodSecurity'),
      description: t('sources.foodSecurityDesc'),
    },
  };

  // Deduplicate data sources
  const sourcesMap = new Map<
    string,
    { confidence: RiskAssessment['confidence']; lastUpdated: string; categories: string[] }
  >();
  for (const risk of risks) {
    const existing = sourcesMap.get(risk.dataSource);
    if (existing) {
      existing.categories.push(risk.title);
    } else {
      sourcesMap.set(risk.dataSource, {
        confidence: risk.confidence,
        lastUpdated: risk.lastUpdated,
        categories: [risk.title],
      });
    }
  }

  const handleCopyCitation = async () => {
    const sourceNames = Array.from(sourcesMap.keys()).join('; ');
    const date = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    const name = projectName || 'Mining Project';
    const citation = `Estimated using the WRI Environmental Risk Advisor based on: ${sourceNames}. Assessment generated ${date} for ${name}. Data confidence levels and limitations are noted in the full assessment.`;

    try {
      await navigator.clipboard.writeText(citation);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for environments without clipboard API
      setCopied(false);
    }
  };

  const confidenceBadgeVariant = (level: string) => {
    if (level === 'high') return 'default' as const;
    return 'outline' as const;
  };

  return (
    <Card className="bg-muted/20">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-muted-foreground" />
            <CardTitle className="text-base font-medium">{t('sources.title')}</CardTitle>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopyCitation}
            className="gap-1.5"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5" />
                {t('common.copied')}
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                {t('common.copyCitation')}
              </>
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-0 space-y-2">
        <Accordion type="multiple" className="w-full">
          {/* Data Sources */}
          <AccordionItem value="sources">
            <AccordionTrigger className="text-sm">
              <span className="flex items-center gap-2">
                <Database className="w-4 h-4" />
                {t('sources.dataSources')} ({sourcesMap.size})
              </span>
            </AccordionTrigger>
            <AccordionContent>
              <ul className="space-y-3">
                {Array.from(sourcesMap.entries()).map(([source, info]) => (
                  <li key={source} className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <p className="text-sm font-medium">{source}</p>
                      <p className="text-xs text-muted-foreground">
                        {t('sources.usedFor')} {info.categories.join(', ')}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <Badge variant={confidenceBadgeVariant(info.confidence)} className="text-xs">
                        {info.confidence}
                      </Badge>
                      <span className="text-xs text-muted-foreground whitespace-nowrap">
                        {info.lastUpdated}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            </AccordionContent>
          </AccordionItem>

          {/* Methodology */}
          <AccordionItem value="methodology">
            <AccordionTrigger className="text-sm">
              <span className="flex items-center gap-2">
                <FlaskConical className="w-4 h-4" />
                {t('sources.howRisksAssessed')}
              </span>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4">
                {risks.map((risk) => {
                  const method = methodologyByCategory[risk.category];
                  if (!method) return null;
                  return (
                    <div key={risk.category}>
                      <h5 className="text-sm font-medium mb-1">{method.title}</h5>
                      <p className="text-xs text-muted-foreground">{method.description}</p>
                    </div>
                  );
                })}
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Confidence Levels */}
          <AccordionItem value="confidence">
            <AccordionTrigger className="text-sm">
              <span className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4" />
                {t('sources.confidenceLevels')}
              </span>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-3">
                {Object.entries(confidenceDescriptions).map(([level, description]) => (
                  <div key={level} className="flex items-start gap-3">
                    <Badge
                      variant={confidenceBadgeVariant(level)}
                      className="text-xs mt-0.5 capitalize flex-shrink-0"
                    >
                      {level}
                    </Badge>
                    <p className="text-xs text-muted-foreground">{description}</p>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <Alert className="mt-4">
          <Info className="h-4 w-4" />
          <AlertDescription className="text-xs">
            <strong>{t('sources.howToCite')}</strong> {t('sources.citationText', { name: projectName || 'this project' })}
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
}
