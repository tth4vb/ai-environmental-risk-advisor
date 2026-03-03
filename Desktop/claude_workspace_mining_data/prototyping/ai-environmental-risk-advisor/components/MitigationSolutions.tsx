'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Droplets,
  Trees,
  Users,
  MapPin,
  Wheat,
  Building2,
  Landmark,
  Clock,
  Lightbulb,
} from 'lucide-react';
import { RiskAssessment, StakeholderRole } from '@/types';
import { useTranslation } from '@/lib/i18n';

interface MitigationSolutionsProps {
  risks: RiskAssessment[];
}

const riskIcons: Record<string, React.ElementType> = {
  water: Droplets,
  biodiversity: Trees,
  'community-displacement': Users,
  'indigenous-lands': MapPin,
  'food-security': Wheat,
};

const stakeholderIcons: Record<StakeholderRole, React.ElementType> = {
  community: Users,
  company: Building2,
  government: Landmark,
};

const stakeholderColors: Record<StakeholderRole, string> = {
  community: 'text-blue-600 bg-blue-50 border-blue-200',
  company: 'text-amber-600 bg-amber-50 border-amber-200',
  government: 'text-emerald-600 bg-emerald-50 border-emerald-200',
};

const stakeholderHeaderColors: Record<StakeholderRole, string> = {
  community: 'text-blue-700',
  company: 'text-amber-700',
  government: 'text-emerald-700',
};

const riskBadgeVariants = {
  low: 'outline' as const,
  medium: 'outline' as const,
  high: 'destructive' as const,
  critical: 'destructive' as const,
};

const priorityDots: Record<string, string> = {
  high: 'bg-destructive',
  medium: 'bg-warning',
  low: 'bg-muted-foreground',
};

type FilterOption = 'all' | StakeholderRole;

export function MitigationSolutions({ risks }: MitigationSolutionsProps) {
  const { t } = useTranslation();
  const [filter, setFilter] = useState<FilterOption>('all');

  const filters: { key: FilterOption; label: string; icon?: React.ElementType }[] = [
    { key: 'all', label: t('solutions.filterAll') },
    { key: 'community', label: t('mitigation.community'), icon: Users },
    { key: 'company', label: t('mitigation.company'), icon: Building2 },
    { key: 'government', label: t('mitigation.government'), icon: Landmark },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-primary" />
            <CardTitle>{t('solutions.title')}</CardTitle>
          </div>
          <CardDescription>
            {t('solutions.subtitle')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Filter pills */}
          <div className="flex flex-wrap gap-2">
            {filters.map(({ key, label, icon: FilterIcon }) => (
              <Button
                key={key}
                variant={filter === key ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter(key)}
                className="gap-1.5"
              >
                {FilterIcon && <FilterIcon className="w-3.5 h-3.5" />}
                {label}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Per-risk mitigation cards */}
      {risks.map((risk) => {
        const Icon = riskIcons[risk.category];
        const filteredActions = filter === 'all'
          ? risk.mitigation.actions
          : risk.mitigation.actions.filter(a => a.stakeholder === filter);

        if (filteredActions.length === 0) return null;

        // Group actions by stakeholder
        const groupedActions: Record<StakeholderRole, typeof filteredActions> = {
          community: filteredActions.filter(a => a.stakeholder === 'community'),
          company: filteredActions.filter(a => a.stakeholder === 'company'),
          government: filteredActions.filter(a => a.stakeholder === 'government'),
        };

        return (
          <Card key={risk.category} className="overflow-hidden">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Icon className="w-5 h-5" />
                  <CardTitle className="text-lg">{risk.title}</CardTitle>
                </div>
                <Badge variant={riskBadgeVariants[risk.level]}>
                  {risk.level.toUpperCase()} RISK
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Three-column stakeholder layout on larger screens */}
              <div className="grid gap-4 md:grid-cols-3">
                {(['community', 'company', 'government'] as StakeholderRole[]).map((role) => {
                  const actions = groupedActions[role];
                  if (actions.length === 0) return null;
                  const RoleIcon = stakeholderIcons[role];
                  return (
                    <div key={role} className={`rounded-lg border p-3 ${stakeholderColors[role]}`}>
                      <div className={`flex items-center gap-1.5 mb-3 font-medium text-sm ${stakeholderHeaderColors[role]}`}>
                        <RoleIcon className="w-4 h-4" />
                        {t(`mitigation.${role}`)}
                      </div>
                      <div className="space-y-3">
                        {actions.map((action, i) => (
                          <div key={i} className="space-y-1">
                            <div className="flex items-start gap-1.5">
                              <span className={`mt-1.5 w-2 h-2 rounded-full flex-shrink-0 ${priorityDots[action.priority]}`} />
                              <p className="text-sm font-medium text-foreground">{action.title}</p>
                            </div>
                            <p className="text-xs text-muted-foreground pl-3.5">{action.description}</p>
                            <div className="flex items-center gap-1 pl-3.5">
                              <Clock className="w-3 h-3 text-muted-foreground" />
                              <span className="text-xs text-muted-foreground">{action.timeframe}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Success example */}
              {risk.mitigation.successExample && (
                <div className="p-3 bg-primary/5 rounded-lg border border-primary/10">
                  <p className="text-sm">
                    <span className="font-medium text-primary">{t('mitigation.successExample')}:</span>{' '}
                    <span className="text-muted-foreground">{risk.mitigation.successExample}</span>
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}

    </div>
  );
}
