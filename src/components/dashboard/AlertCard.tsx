import { AIAlert } from '@/lib/mockData';
import { cn } from '@/lib/utils';
import { AlertTriangle, Clock, CheckCircle } from 'lucide-react';

interface AlertCardProps {
  alert: AIAlert;
}

const statusConfig = {
  action_required: {
    label: 'Action Required',
    icon: AlertTriangle,
    className: 'status-action-required',
  },
  in_review: {
    label: 'In Review',
    icon: Clock,
    className: 'status-in-review',
  },
  approved: {
    label: 'Approved',
    icon: CheckCircle,
    className: 'status-approved',
  },
};

export function AlertCard({ alert }: AlertCardProps) {
  const config = statusConfig[alert.status];
  const Icon = config.icon;

  return (
    <div className="p-4 rounded-lg border bg-card hover:shadow-sm transition-all duration-200 group">
      <div className="flex items-start gap-3">
        <div className={cn(
          "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
          alert.status === 'action_required' && "bg-destructive/10",
          alert.status === 'in_review' && "bg-warning/10",
          alert.status === 'approved' && "bg-success/10"
        )}>
          <Icon className={cn(
            "w-4 h-4",
            alert.status === 'action_required' && "text-destructive",
            alert.status === 'in_review' && "text-warning",
            alert.status === 'approved' && "text-success"
          )} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-foreground leading-snug">{alert.message}</p>
          <div className="flex items-center gap-3 mt-2">
            <span className={cn("status-badge", config.className)}>
              {config.label}
            </span>
            <span className="text-xs text-muted-foreground">{alert.timestamp}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
