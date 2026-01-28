import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/Tabs';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
export function ResidentSettings() {
  const [activeTab, setActiveTab] = useState('profile');
  return <div className="max-w-4xl space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
        <p className="text-neutral-500">
          Manage your account preferences and billing details.
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="billing">Billing Method</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Input label="First Name" defaultValue="John" />
                <Input label="Last Name" defaultValue="Doe" />
              </div>
              <Input label="Email Address" defaultValue="john@example.com" />
              <Input label="Phone Number" defaultValue="(555) 123-4567" />
              <div className="pt-2">
                <Button>Save Changes</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {['Pickup Reminders', 'Service Alerts', 'Billing Updates', 'Marketing'].map(item => <div key={item} className="flex items-center justify-between py-2">
                  <span className="text-sm font-medium">{item}</span>
                  <input type="checkbox" className="h-4 w-4 rounded border-neutral-300 text-sky-600 focus:ring-sky-500" defaultChecked />
                </div>)}
              <div className="pt-2">
                <Button>Save Preferences</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="billing">
          <Card>
            <CardHeader>
              <CardTitle>Payment Method</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 border border-neutral-200 rounded-md">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-12 bg-neutral-100 rounded flex items-center justify-center text-xs font-bold">
                    VISA
                  </div>
                  <div>
                    <div className="font-medium text-sm">
                      Visa ending in 4242
                    </div>
                    <div className="text-xs text-neutral-500">
                      Expires 12/24
                    </div>
                  </div>
                </div>
                <Button variant="ghost" size="sm">
                  Edit
                </Button>
              </div>
              <Button variant="outline" className="w-full">
                Add New Payment Method
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>;
}