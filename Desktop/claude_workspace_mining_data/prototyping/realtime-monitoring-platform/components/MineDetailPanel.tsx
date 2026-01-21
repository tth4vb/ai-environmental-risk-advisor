'use client';

import { Mine } from '@/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { StandardsDetailCard } from './StandardsDetailCard';
import { ProgressLadder } from './ProgressLadder';
import {
  X,
  Eye,
  EyeOff,
  MapPin,
  Building2,
  Calendar,
  Users,
  Shield
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { isWatching, addToWatchlist, removeFromWatchlist } from '@/lib/watchlist';
import { isCertified } from '@/lib/standards-utils';

interface MineDetailPanelProps {
  mine: Mine;
  onClose: () => void;
}

const statusColors = {
  active: 'bg-green-100 text-green-800',
  suspended: 'bg-yellow-100 text-yellow-800',
  closed: 'bg-gray-100 text-gray-800',
  expansion: 'bg-blue-100 text-blue-800'
};

const riskColors = {
  low: 'bg-green-100 text-green-800',
  moderate: 'bg-yellow-100 text-yellow-800',
  high: 'bg-orange-100 text-orange-800',
  critical: 'bg-red-100 text-red-800'
};

export function MineDetailPanel({ mine, onClose }: MineDetailPanelProps) {
  const [watching, setWatching] = useState(false);

  useEffect(() => {
    setWatching(isWatching(mine.id));
  }, [mine.id]);

  const toggleWatch = () => {
    if (watching) {
      removeFromWatchlist(mine.id);
      setWatching(false);
    } else {
      addToWatchlist(mine.id);
      setWatching(true);
    }
  };

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Header */}
      <div className="p-4 border-b">
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-semibold truncate">{mine.name}</h2>
            <p className="text-sm text-muted-foreground">{mine.company}</p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center gap-2 flex-wrap mb-3">
          <Badge variant="outline" className={statusColors[mine.status]}>
            {mine.status}
          </Badge>
          <Badge variant="outline" className="capitalize">
            {mine.commodity}
          </Badge>
          {isCertified(mine) && (
            <Badge variant="outline" style={{ backgroundColor: '#F0AB00' + '20', color: '#F0AB00', borderColor: '#F0AB00' + '40' }}>
              ✓ Certified
            </Badge>
          )}
        </div>

        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span>{mine.region ? `${mine.region}, ` : ''}{mine.country}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Building2 className="h-4 w-4" />
            <span className="capitalize">{mine.mineType.replace('_', ' ')}</span>
          </div>
          {mine.operatingSince && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>Since {mine.operatingSince}</span>
            </div>
          )}
          {mine.nearestCommunityKm && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Users className="h-4 w-4" />
              <span>{mine.nearestCommunityKm} km to community</span>
            </div>
          )}
        </div>

        {mine.nearProtectedArea && (
          <div className="flex items-center gap-2 mt-2 text-amber-600 text-sm">
            <Shield className="h-4 w-4" />
            <span>Near protected area</span>
          </div>
        )}

        {mine.icmmId && (
          <div className="text-xs text-muted-foreground mt-2">
            ICMM ID: {mine.icmmId} • Data confidence: {mine.dataConfidence}
          </div>
        )}

        <div className="flex gap-2 mt-4">
          <Button
            variant={watching ? "default" : "outline"}
            size="sm"
            onClick={toggleWatch}
            className="flex-1"
          >
            {watching ? (
              <>
                <EyeOff className="h-4 w-4 mr-2" />
                Unwatch
              </>
            ) : (
              <>
                <Eye className="h-4 w-4 mr-2" />
                Watch This Mine
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Standards Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Progress Ladder */}
        {mine.progressLevel && (
          <ProgressLadder currentLevel={mine.progressLevel} />
        )}

        {/* Certification Details */}
        <StandardsDetailCard mine={mine} />
      </div>
    </div>
  );
}
