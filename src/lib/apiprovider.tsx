import React, { createContext, useContext } from "react";

export interface SignalSource {
  name: string;
  mentions: number;
  change7: number;
}

export interface TrendingKeyword {
  keyword: string;
  mentions: number;
  change24: number;
  change7: number;
  source: string;
  confidence: number;
}

export interface TrendingSku {
  sku: string;
  title: string;
  confidence: number;
  score: number;
  trendSpike: number;
  trendChange24: number;
  trendChange7: number;
  timeUntilStockout: string;
  revenueAtRisk: number;
  status: string;
  keywords: string[];
  mapping: string;
  sourceBreakdown: Array<{ source: string; mentions: number }>;
  mentions: number;
}

export interface TrendsResponse {
  trending_skus: TrendingSku[];
  trend_keywords: TrendingKeyword[];
  signal_sources: SignalSource[];
  last_updated: string;
}

export interface SkuMappingItem extends TrendingSku {}

export interface SkuMappingResponse {
  mappings: SkuMappingItem[];
}

export type ForecastPoint = { date: string; units: number };

export type ForecastResponse = {
  sku: string;
  region: string;
  horizon: number;
  model_version: string;
  trained_at: string;
  data_window: { start: string; end: string };
  last_updated: string;
  point_forecast: ForecastPoint[];
  confidence_intervals: {
    low: ForecastPoint[];
    median: ForecastPoint[];
    high: ForecastPoint[];
  };
  aggregate_metrics: {
    expected_units?: number;
    expected_revenue?: number;
    stockout_risk_pct?: number;
  };
  notes?: string;
  ttl_seconds: number;
  historical?: ForecastPoint[];
};

export type ForecastRequestParams = {
  sku: string;
  horizon?: 7 | 14 | 30;
  region?: string;
  start_date?: string;
};

const env: any = import.meta.env || {};
const base = env.VITE_API_BASE || env.REACT_APP_API_BASE || "http://localhost:8000";

export const fetchJson = async (path: string) => {
  const res = await fetch(base + path);
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || `HTTP ${res.status}`);
  }
  return res.json();
};

export const fetchForecast = (params: ForecastRequestParams) => {
  const { sku, horizon, region, start_date } = params;
  const qs = new URLSearchParams();
  qs.set("sku", sku);
  qs.set("horizon", String(horizon ?? 14));
  if (region) qs.set("region", region);
  if (start_date) qs.set("start_date", start_date);
  return fetchJson(`/api/forecast?${qs.toString()}`) as Promise<ForecastResponse>;
};

type ApiContextType = {
  fetchJson: (path: string) => Promise<any>;
  fetchTrends: () => Promise<TrendsResponse>;
  fetchSkuMapping: () => Promise<SkuMappingResponse>;
  fetchForecast: (params: ForecastRequestParams) => Promise<ForecastResponse>;
};

const ApiContext = createContext<ApiContextType | null>(null);

export function ApiProvider({ children }: { children: React.ReactNode }) {
  const fetchTrends = () => fetchJson("/api/trends");
  const fetchSkuMapping = () => fetchJson("/api/sku-mapping");

  return (
    <ApiContext.Provider value={{ fetchJson, fetchTrends, fetchSkuMapping, fetchForecast }}>
      {children}
    </ApiContext.Provider>
  );
}

export function useApi() {
  const ctx = useContext(ApiContext);
  if (!ctx) throw new Error("useApi must be used inside ApiProvider");
  return ctx;
}
