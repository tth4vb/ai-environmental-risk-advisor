'use client';

import { useState } from 'react';
import { ProjectMapInput } from '@/components/ProjectMapInput';
import { Shield, MapPin, ClipboardList, FileCheck } from 'lucide-react';

const steps = [
  { label: 'Pick location', icon: MapPin },
  { label: 'Add details', icon: ClipboardList },
  { label: 'Get assessment', icon: FileCheck },
];

export default function Home() {
  const [currentStep, setCurrentStep] = useState(0);

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b px-4 py-3">
        <div className="container mx-auto flex items-center gap-2">
          <Shield className="w-6 h-6 text-primary" />
          <h1 className="text-xl font-bold">Community Environmental Risk Advisor</h1>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-white border-b">
        <div className="container mx-auto px-4 py-8">
          <h2 className="text-3xl font-bold tracking-tight mb-2">
            Understand the environmental risks of a mining project
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mb-8">
            Select a location on the map or choose a case study, fill in project details, and get an independent environmental risk assessment in minutes.
          </p>

          {/* Step Indicator */}
          <div className="flex items-center gap-2">
            {steps.map((step, i) => {
              const Icon = step.icon;
              const isActive = i === currentStep;
              const isCompleted = i < currentStep;
              return (
                <div key={step.label} className="flex items-center gap-2">
                  {i > 0 && (
                    <div
                      className={`w-8 h-px ${
                        isCompleted ? 'bg-primary' : 'bg-gray-200'
                      }`}
                    />
                  )}
                  <div
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-primary text-primary-foreground'
                        : isCompleted
                        ? 'bg-primary/10 text-primary'
                        : 'bg-gray-100 text-muted-foreground'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {step.label}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        <ProjectMapInput onStepChange={setCurrentStep} />
      </div>
    </main>
  );
}
