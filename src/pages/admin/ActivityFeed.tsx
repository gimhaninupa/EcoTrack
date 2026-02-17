import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { useAdmin } from '../../context/AdminContext';
import { Badge } from '../../components/ui/Badge';
import { AlertCircle, Truck, CreditCard, CheckCircle2, Clock } from 'lucide-react';
import { format } from 'date-fns';

export function AdminActivityFeed() {
    const { issues, schedules, invoices } = useAdmin();

    // Combine and sort all activities
    const activities = [
        ...issues.map(i => ({
            id: i.id,
            type: 'issue',
            title: 'New Issue Reported',
            desc: `${i.type} at ${i.address}`,
            date: new Date(i.date || i.createdAt || Date.now()), // Handle various date formats
            status: i.status,
            icon: AlertCircle,
            color: 'text-red-500',
            bg: 'bg-red-50'
        })),
        ...schedules.map(s => ({
            id: s.id,
            type: 'pickup',
            title: 'Pickup Scheduled',
            desc: `${s.type} collection for ${s.route}`, // Using route as location for now
            date: new Date(s.date),
            status: s.status,
            icon: Truck,
            color: 'text-blue-500',
            bg: 'bg-blue-50'
        })),
        ...invoices.filter(inv => inv.status === 'Paid').map(p => ({
            id: p.id,
            type: 'payment',
            title: 'Payment Received',
            desc: `LKR ${p.amount} from ${p.residentName}`,
            date: new Date(p.date || Date.now()),
            status: 'Paid',
            icon: CreditCard,
            color: 'text-green-500',
            bg: 'bg-green-50'
        }))
    ].sort((a, b) => b.date.getTime() - a.date.getTime())
        .slice(0, 10); // Show last 10 activities

    return (
        <Card className="col-span-1">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-neutral-500" />
                    Live Activity Feed
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {activities.length === 0 ? (
                        <p className="text-center text-neutral-500 text-sm py-4">No recent activity</p>
                    ) : (
                        activities.map((item, i) => (
                            <div key={`${item.type}-${item.id}-${i}`} className="flex items-start gap-3 p-3 rounded-lg border border-neutral-100 hover:bg-neutral-50 transition-colors">
                                <div className={`p-2 rounded-full ${item.bg}`}>
                                    <item.icon className={`h-4 w-4 ${item.color}`} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between mb-1">
                                        <p className="text-sm font-medium text-neutral-900">{item.title}</p>
                                        <span className="text-xs text-neutral-400">
                                            {format(item.date, 'MMM d, h:mm a')}
                                        </span>
                                    </div>
                                    <p className="text-xs text-neutral-600 truncate">{item.desc}</p>
                                    <div className="mt-2 flex items-center gap-2">
                                        <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-5">
                                            {item.status}
                                        </Badge>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
