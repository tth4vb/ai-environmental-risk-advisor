'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Mountain, Droplets, MousePointerClick } from 'lucide-react';
import { SampleMine } from '@/lib/dummy-data';
import { MINERAL_COLORS } from '@/lib/constants';

interface CaseStudySelectorProps {
  samples: SampleMine[];
  onSelect: (sample: SampleMine) => void;
  selectedId?: string;
}

const mineralIcons: Record<string, React.ReactNode> = {
  lithium: <Droplets className="w-4 h-4" />,
  copper: <Mountain className="w-4 h-4" />,
  nickel: <Mountain className="w-4 h-4" />,
  cobalt: <Mountain className="w-4 h-4" />,
};

export function CaseStudySelector({ samples, onSelect, selectedId }: CaseStudySelectorProps) {
  return (
    <div className="space-y-3">
      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-1">Sample Case Studies</h3>
        <p className="text-sm text-muted-foreground">
          Select a mining project to explore
        </p>
      </div>

      {samples.map((sample) => (
        <Card
          key={sample.id}
          className={`cursor-pointer transition-all hover:shadow-md ${
            selectedId === sample.id
              ? 'ring-2 ring-primary shadow-md'
              : 'hover:border-primary/50'
          }`}
          onClick={() => onSelect(sample)}
        >
          <CardContent className="p-3">
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <h4 className="font-semibold text-sm mb-1">{sample.name}</h4>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <MapPin className="w-3 h-3" />
                  <span>{sample.location}</span>
                </div>
              </div>
              <div className={`p-1.5 rounded-lg ${MINERAL_COLORS[sample.mineralType]}`}>
                {mineralIcons[sample.mineralType]}
              </div>
            </div>

            <Badge
              variant="secondary"
              className={`text-xs ${MINERAL_COLORS[sample.mineralType]}`}
            >
              {sample.mineralType.charAt(0).toUpperCase() + sample.mineralType.slice(1)}
            </Badge>

            {selectedId === sample.id && (
              <p className="text-xs text-muted-foreground mt-2 line-clamp-2">
                {sample.description}
              </p>
            )}
          </CardContent>
        </Card>
      ))}

      {/* "Or click the map" hint */}
      <div className="pt-3 mt-3 border-t">
        <p className="text-xs text-muted-foreground flex items-center gap-1.5">
          <MousePointerClick className="w-4 h-4" />
          Or click anywhere on the map to place your own marker
        </p>
      </div>
    </div>
  );
}
