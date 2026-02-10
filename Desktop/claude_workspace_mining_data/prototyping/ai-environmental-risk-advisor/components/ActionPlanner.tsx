'use client';

import { ProjectPhase, ProjectStage } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Calendar,
  CheckCircle,
  Clock,
  FileText,
  Users,
  Shield,
  AlertCircle,
  Download,
  ChevronRight
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { withGlossaryTerms } from '@/lib/glossary-utils';
import { useTranslation } from '@/lib/i18n';

interface ActionPlannerProps {
  phases: ProjectPhase[];
  currentStage: ProjectStage;
}

const statusColors = {
  completed: 'text-muted-foreground',
  current: 'text-primary font-semibold',
  upcoming: 'text-muted-foreground'
};

const statusIcons = {
  completed: CheckCircle,
  current: Clock,
  upcoming: Calendar
};

export function ActionPlanner({ phases, currentStage }: ActionPlannerProps) {
  const { toast } = useToast();
  const { t } = useTranslation();
  const currentPhase = phases.find(p => p.status === 'current');

  const handleDownloadChecklist = () => {
    toast({
      title: t('common.comingSoon'),
      description: t('actionPlanner.checklistDescription'),
    });
  };

  const handleScheduleWorkshop = () => {
    toast({
      title: t('common.comingSoon'),
      description: t('actionPlanner.workshopDescription'),
    });
  };

  return (
    <div className="space-y-6">
      {/* Current Phase Alert */}
      {currentPhase && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {t('actionPlanner.currentPhaseAlert', { name: currentPhase.name })}
          </AlertDescription>
        </Alert>
      )}

      {/* Timeline Overview */}
      <div className="relative">
        <div className="absolute left-8 top-8 bottom-0 w-0.5 bg-border" />
        <div className="space-y-6">
          {phases.map((phase, index) => {
            const StatusIcon = statusIcons[phase.status];
            const isExpanded = phase.status === 'current';

            return (
              <div key={phase.name} className="relative">
                <div className="absolute left-8 -translate-x-1/2 w-4 h-4 rounded-full bg-background border-2 border-border">
                  <StatusIcon className={`w-4 h-4 ${phase.status === 'current' ? 'text-primary' : 'text-muted-foreground'}`} />
                </div>

                <Card className={`ml-16 ${phase.status === 'current' ? 'border-primary' : ''}`}>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className={`text-lg ${statusColors[phase.status]}`}>
                          {phase.name}
                        </CardTitle>
                        <CardDescription>{phase.estimatedDate}</CardDescription>
                      </div>
                      <Badge variant={phase.status === 'current' ? 'default' : 'secondary'}>
                        {phase.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">{withGlossaryTerms(phase.description)}</p>
                  </CardHeader>

                  {(isExpanded || phase.status === 'upcoming') && (
                    <CardContent>
                      <Tabs defaultValue="actions" className="w-full">
                        <TabsList className="grid w-full grid-cols-3">
                          <TabsTrigger value="actions">
                            <Users className="w-4 h-4 mr-1" />
                            {t('actionPlanner.tabActions')}
                          </TabsTrigger>
                          <TabsTrigger value="documents">
                            <FileText className="w-4 h-4 mr-1" />
                            {t('actionPlanner.tabDocuments')}
                          </TabsTrigger>
                          <TabsTrigger value="rights">
                            <Shield className="w-4 h-4 mr-1" />
                            {t('actionPlanner.tabRights')}
                          </TabsTrigger>
                        </TabsList>

                        <TabsContent value="actions" className="mt-4 space-y-2">
                          <h4 className="text-sm font-medium mb-2">{t('actionPlanner.communityActions')}</h4>
                          <ul className="space-y-2">
                            {phase.communityActions.map((action, i) => (
                              <li key={i} className="flex items-start gap-2 text-sm">
                                <ChevronRight className="w-4 h-4 mt-0.5 text-muted-foreground flex-shrink-0" />
                                <span>{withGlossaryTerms(action)}</span>
                              </li>
                            ))}
                          </ul>
                        </TabsContent>

                        <TabsContent value="documents" className="mt-4 space-y-2">
                          <h4 className="text-sm font-medium mb-2">{t('actionPlanner.documentsToRequest')}</h4>
                          <ul className="space-y-2">
                            {phase.documentsNeeded.map((doc, i) => (
                              <li key={i} className="flex items-start gap-2 text-sm">
                                <FileText className="w-4 h-4 mt-0.5 text-muted-foreground flex-shrink-0" />
                                <span>{withGlossaryTerms(doc)}</span>
                              </li>
                            ))}
                          </ul>
                        </TabsContent>

                        <TabsContent value="rights" className="mt-4 space-y-2">
                          <h4 className="text-sm font-medium mb-2">{t('actionPlanner.yourRights')}</h4>
                          <ul className="space-y-2">
                            {phase.rights.map((right, i) => (
                              <li key={i} className="flex items-start gap-2 text-sm">
                                <Shield className="w-4 h-4 mt-0.5 text-muted-foreground flex-shrink-0" />
                                <span>{withGlossaryTerms(right)}</span>
                              </li>
                            ))}
                          </ul>
                        </TabsContent>
                      </Tabs>

                      {phase.status === 'current' && (
                        <div className="flex gap-2 mt-4">
                          <Button size="sm" variant="outline" onClick={handleDownloadChecklist}>
                            <Download className="w-4 h-4 mr-1" />
                            {t('actionPlanner.downloadChecklist')}
                          </Button>
                          <Button size="sm" variant="outline" onClick={handleScheduleWorkshop}>
                            <Users className="w-4 h-4 mr-1" />
                            {t('actionPlanner.scheduleWorkshop')}
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  )}
                </Card>
              </div>
            );
          })}
        </div>
      </div>

      {/* Key Principles */}
      <Card className="bg-muted/30">
        <CardHeader>
          <CardTitle className="text-base">{t('actionPlanner.keyPrinciples')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p>&bull; <strong>{t('actionPlanner.documentEverything')}</strong> {t('actionPlanner.documentEverythingDesc')}</p>
          <p>&bull; <strong>{t('actionPlanner.actCollectively')}</strong> {t('actionPlanner.actCollectivelyDesc')}</p>
          <p>&bull; <strong>{t('actionPlanner.knowYourRights')}</strong> {t('actionPlanner.knowYourRightsDesc')}</p>
          <p>&bull; <strong>{t('actionPlanner.seekIndependent')}</strong> {t('actionPlanner.seekIndependentDesc')}</p>
          <p>&bull; <strong>{t('actionPlanner.planLongTerm')}</strong> {t('actionPlanner.planLongTermDesc')}</p>
        </CardContent>
      </Card>
    </div>
  );
}
