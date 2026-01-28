import React from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Bell, Check, Clock, AlertTriangle } from 'lucide-react';
export function ResidentNotifications() {
  const notifications = [{
    id: 1,
    title: 'Pickup Delayed',
    message: 'Due to heavy traffic, collection is delayed by approx. 30 mins.',
    time: '2 hours ago',
    type: 'warning',
    read: false
  }, {
    id: 2,
    title: 'Issue Resolved',
    message: 'Your report #ISS-1023 has been marked as resolved.',
    time: 'Yesterday',
    type: 'success',
    read: true
  }, {
    id: 3,
    title: 'Bill Available',
    message: 'Your October statement is now available for viewing.',
    time: '3 days ago',
    type: 'info',
    read: true
  }];
  return <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Notifications</h2>
          <p className="text-neutral-500">
            Stay updated on your service status.
          </p>
        </div>
        <Button variant="outline" size="sm">
          Mark all as read
        </Button>
      </div>

      <div className="space-y-4">
        {notifications.map(notification => <Card key={notification.id} className={`transition-colors ${notification.read ? 'bg-white' : 'bg-sky-50/50 border-sky-100'}`}>
            <div className="p-4 flex gap-4">
              <div className={`mt-1 h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0 ${notification.type === 'warning' ? 'bg-amber-100 text-amber-600' : notification.type === 'success' ? 'bg-emerald-100 text-emerald-600' : 'bg-sky-100 text-sky-600'}`}>
                {notification.type === 'warning' ? <AlertTriangle className="h-4 w-4" /> : notification.type === 'success' ? <Check className="h-4 w-4" /> : <Bell className="h-4 w-4" />}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <h4 className={`font-semibold text-sm ${!notification.read && 'text-sky-900'}`}>
                    {notification.title}
                  </h4>
                  <span className="text-xs text-neutral-400 flex items-center gap-1">
                    <Clock className="h-3 w-3" /> {notification.time}
                  </span>
                </div>
                <p className="text-sm text-neutral-600">
                  {notification.message}
                </p>
              </div>
            </div>
          </Card>)}
      </div>
    </div>;
}