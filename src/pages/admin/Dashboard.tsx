import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { BarChart3, Users, AlertCircle, Truck, TrendingUp, ArrowUpRight } from 'lucide-react';
export function AdminDashboard() {
  return <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Admin Overview</h2>
          <p className="text-neutral-500">
            System performance and key metrics.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">Download Report</Button>
          <Button>Manage Fleet</Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[{
        title: 'Total Collections',
        value: '12,450',
        change: '+12%',
        icon: Truck
      }, {
        title: 'Active Issues',
        value: '24',
        change: '-5%',
        icon: AlertCircle
      }, {
        title: 'Fleet Efficiency',
        value: '94%',
        change: '+2%',
        icon: TrendingUp
      }, {
        title: 'Total Residents',
        value: '45.2k',
        change: '+8%',
        icon: Users
      }].map((stat, i) => <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-neutral-500">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-neutral-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold font-mono">{stat.value}</div>
              <p className={`text-xs flex items-center mt-1 ${stat.change.startsWith('+') ? 'text-emerald-600' : 'text-red-600'}`}>
                {stat.change}
                <span className="text-neutral-400 ml-1">from last month</span>
              </p>
            </CardContent>
          </Card>)}
      </div>

      {/* Charts & Maps Placeholder */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Collection Volume</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full bg-neutral-50 rounded-md flex items-center justify-center border border-neutral-100 border-dashed">
              <div className="text-center text-neutral-400">
                <BarChart3 className="h-10 w-10 mx-auto mb-2 opacity-50" />
                <span>Chart Visualization Placeholder</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>System Health</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[{
            label: 'API Status',
            status: 'Operational',
            color: 'bg-emerald-500'
          }, {
            label: 'Fleet GPS',
            status: 'Operational',
            color: 'bg-emerald-500'
          }, {
            label: 'Payment Gateway',
            status: 'Operational',
            color: 'bg-emerald-500'
          }, {
            label: 'Notification Service',
            status: 'Degraded',
            color: 'bg-amber-500'
          }].map((item, i) => <div key={i} className="flex items-center justify-between">
                <span className="text-sm font-medium">{item.label}</span>
                <div className="flex items-center gap-2">
                  <div className={`h-2 w-2 rounded-full ${item.color}`} />
                  <span className="text-xs text-neutral-500">
                    {item.status}
                  </span>
                </div>
              </div>)}
            <div className="pt-4 border-t border-neutral-100">
              <Button variant="ghost" size="sm" className="w-full text-sky-600">
                View System Logs <ArrowUpRight className="ml-1 h-3 w-3" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>;
}