import React, { Suspense, useMemo } from 'react';
import { useApi } from '@/lib/apiprovider';
import type { TrendsResponse, SkuMappingResponse } from '@/lib/apiprovider';
import { useQuery } from '@tanstack/react-query';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { StatCard } from '@/components/dashboard/StatCard';
const AlertCard = React.lazy(() => import('@/components/dashboard/AlertCard').then((mod) => ({ default: mod.AlertCard })));
const TrendingTable = React.lazy(() => import('@/components/dashboard/TrendingTable').then((mod) => ({ default: mod.TrendingTable })));
const DemandChart = React.lazy(() => import('@/components/dashboard/DemandChart').then((mod) => ({ default: mod.DemandChart })));
import ErrorBoundary from '@/components/ui/error-boundary';
import { 
  TrendingUp, 
  AlertTriangle, 
  DollarSign, 
  Shield,
  Package,
  BarChart3
} from 'lucide-react';
import { useForecast } from '@/hooks/useForecast';

const KeyMetrics = () => {
  const { fetchJson, fetchTrends, fetchSkuMapping } = useApi();
  const skuMappingQuery = useQuery<SkuMappingResponse>({
    queryKey: ['skuMapping'],
    queryFn: fetchSkuMapping,
    staleTime: 60_000,
    retry: 1,
  });

  const trendsQuery = useQuery<TrendsResponse>({
    queryKey: ['trendsOverview'],
    queryFn: fetchTrends,
    staleTime: 60_000,
    retry: 1,
  });

  const socialQuery = useQuery({
    queryKey: ['social'],
    queryFn: () => fetchJson('/api/social'),
    staleTime: 60_000,
    retry: 1,
  });

  const forecastQuery = useForecast({ sku: 'GS-019', horizon: 14 });

  const skuMappings = skuMappingQuery.data?.mappings ?? [];
  const trendingSource = trendsQuery.data?.trending_skus ?? skuMappings;
  const trendingTableRows = useMemo(() => {
    if (!trendingSource || trendingSource.length === 0) return [];
    return [...trendingSource].sort((a, b) => b.trendSpike - a.trendSpike).slice(0, 10);
  }, [trendingSource]);

  // Build alerts from social rows
  const derivedAlerts = useMemo(() => {
    const rows = socialQuery.data && socialQuery.data.rows ? socialQuery.data.rows : null;
    if (!rows) return [];

    return rows
      .slice()
      .sort((a: any, b: any) => (Number(b.mentions) || 0) - (Number(a.mentions) || 0))
      .slice(0, 8)
      .map((r: any, idx: number) => {
        const mentions = Number(r.mentions) || 0;
        const status = mentions >= 100 ? 'action_required' : mentions >= 50 ? 'in_review' : 'approved';
        const impact: any = mentions >= 100 ? 'high' : mentions >= 50 ? 'medium' : 'low';
        return {
          id: r.post_id || `s-${idx}`,
          message: r.text || `${r.hashtag || 'signal'} on ${r.source}`,
          status,
          timestamp: r.date ? new Date(r.date).toLocaleString() : 'recent',
          impactLevel: impact,
        };
      });
  }, [socialQuery.data]);

  const kpis = useMemo(() => {
    const revenueProtected = forecastQuery.data?.aggregate_metrics?.expected_revenue ?? null;
    const trendingRevenueAtRisk = trendingTableRows.reduce((sum, row) => sum + (row.revenueAtRisk || 0), 0);
    const revenueAtRisk = forecastQuery.data?.aggregate_metrics?.stockout_risk_pct
      ? Math.round((forecastQuery.data.aggregate_metrics.stockout_risk_pct / 100) * trendingRevenueAtRisk)
      : (trendingRevenueAtRisk || null);
    const actionRequired = trendingTableRows.filter((row) => row.status === 'action_required').length;
    const activeAlerts = Math.max(actionRequired, derivedAlerts.length);

    return {
      skusMonitored: skuMappings.length,
      activeAlerts,
      revenueProtected,
      revenueAtRisk,
    };
  }, [derivedAlerts.length, forecastQuery.data, skuMappings.length, trendingTableRows]);

  const formatCurrency = (value: number | null | undefined) =>
    typeof value === 'number' ? `$${value.toLocaleString()}` : '—';

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="animate-fade-up">
          <h2 className="text-2xl font-bold text-foreground">Key Metrics</h2>
          <p className="text-muted-foreground mt-1">Executive demand insights powered by Sensing Engine</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 animate-fade-up" style={{ animationDelay: '0.1s' }}>
          <StatCard
            title="Revenue Protected"
            value={forecastQuery.isLoading ? 'Loading…' : formatCurrency(kpis.revenueProtected)}
            subtitle="Next 14 days"
            icon={Shield}
            variant="success"
            trend={{ value: 12.5, isPositive: true }}
          />
          <StatCard
            title="Revenue at Risk"
            value={forecastQuery.isLoading ? 'Loading…' : formatCurrency(kpis.revenueAtRisk)}
            subtitle="Requires immediate action"
            icon={AlertTriangle}
            variant="danger"
          />
          <StatCard
            title="Recommended Actions"
            value={forecastQuery.isLoading ? '-' : kpis.activeAlerts}
            subtitle={`${(socialQuery.data && socialQuery.data.rows) ? socialQuery.data.rows.length : 0} total signals`}
            icon={TrendingUp}
            variant="warning"
          />
          <StatCard
            title="SKUs Monitored"
            value={new Intl.NumberFormat().format(kpis.skusMonitored)}
            subtitle="From SKU mappings"
            icon={Package}
            variant="primary"
            trend={{ value: 8.2, isPositive: true }}
          />
        </div>
        {forecastQuery.isLoading && (
          <div className="text-xs text-muted-foreground">Fetching latest forecast…</div>
        )}
        {forecastQuery.isSuccess && forecastQuery.data && (
          <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
            <span className="px-3 py-1 rounded-full border border-border bg-background/50">Model {forecastQuery.data.model_version}</span>
            <span>Last updated {new Date(forecastQuery.data.last_updated).toLocaleString()}</span>
            <span>{forecastQuery.data.ttl_seconds ? `TTL ${forecastQuery.data.ttl_seconds}s` : ''}</span>
          </div>
        )}
        {forecastQuery.isError && (
          <div className="flex items-center gap-2 text-xs text-destructive">
            <AlertTriangle className="w-4 h-4" />
            Forecast unavailable — demo mode
          </div>
        )}

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Trending SKUs - Takes 2 columns */}
            <div className="xl:col-span-2 bg-card rounded-xl border p-5 animate-fade-up" style={{ animationDelay: '0.2s' }}>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-primary" />
                    Top Trending SKUs
                  </h3>
                  <p className="text-sm text-muted-foreground">Top 5 products requiring attention</p>
                </div>
                <span className="status-badge status-action-required">
                  <AlertTriangle className="w-3 h-3" />
                  {(trendingTableRows && trendingTableRows.filter((s: any) => s.timeUntilStockout.includes('hour')).length) || 0} Critical
                </span>
              </div>
              <ErrorBoundary>
                  <Suspense fallback={<div className="p-4">Loading trending table...</div>}>
                  <TrendingTable data={trendingTableRows} />
                </Suspense>
              </ErrorBoundary>
            </div>

          {/* Recommended Actions */}
          <div className="bg-card rounded-xl border p-5 animate-fade-up" style={{ animationDelay: '0.3s' }}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-foreground">Recommended Actions</h3>
                <p className="text-xs text-muted-foreground">Review and approve AI-recommended actions before execution.</p>
              </div>
              <span className="text-xs font-medium text-primary cursor-pointer hover:underline">View All</span>
            </div>
            <div className="space-y-3">
              <ErrorBoundary>
                <Suspense fallback={<div className="p-2">Loading alerts...</div>}>
                  {derivedAlerts.map((alert) => (
                    <AlertCard key={alert.id} alert={alert} />
                  ))}
                </Suspense>
              </ErrorBoundary>
            </div>
          </div>
        </div>

        {/* Forecast Chart */}
        <div className="animate-fade-up" style={{ animationDelay: '0.4s' }}>
          <ErrorBoundary>
            <Suspense fallback={<div className="p-4">Loading forecast chart...</div>}>
              <DemandChart />
            </Suspense>
          </ErrorBoundary>
        </div>

        {/* Revenue Impact Card */}
        <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent rounded-xl border border-primary/20 p-6 animate-fade-up" style={{ animationDelay: '0.5s' }}>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-primary/20 flex items-center justify-center">
              <DollarSign className="w-7 h-7 text-primary" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-foreground">Projected Revenue Impact</h3>
              <p className="text-muted-foreground">Next 14 days projection based on AI analysis</p>
            </div>
            <div className="ml-auto text-right">
              <p className="text-3xl font-bold text-success">
                {forecastQuery.isLoading ? 'Loading…' : formatCurrency(kpis.revenueProtected)}
              </p>
              <p className="text-sm text-muted-foreground">revenue protected through early detection</p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default KeyMetrics;
