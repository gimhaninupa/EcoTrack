import React from 'react';
import { DataTable } from '../../components/shared/DataTable';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Download } from 'lucide-react';
export function ResidentPaymentHistory() {
  const data = [{
    id: 'INV-2023-010',
    date: 'Oct 01, 2023',
    amount: '$45.00',
    status: 'Paid',
    method: 'Visa •••• 4242'
  }, {
    id: 'INV-2023-009',
    date: 'Sep 01, 2023',
    amount: '$45.00',
    status: 'Paid',
    method: 'Visa •••• 4242'
  }, {
    id: 'INV-2023-008',
    date: 'Aug 01, 2023',
    amount: '$45.00',
    status: 'Paid',
    method: 'Visa •••• 4242'
  }];
  const columns = [{
    header: 'Invoice',
    accessorKey: 'id' as const,
    cell: (item: any) => <span className="font-mono text-xs font-medium">{item.id}</span>
  }, {
    header: 'Date',
    accessorKey: 'date' as const
  }, {
    header: 'Amount',
    accessorKey: 'amount' as const,
    cell: (item: any) => <span className="font-mono">{item.amount}</span>
  }, {
    header: 'Payment Method',
    accessorKey: 'method' as const,
    cell: (item: any) => <span className="text-neutral-500">{item.method}</span>
  }, {
    header: 'Status',
    accessorKey: 'status' as const,
    cell: (item: any) => <Badge variant="success">{item.status}</Badge>
  }, {
    header: 'Actions',
    accessorKey: 'id' as const,
    cell: () => <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
          <Download className="h-4 w-4 text-neutral-500" />
        </Button>
  }];
  return <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            Billing & Payments
          </h2>
          <p className="text-neutral-500">
            View your payment history and download receipts.
          </p>
        </div>
      </div>

      <DataTable data={data} columns={columns} />
    </div>;
}