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
  const currentPhase = phases.find(p => p.status === 'current');

  const handleDownloadChecklist = () => {
    toast({
      title: "Coming Soon",
      description: "Download a printable checklist for this phase with all actions and documents needed.",
    });
  };

  const handleScheduleWorkshop = () => {
    toast({
      title: "Coming Soon",
      description: "Schedule a community workshop to prepare for this project phase together.",
    });
  };

  return (
    <div className="space-y-6">
      {/* Current Phase Alert */}
      {currentPhase && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <strong>Current Phase:</strong> {currentPhase.name} - This is a critical time for community action. 
            Review the actions below and ensure your community is prepared.
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
                            Actions
                          </TabsTrigger>
                          <TabsTrigger value="documents">
                            <FileText className="w-4 h-4 mr-1" />
                            Documents
                          </TabsTrigger>
                          <TabsTrigger value="rights">
                            <Shield className="w-4 h-4 mr-1" />
                            Rights
                          </TabsTrigger>
                        </TabsList>
                        
                        <TabsContent value="actions" className="mt-4 space-y-2">
                          <h4 className="text-sm font-medium mb-2">Community Actions:</h4>
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
                          <h4 className="text-sm font-medium mb-2">Documents to Request:</h4>
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
                          <h4 className="text-sm font-medium mb-2">Your Rights:</h4>
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
                            Download Checklist
                          </Button>
                          <Button size="sm" variant="outline" onClick={handleScheduleWorkshop}>
                            <Users className="w-4 h-4 mr-1" />
                            Schedule Workshop
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
          <CardTitle className="text-base">Key Principles for Community Action</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p>• <strong>Document Everything:</strong> Keep records of all communications, meetings, and observations</p>
          <p>• <strong>Act Collectively:</strong> Unite with neighboring communities for stronger negotiating position</p>
          <p>• <strong>Know Your Rights:</strong> Understand legal protections before entering any agreements</p>
          <p>• <strong>Seek Independent Advice:</strong> Don&apos;t rely solely on company-provided information</p>
          <p>• <strong>Plan for Long-term:</strong> Consider impacts beyond the mining project&apos;s lifespan</p>
        </CardContent>
      </Card>
    </div>
  );
}