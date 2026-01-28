import { useState, useEffect } from 'react';
import { useApi } from '@/lib/apiprovider';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { 
  LineChart, 
  BarChart3, 
  TrendingUp, 
  TrendingDown,
  AlertCircle,
  CheckCircle,
  Target
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend
} from 'recharts';
import { trendingSKUs, generateForecastData } from '@/lib/mockData';

const timeRanges = [
  { label: '7 Days', value: '7' },
  { label: '14 Days', value: '14' },
  { label: '30 Days', value: '30' },
];

const DemandForecast = () => {
  const [selectedRange, setSelectedRange] = useState('14');
  const [selectedSKU, setSelectedSKU] = useState(trendingSKUs[0].sku);
  const api = useApi();
  const [forecastData, setForecastData] = useState(generateForecastData(parseInt(selectedRange)));
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      try {
        const hist = await api.fetchJson(`/api/historic?sku=${selectedSKU}`);
        const fc = await api.fetchJson(`/api/forecast?sku=${selectedSKU}&horizon=${selectedRange}`);
        // hist: {dates:[], values:[]}, fc: {forecast_dates:[], forecast:[], lower:[], upper:[]}
        const histDates = hist.dates || [];
        const histValues = hist.values || [];
        const fcDates = fc.forecast_dates || fc.forecastDates || [];
        const fcVals = fc.forecast || [];

        const combined = [] as any[];
        for (let i = 0; i < histDates.length; i++) {
          combined.push({ date: histDates[i], historical: histValues[i] });
        }
        for (let i = 0; i < fcDates.length; i++) {
          combined.push({ date: fcDates[i], forecast: fcVals[i] });
        }
        if (mounted) setForecastData(combined);
      } catch (e) {
        // keep mock data on error
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => { mounted = false; };
  }, [selectedSKU, selectedRange]);
  
  const selectedProduct = trendingSKUs.find(s => s.sku === selectedSKU) || trendingSKUs[0];

  // Mock SKU-level data
  const skuPredictions = trendingSKUs.map(sku => ({
    name: sku.name,
    sku: sku.sku,
    expectedUnits: Math.floor(Math.random() * 500) + 200,
    confidence: sku.confidence > 90 ? 'High' : sku.confidence > 80 ? 'Medium' : 'Low',
    confidenceValue: sku.confidence,
    trend: Math.random() > 0.3 ? 'up' : 'down',
    trendValue: Math.floor(Math.random() * 30) + 5,
  }));

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 animate-fade-up">
          <div>
            <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <LineChart className="w-6 h-6 text-primary" />
              Demand Forecast
            </h2>
            <p className="text-muted-foreground mt-1">AI-powered demand predictions by SKU</p>
          </div>
          <div className="flex items-center gap-3">
            <Select value={selectedSKU} onValueChange={setSelectedSKU}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Select SKU" />
              </SelectTrigger>
              <SelectContent>
                {trendingSKUs.map((sku) => (
                  <SelectItem key={sku.sku} value={sku.sku}>
                    {sku.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
              {timeRanges.map((range) => (
                <Button
                  key={range.value}
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedRange(range.value)}
                  className={cn(
                    "h-8 px-3 text-xs font-medium",
                    selectedRange === range.value 
                      ? "bg-background shadow-sm text-foreground" 
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {range.label}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Selected SKU Details */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 animate-fade-up" style={{ animationDelay: '0.1s' }}>
          <div className="bg-card rounded-xl border p-4">
            <p className="text-sm text-muted-foreground">Expected Units</p>
            <p className="text-2xl font-bold text-foreground mt-1">
              {Math.floor(Math.random() * 500) + 300}
            </p>
            <div className="flex items-center gap-1 mt-2 text-success text-sm">
              <TrendingUp className="w-4 h-4" />
              <span>+12% vs forecast</span>
            </div>
          </div>
          <div className="bg-card rounded-xl border p-4">
            <p className="text-sm text-muted-foreground">Confidence Band</p>
            <p className="text-2xl font-bold text-foreground mt-1">
              {selectedProduct.confidence}%
            </p>
            <div className={cn(
              "flex items-center gap-1 mt-2 text-sm",
              selectedProduct.confidence >= 90 ? "text-success" : 
              selectedProduct.confidence >= 80 ? "text-primary" : "text-warning"
            )}>
              {selectedProduct.confidence >= 90 ? (
                <CheckCircle className="w-4 h-4" />
              ) : (
                <AlertCircle className="w-4 h-4" />
              )}
              <span>{selectedProduct.confidence >= 90 ? 'High' : selectedProduct.confidence >= 80 ? 'Medium' : 'Low'} confidence</span>
            </div>
          </div>
          <div className="bg-card rounded-xl border p-4">
            <p className="text-sm text-muted-foreground">Trend Spike</p>
            <p className="text-2xl font-bold text-success mt-1">
              +{selectedProduct.trendSpike}%
            </p>
            <div className="flex items-center gap-1 mt-2 text-muted-foreground text-sm">
              <Target className="w-4 h-4" />
              <span>Social momentum</span>
            </div>
          </div>
          <div className="bg-card rounded-xl border p-4">
            <p className="text-sm text-muted-foreground">Time to Stockout</p>
            <p className={cn(
              "text-2xl font-bold mt-1",
              selectedProduct.timeUntilStockout.includes('hour') ? "text-destructive" : "text-foreground"
            )}>
              {selectedProduct.timeUntilStockout}
            </p>
            <div className="flex items-center gap-1 mt-2 text-muted-foreground text-sm">
              <AlertCircle className="w-4 h-4" />
              <span>Based on current velocity</span>
            </div>
          </div>
        </div>

        {/* Main Chart */}
        <div className="bg-card rounded-xl border p-5 animate-fade-up" style={{ animationDelay: '0.2s' }}>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-foreground">Historical vs AI Forecast</h3>
              <p className="text-sm text-muted-foreground">{selectedProduct.name} ({selectedProduct.sku})</p>
            </div>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-chart-1" />
                <span className="text-muted-foreground">Historical</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-0.5 bg-chart-2 border-dashed border-chart-2" style={{ borderStyle: 'dashed' }} />
                <span className="text-muted-foreground">AI Forecast</span>
              </div>
            </div>
          </div>
          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={forecastData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
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
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--popover))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="historical"
                  stroke="hsl(var(--chart-1))"
                  strokeWidth={2}
                  fill="url(#historicalGradient)"
                  connectNulls={false}
                />
                <Area
                  type="monotone"
                  dataKey="forecast"
                  stroke="hsl(var(--chart-2))"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  fill="url(#forecastGradient)"
                  connectNulls={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* SKU Predictions Table */}
        <div className="bg-card rounded-xl border p-5 animate-fade-up" style={{ animationDelay: '0.3s' }}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-primary" />
              SKU-Level Predictions
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase">Product</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase">Expected Units</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase">Confidence</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase">Trend</th>
                </tr>
              </thead>
              <tbody>
                {skuPredictions.map((prediction) => (
                  <tr key={prediction.sku} className="border-b border-border/50 hover:bg-muted/50 transition-colors">
                    <td className="py-4 px-4">
                      <div>
                        <p className="font-medium text-foreground text-sm">{prediction.name}</p>
                        <p className="text-xs text-muted-foreground">{prediction.sku}</p>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="font-semibold text-foreground">{prediction.expectedUnits}</span>
                      <span className="text-xs text-muted-foreground ml-1">units</span>
                    </td>
                    <td className="py-4 px-4">
                      <span className={cn(
                        "status-badge",
                        prediction.confidence === 'High' && "status-approved",
                        prediction.confidence === 'Medium' && "bg-primary/10 text-primary",
                        prediction.confidence === 'Low' && "status-in-review"
                      )}>
                        {prediction.confidence}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className={cn(
                        "flex items-center gap-1",
                        prediction.trend === 'up' ? "text-success" : "text-destructive"
                      )}>
                        {prediction.trend === 'up' ? (
                          <TrendingUp className="w-4 h-4" />
                        ) : (
                          <TrendingDown className="w-4 h-4" />
                        )}
                        <span className="font-medium">{prediction.trend === 'up' ? '+' : '-'}{prediction.trendValue}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DemandForecast;
