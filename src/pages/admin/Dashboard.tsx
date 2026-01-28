import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { BarChart3, Users, AlertCircle, Truck, TrendingUp, ArrowUpRight, Download } from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import { useNavigate } from 'react-router-dom';

export function AdminDashboard() {
  const navigate = useNavigate();
  const { trucks, issues, residents } = useAdmin();

  const handleDownloadReport = () => {
    // Calculate data for report
    const activeTrucks = trucks.filter(t => t.status !== 'Idle' && t.status !== 'Maintenance').length;
    const openIssues = issues.filter(i => i.status === 'Open').length;
    const efficiency = Math.round((trucks.filter(t => t.status === 'En Route' || t.status === 'Collection').length / trucks.length) * 100);

    // Create new window for printing
    const printWindow = window.open('', '', 'height=800,width=800');
    if (!printWindow) return;

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>EcoTrack System Report</title>
          <style>
            body { font-family: 'Inter', sans-serif; line-height: 1.5; color: #1a1a1a; max-width: 800px; margin: 0 auto; padding: 40px; }
            .header { text-align: center; margin-bottom: 40px; border-bottom: 2px solid #228B22; padding-bottom: 20px; }
            .header h1 { margin: 0; color: #228B22; font-size: 28px; }
            .header p { color: #666; margin: 5px 0 0; }
            .section { margin-bottom: 30px; }
            .section-title { font-size: 18px; font-weight: bold; color: #111; border-bottom: 1px solid #eee; padding-bottom: 10px; margin-bottom: 15px; }
            .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; margin-bottom: 30px; }
            .stat-card { background: #f9fafb; padding: 15px; border-radius: 8px; text-align: center; border: 1px solid #e5e7eb; }
            .stat-value { font-size: 24px; font-weight: bold; color: #228B22; }
            .stat-label { font-size: 12px; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px; }
            table { width: 100%; border-collapse: collapse; font-size: 14px; }
            th { text-align: left; background: #f0fdf4; padding: 10px; border-bottom: 2px solid #228B22; color: #166534; font-weight: 600; }
            td { padding: 10px; border-bottom: 1px solid #e5e7eb; }
            .footer { margin-top: 50px; text-align: center; font-size: 12px; color: #9ca3af; border-top: 1px solid #eee; padding-top: 20px; }
            .status-badge { padding: 4px 8px; border-radius: 12px; font-size: 11px; font-weight: 600; }
            @media print { body { padding: 20px; } }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>EcoTrack Admin Report</h1>
            <p>Generated on ${new Date().toLocaleString()}</p>
          </div>

          <div class="section">
            <div class="section-title">System Overview</div>
            <div class="stats-grid">
              <div class="stat-card">
                <div class="stat-value">${activeTrucks}</div>
                <div class="stat-label">Active Trucks</div>
              </div>
              <div class="stat-card">
                <div class="stat-value">${openIssues}</div>
                <div class="stat-label">Open Issues</div>
              </div>
             <div class="stat-card">
                <div class="stat-value">${efficiency}%</div>
                <div class="stat-label">Fleet Efficiency</div>
              </div>
              <div class="stat-card">
                <div class="stat-value">${residents.length}</div>
                <div class="stat-label">Total Residents</div>
              </div>
            </div>
          </div>

          <div class="section">
            <div class="section-title">Recent Critical Issues</div>
            <table>
              <thead>
                <tr>
                  <th>Type</th>
                  <th>Location</th>
                  <th>Priority</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                ${issues.slice(0, 5).map(i => `
                  <tr>
                    <td>${i.type}</td>
                    <td>${i.address}</td>
                    <td><span style="color: ${i.priority === 'High' ? '#dc2626' : '#ea580c'}">${i.priority}</span></td>
                    <td>${i.status}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>

          <div class="section">
            <div class="section-title">Fleet Status</div>
            <table>
              <thead>
                <tr>
                  <th>Truck ID</th>
                  <th>Driver</th>
                  <th>Status</th>
                  <th>Battery/Fuel</th>
                </tr>
              </thead>
              <tbody>
                ${trucks.map(t => `
                  <tr>
                    <td>${t.id}</td>
                    <td>${t.driver}</td>
                    <td>${t.status}</td>
                    <td>${t.type === 'EV' ? t.battery + '%' : t.fuel + '%'}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>

          <div class="footer">
            <p>Confidential Property of EcoTrack Systems • ${new Date().getFullYear()}</p>
          </div>
        </body>
      </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
    printWindow.focus();
    // Delay slightly to ensure styles load
    setTimeout(() => {
      printWindow.print();
    }, 500);
  };

  // Calculate stats
  const totalCollections = trucks.filter(t => t.status !== 'Idle' && t.status !== 'Maintenance').length * 12 + 45; // Mock calculation based on active trucks
  const activeIssues = issues.filter(i => i.status === 'Open' || i.status === 'In Progress').length;
  const fleetEfficiency = Math.round((trucks.filter(t => t.status === 'En Route' || t.status === 'Collection').length / trucks.length) * 100);
  const totalResidents = residents.length;

  return (
    <div className="space-y-6">

      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Admin Overview</h2>
          <p className="text-neutral-500">
            System performance and key metrics.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleDownloadReport}>
            <Download className="mr-2 h-4 w-4" /> Download Report
          </Button>
          <Button onClick={() => navigate('/admin/fleet')}>Manage Fleet</Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[{
          title: 'Total Collections',
          value: totalCollections.toString(),
          change: '+12%',
          icon: Truck
        }, {
          title: 'Active Issues',
          value: activeIssues.toString(),
          change: activeIssues > 2 ? '+5%' : '-2%',
          icon: AlertCircle
        }, {
          title: 'Fleet Efficiency',
          value: `${fleetEfficiency}%`,
          change: '+4%',
          icon: TrendingUp
        }, {
          title: 'Total Residents',
          value: totalResidents.toString(),
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
            <p className="text-xs flex items-center mt-1 text-neutral-400">
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
                <span>No Data Available</span>
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
              status: 'Online',
              color: 'bg-emerald-500'
            }, {
              label: 'Fleet GPS',
              status: 'Waiting',
              color: 'bg-neutral-300'
            }, {
              label: 'Payment Gateway',
              status: 'Offline',
              color: 'bg-neutral-300'
            }, {
              label: 'Notification Service',
              status: 'Online',
              color: 'bg-emerald-500'
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
              <Button
                variant="ghost"
                size="sm"
                className="w-full text-forest-600"
                onClick={() => navigate('/admin/settings')}
              >
                View System Logs <ArrowUpRight className="ml-1 h-3 w-3" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}