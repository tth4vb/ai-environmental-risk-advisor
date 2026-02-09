'use client';

import { MiningProject, RiskAssessment } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { TrendingUp, TrendingDown, Minus, Info } from 'lucide-react';

interface ComparativeAnalysisProps {
  project: MiningProject;
  risks: RiskAssessment[];
}

export function ComparativeAnalysis({ project, risks }: ComparativeAnalysisProps) {
  // Mock comparative data
  const comparisons = [
    {
      metric: 'Water Usage',
      yourProject: project.mineralType === 'lithium' ? '2M L/day' : '500K L/day',
      regional: project.mineralType === 'lithium' ? '1.5M L/day' : '600K L/day',
      global: project.mineralType === 'lithium' ? '1.8M L/day' : '450K L/day',
      trend: project.mineralType === 'lithium' ? 'higher' : 'average'
    },
    {
      metric: 'Land Footprint',
      yourProject: project.size === 'large' ? '1,500 ha' : '300 ha',
      regional: '800 ha',
      global: '650 ha',
      trend: project.size === 'large' ? 'higher' : 'lower'
    },
    {
      metric: 'Community Distance',
      yourProject: project.communityDistance === 'near' ? '<5 km' : '>10 km',
      regional: '8 km',
      global: '12 km',
      trend: project.communityDistance === 'near' ? 'concerning' : 'average'
    },
    {
      metric: 'Protected Areas',
      yourProject: project.hasProtectedAreas ? 'Overlaps' : 'No overlap',
      regional: '15% overlap',
      global: '10% overlap',
      trend: project.hasProtectedAreas ? 'concerning' : 'better'
    }
  ];

  const similarProjects = [
    {
      name: 'Escondida Copper Mine',
      location: 'Chile',
      similarity: 'high',
      outcome: 'Severe water conflicts, community protests',
      lesson: 'Water-sharing agreements essential from start'
    },
    {
      name: 'Grasberg Mine',
      location: 'Indonesia', 
      similarity: 'medium',
      outcome: 'Environmental damage, tailings failures',
      lesson: 'Independent monitoring critical'
    },
    {
      name: 'Jáchal Lithium',
      location: 'Argentina',
      similarity: 'high',
      outcome: 'Groundwater depletion, ecosystem collapse',
      lesson: 'Baseline studies must be comprehensive'
    }
  ];

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'higher':
      case 'concerning':
        return <TrendingUp className="w-4 h-4 text-destructive" />;
      case 'lower':
      case 'better':
        return <TrendingDown className="w-4 h-4 text-success" />;
      default:
        return <Minus className="w-4 h-4 text-muted-foreground" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Metrics Comparison */}
      <Card>
        <CardHeader>
          <CardTitle>Project Comparison</CardTitle>
          <CardDescription>
            How this project compares to regional and global averages
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b text-sm">
                  <th className="text-left py-2">Metric</th>
                  <th className="text-center py-2">This Project</th>
                  <th className="text-center py-2">Regional Avg</th>
                  <th className="text-center py-2">Global Avg</th>
                  <th className="text-center py-2">Trend</th>
                </tr>
              </thead>
              <tbody>
                {comparisons.map((comp) => (
                  <tr key={comp.metric} className="border-b">
                    <td className="py-3 text-sm font-medium">{comp.metric}</td>
                    <td className="py-3 text-center">
                      <Badge variant={comp.trend === 'concerning' || comp.trend === 'higher' ? 'destructive' : 'secondary'}>
                        {comp.yourProject}
                      </Badge>
                    </td>
                    <td className="py-3 text-center text-sm text-muted-foreground">{comp.regional}</td>
                    <td className="py-3 text-center text-sm text-muted-foreground">{comp.global}</td>
                    <td className="py-3 text-center">{getTrendIcon(comp.trend)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Similar Projects */}
      <Card>
        <CardHeader>
          <CardTitle>Learn from Similar Projects</CardTitle>
          <CardDescription>
            Historical outcomes from comparable mining operations
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {similarProjects.map((proj) => (
            <div key={proj.name} className="border rounded-lg p-4 space-y-2">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-medium">{proj.name}</h4>
                  <p className="text-sm text-muted-foreground">{proj.location}</p>
                </div>
                <Badge variant={proj.similarity === 'high' ? 'default' : 'secondary'}>
                  {proj.similarity} similarity
                </Badge>
              </div>
              <div className="space-y-1 text-sm">
                <p><strong>Outcome:</strong> {proj.outcome}</p>
                <p><strong>Key Lesson:</strong> {proj.lesson}</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Insights Alert */}
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          <strong>Key Insight:</strong> Projects with similar characteristics to yours have faced significant challenges. 
          Early community organization and independent monitoring have been critical success factors for protecting community interests.
        </AlertDescription>
      </Alert>
    </div>
  );
}