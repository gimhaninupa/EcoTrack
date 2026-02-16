import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Truck, TrendingUp, Plus, MapPin, AlertCircle, Users } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { serviceService } from '../../services/serviceService';
import { requestService } from '../../services/requestService';
import { Input } from '../../components/ui/Input';

export function AdminDashboard() {
  const { user } = useAuth();
  const [services, setServices] = useState<any[]>([]);
  const [requests, setRequests] = useState<any[]>([]);
  const [showCreateService, setShowCreateService] = useState(false);
  const [newService, setNewService] = useState({ serviceName: '', description: '', area: '' });

  useEffect(() => {
    if (!user?.uid) return;

    let unsubServices: (() => void) | undefined;
    let unsubRequests: (() => void) | undefined;

    // Small delay to ensure auth state is stable and component is mounted
    const timeoutId = setTimeout(() => {
      console.log('AdminDashboard: Subscribing to data...');

      // Subscribe to Services
      unsubServices = serviceService.subscribeToAdminServices(user.uid, (data) => {
        setServices(data);
      });

      // Subscribe to Requests
      unsubRequests = requestService.subscribeToAdminRequests(user.uid, (data) => {
        setRequests(data);
      });
    }, 500);

    return () => {
      console.log('AdminDashboard: Cleaning up subscriptions...');
      clearTimeout(timeoutId);
      if (unsubServices) unsubServices();
      if (unsubRequests) unsubRequests();
    };
  }, [user?.uid]);

  const handleCreateService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.uid) return;
    try {
      await serviceService.createService(user.uid, newService);
      setShowCreateService(false);
      setNewService({ serviceName: '', description: '', area: '' });
      alert('Service created successfully!');
    } catch (error) {
      console.error(error);
      alert('Failed to create service');
    }
  };

  const handleStatusUpdate = async (requestId: string, newStatus: 'accepted' | 'completed') => {
    try {
      await requestService.updateRequestStatus(requestId, newStatus);
    } catch (error) {
      console.error(error);
      alert('Failed to update status');
    }
  };

  // KPI Calculations
  const totalServices = services.length;
  const pendingRequests = requests.filter(r => r.status === 'pending').length;
  const completedRequests = requests.filter(r => r.status === 'completed').length;
  const totalRequests = requests.length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Admin Overview</h2>
          <p className="text-neutral-500">Welcome back, {user?.name}</p>
        </div>
        <Button onClick={() => setShowCreateService(!showCreateService)}>
          <Plus className="mr-2 h-4 w-4" /> Create New Service
        </Button>
      </div>

      {/* Create Service Form */}
      {showCreateService && (
        <Card className="border-forest-200 bg-forest-50/30 shadow-sm animate-in fade-in slide-in-from-top-4">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-forest-800">
              <Plus className="h-5 w-5" />
              Add New Waste Collection Service
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreateService} className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 items-end">
              <div className="space-y-2">
                <label className="text-sm font-medium text-forest-900">Service Name</label>
                <Input
                  placeholder="e.g., Weekly Pickup"
                  value={newService.serviceName}
                  onChange={e => setNewService({ ...newService, serviceName: e.target.value })}
                  required
                  className="bg-white border-forest-200 focus:border-forest-500 focus:ring-forest-500"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-forest-900">Area</label>
                <Input
                  placeholder="e.g., Colombo 03"
                  value={newService.area}
                  onChange={e => setNewService({ ...newService, area: e.target.value })}
                  required
                  className="bg-white border-forest-200 focus:border-forest-500 focus:ring-forest-500"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-forest-900">Description</label>
                <Input
                  placeholder="Service details"
                  value={newService.description}
                  onChange={e => setNewService({ ...newService, description: e.target.value })}
                  required
                  className="bg-white border-forest-200 focus:border-forest-500 focus:ring-forest-500"
                />
              </div>
              <div className="flex gap-3">
                <Button type="button" variant="ghost" onClick={() => setShowCreateService(false)} className="flex-1 hover:bg-forest-100/50 hover:text-forest-700">
                  Cancel
                </Button>
                <Button type="submit" className="flex-1 bg-forest-600 hover:bg-forest-700 shadow-md shadow-forest-200 font-medium">
                  Publish Service
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-white border-neutral-100 shadow-sm hover:shadow-md transition-all duration-200 rounded-xl overflow-hidden group">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-500">Total Services</p>
                <p className="text-3xl font-bold text-neutral-900 mt-2 tracking-tight">{totalServices}</p>
              </div>
              <div className="h-12 w-12 rounded-2xl bg-neutral-50 flex items-center justify-center group-hover:bg-neutral-100 transition-colors">
                <Truck className="h-6 w-6 text-neutral-500 group-hover:text-neutral-700 transition-colors" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white border-neutral-100 shadow-sm hover:shadow-md transition-all duration-200 rounded-xl overflow-hidden group">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-500">Pending Requests</p>
                <p className="text-3xl font-bold text-neutral-900 mt-2 tracking-tight">{pendingRequests}</p>
              </div>
              <div className="h-12 w-12 rounded-2xl bg-amber-50 flex items-center justify-center group-hover:bg-amber-100 transition-colors">
                <AlertCircle className="h-6 w-6 text-amber-600 transition-colors" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white border-neutral-100 shadow-sm hover:shadow-md transition-all duration-200 rounded-xl overflow-hidden group">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-500">Completed Jobs</p>
                <p className="text-3xl font-bold text-neutral-900 mt-2 tracking-tight">{completedRequests}</p>
              </div>
              <div className="h-12 w-12 rounded-2xl bg-emerald-50 flex items-center justify-center group-hover:bg-emerald-100 transition-colors">
                <TrendingUp className="h-6 w-6 text-emerald-600 transition-colors" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white border-neutral-100 shadow-sm hover:shadow-md transition-all duration-200 rounded-xl overflow-hidden group">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-500">Total Requests</p>
                <p className="text-3xl font-bold text-neutral-900 mt-2 tracking-tight">{totalRequests}</p>
              </div>
              <div className="h-12 w-12 rounded-2xl bg-blue-50 flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                <Users className="h-6 w-6 text-blue-600 transition-colors" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Services List */}
        <Card className="border-neutral-100 shadow-sm rounded-xl overflow-hidden bg-white">
          <CardHeader className="border-b border-neutral-50 bg-white px-6 py-4">
            <CardTitle className="text-lg font-bold text-neutral-900">Your Active Services</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {services.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                <div className="h-12 w-12 rounded-full bg-neutral-50 flex items-center justify-center mb-3">
                  <Truck className="h-6 w-6 text-neutral-300" />
                </div>
                <p className="text-neutral-900 font-medium">No services created yet</p>
                <p className="text-neutral-500 text-sm mt-1">Create a new service to start accepting requests.</p>
                <Button variant="outline" size="sm" className="mt-4" onClick={() => setShowCreateService(true)}>
                  Create Service
                </Button>
              </div>
            ) : (
              <div className="divide-y divide-neutral-100">
                {services.map(service => (
                  <div key={service.id} className="flex justify-between items-center p-4 hover:bg-neutral-50 transition-colors group">
                    <div className="flex items-start gap-4">
                      <div className="h-10 w-10 rounded-lg bg-forest-50 flex items-center justify-center flex-shrink-0">
                        <MapPin className="h-5 w-5 text-forest-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-neutral-900 text-sm">{service.serviceName}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-600">
                            {service.area}
                          </span>
                          <span className="text-xs text-neutral-400 truncate max-w-[200px]">
                            {service.description}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-medium">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                        Active
                      </span>
                      <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                        Details
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Incoming Requests */}
        <Card className="border-neutral-100 shadow-sm rounded-xl overflow-hidden bg-white">
          <CardHeader className="border-b border-neutral-50 bg-white px-6 py-4">
            <CardTitle className="text-lg font-bold text-neutral-900">Recent Requests</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {requests.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                <div className="h-12 w-12 rounded-full bg-neutral-50 flex items-center justify-center mb-3">
                  <Users className="h-6 w-6 text-neutral-300" />
                </div>
                <p className="text-neutral-900 font-medium">No requests received yet</p>
                <p className="text-neutral-500 text-sm mt-1">Requests from residents will appear here.</p>
              </div>
            ) : (
              <div className="divide-y divide-neutral-100">
                {requests.map(request => (
                  <div key={request.id} className="flex justify-between items-center p-4 hover:bg-neutral-50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className={`h-2 w-2 rounded-full flex-shrink-0 ${request.status === 'pending' ? 'bg-amber-500' :
                        request.status === 'accepted' ? 'bg-blue-500' :
                          'bg-emerald-500'
                        }`} />
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium text-neutral-900 text-sm">Service Request</h4>
                          <span className="text-xs text-neutral-400">
                            ID: {request.clientId.substring(0, 8)}
                          </span>
                        </div>
                        <div className="mt-1">
                          <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${request.status === 'pending' ? 'bg-amber-50 text-amber-700' :
                            request.status === 'accepted' ? 'bg-blue-50 text-blue-700' :
                              'bg-emerald-50 text-emerald-700'
                            }`}>
                            {request.status}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {request.status === 'pending' && (
                        <Button size="sm" onClick={() => handleStatusUpdate(request.id, 'accepted')} className="bg-white border border-neutral-200 text-neutral-700 hover:bg-forest-50 hover:text-forest-700 hover:border-forest-200 shadow-sm h-8 text-xs">
                          Accept
                        </Button>
                      )}
                      {request.status === 'accepted' && (
                        <Button size="sm" onClick={() => handleStatusUpdate(request.id, 'completed')} className="bg-forest-600 hover:bg-forest-700 text-white shadow-sm h-8 text-xs">
                          Complete
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}