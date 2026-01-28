import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Bell, Globe, Lock, Shield, Server, Database, Save, RefreshCw, Check } from 'lucide-react';
import { useAdmin, SystemSettings } from '../../context/AdminContext';

export function AdminSystemSettings() {
    const { settings, updateSettings } = useAdmin();
    const [activeTab, setActiveTab] = useState('General');
    const [formData, setFormData] = useState<SystemSettings>(settings);

    // Sync form data with settings when they change (initial load)
    useEffect(() => {
        setFormData(settings);
    }, [settings]);

    const handleSave = () => {
        updateSettings(formData);
        alert('Settings saved successfully!');
    };

    const handleGeneralChange = (field: keyof SystemSettings, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleNotificationChange = (type: keyof SystemSettings['notifications']) => {
        setFormData(prev => ({
            ...prev,
            notifications: { ...prev.notifications, [type]: !prev.notifications[type] }
        }));
    };

    const handleSecurityChange = (field: keyof SystemSettings['security'], value: any) => {
        setFormData(prev => ({
            ...prev,
            security: { ...prev.security, [field]: value }
        }));
    };

    const navItems = [
        { label: 'General', icon: Globe },
        { label: 'Notifications', icon: Bell },
        { label: 'Security', icon: Lock },
        { label: 'Roles & Permissions', icon: Shield },
        { label: 'System Health', icon: Server },
    ];

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">System Settings</h2>
                    <p className="text-neutral-500">Global configurations and system health.</p>
                </div>
                <Button onClick={handleSave}>
                    <Save className="mr-2 h-4 w-4" /> Save Changes
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Navigation Sidebar */}
                <div className="space-y-1">
                    {navItems.map((item) => (
                        <button
                            key={item.label}
                            onClick={() => setActiveTab(item.label)}
                            className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === item.label ? 'bg-forest-50 text-forest-700' : 'text-neutral-600 hover:bg-neutral-50'
                                }`}
                        >
                            <item.icon className="h-4 w-4" />
                            {item.label}
                        </button>
                    ))}
                </div>

                {/* Main Content Area */}
                <div className="lg:col-span-2 space-y-6">

                    {/* General Settings */}
                    {activeTab === 'General' && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">General Configuration</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <label className="text-sm font-medium text-neutral-700 mb-1 block">Application Name</label>
                                    <Input
                                        value={formData.appName}
                                        onChange={(e) => handleGeneralChange('appName', e.target.value)}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm font-medium text-neutral-700 mb-1 block">Support Email</label>
                                        <Input
                                            value={formData.supportEmail}
                                            onChange={(e) => handleGeneralChange('supportEmail', e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-neutral-700 mb-1 block">Contact Phone</label>
                                        <Input
                                            value={formData.contactPhone}
                                            onChange={(e) => handleGeneralChange('contactPhone', e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-neutral-700 mb-1 block">Timezone</label>
                                    <select
                                        className="flex h-9 w-full rounded-md border border-neutral-200 bg-white px-3 py-1 text-sm shadow-sm transition-colors focus:ring-1 focus:ring-forest-500"
                                        value={formData.timezone}
                                        onChange={(e) => handleGeneralChange('timezone', e.target.value)}
                                    >
                                        <option>Asia/Colombo (GMT+5:30)</option>
                                        <option>UTC</option>
                                        <option>America/New_York</option>
                                        <option>Europe/London</option>
                                    </select>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Notifications Settings */}
                    {activeTab === 'Notifications' && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Notification Channels</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between p-4 border rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <Bell className="h-5 w-5 text-neutral-500" />
                                        <div>
                                            <div className="font-medium">Push Notifications</div>
                                            <div className="text-xs text-neutral-500">Send alerts to mobile devices</div>
                                        </div>
                                    </div>
                                    <input
                                        type="checkbox"
                                        className="h-5 w-5 text-forest-600 rounded focus:ring-forest-500"
                                        checked={formData.notifications.push}
                                        onChange={() => handleNotificationChange('push')}
                                    />
                                </div>
                                <div className="flex items-center justify-between p-4 border rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <Globe className="h-5 w-5 text-neutral-500" />
                                        <div>
                                            <div className="font-medium">Email Alerts</div>
                                            <div className="text-xs text-neutral-500">Send summary reports and critical alerts</div>
                                        </div>
                                    </div>
                                    <input
                                        type="checkbox"
                                        className="h-5 w-5 text-forest-600 rounded focus:ring-forest-500"
                                        checked={formData.notifications.email}
                                        onChange={() => handleNotificationChange('email')}
                                    />
                                </div>
                                <div className="flex items-center justify-between p-4 border rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <Bell className="h-5 w-5 text-neutral-500" />
                                        <div>
                                            <div className="font-medium">SMS Notifications</div>
                                            <div className="text-xs text-neutral-500">Urgent alerts via SMS</div>
                                        </div>
                                    </div>
                                    <input
                                        type="checkbox"
                                        className="h-5 w-5 text-forest-600 rounded focus:ring-forest-500"
                                        checked={formData.notifications.sms}
                                        onChange={() => handleNotificationChange('sms')}
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Security Settings */}
                    {activeTab === 'Security' && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Security Policy</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <label className="text-sm font-medium text-neutral-700 mb-1 block">Minimum Password Length</label>
                                    <Input
                                        type="number"
                                        value={formData.security.minPasswordLength}
                                        onChange={(e) => handleSecurityChange('minPasswordLength', parseInt(e.target.value))}
                                    />
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-neutral-700 mb-1 block">Session Timeout (Minutes)</label>
                                    <Input
                                        type="number"
                                        value={formData.security.sessionTimeout}
                                        onChange={(e) => handleSecurityChange('sessionTimeout', parseInt(e.target.value))}
                                    />
                                </div>
                                <div className="flex items-center justify-between p-4 border rounded-lg mt-2">
                                    <div className="font-medium">Require Special Characters</div>
                                    <input
                                        type="checkbox"
                                        className="h-5 w-5 text-forest-600 rounded focus:ring-forest-500"
                                        checked={formData.security.requireSpecialChars}
                                        onChange={(e) => handleSecurityChange('requireSpecialChars', e.target.checked)}
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Roles & Permissions display */}
                    {activeTab === 'Roles & Permissions' && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Roles & Permissions</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-center py-8">
                                    <Shield className="h-12 w-12 text-neutral-300 mx-auto mb-3" />
                                    <h3 className="text-lg font-medium text-neutral-900">Manage Roles in User Management</h3>
                                    <p className="text-neutral-500 mb-4 max-w-sm mx-auto">
                                        Role definitions and permission sets are managed centrally in the User Management section.
                                    </p>
                                    <Button variant="outline" onClick={() => window.location.href = '/admin' /* Mock nav */}>
                                        Go to User Management
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* System Health Tab */}
                    {activeTab === 'System Health' && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">System Status</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between p-3 border border-neutral-100 rounded-lg bg-neutral-50">
                                    <div className="flex items-center gap-3">
                                        <Server className="h-5 w-5 text-green-600" />
                                        <div>
                                            <div className="text-sm font-medium">API Server</div>
                                            <div className="text-xs text-neutral-500">Uptime: 99.9%</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                        <span className="text-sm font-medium text-green-700">Operational</span>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between p-3 border border-neutral-100 rounded-lg bg-neutral-50">
                                    <div className="flex items-center gap-3">
                                        <Database className="h-5 w-5 text-green-600" />
                                        <div>
                                            <div className="text-sm font-medium">Primary Database</div>
                                            <div className="text-xs text-neutral-500">Latency: 24ms</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                        <span className="text-sm font-medium text-green-700">Healthy</span>
                                    </div>
                                </div>

                                <div className="flex justify-end pt-2">
                                    <Button variant="outline" size="sm">
                                        <RefreshCw className="mr-2 h-3 w-3" /> Refresh Status
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
}
