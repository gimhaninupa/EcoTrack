import React, { useState } from 'react';
import { Truck, TrendingUp, Plus, MapPin, AlertCircle, CheckCircle, Clock, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { StatCard } from '../../components/ui/StatCard';
import { Button } from '../../components/ui/Button';
import { useAdmin } from '../../context/AdminContext';
import { useService } from '../../context/ServiceContext';
import { requestService, ServiceRequest } from '../../services/requestService';
import { useFirestoreListener } from '../../hooks/useFirestoreListener';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { AdminActivityFeed } from './ActivityFeed';

export function AdminDashboard() {
  const { trucks, schedules, invoices, issues } = useAdmin();
  const { services, createService } = useService();

  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const [newService, setNewService] = useState({
    name: '',
    description: '',
    frequency: 'Weekly',
    area: '',
    nextCollection: ''
  });

  // Real-time listener for ALL requests
  const { data: requests, loading } = useFirestoreListener<ServiceRequest>({
    collectionName: 'requests',
    sort: { field: 'createdAt', direction: 'desc' }
  });

  const handleStatusUpdate = async (requestId: string, newStatus: 'pending' | 'accepted' | 'completed' | 'cancelled') => {
    try {
      await requestService.updateRequestStatus(requestId, newStatus);
    } catch (error) {
      console.error("Failed to update status", error);
      alert("Failed to update request status.");
    }
  };

  const handleCreateService = (e: React.FormEvent) => {
    e.preventDefault();
    createService(newService);
    setIsServiceModalOpen(false);
    setNewService({ name: '', description: '', frequency: 'Weekly', area: '', nextCollection: '' });
  };

  const pendingRequestsCount = requests ? requests.filter(r => r.status === 'pending').length : 0;
  const completedJobsCount = requests ? requests.filter(r => r.status === 'completed').length : 0;
  const activeTrucksCount = trucks.filter(t => t.status === 'En Route').length;

  return (
    <div className="space-y-8 p-1">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-neutral-900">Admin Dashboard</h2>
          <p className="text-neutral-500 mt-1">Monitor waste management operations and fleet status.</p>
        </div>
        <div className="flex gap-3">
          <Button onClick={() => setIsServiceModalOpen(true)} className="bg-forest-600 hover:bg-forest-700 text-white shadow-md shadow-forest-200">
            <Plus className="mr-2 h-4 w-4" /> Create Service
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Pending Requests"
          value={loading ? '...' : pendingRequestsCount}
          description="Requires attention"
          icon={AlertCircle}
          color="amber"
        />
        <StatCard
          title="Completed Jobs"
          value={loading ? '...' : completedJobsCount}
          description="Lifetime total"
          icon={CheckCircle}
          color="emerald"
          trend={{ value: 12, label: 'vs last week', positive: true }}
        />
        <StatCard
          title="Active Trucks"
          value={activeTrucksCount}
          description="Currently on route"
          icon={Truck}
          color="blue"
        />
        <StatCard
          title="Total Services"
          value={services.length}
          description="Active service areas"
          icon={TrendingUp}
          color="purple"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-6">

          <AdminActivityFeed />

          <Card>
            <CardHeader>
              <CardTitle>Fleet Status Map</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-neutral-100 rounded-lg aspect-video flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://api.mapbox.com/styles/v1/mapbox/light-v10/static/80.0088,6.8485,13,0/800x450?access_token=pk.eyJ1IjoiZWNvdHJhY2siLCJhIjoiY2x0bnh5ZzFvMDJqaTJrbzF0ZGJ5bXF6ayJ9.placeholder')] bg-cover bg-center opacity-50" />
                <div className="z-10 text-center">
                  <MapPin className="h-8 w-8 text-forest-500 mx-auto mb-2 animate-bounce" />
                  <p className="font-medium text-neutral-600">Live Map Unavailable in Demo</p>
                  <p className="text-xs text-neutral-400 mt-1">Showing simulated truck positions</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Incoming Requests Section (Real-time) */}
          <Card className="h-full border-neutral-200/60 shadow-sm">
            <CardHeader className="border-b border-neutral-100 bg-neutral-50/30">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Incoming Live Requests</CardTitle>
                <div className="flex gap-2">
                  <span className="text-xs font-medium px-2 py-1 bg-white border border-neutral-200 rounded-full text-neutral-600">
                    Live Feed
                  </span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-neutral-100">
                {loading ? (
                  <div className="p-8 text-center text-neutral-500">Loading requests...</div>
                ) : requests.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-neutral-500">
                    <AlertCircle className="h-10 w-10 mb-3 opacity-10" />
                    <p>No requests found</p>
                  </div>
                ) : (
                  requests.slice(0, 7).map((request) => (
                    <div key={request.id} className="group flex items-start justify-between p-4 hover:bg-neutral-50/50 transition-colors">
                      <div className="flex gap-4">
                        <div className={`mt-1 h-2.5 w-2.5 rounded-full flex-shrink-0 shadow-sm ${request.status === 'pending' ? 'bg-amber-500' :
                          request.status === 'accepted' ? 'bg-blue-500' :
                            request.status === 'completed' ? 'bg-emerald-500' : 'bg-red-500'
                          }`}
                        />
                        <div>
                          <p className="font-semibold text-neutral-900 text-sm">{request.clientName}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="inline-flex items-center rounded-md bg-neutral-100 px-2 py-0.5 text-xs font-medium text-neutral-600 ring-1 ring-inset ring-neutral-500/10">
                              {request.wasteType}
                            </span>
                          </div>
                          <p className="text-xs text-neutral-500 flex items-center gap-1 mt-2">
                            <MapPin className="h-3 w-3" /> {request.location || request.clientAddress}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <span className="text-xs text-neutral-400 flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {request.createdAt?.seconds ? new Date(request.createdAt.seconds * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Just now'}
                        </span>
                        {request.status === 'pending' && (
                          <Button size="sm" className="h-8 text-xs bg-neutral-900 hover:bg-neutral-800 text-white" onClick={() => handleStatusUpdate(request.id!, 'accepted')}>
                            Accept Request
                          </Button>
                        )}
                        {request.status === 'accepted' && (
                          <Button size="sm" variant="outline" className="h-8 text-xs border-emerald-200 text-emerald-700 hover:bg-emerald-50 hover:text-emerald-800 hover:border-emerald-300" onClick={() => handleStatusUpdate(request.id!, 'completed')}>
                            Mark Complete
                          </Button>
                        )}
                        {request.status === 'completed' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-100">
                            <CheckCircle className="h-3 w-3" />
                            Completed
                          </span>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Area */}
        <div className="space-y-6">
          {/* Services List */}
          <Card className="border-neutral-200/60 shadow-sm">
            <CardHeader className="border-b border-neutral-100 pb-4">
              <CardTitle className="text-lg">Active Services</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="space-y-3">
                {services.map(service => (
                  <div key={service.id} className="p-3 bg-white border border-neutral-100 rounded-xl hover:border-forest-200 hover:shadow-sm transition-all">
                    <div className="flex justify-between items-start mb-2">
                      <div className="p-1.5 bg-forest-50 rounded-lg">
                        <Calendar className="h-4 w-4 text-forest-600" />
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-forest-600 bg-forest-50 px-2 py-0.5 rounded-full">
                        Active
                      </span>
                    </div>
                    <div>
                      <p className="font-semibold text-sm text-neutral-900">{service.name}</p>
                      <p className="text-xs text-neutral-500 mt-1">{service.area}</p>
                      <div className="mt-2 flex items-center text-xs font-medium text-neutral-600 bg-neutral-100/50 px-2 py-1 rounded w-fit">
                        {service.frequency}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Create Service Modal */}
      <Modal
        isOpen={isServiceModalOpen}
        onClose={() => setIsServiceModalOpen(false)}
        title="Create New Service"
        description="Add a new waste collection service to the catalog."
      >
        <form onSubmit={handleCreateService} className="space-y-4 mt-4">
          <Input
            label="Service Name"
            placeholder="e.g. Daily Plastic Collection"
            value={newService.name}
            onChange={(e) => setNewService({ ...newService, name: e.target.value })}
            required
          />
          <Input
            label="Description"
            placeholder="Brief description of what is collected"
            value={newService.description}
            onChange={(e) => setNewService({ ...newService, description: e.target.value })}
            required
          />
          <Select
            label="Frequency"
            value={newService.frequency}
            onChange={(e) => setNewService({ ...newService, frequency: e.target.value })}
            options={[
              { label: 'Daily', value: 'Daily' },
              { label: 'Weekly', value: 'Weekly' },
              { label: 'Bi-Weekly', value: 'Bi-Weekly' },
              { label: 'Monthly', value: 'Monthly' }
            ]}
          />
          <Input
            label="Target Area"
            placeholder="e.g. Kottawa, Homagama"
            value={newService.area}
            onChange={(e) => setNewService({ ...newService, area: e.target.value })}
            required
          />
          <Input
            label="Next Collection"
            placeholder="e.g. Tomorrow at 8 AM"
            value={newService.nextCollection}
            onChange={(e) => setNewService({ ...newService, nextCollection: e.target.value })}
            required
          />
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="ghost" type="button" onClick={() => setIsServiceModalOpen(false)}>Cancel</Button>
            <Button type="submit">Publish Service</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}