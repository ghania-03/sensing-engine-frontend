import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ApiProvider } from "./lib/apiprovider";
import KeyMetrics from "./pages/Overview";
import TrendRadar from "./pages/LiveTrends";
import DemandForecast from "./pages/DemandForecast";
import PurchaseOrders from "./pages/PurchaseOrders";
import Settings from "./pages/Settings";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ApiProvider>
      <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/overview" element={<KeyMetrics />} />
          <Route path="/live-trends" element={<TrendRadar />} />
          <Route path="/demand-forecast" element={<DemandForecast />} />
          <Route path="/purchase-orders" element={<PurchaseOrders />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/" element={<KeyMetrics />} />
          <Route path="*" element={<Navigate to="/overview" replace />} />
        </Routes>
      </BrowserRouter>
      </TooltipProvider>
    </ApiProvider>
  </QueryClientProvider>
);

export default App;
