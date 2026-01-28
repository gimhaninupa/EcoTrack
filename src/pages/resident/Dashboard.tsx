import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Calendar, MapPin, AlertCircle, ArrowRight, Truck } from 'lucide-react';
import { Badge } from '../../components/ui/Badge';
export function ResidentDashboard() {
  return <div className="space-y-6">
    {/* Welcome Section */}
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">
          Good morning, John
        </h2>
        <p className="text-neutral-500">
          Here's what's happening with your waste collection.
        </p>
      </div>
      <div className="flex gap-2">
        <Button variant="outline">View Schedule</Button>
        <Button>Report Issue</Button>
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
            <Truck className="h-8 w-8 text-forest-500" />
            <div>
              <div className="text-2xl font-bold">Tomorrow</div>
              <div className="text-sm text-neutral-400">
                Recycling & Compost
              </div>
            </div>
          </div>
          <div className="text-xs text-neutral-500 bg-neutral-800/50 p-2 rounded">
            Estimated arrival: 8:00 AM - 12:00 PM
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
          <div className="text-2xl font-bold font-mono mb-1">$45.00</div>
          <div className="text-sm text-neutral-500 mb-4">
            Due Oct 31, 2023
          </div>
          <Button variant="outline" size="sm" className="w-full">
            Pay Now
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
            <div className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
            <span className="font-medium">Active</span>
          </div>
          <p className="text-sm text-neutral-500 mb-4">
            No service interruptions reported in your area.
          </p>
          <Button variant="ghost" size="sm" className="w-full justify-start px-0 text-forest-600">
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
            <div className="space-y-4">
              {[{
                title: 'Weekly Pickup Completed',
                date: 'Oct 24',
                icon: CheckCircle2,
                color: 'text-emerald-500'
              }, {
                title: 'Bill Payment Processed',
                date: 'Oct 01',
                icon: CreditCard,
                color: 'text-neutral-500'
              }, {
                title: 'Issue Reported: Missed Pickup',
                date: 'Sep 28',
                icon: AlertCircle,
                color: 'text-amber-500'
              }].map((item, i) => <div key={i} className="flex items-center justify-between py-2 border-b last:border-0 border-neutral-100">
                <div className="flex items-center gap-3">
                  <item.icon className={`h-5 w-5 ${item.color}`} />
                  <span className="font-medium text-sm">{item.title}</span>
                </div>
                <span className="text-sm text-neutral-500 font-mono">
                  {item.date}
                </span>
              </div>)}
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
            <Button variant="ghost" className="w-full justify-start">
              <Calendar className="mr-2 h-4 w-4 text-neutral-500" />
              Request Bulk Pickup
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              <MapPin className="mr-2 h-4 w-4 text-neutral-500" />
              Find Drop-off Center
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              <AlertCircle className="mr-2 h-4 w-4 text-neutral-500" />
              Report Illegal Dumping
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  </div>;
}
import { CheckCircle2, CreditCard } from 'lucide-react';