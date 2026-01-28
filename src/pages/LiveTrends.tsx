import React, { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useApi } from "@/lib/apiprovider";
import type { TrendingKeyword } from "@/lib/apiprovider";
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Badge } from '@/components/ui/badge';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';

export default function TrendRadar() {
  const { fetchJson, fetchTrends } = useApi();
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  // Query backend signals with polling every 30s
  const signalsQuery = useQuery({
    queryKey: ["trendSignals"],
    queryFn: () => fetchJson("/api/trends/signals"),
    staleTime: 60_000,
    refetchInterval: 30_000,
    retry: 1,
  });

  const socialQuery = useQuery({
    queryKey: ["social"],
    queryFn: () => fetchJson("/api/social"),
    staleTime: 60_000,
    retry: 1,
  });

  const trendsQuery = useQuery({
    queryKey: ["trends"],
    queryFn: fetchTrends,
    staleTime: 60_000,
    retry: 1,
  });

  const signals = useMemo(() => (Array.isArray(signalsQuery.data) ? signalsQuery.data : []), [signalsQuery.data]);
  const signalSources = trendsQuery.data?.signal_sources ?? [];
  const chartData = useMemo(
    () =>
      signalSources.map((source) => ({
        source: source.name,
        velocity: source.mentions ?? 0,
        change7: source.change7 ?? 0,
      })),
    [signalSources]
  );
  const totalSourceVelocity = useMemo(
    () => signalSources.reduce((sum, source) => sum + (source.mentions ?? 0), 0),
    [signalSources]
  );

  const trendKeywords = trendsQuery.data?.trend_keywords ?? [];
  const lastUpdated = trendsQuery.data?.last_updated;
  const freshnessLabel = useMemo(() => {
    if (!lastUpdated) return null;
    const parsed = Date.parse(lastUpdated);
    if (Number.isNaN(parsed)) return null;
    const delta = Date.now() - parsed;
    if (delta < 0) return "just now";
    const minutes = Math.floor(delta / 60_000);
    if (minutes < 1) return "just now";
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  }, [lastUpdated]);

  if (trendsQuery.isLoading) {
    return (
      <DashboardLayout>
        <div className="p-6">Loading live trends…</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {trendsQuery.isError && (
          <div className="rounded-xl border border-destructive/60 bg-destructive/5 p-4 text-sm text-destructive-foreground">
            Unable to load live trend data right now; showing the latest available signals.
          </div>
        )}

        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-3">
              <div>
                <h2 className="text-2xl font-bold">Trend Radar</h2>
                <p className="text-xs text-muted-foreground">
                  Trends to follow:&nbsp;
                  <a
                    href="https://trends.google.com/trending?geo=US&hl=en-US&hours=168&sort=search-volume&category=5"
                    target="_blank"
                    rel="noreferrer"
                    className="underline"
                  >
                    Google Trend Radar
                  </a>
                </p>
              </div>
              {freshnessLabel && (
                <Badge variant="outline" className="mt-1 min-w-[130px] text-center">
                  Last refreshed {freshnessLabel}
                </Badge>
              )}
            </div>
            {lastUpdated && (
              <p className="text-xs text-muted-foreground">
                Snapshot time {new Date(lastUpdated).toLocaleString()}
              </p>
            )}
          </div>
          <div className="text-sm text-muted-foreground">
            Auto-refresh every 30s · Signal source velocity
          </div>
        </div>

        <SignalPanel
          signals={signals}
          social={socialQuery.data}
          chartData={chartData}
          totalVelocity={totalSourceVelocity}
          trendKeywords={trendKeywords}
          onOpenHashtag={(tag: string) => {
            setSelectedTag(tag);
            setDialogOpen(true);
          }}
        />

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent>
            <DialogTitle>Posts for {selectedTag}</DialogTitle>
            <DialogDescription>
              <div className="mt-4 space-y-3">
                {(socialQuery.data?.rows || []).filter((r: any) => {
                  const h = (r.hashtag || '').toString().toLowerCase();
                  return h && selectedTag && h.includes(selectedTag.toLowerCase().replace('#',''));
                }).slice(0, 10).map((r: any) => (
                  <div key={r.post_id || r.date + r.hashtag} className="p-3 border rounded-md">
                    <div className="text-sm text-muted-foreground">{r.source} • {r.sku || '—'} • {r.date}</div>
                    <div className="mt-1 text-foreground">{r.text || r.post || ''}</div>
                  </div>
                ))}
              </div>
            </DialogDescription>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}

// Simple list component
function SignalPanel({
  signals,
  social,
  chartData = [],
  totalVelocity = 0,
  trendKeywords = [],
  onOpenHashtag,
}: {
  signals: any[];
  social?: any;
  chartData?: { source: string; velocity: number; change7?: number }[];
  totalVelocity?: number;
  trendKeywords?: TrendingKeyword[];
  onOpenHashtag?: (tag: string) => void;
}) {

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 bg-card rounded-xl border p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold">Signal Velocity</h3>
          <p className="text-xs text-muted-foreground">
            {totalVelocity.toLocaleString()} combined mentions · multi-source
          </p>
        </div>
        <div className="h-64">
          {totalVelocity === 0 ? (
            <div className="flex items-center justify-center h-full text-xs text-muted-foreground">
              No signal velocity data available yet.
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--chart-grid))" />
                <XAxis dataKey="source" tick={{ fontSize: 10 }} />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="velocity" name="Mentions" fill="hsl(var(--chart-1))" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      <div className="space-y-6 lg:col-span-1">
        <TopKeywordsPanel keywords={trendKeywords} />
        <div className="bg-card rounded-xl border p-4">
          <h3 className="text-lg font-semibold mb-3">Top Hashtags</h3>
          <div className="space-y-2 mb-4">
            {(social?.top_hashtags || aggregateTopHashtags(signals)).slice(0, 6).map((t: any) => (
              <button
                key={t.hashtag || t.name}
                onClick={() => onOpenHashtag?.(t.hashtag || t.name)}
                className="flex items-start justify-between w-full text-left"
              >
                <div className="min-w-0">
                  <p className="font-medium text-foreground">{t.hashtag || t.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {snippetForHashtag(social, signals, t.hashtag || t.name)}
                  </p>
                </div>
                <div className="text-sm font-semibold text-foreground">
                  {t.count ?? t.mentions ?? 0}
                </div>
              </button>
            ))}
          </div>

          <h3 className="text-lg font-semibold mb-3">Recent Signals</h3>
          <div className="space-y-3 max-h-48 overflow-auto">
            {signals.map((s) => (
              <SignalCard key={s.id} s={s} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function TopKeywordsPanel({ keywords }: { keywords?: TrendingKeyword[] }) {
  return (
    <div className="bg-card rounded-xl border p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold">Top Keywords</h3>
        <p className="text-xs text-muted-foreground">Based on mentions + momentum</p>
      </div>
      {keywords && keywords.length > 0 ? (
        <div className="space-y-3">
          {keywords.map((keyword) => (
            <div key={keyword.keyword} className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="font-medium text-foreground truncate">{keyword.keyword}</p>
                <p className="text-xs text-muted-foreground">{keyword.source}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground">
                  {keyword.mentions?.toLocaleString() ?? 0} mentions
                </p>
                <div className="flex gap-1 mt-1">
                  <KeywordChangePill label="24h" value={keyword.change24} />
                  <KeywordChangePill label="7d" value={keyword.change7} />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-md border border-dashed border-muted/40 p-4 text-xs text-muted-foreground">
          No keyword trends available yet. Live data will appear once signal sources populate.
        </div>
      )}
    </div>
  );
}

function KeywordChangePill({ label, value }: { label: string; value?: number }) {
  const formatted = typeof value === "number" ? `${value > 0 ? "+" : ""}${value}%` : "—";
  const tone =
    typeof value !== "number"
      ? "text-muted-foreground bg-muted/10"
      : value > 0
        ? "text-emerald-500 bg-emerald-500/10"
        : value < 0
          ? "text-rose-500 bg-rose-500/10"
          : "text-foreground bg-muted/5";

  return (
    <span className={`flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold ${tone}`}>
      {label}: {formatted}
    </span>
  );
}

function aggregateTopHashtags(signals: any[]) {
  const map: Record<string, { hashtag: string; count: number }> = {};
  signals.forEach((s) => {
    const h = String(s.keyword || s.hashtag || '').toLowerCase();
    if (!h) return;
    if (!map[h]) map[h] = { hashtag: h, count: 0 };
    map[h].count += Number(s.velocity ?? s.mentions ?? 0);
  });
  return Object.values(map).sort((a, b) => b.count - a.count);
}

function snippetForHashtag(social: any, signals: any[], hashtag: string) {
  if (!hashtag) return '';
  // prefer full social rows with text
  const rows = social?.rows || [];
  const found = rows.find((r: any) => (r.hashtag || r.hashtag?.toString?.() || '').toLowerCase() === hashtag.toLowerCase());
  if (found && found.text) return found.text;
  // fallback: find in signals
  const sfound = signals.find((r: any) => String(r.keyword || r.hashtag || '').toLowerCase() === hashtag.toLowerCase());
  return sfound?.text || sfound?.post || '';
}

function SignalCard({ s }: { s: any }) {
  const keyword = s.keyword || s.hashtag || s.tag || '';
  const source = s.source || s.platform || 'unknown';
  const velocity = Number(s.velocity ?? s.mentions ?? 0);
  let timeLabel = '';
  try {
    timeLabel = s.timestamp ? new Date(s.timestamp).toLocaleString() : '';
  } catch (e) {
    timeLabel = String(s.timestamp || '');
  }

  return (
    <div className="p-3 rounded-lg border bg-card/50 hover:shadow-sm">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="font-medium text-foreground truncate">{keyword || source}</p>
          <p className="text-xs text-muted-foreground">Source: {String(source)}</p>
          <p className="text-xs text-muted-foreground">SKU: {String(s.sku || s.sku_id || '')}</p>
        </div>
        <div className="text-right">
          <div className="text-sm font-semibold">{velocity}</div>
          <div className="text-xs text-muted-foreground">{timeLabel}</div>
        </div>
      </div>
    </div>
  );
}
