import React from 'react';
import { Card } from '../../components/ui/Card';
import { Map } from '../../components/shared/Map';
import { Button } from '../../components/ui/Button';
import { DataTable } from '../../components/shared/DataTable';
import { Plus } from 'lucide-react';
export function AdminRouteManagement() {
  const routes = [{
    id: 'RT-101',
    name: 'North District A',
    driver: 'Mike S.',
    status: 'Active',
    progress: '65%'
  }, {
    id: 'RT-102',
    name: 'North District B',
    driver: 'Sarah J.',
    status: 'Active',
    progress: '42%'
  }, {
    id: 'RT-103',
    name: 'Downtown Commercial',
    driver: 'Tom H.',
    status: 'Completed',
    progress: '100%'
  }];
  const columns = [{
    header: 'Route ID',
    accessorKey: 'id' as const,
    cell: (item: any) => <span className="font-mono text-xs">{item.id}</span>
  }, {
    header: 'Name',
    accessorKey: 'name' as const
  }, {
    header: 'Driver',
    accessorKey: 'driver' as const
  }, {
    header: 'Status',
    accessorKey: 'status' as const
  }, {
    header: 'Progress',
    accessorKey: 'progress' as const
  }];
  return <div className="h-[calc(100vh-8rem)] flex flex-col space-y-4">
      <div className="flex items-center justify-between flex-shrink-0">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            Route Management
          </h2>
          <p className="text-neutral-500">
            Optimize and assign collection routes.
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Create New Route
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0">
        <div className="lg:col-span-2 h-full flex flex-col">
          <Card className="flex-1 p-0 overflow-hidden border-0 shadow-md">
            <Map className="h-full w-full rounded-none border-0" />
          </Card>
        </div>

        <div className="flex flex-col gap-4 overflow-y-auto">
          <Card className="flex-1">
            <div className="p-4 border-b border-neutral-100">
              <h3 className="font-semibold text-sm">Active Routes</h3>
            </div>
            <div className="p-2">
              <DataTable data={routes} columns={columns} />
            </div>
          </Card>
        </div>
      </div>
    </div>;
}