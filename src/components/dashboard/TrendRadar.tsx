import { TrendSignal, sourceIcons } from '@/lib/mockData';
import { cn } from '@/lib/utils';
import { TrendingUp, TrendingDown, Zap } from 'lucide-react';

interface TrendRadarProps {
  signals: TrendSignal[];
}

export function TrendRadar({ signals }: TrendRadarProps) {
  return (
    <div className="space-y-3">
      {signals.map((signal) => (
        <div 
          key={signal.id}
          className="p-4 rounded-lg border bg-card hover:shadow-sm transition-all duration-200 group"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center text-lg">
                {sourceIcons[signal.source]}
              </div>
              <div>
                <p className="font-medium text-foreground text-sm group-hover:text-primary transition-colors">
                  {signal.keyword}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5 capitalize">{signal.source}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="flex items-center gap-1 justify-end">
                  {signal.change24h > 0 ? (
                    <TrendingUp className="w-3.5 h-3.5 text-success" />
                  ) : (
                    <TrendingDown className="w-3.5 h-3.5 text-destructive" />
                  )}
                  <span className={cn(
                    "text-sm font-semibold",
                    signal.change24h > 0 ? "text-success" : "text-destructive"
                  )}>
                    {signal.change24h > 0 ? '+' : ''}{signal.change24h}%
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">24h</p>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-1 justify-end">
                  {signal.change7d > 0 ? (
                    <TrendingUp className="w-3.5 h-3.5 text-success" />
                  ) : (
                    <TrendingDown className="w-3.5 h-3.5 text-destructive" />
                  )}
                  <span className={cn(
                    "text-sm font-semibold",
                    signal.change7d > 0 ? "text-success" : "text-destructive"
                  )}>
                    {signal.change7d > 0 ? '+' : ''}{signal.change7d}%
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">7d</p>
              </div>
              <div className="flex items-center gap-1 pl-2 border-l border-border">
                <Zap className="w-3.5 h-3.5 text-warning" />
                <span className="text-sm font-semibold text-foreground">{signal.velocity}</span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
