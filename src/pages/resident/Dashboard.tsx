import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Calendar, Clock, Truck, Plus, Search, MapPin, FileText } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { serviceService } from '../../services/serviceService';
import { requestService } from '../../services/requestService';
import { Input } from '../../components/ui/Input';

export function ResidentDashboard() {
  const { user } = useAuth();
  const [activeServices, setActiveServices] = useState<any[]>([]);
  const [myRequests, setMyRequests] = useState<any[]>([]);
  const [areaFilter, setAreaFilter] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!user?.uid) return;

    // Subscribe to Client Requests
    const unsubRequests = requestService.subscribeToClientRequests(user.uid, (data) => {
      setMyRequests(data);
    });

    // Subscribe to All Services (Initially all, or filtered by user location if available)
    const unsubServices = serviceService.subscribeToAllServices(null, (data) => {
      setActiveServices(data);
    });

    return () => {
      unsubRequests();
      unsubServices();
    };
  }, [user?.uid]);

  // Filter services locally for now or update subscription
  const filteredServices = activeServices.filter(s =>
    s.area.toLowerCase().includes(areaFilter.toLowerCase()) ||
    s.serviceName.toLowerCase().includes(areaFilter.toLowerCase())
  );

  const handleRequestService = async (service: any) => {
    if (!user?.uid) return;
    if (!confirm(`Request ${service.serviceName} for your location?`)) return;

    setIsLoading(true);
    try {
      if (!user.name || !user.location) {
        alert("Please update your profile with Name and Location in Settings before requesting a service.");
        setIsLoading(false);
        return;
      }
      await requestService.createRequest(user.uid, service.id, service.adminId, user.name, user.location);
      alert('Service requested successfully!');
    } catch (error) {
      console.error(error);
      alert('Failed to request service');
    } finally {
      setIsLoading(false);
    }
  };

  const pendingRequests = myRequests.filter(r => r.status !== 'completed').length;
  const completedRequests = myRequests.filter(r => r.status === 'completed').length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Resident Dashboard</h2>
          <p className="text-neutral-500">Welcome back, {user?.name}</p>
        </div>
        <Button className="bg-forest-600 hover:bg-forest-700">
          <Plus className="mr-2 h-4 w-4" /> New Special Request
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-white border-neutral-100 shadow-sm hover:shadow-md transition-all duration-200 rounded-xl overflow-hidden group">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-500">Active Requests</p>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-neutral-900 tracking-tight">{pendingRequests}</span>
                  <span className="text-sm text-neutral-500">pending</span>
                </div>
              </div>
              <div className="h-12 w-12 rounded-2xl bg-forest-50 flex items-center justify-center group-hover:bg-forest-100 transition-colors">
                <Clock className="h-6 w-6 text-forest-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-neutral-100 shadow-sm hover:shadow-md transition-all duration-200 rounded-xl overflow-hidden group">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-500">Completed Services</p>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-neutral-900 tracking-tight">{completedRequests}</span>
                  <span className="text-sm text-emerald-600 font-medium">jobs done</span>
                </div>
              </div>
              <div className="h-12 w-12 rounded-2xl bg-emerald-50 flex items-center justify-center group-hover:bg-emerald-100 transition-colors">
                <Truck className="h-6 w-6 text-emerald-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Available Services */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-neutral-900 tracking-tight">Available Services</h3>
            <div className="w-full max-w-xs relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
              <Input
                placeholder="Filter by Area..."
                value={areaFilter}
                onChange={(e) => setAreaFilter(e.target.value)}
                className="pl-10 rounded-full border-neutral-200 focus:border-forest-500 focus:ring-forest-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredServices.length === 0 ? (
              <div className="col-span-2 flex flex-col items-center justify-center py-16 px-4 bg-white rounded-xl border border-neutral-200 border-dashed">
                <div className="h-16 w-16 rounded-full bg-neutral-50 flex items-center justify-center mb-4">
                  <MapPin className="h-8 w-8 text-neutral-400" />
                </div>
                <p className="text-neutral-900 font-medium">No services found</p>
                <p className="text-neutral-500 text-sm mt-1">We couldn't find any services in this area.</p>
              </div>
            ) : (
              filteredServices.map(service => (
                <Card key={service.id} className="border-neutral-200 shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-1 rounded-xl overflow-hidden group">
                  <CardHeader className="pb-3 pt-6 px-6">
                    <div className="flex justify-between items-start mb-2">
                      <span className="inline-flex items-center rounded-lg bg-forest-50 px-2.5 py-1 text-xs font-semibold text-forest-700 tracking-wide uppercase">
                        {service.area}
                      </span>
                    </div>
                    <CardTitle className="text-lg font-bold text-neutral-900 group-hover:text-forest-600 transition-colors">
                      {service.serviceName}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pb-6 px-6">
                    <p className="text-sm text-neutral-600 line-clamp-2 leading-relaxed mb-6 h-10">
                      {service.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-xs font-medium text-neutral-500">
                        <Calendar className="mr-1.5 h-4 w-4 text-neutral-400" />
                        Daily Collection
                      </div>
                      <Button
                        size="sm"
                        className="rounded-full px-6 bg-neutral-900 hover:bg-forest-600 transition-colors shadow-sm"
                        onClick={() => handleRequestService(service)}
                        disabled={isLoading}
                      >
                        Request
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>

        {/* My Requests Status */}
        <div className="space-y-6">
          <h3 className="text-xl font-bold text-neutral-900 tracking-tight">My Requests</h3>
          <Card className="border-neutral-100 shadow-sm rounded-xl overflow-hidden bg-white">
            <CardContent className="p-0">
              {myRequests.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                  <div className="h-12 w-12 rounded-full bg-neutral-50 flex items-center justify-center mb-3">
                    <FileText className="h-6 w-6 text-neutral-300" />
                  </div>
                  <p className="text-neutral-900 font-medium">No active requests</p>
                  <p className="text-neutral-500 text-sm mt-1">Your service requests will appear here.</p>
                </div>
              ) : (
                <div className="divide-y divide-neutral-100">
                  {myRequests.map((request) => {
                    const serviceName = activeServices.find(s => s.id === request.serviceId)?.serviceName || 'Service Request';
                    return (
                      <div key={request.id} className="p-4 hover:bg-neutral-50 transition-colors flex gap-4">
                        <div className={`mt-1 h-2.5 w-2.5 rounded-full flex-shrink-0 ${request.status === 'completed' ? 'bg-emerald-500' :
                          request.status === 'accepted' ? 'bg-blue-500' : 'bg-amber-500'
                          }`} />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <p className="text-sm font-semibold text-neutral-900 truncate pr-4">{serviceName}</p>
                            <span className="text-xs text-neutral-400 flex-shrink-0">
                              {request.createdAt?.seconds ? new Date(request.createdAt.seconds * 1000).toLocaleDateString() : 'Just now'}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <p className="text-xs text-neutral-500 truncate">
                              Request ID: <span className="font-mono">{request.id.slice(0, 8)}</span>
                            </p>
                            <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${request.status === 'pending' ? 'bg-amber-50 text-amber-700' :
                              request.status === 'accepted' ? 'bg-blue-50 text-blue-700' :
                                'bg-emerald-50 text-emerald-700'
                              }`}>
                              {request.status}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}