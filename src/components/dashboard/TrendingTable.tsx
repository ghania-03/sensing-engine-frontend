import { cn } from '@/lib/utils';
import type { TrendingSku } from '@/lib/apiprovider';
import { TrendingUp, Clock, DollarSign, Target } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface TrendingTableProps {
  data: TrendingSku[];
}

export function TrendingTable({ data }: TrendingTableProps) {
  const empty = !data || data.length === 0;
  const rowsToRender = empty ? Array.from({ length: 5 }) : data;

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-border">
            <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">SKU</th>
            <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Trend Spike</th>
            <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Time to Stockout</th>
            <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Revenue at Risk</th>
            <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Confidence</th>
          </tr>
        </thead>
        <tbody>
          {rowsToRender.map((item: any, index: number) => {
            const isPlaceholder = empty;
            const name = isPlaceholder ? '' : item.title || item.sku;
            const sku = isPlaceholder ? '' : item.sku;
            const trendSpike = isPlaceholder ? null : item.trendSpike;
            const timeUntilStockout = isPlaceholder ? '' : item.timeUntilStockout;
            const revenueAtRisk = isPlaceholder ? null : item.revenueAtRisk;
            const confidence = isPlaceholder ? 0 : item.confidence;

            return (
              <tr 
                key={isPlaceholder ? `placeholder-${index}` : item.id}
                className={cn(
                  "border-b border-border/50 hover:bg-muted/50 transition-colors",
                  index === 0 && "bg-destructive/5"
                )}
              >
                <td className="py-4 px-4">
                  <div>
                    <p className="font-medium text-foreground text-sm">{name}</p>
                    <p className="text-xs text-muted-foreground">{sku}</p>
                  </div>
                </td>
                <td className="py-4 px-4">
                  <div className="flex items-center gap-1.5">
                    <TrendingUp className="w-4 h-4 text-success" />
                    <span className="font-semibold text-success">{trendSpike !== null ? `+${trendSpike}%` : ''}</span>
                  </div>
                </td>
                <td className="py-4 px-4">
                  <div className="flex items-center gap-1.5">
                    <Clock className={cn(
                      "w-4 h-4",
                      timeUntilStockout && timeUntilStockout.includes('hour') ? "text-destructive" : "text-warning"
                    )} />
                    <span className={cn(
                      "font-medium text-sm",
                      timeUntilStockout && timeUntilStockout.includes('hour') ? "text-destructive" : "text-foreground"
                    )}>
                      {timeUntilStockout}
                    </span>
                  </div>
                </td>
                <td className="py-4 px-4">
                  <div className="flex items-center gap-1.5">
                    <DollarSign className="w-4 h-4 text-muted-foreground" />
                    <span className="font-semibold text-foreground">{revenueAtRisk !== null ? `$${revenueAtRisk.toLocaleString()}` : ''}</span>
                  </div>
                </td>
                <td className="py-4 px-4">
                  <div className="flex items-center gap-2 min-w-[100px]">
                    <Progress value={confidence} className="h-2 flex-1" />
                    <span className="text-xs font-medium text-muted-foreground w-8">{confidence ? `${confidence}%` : ''}</span>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
