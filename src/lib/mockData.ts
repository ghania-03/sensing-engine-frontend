// Mock Data for Demand Analysis Dashboard

export interface TrendingSKU {
  id: string;
  name: string;
  sku: string;
  trendSpike: number;
  timeUntilStockout: string;
  revenueAtRisk: number;
  confidence: number;
}

export interface AIAlert {
  id: string;
  message: string;
  status: 'action_required' | 'in_review' | 'approved';
  timestamp: string;
  impactLevel: 'high' | 'medium' | 'low';
}

export interface TrendSignal {
  id: string;
  keyword: string;
  change24h: number;
  change7d: number;
  source: 'tiktok' | 'instagram' | 'twitter' | 'google';
  velocity: number;
}

export interface SKUMapping {
  id: string;
  trendKeyword: string;
  skuId: string;
  skuName: string;
  confidence: number;
}

export interface ForecastData {
  date: string;
  historical: number | null;
  forecast: number | null;
  forecastLow: number | null;
  forecastHigh: number | null;
}

export interface AIRecommendation {
  id: string;
  skuName: string;
  skuId: string;
  action: string;
  quantity: number;
  supplier: string;
  revenueProtected: number;
  status: 'drafted' | 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

export interface PurchaseOrder {
  id: string;
  poNumber: string;
  supplier: string;
  items: number;
  totalValue: number;
  status: 'draft' | 'approved' | 'sent' | 'received';
  createdAt: string;
  expectedDelivery: string;
}

export const trendingSKUs: TrendingSKU[] = [
  { id: '1', name: 'Green Silk Scarf', sku: 'GS-019', trendSpike: 342, timeUntilStockout: '18 hours', revenueAtRisk: 45200, confidence: 94 },
  { id: '2', name: 'Vintage Denim Jacket', sku: 'VDJ-045', trendSpike: 278, timeUntilStockout: '2 days', revenueAtRisk: 89500, confidence: 88 },
  { id: '3', name: 'Pearl Drop Earrings', sku: 'PDE-112', trendSpike: 195, timeUntilStockout: '36 hours', revenueAtRisk: 23800, confidence: 91 },
  { id: '4', name: 'Cashmere Blend Sweater', sku: 'CBS-067', trendSpike: 156, timeUntilStockout: '4 days', revenueAtRisk: 67300, confidence: 85 },
  { id: '5', name: 'Leather Crossbody Bag', sku: 'LCB-089', trendSpike: 134, timeUntilStockout: '5 days', revenueAtRisk: 112400, confidence: 82 },
];

export const aiAlerts: AIAlert[] = [
  { id: '1', message: 'Store-Level Demand Surge Detected – Green Silk Scarf (Chicago & SoHo)', status: 'action_required', timestamp: '2 min ago', impactLevel: 'high' },
  { id: '2', message: 'Influencer Campaign Impact – Pearl Drop Earrings trending on TikTok', status: 'in_review', timestamp: '15 min ago', impactLevel: 'high' },
  { id: '3', message: 'Regional Weather Pattern – Winter accessories demand increasing in Northeast', status: 'in_review', timestamp: '1 hour ago', impactLevel: 'medium' },
  { id: '4', message: 'Competitor Stockout Alert – Similar denim products unavailable at major retailer', status: 'approved', timestamp: '3 hours ago', impactLevel: 'medium' },
];

export const trendSignals: TrendSignal[] = [
  { id: '1', keyword: 'quiet luxury scarf', change24h: 245, change7d: 892, source: 'tiktok', velocity: 94 },
  { id: '2', keyword: 'vintage denim aesthetic', change24h: 178, change7d: 456, source: 'instagram', velocity: 87 },
  { id: '3', keyword: 'pearl jewelry trend', change24h: 134, change7d: 312, source: 'twitter', velocity: 76 },
  { id: '4', keyword: 'cashmere sweater', change24h: 89, change7d: 234, source: 'google', velocity: 68 },
  { id: '5', keyword: 'crossbody bag 2024', change24h: 67, change7d: 189, source: 'tiktok', velocity: 62 },
  { id: '6', keyword: 'sustainable fashion', change24h: 56, change7d: 167, source: 'instagram', velocity: 58 },
];

export const skuMappings: SKUMapping[] = [
  { id: '1', trendKeyword: 'quiet luxury scarf', skuId: 'GS-019', skuName: 'Green Silk Scarf', confidence: 92 },
  { id: '2', trendKeyword: 'vintage denim aesthetic', skuId: 'VDJ-045', skuName: 'Vintage Denim Jacket', confidence: 88 },
  { id: '3', trendKeyword: 'pearl jewelry trend', skuId: 'PDE-112', skuName: 'Pearl Drop Earrings', confidence: 95 },
  { id: '4', trendKeyword: 'cashmere sweater', skuId: 'CBS-067', skuName: 'Cashmere Blend Sweater', confidence: 91 },
  { id: '5', trendKeyword: 'crossbody bag 2024', skuId: 'LCB-089', skuName: 'Leather Crossbody Bag', confidence: 85 },
];

export const generateForecastData = (days: number = 30): ForecastData[] => {
  const data: ForecastData[] = [];
  const today = new Date();
  const historicalDays = Math.floor(days * 0.6);
  
  for (let i = days; i > 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const isHistorical = i > days - historicalDays;
    
    const baseValue = 120 + Math.sin(i / 5) * 30;
    const noise = Math.random() * 20 - 10;
    
    if (isHistorical) {
      data.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        historical: Math.round(baseValue + noise),
        forecast: null,
        forecastLow: null,
        forecastHigh: null,
      });
    } else {
      const forecastValue = baseValue + 15 + noise;
      data.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        historical: null,
        forecast: Math.round(forecastValue),
        forecastLow: Math.round(forecastValue * 0.85),
        forecastHigh: Math.round(forecastValue * 1.15),
      });
    }
  }
  
  return data;
};

