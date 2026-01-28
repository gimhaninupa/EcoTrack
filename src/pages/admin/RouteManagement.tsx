import React, { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Map } from '../../components/shared/Map';
import { Button } from '../../components/ui/Button';
import { DataTable } from '../../components/shared/DataTable';
import { Plus, X, Pencil, Trash2 } from 'lucide-react';
import { useAdmin, AdminRoute } from '../../context/AdminContext';
import { Input } from '../../components/ui/Input';

export function AdminRouteManagement() {
  const { routes, addRoute, updateRoute, deleteRoute } = useAdmin();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRoute, setEditingRoute] = useState<AdminRoute | null>(null);
  const [newRoute, setNewRoute] = useState({ name: '', driver: '', status: 'Active' as const, progress: '0%' });

  const handleOpenCreate = () => {
    setEditingRoute(null);
    setNewRoute({ name: '', driver: '', status: 'Active', progress: '0%' });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (route: AdminRoute) => {
    setEditingRoute(route);
    setNewRoute({
      name: route.name,
      driver: route.driver,
      status: route.status,
      progress: route.progress
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this route?')) {
      deleteRoute(id);
    }
  };

  const handleSubmit = () => {
    if (!newRoute.name || !newRoute.driver) return;

    if (editingRoute) {
      updateRoute(editingRoute.id, newRoute);
    } else {
      addRoute(newRoute);
    }

    setIsModalOpen(false);
    setEditingRoute(null);
    setNewRoute({ name: '', driver: '', status: 'Active', progress: '0%' });
  };

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
    header: 'Actions',
    accessorKey: 'id' as const,
    cell: (item: any) => (
      <div className="flex gap-2">
        <Button variant="ghost" size="icon" onClick={() => handleOpenEdit(item)}>
          <Pencil className="h-3 w-3" />
        </Button>
        <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600" onClick={() => handleDelete(item.id)}>
          <Trash2 className="h-3 w-3" />
        </Button>
      </div>
    )
  }];

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col space-y-4">
      <div className="flex items-center justify-between flex-shrink-0">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            Route Management
          </h2>
          <p className="text-neutral-500">
            Optimize and assign collection routes.
          </p>
        </div>
        <Button onClick={handleOpenCreate}>
          <Plus className="mr-2 h-4 w-4" />
          Create New Route
        </Button>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <Card className="w-full max-w-md p-6 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold">
                {editingRoute ? 'Edit Route' : 'Add New Route'}
              </h3>
              <Button variant="ghost" size="icon" onClick={() => setIsModalOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium">Route Name</label>
                <Input
                  value={newRoute.name}
                  onChange={e => setNewRoute({ ...newRoute, name: e.target.value })}
                  placeholder="e.g. Zone A Collection"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Driver Name</label>
                <Input
                  value={newRoute.driver}
                  onChange={e => setNewRoute({ ...newRoute, driver: e.target.value })}
                  placeholder="e.g. John Doe"
                />
              </div>
              <Button className="w-full" onClick={handleSubmit}>
                {editingRoute ? 'Save Changes' : 'Create Route'}
              </Button>
            </div>
          </Card>
        </div>
      )}

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
    </div>
  );
}