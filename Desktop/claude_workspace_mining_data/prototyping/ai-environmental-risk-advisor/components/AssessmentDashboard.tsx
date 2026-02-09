'use client';

import { useState } from 'react';
import { MiningProject } from '@/types';
import { getRiskAssessments, getProjectPhases } from '@/lib/dummy-data';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  AlertCircle,
  BarChart3,
  BookOpen,
  Calendar,
  Download,
  ArrowLeft,
  Share2
} from 'lucide-react';
import { RiskOverview } from './RiskOverview';
import { ActionPlanner } from './ActionPlanner';
import { DataVisualizations } from './visualizations/DataVisualizations';
import { LearnSection } from './LearnSection';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';

interface AssessmentDashboardProps {
  project: MiningProject;
}

export function AssessmentDashboard({ project }: AssessmentDashboardProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const { toast } = useToast();
  
  const risks = getRiskAssessments(project);
  const phases = getProjectPhases(project);

  const handleShare = () => {
    toast({
      title: "Coming Soon",
      description: "Share functionality will allow you to collaborate with community members and advisors.",
    });
  };

  const handleDownload = () => {
    toast({
      title: "Coming Soon", 
      description: "Download full assessment report as PDF with all data and recommendations.",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <Link href="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Start
              </Button>
            </Link>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleShare}>
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
              <Button variant="outline" size="sm" onClick={handleDownload}>
                <Download className="w-4 h-4 mr-2" />
                Download Report
              </Button>
            </div>
          </div>
          
          <div className="space-y-2">
            <h1 className="text-3xl font-bold">Environmental Risk Assessment</h1>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">
                {project.projectName || `${project.mineralType} Mining Project`}
              </Badge>
              <Badge variant="outline">
                {project.location.nearestCity}, {project.location.region}
              </Badge>
              <Badge variant="outline">
                {project.stage.replace('-', ' ')}
              </Badge>
              {project.companyName && (
                <Badge variant="outline">{project.companyName}</Badge>
              )}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid grid-cols-2 sm:grid-cols-4 gap-2 h-auto">
            <TabsTrigger value="overview" className="flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              <span className="hidden sm:inline">Risk Overview</span>
              <span className="sm:hidden">Risks</span>
            </TabsTrigger>
            <TabsTrigger value="data" className="flex items-center gap-1">
              <BarChart3 className="w-4 h-4" />
              <span className="hidden sm:inline">Explore Data</span>
              <span className="sm:hidden">Data</span>
            </TabsTrigger>
            <TabsTrigger value="actions" className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span className="hidden sm:inline">Your Action Plan</span>
              <span className="sm:hidden">Actions</span>
            </TabsTrigger>
            <TabsTrigger value="learn" className="flex items-center gap-1">
              <BookOpen className="w-4 h-4" />
              <span className="hidden sm:inline">Learn</span>
              <span className="sm:hidden">Learn</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Environmental Risk Summary</CardTitle>
                <CardDescription>
                  Independent assessment based on publicly available data and environmental standards
                </CardDescription>
              </CardHeader>
              <CardContent>
                <RiskOverview risks={risks} projectName={project.projectName || `${project.mineralType} Mining Project`} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="data" className="space-y-6">
            <DataVisualizations project={project} risks={risks} />
          </TabsContent>

          <TabsContent value="actions" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Your Action Plan</CardTitle>
                <CardDescription>
                  Know your rights and what actions to take at each project phase
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ActionPlanner phases={phases} currentStage={project.stage} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="learn" className="space-y-6">
            <LearnSection />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}