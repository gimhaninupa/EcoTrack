import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { StatCard } from '../../components/ui/StatCard';
import { Button } from '../../components/ui/Button';
import { Calendar, Clock, Truck, Search, MapPin, FileText, Plus, ChevronRight, Leaf } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useService } from '../../context/ServiceContext';
import { requestService, ServiceRequest } from '../../services/requestService';
import { useFirestoreListener } from '../../hooks/useFirestoreListener';
import { where } from 'firebase/firestore';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';

export function ResidentDashboard() {
  const { user } = useAuth();
  const { services } = useService();
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [requestType, setRequestType] = useState('Bulk Pickup');
  const [requestLocation, setRequestLocation] = useState(user?.address || user?.location || '');

  // Real-time listener for THIS resident's requests
  const { data: requests, loading } = useFirestoreListener<ServiceRequest>({
    collectionName: 'requests',
    filters: user ? [where('clientId', '==', user.uid)] : [],
    sort: { field: 'createdAt', direction: 'desc' }
  });

  const activeRequestsCount = requests.filter(r => r.status === 'pending' || r.status === 'accepted').length;
  const completedRequestsCount = requests.filter(r => r.status === 'completed').length;

  const handleCreateRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      await requestService.createRequest(
        user.uid,
        user.name,
        requestLocation, // Use the form location or user address
        requestType,
        requestLocation
      );
      setIsRequestModalOpen(false);
    } catch (error) {
      console.error("Failed to create request", error);
      alert("Failed to submit request. Please try again.");
    }
  };

  const handleRequestService = async (service: any) => {
    if (!user) return;
    const address = user.address || user.location;
    if (!user.name || !address) {
      alert("Please update your profile with Name and Address in Settings before requesting services.");
      return;
    }

    const confirmRequest = window.confirm(`Request ${service.name} for your registered address?`);
    if (confirmRequest) {
      try {
        await requestService.createRequest(
          user.uid,
          user.name,
          address,
          service.name,
          address
        );
      } catch (error) {
        console.error("Error requesting service:", error);
        alert("Failed to request service.");
      }
    }
  };

  return (
    <div className="space-y-8 p-1">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-forest-900 rounded-2xl p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10 transform translate-x-10 -translate-y-10">
          <Truck className="h-64 w-64" />
        </div>
        <div className="relative z-10">
          <h2 className="text-3xl font-bold tracking-tight">Welcome back, {user?.name?.split(' ')[0] || 'Resident'}!</h2>
          <p className="text-forest-100 mt-2 max-w-xl">
            Track your waste collection, schedule pickups, and manage your eco-footprint all in one place.
          </p>
        </div>
        <div className="relative z-10">
          <Button onClick={() => setIsRequestModalOpen(true)} className="bg-white text-forest-900 hover:bg-forest-50 border-0 shadow-lg font-semibold">
            <Plus className="mr-2 h-4 w-4" /> New Special Request
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Active Requests"
          value={loading ? '...' : activeRequestsCount}
          description="Pending or in progress"
          icon={Clock}
          color="amber"
        />
        <StatCard
          title="Completed Services"
          value={loading ? '...' : completedRequestsCount}
          description="Lifetime total"
          icon={Truck}
          color="forest"
        />
        <StatCard
          title="Next Pickup"
          value="Tue, 14th"
          description="General Waste"
          icon={Calendar}
          color="blue"
        />
        <div className="rounded-xl border border-neutral-200/60 bg-white p-6 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-neutral-500">Eco Points</span>
            <Leaf className="h-4 w-4 text-emerald-500" />
          </div>
          <div>
            <div className="text-2xl font-bold tracking-tight text-neutral-900">250 pts</div>
            <div className="text-xs text-neutral-500 mt-1">Level 2 Contributor</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Available Services */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-neutral-900">Available Services</h3>
            <div className="relative w-64">
              <Search className="absolute left-3 top-3 h-4 w-4 text-neutral-400" />
              <input placeholder="Search services..." className="pl-9 h-10 w-full rounded-full border border-neutral-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-forest-500 shadow-sm transition-all" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {services.map((service) => (
              <Card key={service.id} className="overflow-hidden hover:border-forest-200 hover:shadow-md transition-all group duration-300">
                <CardContent className="p-0">
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="p-2.5 bg-forest-50 rounded-xl text-forest-600 group-hover:bg-forest-600 group-hover:text-white transition-colors duration-300">
                        <Truck className="h-6 w-6" />
                      </div>
                      <span className="inline-flex items-center rounded-full bg-neutral-100 px-2.5 py-1 text-xs font-semibold text-neutral-600 uppercase tracking-wide">
                        {service.frequency}
                      </span>
                    </div>
                    <h4 className="text-lg font-bold mb-2 text-neutral-900 group-hover:text-forest-700 transition-colors">{service.name}</h4>
                    <p className="text-sm text-neutral-500 mb-6 line-clamp-2 leading-relaxed">
                      {service.description}
                    </p>
                    <div className="flex items-center justify-between pt-4 border-t border-neutral-100">
                      <div className="text-xs font-medium text-neutral-500 flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5" /> Next: {service.nextCollection}
                      </div>
                      <Button
                        size="sm"
                        className="rounded-full px-5 bg-neutral-900 hover:bg-forest-600 transition-all shadow-sm group-hover:shadow-forest-100"
                        onClick={() => handleRequestService(service)}
                      >
                        Request
                        <ChevronRight className="ml-1 h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* My Requests List (Real-time) */}
        <div className="space-y-6">
          <Card className="h-full border-neutral-200/60 shadow-sm">
            <CardHeader className="border-b border-neutral-100 pb-4">
              <CardTitle className="text-lg">Recent Requests</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="divide-y divide-neutral-100">
                {loading ? (
                  <p className="p-6 text-sm text-neutral-500 text-center">Loading requests...</p>
                ) : requests.length === 0 ? (
                  <div className="p-8 text-center">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-neutral-100 mb-3">
                      <FileText className="h-6 w-6 text-neutral-400" />
                    </div>
                    <p className="text-sm font-medium text-neutral-900">No requests yet</p>
                    <p className="text-xs text-neutral-500 mt-1">Your service history will appear here.</p>
                  </div>
                ) : (
                  requests.slice(0, 5).map((req) => (
                    <div key={req.id} className="flex items-start gap-4 p-4 hover:bg-neutral-50/50 transition-colors">
                      <div className={`mt-1.5 h-2.5 w-2.5 rounded-full shadow-sm flex-shrink-0 ${req.status === 'completed' ? 'bg-forest-500' :
                        req.status === 'accepted' ? 'bg-amber-500' : 'bg-neutral-300'
                        }`} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-neutral-900 truncate">{req.wasteType || 'Service Request'}</p>
                        <p className="text-xs text-neutral-500 mt-0.5 flex items-center gap-1">
                          <MapPin className="h-3 w-3" /> {req.location || 'Registered Address'}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide ${req.status === 'completed' ? 'bg-forest-50 text-forest-700' :
                            req.status === 'accepted' ? 'bg-amber-50 text-amber-700' :
                              'bg-neutral-100 text-neutral-600'
                          }`}>
                          {req.status}
                        </span>
                        <p className="text-[10px] text-neutral-400 mt-1">
                          {req.createdAt?.seconds ? new Date(req.createdAt.seconds * 1000).toLocaleDateString() : 'Just now'}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-forest-50 to-white border-forest-100">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white rounded-full shadow-sm text-forest-600">
                  <Leaf className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="font-bold text-forest-900">Did you know?</h4>
                  <p className="text-xs text-forest-700 mt-1">Recycling one aluminum can saves enough energy to run a TV for three hours.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* New Request Modal */}
      <Modal
        isOpen={isRequestModalOpen}
        onClose={() => setIsRequestModalOpen(false)}
        title="New Special Request"
        description="Submit a request for special waste collection."
      >
        <form onSubmit={handleCreateRequest} className="space-y-4 mt-4">
          <Select
            label="Waste Type"
            value={requestType}
            onChange={(e) => setRequestType(e.target.value)}
            options={[
              { label: 'Bulk Pickup', value: 'Bulk Pickup' },
              { label: 'Hazardous Waste', value: 'Hazardous Waste' },
              { label: 'E-Waste', value: 'E-Waste' },
              { label: 'Yard Debris', value: 'Yard Debris' }
            ]}
          />
          <Input
            label="Location"
            value={requestLocation}
            onChange={(e) => setRequestLocation(e.target.value)}
            placeholder="e.g. Backyard, Curb, etc."
          />
          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="ghost" onClick={() => setIsRequestModalOpen(false)}>Cancel</Button>
            <Button type="submit">Submit Request</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}