export const aiRecommendations: AIRecommendation[] = [
  { id: '1', skuName: 'Green Silk Scarf', skuId: 'GS-019', action: 'Emergency Reorder', quantity: 650, supplier: 'Milano Textiles', revenueProtected: 58200, status: 'pending', createdAt: '2026-01-18T10:30:00Z' },
  { id: '2', skuName: 'Vintage Denim Jacket', skuId: 'VDJ-045', action: 'Store Transfer', quantity: 180, supplier: 'Chicago DC → SoHo', revenueProtected: 95000, status: 'drafted', createdAt: '2026-01-18T09:15:00Z' },
  { id: '3', skuName: 'Pearl Drop Earrings', skuId: 'PDE-112', action: 'Express Restock', quantity: 320, supplier: 'Tokyo Jewelry Co.', revenueProtected: 24800, status: 'approved', createdAt: '2026-01-17T16:45:00Z' },
  { id: '4', skuName: 'Cashmere Blend Sweater', skuId: 'CBS-067', action: 'Standard Reorder', quantity: 260, supplier: 'Scottish Woolens', revenueProtected: 72000, status: 'pending', createdAt: '2026-01-17T14:20:00Z' },
];

export const purchaseOrders: PurchaseOrder[] = [
  { id: '1', poNumber: 'PO-2026-1034', supplier: 'Milano Textiles', items: 11, totalValue: 145000, status: 'approved', createdAt: '2026-01-15', expectedDelivery: '2026-01-22' },
  { id: '2', poNumber: 'PO-2026-1033', supplier: 'Tokyo Jewelry Co.', items: 14, totalValue: 98000, status: 'sent', createdAt: '2026-01-14', expectedDelivery: '2026-01-25' },
  { id: '3', poNumber: 'PO-2026-1032', supplier: 'Scottish Woolens', items: 6, totalValue: 75000, status: 'draft', createdAt: '2026-01-14', expectedDelivery: '2026-01-28' },
  { id: '4', poNumber: 'PO-2026-1031', supplier: 'Premium Leather Works', items: 18, totalValue: 255000, status: 'received', createdAt: '2026-01-10', expectedDelivery: '2026-01-17' },
  { id: '5', poNumber: 'PO-2026-1030', supplier: 'Artisan Accessories', items: 22, totalValue: 158000, status: 'approved', createdAt: '2026-01-08', expectedDelivery: '2026-01-20' },
];

export const revenueProjection = {
  protected: 520000,
  atRisk: 76000,
  period: '14 days',
};

export const sourceIcons = {
  tiktok: '📱',
  instagram: '📸',
  twitter: '🐦',
  google: '🔍',
};
