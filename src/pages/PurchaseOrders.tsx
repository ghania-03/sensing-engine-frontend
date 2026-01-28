import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PurchaseOrderTable } from '@/components/dashboard/PurchaseOrderTable';
import { purchaseOrders } from '@/lib/mockData';
import { ShoppingCart, Plus, Filter, Download, FileText, Truck, Package, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const statusFilters = [
  { label: 'All', value: 'all' },
  { label: 'Draft', value: 'draft' },
  { label: 'Approved', value: 'approved' },
  { label: 'Sent', value: 'sent' },
  { label: 'Received', value: 'received' },
];

const PurchaseOrders = () => {
  const [activeFilter, setActiveFilter] = useState('all');

  const filteredOrders = activeFilter === 'all' 
    ? purchaseOrders 
    : purchaseOrders.filter(o => o.status === activeFilter);

  const statusCounts = {
    draft: purchaseOrders.filter(o => o.status === 'draft').length,
    approved: purchaseOrders.filter(o => o.status === 'approved').length,
    sent: purchaseOrders.filter(o => o.status === 'sent').length,
    received: purchaseOrders.filter(o => o.status === 'received').length,
  };

  const totalValue = purchaseOrders.reduce((acc, o) => acc + o.totalValue, 0);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 animate-fade-up">
          <div>
            <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <ShoppingCart className="w-6 h-6 text-primary" />
              Purchase Orders
            </h2>
            <p className="text-muted-foreground mt-1">Track and manage replenishment orders</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button size="sm">
              <Plus className="w-4 h-4 mr-2" />
              New PO
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 animate-fade-up" style={{ animationDelay: '0.1s' }}>
          <div className="bg-card rounded-xl border p-4">
            <div className="flex items-center gap-2 mb-2">
              <FileText className="w-4 h-4 text-muted-foreground" />
              <span className="text-xs text-muted-foreground uppercase">Drafts</span>
            </div>
            <p className="text-2xl font-bold text-foreground">{statusCounts.draft}</p>
          </div>
          <div className="bg-card rounded-xl border p-4">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="w-4 h-4 text-success" />
              <span className="text-xs text-muted-foreground uppercase">Approved</span>
            </div>
            <p className="text-2xl font-bold text-foreground">{statusCounts.approved}</p>
          </div>
          <div className="bg-card rounded-xl border p-4">
            <div className="flex items-center gap-2 mb-2">
              <Truck className="w-4 h-4 text-warning" />
              <span className="text-xs text-muted-foreground uppercase">In Transit</span>
            </div>
            <p className="text-2xl font-bold text-foreground">{statusCounts.sent}</p>
          </div>
          <div className="bg-card rounded-xl border p-4">
            <div className="flex items-center gap-2 mb-2">
              <Package className="w-4 h-4 text-primary" />
              <span className="text-xs text-muted-foreground uppercase">Received</span>
            </div>
            <p className="text-2xl font-bold text-foreground">{statusCounts.received}</p>
          </div>
          <div className="bg-card rounded-xl border p-4 col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-2">
              <ShoppingCart className="w-4 h-4 text-primary" />
              <span className="text-xs text-muted-foreground uppercase">Total Value</span>
            </div>
            <p className="text-2xl font-bold text-primary">${(totalValue / 1000).toFixed(0)}K</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center justify-between animate-fade-up" style={{ animationDelay: '0.15s' }}>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-muted-foreground" />
            <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
              {statusFilters.map((filter) => (
                <Button
                  key={filter.value}
                  variant="ghost"
                  size="sm"
                  onClick={() => setActiveFilter(filter.value)}
                  className={cn(
                    "h-8 px-3 text-xs font-medium",
                    activeFilter === filter.value 
                      ? "bg-background shadow-sm text-foreground" 
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {filter.label}
                </Button>
              ))}
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            Showing {filteredOrders.length} of {purchaseOrders.length} orders
          </p>
        </div>

        {/* Table */}
        <div className="animate-fade-up" style={{ animationDelay: '0.2s' }}>
          <PurchaseOrderTable orders={filteredOrders} />
        </div>

        {filteredOrders.length === 0 && (
          <div className="text-center py-12 bg-card rounded-xl border">
            <ShoppingCart className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-lg font-medium text-foreground">No orders found</p>
            <p className="text-sm text-muted-foreground">There are no purchase orders matching the selected filter.</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default PurchaseOrders;
