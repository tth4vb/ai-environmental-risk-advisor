'use client';

import { Mine } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X, TrendingUp, Award, FileText, AlertCircle, Info } from 'lucide-react';
import { isCertified, getProgressLevelInfo } from '@/lib/standards-utils';

interface SummaryStatisticsPanelProps {
  mines: Mine[];
  onClose: () => void;
}

export function SummaryStatisticsPanel({ mines, onClose }: SummaryStatisticsPanelProps) {
  // Calculate statistics
  const totalMines = mines.length;
  const certifiedMines = mines.filter(isCertified);
  const certifiedCount = certifiedMines.length;
  const certifiedPercent = Math.round((certifiedCount / totalMines) * 100);

  const inProgressCount = mines.filter(m =>
    m.progressLevel === 'verification' || m.progressLevel === 'self_assessment'
  ).length;
  const inProgressPercent = Math.round((inProgressCount / totalMines) * 100);

  const transparencyCount = mines.filter(m =>
    m.progressLevel === 'disclosure' || m.progressLevel === 'baseline'
  ).length;
  const transparencyPercent = Math.round((transparencyCount / totalMines) * 100);

  const unknownCount = mines.filter(m => !m.progressLevel || m.progressLevel === 'unknown').length;
  const unknownPercent = Math.round((unknownCount / totalMines) * 100);

  // Progress level breakdown
  const progressBreakdown = [
    { level: 'certified', count: mines.filter(m => m.progressLevel === 'certified').length },
    { level: 'advanced', count: mines.filter(m => m.progressLevel === 'advanced').length },
    { level: 'verification', count: mines.filter(m => m.progressLevel === 'verification').length },
    { level: 'self_assessment', count: mines.filter(m => m.progressLevel === 'self_assessment').length },
    { level: 'disclosure', count: mines.filter(m => m.progressLevel === 'disclosure').length },
    { level: 'baseline', count: mines.filter(m => m.progressLevel === 'baseline').length },
    { level: 'unknown', count: unknownCount },
  ].filter(item => item.count > 0);

  // Top commodities
  const commodityCounts: Record<string, number> = {};
  mines.forEach(mine => {
    commodityCounts[mine.commodity] = (commodityCounts[mine.commodity] || 0) + 1;
  });
  const topCommodities = Object.entries(commodityCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  return (
    <div className="w-96 border-l bg-background overflow-hidden flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b bg-gradient-to-r from-amber-50 via-blue-50 to-green-50 border-[#F0AB00]/20">
        <div className="flex items-start justify-between mb-2">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Global Mining Standards</h2>
            <p className="text-sm text-gray-600">Summary Statistics</p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Content - Scrollable */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Key Statistics */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Key Statistics
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium">Total Mines</span>
                <span className="text-2xl font-bold">{totalMines.toLocaleString()}</span>
              </div>
            </div>

            <div className="pt-3 border-t">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Award className="h-4 w-4" style={{ color: '#F0AB00' }} />
                  <span className="text-sm font-medium">Certified</span>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold" style={{ color: '#F0AB00' }}>{certifiedCount.toLocaleString()}</div>
                  <div className="text-xs text-muted-foreground">{certifiedPercent}%</div>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="h-2 rounded-full transition-all"
                  style={{ width: `${certifiedPercent}%`, backgroundColor: '#F0AB00' }}
                />
              </div>
            </div>

            <div className="pt-3 border-t">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-blue-600">In Progress</span>
                <div className="text-right">
                  <div className="text-lg font-bold text-blue-600">{inProgressCount.toLocaleString()}</div>
                  <div className="text-xs text-muted-foreground">{inProgressPercent}%</div>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full transition-all"
                  style={{ width: `${inProgressPercent}%` }}
                />
              </div>
            </div>

            <div className="pt-3 border-t">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-amber-600">Some Transparency</span>
                <div className="text-right">
                  <div className="text-lg font-bold text-amber-600">{transparencyCount.toLocaleString()}</div>
                  <div className="text-xs text-muted-foreground">{transparencyPercent}%</div>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-gray-400" />
                  <span className="text-sm font-medium text-gray-600">Unknown</span>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-gray-600">{unknownCount.toLocaleString()}</div>
                  <div className="text-xs text-muted-foreground">{unknownPercent}%</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Progress Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Progress Level Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {progressBreakdown.map(({ level, count }) => {
                const info = getProgressLevelInfo(level as any);
                const percent = Math.round((count / totalMines) * 100);
                return (
                  <div key={level} className="flex items-center justify-between text-sm">
                    <div className="flex-1">
                      <div className="font-medium">{info.label}</div>
                      <div className="text-xs text-muted-foreground">{info.description}</div>
                    </div>
                    <div className="text-right ml-4">
                      <div className="font-medium">{count.toLocaleString()}</div>
                      <div className="text-xs text-muted-foreground">{percent}%</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Top Commodities */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Top Commodities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {topCommodities.map(([commodity, count]) => {
                const percent = Math.round((count / totalMines) * 100);
                return (
                  <div key={commodity} className="flex items-center justify-between text-sm">
                    <span className="capitalize font-medium">{commodity}</span>
                    <div className="text-right">
                      <span className="font-medium">{count.toLocaleString()}</span>
                      <span className="text-xs text-muted-foreground ml-2">({percent}%)</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Data Sources */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Global Data Sources
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm">
              <div>
                <div className="font-medium">ICMM Global Mine Asset Database</div>
                <div className="text-xs text-muted-foreground mt-1">
                  Base mine location and operational data (Sept 2025)
                </div>
              </div>
              <div className="pt-2 border-t">
                <div className="font-medium">The Copper Mark Registry</div>
                <div className="text-xs text-muted-foreground mt-1">
                  Copper and nickel certification status
                </div>
              </div>
              <div className="pt-2 border-t">
                <div className="font-medium">IRMA (Initiative for Responsible Mining Assurance)</div>
                <div className="text-xs text-muted-foreground mt-1">
                  Independent third-party mine certifications
                </div>
              </div>
              <div className="pt-2 border-t">
                <div className="font-medium">Company ESG Disclosures</div>
                <div className="text-xs text-muted-foreground mt-1">
                  Annual reports, sustainability reports, CDP disclosures
                </div>
              </div>
              <div className="pt-2 border-t">
                <div className="font-medium">National Mining Registries</div>
                <div className="text-xs text-muted-foreground mt-1">
                  Regulatory compliance and licensing data
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* About */}
        <div className="p-3 rounded-lg text-sm" style={{ backgroundColor: '#F0AB00' + '15' }}>
          <div className="flex items-start gap-2">
            <Info className="h-4 w-4 mt-0.5 flex-shrink-0" style={{ color: '#003F6A' }} />
            <div>
              <p className="font-medium" style={{ color: '#003F6A' }}>About this data</p>
              <p className="text-xs mt-1 text-gray-700">
                WRI tracks the share of critical mineral production from certified mines
                to measure progress toward responsible mining practices. Click any mine
                marker to see detailed certification information and data sources.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
