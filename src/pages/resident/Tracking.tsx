import React, { useEffect } from 'react';
import { Card } from '../../components/ui/Card';
import { Map } from '../../components/shared/Map';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Clock, MapPin, Play } from 'lucide-react';
import { useService } from '../../context/ServiceContext';

export function ResidentTracking() {
  const { activeTracking, startTracking, simulateMovement, pickups } = useService();

  // Simulate movement interval if active
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (activeTracking?.isActive && activeTracking.status !== 'Completed') {
      interval = setInterval(simulateMovement, 3000); // Move every 3 seconds
    }
    return () => clearInterval(interval);
  }, [activeTracking]);

  const handleStartDemo = () => {
    // Try to find a scheduled pickup to use its location
    const upcomingPickup = pickups.find(p => p.status === 'Scheduled');
    const pickupId = upcomingPickup ? upcomingPickup.id : 'demo-id';
    startTracking(pickupId);
  };

  return <div className="h-[calc(100vh-8rem)] flex flex-col space-y-4">
    <div className="flex items-center justify-between flex-shrink-0">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Live Tracking</h2>
        <p className="text-neutral-500">
          See where your collection truck is in real-time.
        </p>
      </div>
      {activeTracking?.isActive ? (
        <Badge variant="success" className="px-3 py-1">
          <span className="relative flex h-2 w-2 mr-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          Live Updates Active
        </Badge>
      ) : (
        <Button size="sm" onClick={handleStartDemo} variant="outline">
          <Play className="h-3 w-3 mr-2" /> Start Demo Simulation
        </Button>
      )}
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 flex-1 min-h-0">
      <Card className="lg:col-span-3 h-full min-h-[400px] border shadow-sm relative overflow-hidden">
        <Map
          className="h-full w-full border-0"
          truckPosition={activeTracking?.isActive ? activeTracking.coordinates : undefined}
        />
        {/* Overlay Progress Bar for simulation visual */}
        {activeTracking?.isActive && (
          <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur p-4 rounded-lg border border-neutral-200 shadow-lg">
            <div className="flex justify-between text-sm font-medium mb-2">
              <span>Route Progress</span>
              <span>{activeTracking.progress}%</span>
            </div>
            <div className="h-2 w-full bg-neutral-200 rounded-full overflow-hidden">
              <div className="h-full bg-forest-500 transition-all duration-1000 ease-linear" style={{ width: `${activeTracking.progress}%` }} />
            </div>
          </div>
        )}
      </Card>

      <div className="space-y-4 overflow-y-auto">
        <Card>
          <div className="p-4 border-b border-neutral-100">
            <h3 className="font-semibold text-sm">Status</h3>
          </div>
          <div className="p-4 space-y-4">
            <div className="flex items-start gap-3">
              <Clock className="h-5 w-5 text-neutral-400 mt-0.5" />
              <div>
                <div className="text-sm font-medium">Estimated Arrival</div>
                <div className="text-2xl font-bold font-mono text-neutral-900">
                  {activeTracking?.eta || '--:--'}
                </div>
                <div className="text-xs text-neutral-500">
                  {activeTracking?.status || 'Waiting for schedule'}
                </div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-neutral-400 mt-0.5" />
              <div>
                <div className="text-sm font-medium">Current Location</div>
                <div className="text-sm text-neutral-600">
                  {activeTracking?.location || 'Depot'}
                </div>
                <div className="text-xs text-neutral-500">
                  {activeTracking?.isActive ? 'Updating...' : 'Not in route'}
                </div>
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <div className="p-4 border-b border-neutral-100">
            <h3 className="font-semibold text-sm">Truck Info</h3>
          </div>
          <div className="p-4">
            {activeTracking?.isActive ? (
              <>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-neutral-500">Vehicle ID</span>
                  <span className="text-sm font-mono font-medium">TRK-882</span>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-neutral-500">Type</span>
                  <span className="text-sm font-medium">Side Loader</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-neutral-500">Driver</span>
                  <span className="text-sm font-medium">Mike R.</span>
                </div>
              </>
            ) : (
              <div className="text-sm text-neutral-400 text-center py-4">No active truck assigned.</div>
            )}
          </div>
        </Card>
      </div>
    </div>
  </div>;
}