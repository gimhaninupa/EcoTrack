import React, { useState } from 'react';
import { DataTable } from '../../components/shared/DataTable';
import { Badge } from '../../components/ui/Badge';
import { FilterPanel } from '../../components/shared/FilterPanel';
import { SearchBar } from '../../components/shared/SearchBar';
import { useService } from '../../context/ServiceContext';
import { Button } from '../../components/ui/Button';

export function ResidentIssueHistory() {
  const { issues, pickups } = useService();
  const [activeTab, setActiveTab] = useState<'issues' | 'schedules'>('issues');

  const issueColumns = [{
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

  const scheduleColumns = [{
    header: 'ID',
    accessorKey: 'id' as const,
    cell: (item: any) => <span className="font-mono text-xs text-neutral-500">{item.id}</span>
  }, {
    header: 'Date',
    accessorKey: 'date' as const,
    cell: (item: any) => item.date.toLocaleDateString()
  }, {
    header: 'Type',
    accessorKey: 'type' as const
  }, {
    header: 'Status',
    accessorKey: 'status' as const,
    cell: (item: any) => <Badge variant="secondary">{item.status}</Badge>
  }];

  // Filter completed schedules
  const completedSchedules = pickups.filter(p => p.status === 'Completed' || p.date < new Date());

  return <div className="space-y-6">
    <div className="flex items-center justify-between">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">History</h2>
        <p className="text-neutral-500">
          View your reported issues and past collection schedules.
        </p>
      </div>
    </div>

    {/* Tabs */}
    <div className="flex items-center gap-1 bg-neutral-100 p-1 rounded-lg w-fit">
      <button
        onClick={() => setActiveTab('issues')}
        className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${activeTab === 'issues'
            ? 'bg-white text-forest-700 shadow-sm'
            : 'text-neutral-500 hover:text-neutral-700'
          }`}
      >
        Reported Issues
      </button>
      <button
        onClick={() => setActiveTab('schedules')}
        className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${activeTab === 'schedules'
            ? 'bg-white text-forest-700 shadow-sm'
            : 'text-neutral-500 hover:text-neutral-700'
          }`}
      >
        Completed Schedules
      </button>
    </div>

    <div className="flex items-center justify-between gap-4">
      <SearchBar onSearch={() => { }} />
      <FilterPanel />
    </div>

    {activeTab === 'issues' ? (
      <DataTable data={issues} columns={issueColumns} />
    ) : (
      <DataTable data={completedSchedules} columns={scheduleColumns} />
    )}
  </div>;
}