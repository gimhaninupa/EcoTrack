import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Calendar, MapPin, AlertCircle, ArrowRight, Truck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

import { format } from 'date-fns';
import { useService } from '../../context/ServiceContext';

export function ResidentDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { pickups, activeTracking } = useService();

  // Find next pickup
  const nextPickup = pickups.find(p => p.date >= new Date());

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return <div className="space-y-6">
    {/* Welcome Section */}
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">
          {getGreeting()}, {user?.name.split(' ')[0] || 'Resident'}
        </h2>
        <p className="text-neutral-500">
          Here's what's happening with your waste collection.
        </p>
      </div>
      <div className="flex gap-2">
        <Button variant="outline" onClick={() => navigate('/resident/schedule')}>View Schedule</Button>
        <Button onClick={() => navigate('/resident/report')}>Report Issue</Button>
      </div>
    </div>

    {/* Key Stats / Next Pickup */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card className="bg-neutral-900 text-white border-neutral-800">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-neutral-400">
            Next Pickup
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3 mb-4">
            <Truck className="h-8 w-8 text-neutral-600" />
            <div>
              <div className="text-xl font-bold text-neutral-300">
                {nextPickup ? format(nextPickup.date, 'EEEE, MMM d') : 'No scheduled pickups'}
              </div>
              <div className="text-sm text-neutral-500">
                {nextPickup ? `${nextPickup.type} Collection` : 'Check back later'}
              </div>
            </div>
          </div>
          <div className="text-xs text-neutral-500 bg-neutral-800/50 p-2 rounded">
            {nextPickup ? 'Route #42 Assigned' : 'No route assigned'}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-neutral-500">
            Account Balance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold font-mono mb-1">LKR 0.00</div>
          <div className="text-sm text-neutral-500 mb-4">
            No pending bills
          </div>
          <Button variant="outline" size="sm" className="w-full" onClick={() => navigate('/resident/billing')}>
            View Billing History
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-neutral-500">
            Service Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 mb-2">
            <div className={`h-2.5 w-2.5 rounded-full ${activeTracking?.isActive ? 'bg-emerald-500' : 'bg-neutral-300'}`} />
            <span className="font-medium text-neutral-600">
              {activeTracking?.isActive ? activeTracking.status : 'Pending Activation'}
            </span>
          </div>
          <p className="text-sm text-neutral-500 mb-4">
            {activeTracking?.isActive ? `Truck is ${activeTracking.location}` : 'Service setup in progress.'}
          </p>
          <Button variant="ghost" size="sm" className="w-full justify-start px-0 text-forest-600" onClick={() => navigate('/resident/tracking')}>
            View Service Map <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        </CardContent>
      </Card>
    </div>

    {/* Recent Activity & Quick Actions */}
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center py-10 text-neutral-500">
              <div className="bg-neutral-100 p-3 rounded-full mb-3">
                <AlertCircle className="h-6 w-6 text-neutral-400" />
              </div>
              <p>No recent activity to show.</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button variant="ghost" className="w-full justify-start" onClick={() => navigate('/resident/report')}>
              <Calendar className="mr-2 h-4 w-4 text-neutral-500" />
              Request Bulk Pickup
            </Button>
            <Button variant="ghost" className="w-full justify-start" onClick={() => navigate('/resident/tracking')}>
              <MapPin className="mr-2 h-4 w-4 text-neutral-500" />
              Find Drop-off Center
            </Button>
            <Button variant="ghost" className="w-full justify-start" onClick={() => navigate('/resident/report')}>
              <AlertCircle className="mr-2 h-4 w-4 text-neutral-500" />
              Report Illegal Dumping
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  </div>;
}