'use client';

import { useState, useEffect } from 'react';
import { Mine, ProgressLadderLevel } from '@/types';
import { realMines } from '@/lib/real-mines';
import { MineMap } from '@/components/MineMap';
import { MineDetailPanel } from '@/components/MineDetailPanel';
import { SummaryStatisticsPanel } from '@/components/SummaryStatisticsPanel';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Filter,
  Search,
  Eye,
  AlertTriangle,
  X,
  ChevronDown,
  Award,
  BarChart3
} from 'lucide-react';
import { getWatchlist } from '@/lib/watchlist';
import { isCertified } from '@/lib/standards-utils';

type FilterCommodity = 'all' | 'copper' | 'lithium' | 'nickel' | 'cobalt' | 'gold' | 'silver' | 'iron ore' | 'coal';
type FilterCertification = 'all' | 'certified' | 'in_progress' | 'not_certified';
type FilterProgressLevel = 'all' | ProgressLadderLevel;

export default function Home() {
  const [selectedMine, setSelectedMine] = useState<Mine | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [showSummary, setShowSummary] = useState(true); // Show summary panel by default
  const [commodityFilter, setCommodityFilter] = useState<FilterCommodity>('all');
  const [certificationFilter, setCertificationFilter] = useState<FilterCertification>('all');
  const [progressLevelFilter, setProgressLevelFilter] = useState<FilterProgressLevel>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [watchedMines, setWatchedMines] = useState<string[]>([]);

  useEffect(() => {
    const watchlist = getWatchlist();
    setWatchedMines(watchlist.map(w => w.mineId));
  }, [selectedMine]);

  const filteredMines = realMines.filter(mine => {
    // Commodity filter
    if (commodityFilter !== 'all' && mine.commodity !== commodityFilter) return false;

    // Certification filter
    if (certificationFilter !== 'all') {
      if (certificationFilter === 'certified' && !isCertified(mine)) return false;
      if (certificationFilter === 'in_progress' && mine.progressLevel !== 'verification') return false;
      if (certificationFilter === 'not_certified' && isCertified(mine)) return false;
    }

    // Progress level filter
    if (progressLevelFilter !== 'all' && mine.progressLevel !== progressLevelFilter) {
      return false;
    }

    // Search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        mine.name.toLowerCase().includes(query) ||
        mine.company.toLowerCase().includes(query) ||
        mine.country.toLowerCase().includes(query)
      );
    }

    return true;
  });

  return (
    <main className="h-screen flex flex-col">
      {/* Header */}
      <header className="bg-background border-b px-4 py-3 flex items-center justify-between z-10">
        <div className="flex items-center gap-3">
          <div>
            <h1 className="text-xl font-semibold text-gray-800">Responsible Mining Tracker</h1>
            <p className="text-xs text-muted-foreground">WRI Polsky Center for the Global Energy Transition</p>
          </div>
          <Badge variant="outline" className="text-xs bg-amber-50 text-amber-700 border-amber-200">
            Prototype
          </Badge>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant={showSummary ? "secondary" : "outline"}
            size="sm"
            onClick={() => setShowSummary(!showSummary)}
          >
            <BarChart3 className="h-4 w-4 mr-1" />
            Summary
          </Button>
          {watchedMines.length > 0 && (
            <Badge variant="secondary" className="flex items-center gap-1">
              <Eye className="h-3 w-3" />
              {watchedMines.length} watched
            </Badge>
          )}
        </div>
      </header>

      {/* Search and Filters */}
      <div className="bg-background border-b px-4 py-2 z-10">
        <div className="flex items-center gap-2">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search mines, companies, or countries..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                <X className="h-4 w-4 text-muted-foreground" />
              </button>
            )}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="h-4 w-4 mr-1" />
            Filters
            <ChevronDown className={`h-4 w-4 ml-1 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
          </Button>

          <span className="text-sm text-muted-foreground">
            {filteredMines.length} mine{filteredMines.length !== 1 ? 's' : ''}
          </span>
        </div>

        {showFilters && (
          <div className="space-y-3 mt-3 pb-1">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Commodity:</span>
                <select
                  value={commodityFilter}
                  onChange={(e) => setCommodityFilter(e.target.value as FilterCommodity)}
                  className="text-sm border rounded px-2 py-1"
                >
                  <option value="all">All</option>
                  <option value="gold">Gold</option>
                  <option value="copper">Copper</option>
                  <option value="iron ore">Iron Ore</option>
                  <option value="coal">Coal</option>
                  <option value="lithium">Lithium</option>
                  <option value="nickel">Nickel</option>
                  <option value="cobalt">Cobalt</option>
                  <option value="silver">Silver</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Certification:</span>
                <select
                  value={certificationFilter}
                  onChange={(e) => setCertificationFilter(e.target.value as FilterCertification)}
                  className="text-sm border rounded px-2 py-1"
                >
                  <option value="all">All mines</option>
                  <option value="certified">Certified</option>
                  <option value="in_progress">Verification in progress</option>
                  <option value="not_certified">Not certified</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Progress:</span>
                <select
                  value={progressLevelFilter}
                  onChange={(e) => setProgressLevelFilter(e.target.value as FilterProgressLevel)}
                  className="text-sm border rounded px-2 py-1"
                >
                  <option value="all">All levels</option>
                  <option value="advanced">Advanced</option>
                  <option value="certified">Certified</option>
                  <option value="verification">Verification</option>
                  <option value="self_assessment">Self-Assessment</option>
                  <option value="disclosure">Disclosure</option>
                  <option value="baseline">Baseline</option>
                  <option value="unknown">Unknown</option>
                </select>
              </div>

              {(commodityFilter !== 'all' || certificationFilter !== 'all' || progressLevelFilter !== 'all') && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setCommodityFilter('all');
                    setCertificationFilter('all');
                    setProgressLevelFilter('all');
                  }}
                >
                  Clear filters
                </Button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Certification Statistics Banner */}
      {filteredMines.length > 0 && (
        <div className="px-4 py-3 border-b z-10" style={{ backgroundColor: '#F0AB00' + '10', borderColor: '#F0AB00' + '30' }}>
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-3">
              <Award className="h-5 w-5 flex-shrink-0" style={{ color: '#F0AB00' }} />
              <div>
                <div className="font-semibold text-gray-900">
                  {filteredMines.filter(isCertified).length} of {filteredMines.length} mines
                  ({filteredMines.length > 0 ? Math.round((filteredMines.filter(isCertified).length / filteredMines.length) * 100) : 0}%)
                  are third-party certified
                </div>
                <div className="text-xs text-gray-600">
                  {filteredMines.filter(m => m.progressLevel && m.progressLevel !== 'unknown').length} mines have some transparency •
                  {' '}{filteredMines.filter(m => !m.progressLevel || m.progressLevel === 'unknown').length} with no public data
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Map */}
        <div className="flex-1 relative">
          <MineMap
            mines={filteredMines}
            selectedMineId={selectedMine?.id}
            onMineSelect={(mine) => {
              setSelectedMine(mine);
              setShowSummary(false); // Close summary when selecting a mine
            }}
          />
        </div>

        {/* Summary Statistics Panel */}
        {showSummary && !selectedMine && (
          <div className="w-96 border-l bg-background overflow-hidden">
            <SummaryStatisticsPanel
              mines={filteredMines}
              onClose={() => setShowSummary(false)}
            />
          </div>
        )}

        {/* Detail Panel */}
        {selectedMine && (
          <div className="w-96 border-l bg-background overflow-hidden">
            <MineDetailPanel
              mine={selectedMine}
              onClose={() => setSelectedMine(null)}
            />
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="border-t bg-gray-50 px-4 py-3">
        <div className="flex items-center justify-between text-sm">
          <div>
            <p className="font-medium text-gray-900">A tool by the WRI Polsky Center for the Global Energy Transition</p>
            <p className="text-xs text-gray-600 mt-1">
              © 2026 World Resources Institute. All rights reserved.
            </p>
          </div>
          <div className="flex gap-4 text-xs">
            <a href="#" className="text-gray-600 hover:text-gray-900 hover:underline">About</a>
            <a href="#" className="text-gray-600 hover:text-gray-900 hover:underline">Data Sources</a>
            <a href="#" className="text-gray-600 hover:text-gray-900 hover:underline">Contact</a>
          </div>
        </div>
      </footer>
    </main>
  );
}
