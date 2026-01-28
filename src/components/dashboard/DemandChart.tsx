import { useMemo, useState } from 'react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from 'recharts';
import { generateForecastData } from '@/lib/mockData';
import { useForecast } from '@/hooks/useForecast';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface DemandChartProps {
  className?: string;
}

const timeRanges = [
  { label: '7D', days: 7 },
  { label: '14D', days: 14 },
  { label: '30D', days: 30 },
];

const DEFAULT_SKU = 'GS-019';

export function DemandChart({ className }: DemandChartProps) {
  const [selectedRange, setSelectedRange] = useState(14);
  const forecastQuery = useForecast({ sku: DEFAULT_SKU, horizon: selectedRange });

  const data = useMemo(() => {
    const forecast = forecastQuery.data;
    if (!forecast) return generateForecastData(selectedRange);

    const rows = new Map<string, { date: string; historical?: number; forecast?: number; forecastLow?: number; forecastHigh?: number }>();
    const ensureRow = (date: string) => {
      if (!rows.has(date)) {
        rows.set(date, { date });
      }
      return rows.get(date)!;
    };

    (forecast.historical || []).forEach((point) => {
      ensureRow(point.date).historical = point.units;
    });

    (forecast.point_forecast || []).forEach((point) => {
      ensureRow(point.date).forecast = point.units;
    });

    const applyInterval = (interval: { date: string; units: number }[] | undefined, key: 'forecastLow' | 'forecastHigh') => {
      (interval || []).forEach((point) => {
        ensureRow(point.date)[key] = point.units;
      });
    };

    applyInterval(forecast.confidence_intervals?.low, 'forecastLow');
    applyInterval(forecast.confidence_intervals?.high, 'forecastHigh');

    const combined = Array.from(rows.values()).sort((a, b) => a.date.localeCompare(b.date));
    return combined.length ? combined : generateForecastData(selectedRange);
  }, [forecastQuery.data, selectedRange]);

  return (
    <div className={cn("bg-card rounded-xl border p-5", className)}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Demand Forecast</h3>
          <p className="text-sm text-muted-foreground">Historical vs AI Predictions</p>
        </div>
        <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
          {timeRanges.map((range) => (
            <Button
              key={range.days}
              variant="ghost"
              size="sm"
              onClick={() => setSelectedRange(range.days)}
              className={cn(
                "h-7 px-3 text-xs font-medium",
                selectedRange === range.days 
                  ? "bg-background shadow-sm text-foreground" 
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {range.label}
            </Button>
          ))}
        </div>
      </div>

      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="historicalGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="forecastGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--chart-2))" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="hsl(var(--chart-2))" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--chart-grid))" />
            <XAxis 
              dataKey="date" 
              tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis 
              tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${value}`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--popover))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              }}
              labelStyle={{ color: 'hsl(var(--foreground))' }}
            />
            <Legend 
              wrapperStyle={{ paddingTop: '20px' }}
              formatter={(value) => <span className="text-sm text-muted-foreground">{value}</span>}
            />
            <Area
              type="monotone"
              dataKey="historical"
              stroke="hsl(var(--chart-1))"
              strokeWidth={2}
              fill="url(#historicalGradient)"
              name="Historical"
              connectNulls={false}
            />
            <Area
              type="monotone"
              dataKey="forecast"
              stroke="hsl(var(--chart-2))"
              strokeWidth={2}
              strokeDasharray="5 5"
              fill="url(#forecastGradient)"
              name="AI Forecast"
              connectNulls={false}
            />
            <Area
              type="monotone"
              dataKey="forecastHigh"
              stroke="transparent"
              fill="hsl(var(--chart-2))"
              fillOpacity={0.1}
              name="Upper Bound"
              connectNulls={false}
            />
            <Area
              type="monotone"
              dataKey="forecastLow"
              stroke="transparent"
              fill="hsl(var(--background))"
              name="Lower Bound"
              connectNulls={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
