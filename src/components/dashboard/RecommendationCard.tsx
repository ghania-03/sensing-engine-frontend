import { AIRecommendation } from '@/lib/mockData';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Check, X, Eye, Package, Truck, DollarSign } from 'lucide-react';

interface RecommendationCardProps {
  recommendation: AIRecommendation;
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
  onViewDetails?: (id: string) => void;
}

const statusConfig = {
  drafted: { label: 'Draft', className: 'status-draft' },
  pending: { label: 'Pending Approval', className: 'status-in-review' },
  approved: { label: 'Approved', className: 'status-approved' },
  rejected: { label: 'Rejected', className: 'status-action-required' },
};

export function RecommendationCard({ 
  recommendation, 
  onApprove, 
  onReject, 
  onViewDetails 
}: RecommendationCardProps) {
  const config = statusConfig[recommendation.status];

  return (
    <div className="p-5 rounded-xl border bg-card hover:shadow-md transition-all duration-200">
      <div className="flex items-start justify-between gap-4 mb-4">
        <div>
          <h4 className="font-semibold text-foreground">{recommendation.skuName}</h4>
          <p className="text-sm text-muted-foreground">{recommendation.skuId}</p>
        </div>
        <span className={cn("status-badge", config.className)}>
          {config.label}
        </span>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <Package className="w-4 h-4 text-primary" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Action</p>
            <p className="text-sm font-medium text-foreground">{recommendation.action}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-info/10 flex items-center justify-center">
            <Truck className="w-4 h-4 text-info" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Quantity</p>
            <p className="text-sm font-medium text-foreground">{recommendation.quantity} units</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-success/10 flex items-center justify-center">
            <DollarSign className="w-4 h-4 text-success" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Protected</p>
            <p className="text-sm font-medium text-success">${recommendation.revenueProtected.toLocaleString()}</p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-border">
        <p className="text-xs text-muted-foreground">
          Supplier: <span className="font-medium text-foreground">{recommendation.supplier}</span>
        </p>
        
        {(recommendation.status === 'pending' || recommendation.status === 'drafted') && (
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onViewDetails?.(recommendation.id)}
              className="h-8 px-3 text-xs"
            >
              <Eye className="w-3.5 h-3.5 mr-1" />
              Details
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onReject?.(recommendation.id)}
              className="h-8 px-3 text-xs text-destructive hover:text-destructive hover:bg-destructive/10"
            >
              <X className="w-3.5 h-3.5 mr-1" />
              Reject
            </Button>
            <Button
              size="sm"
              onClick={() => onApprove?.(recommendation.id)}
              className="h-8 px-3 text-xs"
            >
              <Check className="w-3.5 h-3.5 mr-1" />
              Approve
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
