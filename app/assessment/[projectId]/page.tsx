'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { MiningProject } from '@/types';
import { AssessmentDashboard } from '@/components/AssessmentDashboard';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

export default function AssessmentPage() {
  const params = useParams();
  const [project, setProject] = useState<MiningProject | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading project data
    const loadProject = async () => {
      setLoading(true);
      
      // Get project from sessionStorage (in real app, would fetch from API)
      const storedProject = sessionStorage.getItem('currentProject');
      
      if (storedProject) {
        const projectData = JSON.parse(storedProject);
        // Ensure the project ID matches
        if (projectData.id === params.projectId) {
          setProject(projectData);
        }
      }
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      setLoading(false);
    };

    loadProject();
  }, [params.projectId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Analyzing environmental data...</span>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card>
          <CardContent className="pt-6">
            <p>Project not found. Please start a new assessment.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <AssessmentDashboard project={project} />;
}