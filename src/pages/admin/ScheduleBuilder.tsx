import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Calendar as CalendarIcon, Truck, Map, Plus, ChevronLeft, ChevronRight, Settings, X, Edit2, Trash2 } from 'lucide-react';
import { useAdmin, Schedule } from '../../context/AdminContext';
import {
    format, addMonths, subMonths, addWeeks, subWeeks, startOfWeek, endOfWeek,
    eachDayOfInterval, startOfMonth, endOfMonth, isSameDay, isSameMonth, addDays
} from 'date-fns';

export function AdminScheduleBuilder() {
    const { schedules, addSchedule, updateSchedule, deleteSchedule, routes, issues } = useAdmin();
    const [currentDate, setCurrentDate] = useState(new Date(2026, 0, 1)); // Jan 1, 2026
    const [view, setView] = useState<'week' | 'month'>('week');

    // Modal States
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
    const [editingSchedule, setEditingSchedule] = useState<Schedule | null>(null);

    // Form Data
    const [formData, setFormData] = useState({
        day: '',
        date: '',
        route: '',
        truck: '',
        type: 'General',
        status: 'Scheduled'
    });

    // Calendar Navigation
    const handlePrev = () => {
        if (view === 'week') {
            setCurrentDate(subWeeks(currentDate, 1));
        } else {
            setCurrentDate(subMonths(currentDate, 1));
        }
    };

    const handleNext = () => {
        if (view === 'week') {
            setCurrentDate(addWeeks(currentDate, 1));
        } else {
            setCurrentDate(addMonths(currentDate, 1));
        }
    };

    // Calculate Days to Display
    const getDays = () => {
        if (view === 'week') {
            const start = startOfWeek(currentDate, { weekStartsOn: 1 });
            const end = endOfWeek(currentDate, { weekStartsOn: 1 });
            return eachDayOfInterval({ start, end });
        } else {
            const start = startOfWeek(startOfMonth(currentDate), { weekStartsOn: 1 });
            const end = endOfWeek(endOfMonth(currentDate), { weekStartsOn: 1 });
            return eachDayOfInterval({ start, end });
        }
    };

    const calendarDays = getDays();

    // CRUD Handlers
    const handleOpenCreate = (date?: Date) => {
        setEditingSchedule(null);
        setFormData({
            day: date ? format(date, 'EEE') : '',
            date: date ? format(date, 'yyyy-MM-dd') : '',
            route: '',
            truck: '',
            type: 'General',
            status: 'Scheduled'
        });
        setIsModalOpen(true);
    };

    const handleOpenEdit = (e: React.MouseEvent, schedule: Schedule) => {
        e.stopPropagation();
        setEditingSchedule(schedule);
        setFormData({
            day: schedule.day,
            date: schedule.date || '',
            route: schedule.route,
            truck: schedule.truck,
            type: schedule.type,
            status: schedule.status as any
        });
        setIsModalOpen(true);
    };

    const handleDelete = (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        if (confirm('Delete this schedule?')) {
            deleteSchedule(id);
        }
    };

    const handleSubmit = () => {
        if (!formData.date || !formData.route || !formData.truck) {
            alert('Please fill in Date, Route, and Truck');
            return;
        }

        const data = {
            ...formData,
            day: format(new Date(formData.date), 'EEE')
        };

        if (editingSchedule) {
            updateSchedule(editingSchedule.id, data as any);
        } else {
            addSchedule(data as any);
        }
        setIsModalOpen(false);
    };

    const applyTemplate = () => {
        // Simple template: Add schedules for the current week Mon-Fri
        const start = startOfWeek(currentDate, { weekStartsOn: 1 });
        const templateSchedules = [
            { offset: 0, route: 'R-101 (Meepe)', truck: 'TRK-001', type: 'General' },
            { offset: 1, route: 'R-102 (Homagama)', truck: 'TRK-002', type: 'Recycling' },
            { offset: 2, route: 'R-103 (Kottawa)', truck: 'TRK-004', type: 'Organic' },
            { offset: 3, route: 'R-101 (Meepe)', truck: 'TRK-001', type: 'General' },
            { offset: 4, route: 'R-104 (Padukka)', truck: 'TRK-003', type: 'General' },
        ];

        if (confirm('Apply standard weekly template to the current week? This will add 5 schedules.')) {
            templateSchedules.forEach(item => {
                const date = addDays(start, item.offset);
                addSchedule({
                    day: format(date, 'EEE'),
                    date: format(date, 'yyyy-MM-dd'),
                    route: item.route,
                    truck: item.truck,
                    type: item.type,
                    status: 'Draft'
                });
            });
            setIsTemplateModalOpen(false);
        }
    };
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Schedule Builder</h2>
                    <p className="text-neutral-500">Plan and optimize waste collection routes.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={() => setIsTemplateModalOpen(true)}>
                        <Settings className="h-4 w-4 mr-2" /> Templates
                    </Button>
                    <Button onClick={() => handleOpenCreate(new Date())}>
                        <Plus className="h-4 w-4 mr-2" /> Create Schedule
                    </Button>
                </div>

                {/* Create/Edit Modal */}
                {isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                        <Card className="w-full max-w-md p-6 space-y-4 max-h-[90vh] overflow-y-auto">
                            <div className="flex justify-between items-center">
                                <h3 className="text-lg font-bold">{editingSchedule ? 'Edit Schedule' : 'Create Schedule'}</h3>
                                <Button variant="ghost" size="icon" onClick={() => setIsModalOpen(false)}>
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                            <div className="space-y-3">
                                <div>
                                    <label className="text-sm font-medium">Date</label>
                                    <Input
                                        type="date"
                                        value={formData.date}
                                        onChange={e => setFormData({ ...formData, date: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="text-sm font-medium">Route</label>
                                    <select
                                        className="w-full h-9 rounded-md border border-neutral-200 px-3 text-sm"
                                        value={formData.route}
                                        onChange={e => setFormData({ ...formData, route: e.target.value })}
                                    >
                                        <option value="">Select Route</option>
                                        {routes.map(r => (
                                            <option key={r.id} value={`${r.id} (${r.name})`}>
                                                {r.name} ({r.id})
                                            </option>
                                        ))}
                                        {routes.length === 0 && (
                                            <option value="" disabled>No routes found - Add in Route Mgmt</option>
                                        )}
                                    </select>
                                </div>
                                <div>
                                    <label className="text-sm font-medium">Truck</label>
                                    <Input
                                        placeholder="Truck ID (e.g. TRK-001)"
                                        value={formData.truck}
                                        onChange={e => setFormData({ ...formData, truck: e.target.value })}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm font-medium">Type</label>
                                        <select
                                            className="w-full h-9 rounded-md border border-neutral-200 px-3 text-sm"
                                            value={formData.type}
                                            onChange={e => setFormData({ ...formData, type: e.target.value })}
                                        >
                                            <option value="General">General</option>
                                            <option value="Recycling">Recycling</option>
                                            <option value="Organic">Organic</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium">Status</label>
                                        <select
                                            className="w-full h-9 rounded-md border border-neutral-200 px-3 text-sm"
                                            value={formData.status}
                                            onChange={e => setFormData({ ...formData, status: e.target.value })}
                                        >
                                            <option value="Scheduled">Scheduled</option>
                                            <option value="Draft">Draft</option>
                                            <option value="Completed">Completed</option>
                                        </select>
                                    </div>
                                </div>
                                <Button className="w-full" onClick={handleSubmit}>
                                    {editingSchedule ? 'Save Changes' : 'Create Schedule'}
                                </Button>
                            </div>
                        </Card>
                    </div>
                )}

                {/* Template Modal */}
                {isTemplateModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                        <Card className="w-full max-w-md p-6 space-y-4">
                            <div className="flex justify-between items-center">
                                <h3 className="text-lg font-bold">Schedule Templates</h3>
                                <Button variant="ghost" size="icon" onClick={() => setIsTemplateModalOpen(false)}>
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                            <p className="text-sm text-neutral-500">
                                Apply a pre-defined schedule template to the current week ({format(startOfWeek(currentDate, { weekStartsOn: 1 }), 'MMM d')} - {format(endOfWeek(currentDate, { weekStartsOn: 1 }), 'MMM d')}).
                            </p>
                            <div className="space-y-2">
                                <button
                                    className="w-full text-left p-3 rounded-lg border border-neutral-200 hover:border-forest-500 hover:bg-forest-50 transition-all flex justify-between items-center group"
                                    onClick={applyTemplate}
                                >
                                    <div>
                                        <div className="font-medium group-hover:text-forest-700">Standard Week</div>
                                        <div className="text-xs text-neutral-500">Daily collection Mon-Fri, mixed types</div>
                                    </div>
                                    <Plus className="h-4 w-4 opacity-0 group-hover:opacity-100 text-forest-500" />
                                </button>
                            </div>
                        </Card>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <div className="lg:col-span-3 space-y-6">
                    {/* Calendar Toolbar */}
                    <Card className="flex items-center justify-between p-4">
                        <div className="flex items-center gap-4">
                            <Button variant="ghost" size="icon" onClick={handlePrev}><ChevronLeft className="h-4 w-4" /></Button>
                            <div className="text-lg font-semibold flex items-center gap-2">
                                <CalendarIcon className="h-5 w-5 text-neutral-500" />
                                {format(currentDate, 'MMMM yyyy')}
                            </div>
                            <Button variant="ghost" size="icon" onClick={handleNext}><ChevronRight className="h-4 w-4" /></Button>
                        </div>
                        <div className="flex bg-neutral-100 rounded-lg p-1">
                            <button
                                onClick={() => setView('week')}
                                className={`px-3 py-1 rounded-md text-sm font-medium transition-all ${view === 'week' ? 'bg-white shadow-sm text-forest-700' : 'text-neutral-500'}`}
                            >
                                Week
                            </button>
                            <button
                                onClick={() => setView('month')}
                                className={`px-3 py-1 rounded-md text-sm font-medium transition-all ${view === 'month' ? 'bg-white shadow-sm text-forest-700' : 'text-neutral-500'}`}
                            >
                                Month
                            </button>
                        </div>
                    </Card>

                    {/* Calendar Grid */}
                    <Card>
                        <div className="grid grid-cols-7 border-b border-neutral-100">
                            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                                <div key={day} className="py-3 text-center text-sm font-medium text-neutral-500 bg-neutral-50/50">
                                    {day}
                                </div>
                            ))}
                        </div>
                        <div className={`grid grid-cols-7 ${view === 'month' ? 'auto-rows-[100px]' : 'min-h-[500px]'} divide-x divide-neutral-100`}>
                            {calendarDays.map((day, i) => {
                                const daySchedules = schedules.filter(s =>
                                    s.date === format(day, 'yyyy-MM-dd') ||
                                    // Fallback for old data without date: match day name + within current view range (imperfect, but handles legacy mock data if re-added)
                                    (!s.date && s.day === format(day, 'EEE') && view === 'week')
                                );
                                const isCurrentMonth = isSameMonth(day, currentDate);

                                return (
                                    <div
                                        key={day.toISOString()}
                                        className={`p-2 space-y-2 relative group hover:bg-neutral-50/30 transition-colors ${!isCurrentMonth ? 'bg-neutral-50/50' : ''}`}
                                        onClick={() => handleOpenCreate(day)}
                                    >
                                        <div className={`text-center text-xs mb-2 ${!isCurrentMonth ? 'text-neutral-300' : 'text-neutral-500'}`}>
                                            {format(day, 'd')}
                                        </div>
                                        {daySchedules.map(schedule => (
                                            <div
                                                key={schedule.id}
                                                className={`p-1.5 rounded-md border text-[10px] cursor-pointer hover:shadow-md transition-all relative group/item ${schedule.type === 'General' ? 'bg-blue-50 border-blue-100 text-blue-700' :
                                                    schedule.type === 'Recycling' ? 'bg-green-50 border-green-100 text-green-700' :
                                                        'bg-amber-50 border-amber-100 text-amber-700'
                                                    }`}
                                                onClick={(e) => handleOpenEdit(e, schedule)}
                                            >
                                                <div className="font-bold truncate">{schedule.type}</div>
                                                <div className="flex items-center gap-1 opacity-80 truncate">
                                                    <Map className="h-2 w-2" /> {schedule.route.split('(')[0]}
                                                </div>
                                                <button
                                                    onClick={(e) => handleDelete(e, schedule.id)}
                                                    className="absolute -top-1 -right-1 bg-white rounded-full p-0.5 shadow-sm border opacity-0 group-hover/item:opacity-100 transition-opacity"
                                                >
                                                    <X className="h-2 w-2 text-red-500" />
                                                </button>
                                            </div>
                                        ))}
                                        <button className="w-full py-1 border border-dashed border-neutral-200 rounded-md text-neutral-400 hover:border-forest-300 hover:text-forest-500 transition-colors flex justify-center opacity-0 group-hover:opacity-100">
                                            <Plus className="h-3 w-3" />
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    </Card>
                </div>

                <div className="space-y-6">
                    {/* Quick Stats */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm">Weekly Summary</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {(() => {
                                const start = startOfWeek(currentDate, { weekStartsOn: 1 });
                                const end = endOfWeek(currentDate, { weekStartsOn: 1 });
                                const weeklySchedules = schedules.filter(s => {
                                    if (!s.date) return false;
                                    const d = new Date(s.date);
                                    return d >= start && d <= end;
                                });

                                const totalCost = weeklySchedules.length * 45000;
                                const coverage = Math.min(Math.round((weeklySchedules.length / 10) * 100), 100);

                                return (
                                    <>
                                        <div>
                                            <div className="text-xs text-neutral-500 mb-1">Total Coverage</div>
                                            <div className="text-2xl font-bold">{coverage}%</div>
                                            <div className="w-full bg-neutral-100 rounded-full h-1.5 mt-2">
                                                <div className="bg-forest-500 h-1.5 rounded-full" style={{ width: `${coverage}%` }} />
                                            </div>
                                        </div>
                                        <div>
                                            <div className="text-xs text-neutral-500 mb-1">Efficiency Score</div>
                                            <div className="text-2xl font-bold">92/100</div>
                                        </div>
                                        <div>
                                            <div className="text-xs text-neutral-500 mb-1">Projected Cost</div>
                                            <div className="text-2xl font-bold">LKR {(totalCost / 1000).toFixed(1)}k</div>
                                        </div>
                                    </>
                                );
                            })()}
                        </CardContent>
                    </Card>

                    {/* Unassigned Requests */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm">Unassigned Requests</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {issues.filter(i => i.status === 'Open').slice(0, 5).map(issue => (
                                <div key={issue.id} className="p-2 border border-neutral-100 rounded-md bg-neutral-50 flex items-center justify-between">
                                    <div>
                                        <div className="text-xs font-bold">{issue.type}</div>
                                        <div className="text-[10px] text-neutral-500">{issue.address.split(',')[0]} • {issue.priority} Priority</div>
                                    </div>
                                    <Button
                                        size="icon"
                                        variant="ghost"
                                        className="h-6 w-6"
                                        onClick={() => handleOpenCreate(new Date(issue.date))}
                                    >
                                        <Plus className="h-3 w-3" />
                                    </Button>
                                </div>
                            ))}
                            {issues.filter(i => i.status === 'Open').length === 0 && (
                                <div className="text-center text-xs text-neutral-400 py-4">
                                    No open requests
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
