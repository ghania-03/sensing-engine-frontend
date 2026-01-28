import { PurchaseOrder } from '@/lib/mockData';
import { cn } from '@/lib/utils';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Eye, FileText, Truck, Package, CheckCircle } from 'lucide-react';

interface PurchaseOrderTableProps {
  orders: PurchaseOrder[];
}

const statusConfig = {
  draft: { 
    label: 'Draft', 
    className: 'status-draft',
    icon: FileText,
  },
  approved: { 
    label: 'Approved', 
    className: 'status-approved',
    icon: CheckCircle,
  },
  sent: { 
    label: 'Sent', 
    className: 'status-in-review',
    icon: Truck,
  },
  received: { 
    label: 'Received', 
    className: 'bg-primary/10 text-primary',
    icon: Package,
  },
};

export function PurchaseOrderTable({ orders }: PurchaseOrderTableProps) {
  return (
    <div className="overflow-x-auto rounded-lg border bg-card">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="text-xs font-semibold uppercase">PO Number</TableHead>
            <TableHead className="text-xs font-semibold uppercase">Supplier</TableHead>
            <TableHead className="text-xs font-semibold uppercase text-center">Items</TableHead>
            <TableHead className="text-xs font-semibold uppercase text-right">Total Value</TableHead>
            <TableHead className="text-xs font-semibold uppercase">Status</TableHead>
            <TableHead className="text-xs font-semibold uppercase">Expected Delivery</TableHead>
            <TableHead className="text-xs font-semibold uppercase text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => {
            const config = statusConfig[order.status];
            const StatusIcon = config.icon;
            
            return (
              <TableRow key={order.id} className="hover:bg-muted/50 transition-colors">
                <TableCell className="font-medium text-foreground">{order.poNumber}</TableCell>
                <TableCell className="text-muted-foreground">{order.supplier}</TableCell>
                <TableCell className="text-center text-muted-foreground">{order.items}</TableCell>
                <TableCell className="text-right font-semibold text-foreground">
                  ${order.totalValue.toLocaleString()}
                </TableCell>
                <TableCell>
                  <span className={cn("status-badge", config.className)}>
                    <StatusIcon className="w-3 h-3" />
                    {config.label}
                  </span>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {new Date(order.expectedDelivery).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <Eye className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
