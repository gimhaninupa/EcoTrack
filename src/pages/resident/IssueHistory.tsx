import React from 'react';
import { DataTable } from '../../components/shared/DataTable';
import { Badge } from '../../components/ui/Badge';
import { FilterPanel } from '../../components/shared/FilterPanel';
import { SearchBar } from '../../components/shared/SearchBar';
export function ResidentIssueHistory() {
  const data = [{
    id: 'ISS-1023',
    type: 'Missed Pickup',
    date: 'Oct 24, 2023',
    status: 'Resolved',
    description: 'Trash not collected on scheduled day'
  }, {
    id: 'ISS-0998',
    type: 'Damaged Bin',
    date: 'Sep 15, 2023',
    status: 'In Progress',
    description: 'Wheel broken on recycling bin'
  }, {
    id: 'ISS-0854',
    type: 'Missed Pickup',
    date: 'Aug 02, 2023',
    status: 'Resolved',
    description: 'Skipped during route'
  }];
  const columns = [{
    header: 'ID',
    accessorKey: 'id' as const,
    cell: (item: any) => <span className="font-mono text-xs">{item.id}</span>
  }, {
    header: 'Type',
    accessorKey: 'type' as const
  }, {
    header: 'Date',
    accessorKey: 'date' as const
  }, {
    header: 'Description',
    accessorKey: 'description' as const,
    cell: (item: any) => <span className="truncate max-w-[200px] block">{item.description}</span>
  }, {
    header: 'Status',
    accessorKey: 'status' as const,
    cell: (item: any) => <Badge variant={item.status === 'Resolved' ? 'success' : 'warning'}>
          {item.status}
        </Badge>
  }];
  return <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Issue History</h2>
          <p className="text-neutral-500">
            Track the status of your reported issues.
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between gap-4">
        <SearchBar onSearch={() => {}} />
        <FilterPanel />
      </div>

      <DataTable data={data} columns={columns} />
    </div>;
}