import React from 'react';
import { Card } from '../../components/ui/Card';
import { Map } from '../../components/shared/Map';
import { Badge } from '../../components/ui/Badge';
import { Clock, MapPin } from 'lucide-react';
export function ResidentTracking() {
  return <div className="h-[calc(100vh-8rem)] flex flex-col space-y-4">
      <div className="flex items-center justify-between flex-shrink-0">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Live Tracking</h2>
          <p className="text-neutral-500">
            See where your collection truck is in real-time.
          </p>
        </div>
        <Badge variant="success" className="px-3 py-1">
          <span className="relative flex h-2 w-2 mr-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          Live Updates Active
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 flex-1 min-h-0">
        <Card className="lg:col-span-3 h-full min-h-[400px] p-0 overflow-hidden border-0 shadow-md">
          <Map className="h-full w-full rounded-none border-0" />
        </Card>

        <div className="space-y-4 overflow-y-auto">
          <Card>
            <div className="p-4 border-b border-neutral-100">
              <h3 className="font-semibold text-sm">Status</h3>
            </div>
            <div className="p-4 space-y-4">
              <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-sky-500 mt-0.5" />
                <div>
                  <div className="text-sm font-medium">Estimated Arrival</div>
                  <div className="text-2xl font-bold font-mono">10:45 AM</div>
                  <div className="text-xs text-neutral-500">
                    ~15 minutes away
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-neutral-400 mt-0.5" />
                <div>
                  <div className="text-sm font-medium">Current Location</div>
                  <div className="text-sm text-neutral-600">
                    Main St & 4th Ave
                  </div>
                  <div className="text-xs text-neutral-500">Heading North</div>
                </div>
              </div>
            </div>
          </Card>

          <Card>
            <div className="p-4 border-b border-neutral-100">
              <h3 className="font-semibold text-sm">Truck Info</h3>
            </div>
            <div className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-neutral-500">Vehicle ID</span>
                <span className="text-sm font-mono font-medium">TRK-892</span>
              </div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-neutral-500">Type</span>
                <span className="text-sm font-medium">Side Loader</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-neutral-500">Driver</span>
                <span className="text-sm font-medium">Mike S.</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>;
}