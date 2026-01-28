import { SKUMapping } from '@/lib/mockData';
import { ArrowRight } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

interface SKUMappingCardProps {
  mappings: SKUMapping[];
}

export function SKUMappingCard({ mappings }: SKUMappingCardProps) {
  return (
    <div className="space-y-3">
      {mappings.map((mapping) => (
        <div 
          key={mapping.id}
          className="p-4 rounded-lg border bg-card hover:shadow-sm transition-all duration-200"
        >
          <div className="flex items-center gap-3">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">{mapping.trendKeyword}</p>
            </div>
            <ArrowRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
            <div className="flex-1 min-w-0 text-right">
              <p className="text-sm font-medium text-primary truncate">{mapping.skuName}</p>
              <p className="text-xs text-muted-foreground">{mapping.skuId}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 mt-3">
            <span className="text-xs text-muted-foreground">Confidence</span>
            <Progress 
              value={mapping.confidence} 
              className={cn(
                "h-1.5 flex-1",
                mapping.confidence >= 90 && "[&>div]:bg-success",
                mapping.confidence >= 80 && mapping.confidence < 90 && "[&>div]:bg-primary",
                mapping.confidence < 80 && "[&>div]:bg-warning"
              )}
            />
            <span className="text-xs font-medium text-foreground w-8">{mapping.confidence}%</span>
          </div>
        </div>
      ))}
    </div>
  );
}
