import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { BarChart3, TrendingUp, TrendingDown, Users, Truck, DollarSign, Download, Calendar } from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import { subDays, isAfter, startOfMonth, subMonths } from 'date-fns';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export function AdminAnalytics() {
    const { schedules, residents, issues } = useAdmin();
    const [dateRange, setDateRange] = useState<'7d' | '30d' | '90d'>('30d');

    // Filter Logic
    const getStartDate = () => {
        const now = new Date();
        switch (dateRange) {
            case '7d': return subDays(now, 7);
            case '30d': return subDays(now, 30);
            case '90d': return subDays(now, 90);
            default: return subDays(now, 30);
        }
    };

    const startDate = getStartDate();

    const filteredSchedules = schedules.filter(s => {
        if (!s.date) return false;
        return isAfter(new Date(s.date), startDate);
    });

    // 1. Total Collections
    const totalCollections = filteredSchedules.length;

    // 2. Recycling Rate
    const recyclingCount = filteredSchedules.filter(s => s.type === 'Recycling').length;
    const recyclingRate = totalCollections > 0 ? ((recyclingCount / totalCollections) * 100).toFixed(1) : '0';

    // 3. Active Residents (Snapshot, not strictly time-filtered but we show current)
    const activeResidents = residents.filter(r => r.status === 'Active').length;

    // 4. Revenue (Estimated: Active Residents * 1500 LKR base fee)
    const revenue = (activeResidents * 1500) + (totalCollections * 200); // 1500 subscription + 200 per extra pickup est

    // Waste Composition
    const composition = {
        General: filteredSchedules.filter(s => s.type === 'General').length,
        Recycling: filteredSchedules.filter(s => s.type === 'Recycling').length,
        Organic: filteredSchedules.filter(s => s.type === 'Organic').length,
        Haz: filteredSchedules.filter(s => s.type === 'Hazardous' || s.type === 'Special').length,
    };

    const maxComp = Math.max(...Object.values(composition), 1); // Avoid div by 0

    // Efficiency (Issues resolved vs total in period)
    const filteredIssues = issues.filter(i => isAfter(new Date(i.date), startDate));
    const resolvedIssues = filteredIssues.filter(i => i.status === 'Resolved').length;
    const efficiency = filteredIssues.length > 0 ? Math.round((resolvedIssues / filteredIssues.length) * 100) : 100;

    const exportPDF = () => {
        const doc = new jsPDF();

        doc.setFontSize(20);
        doc.text('EcoTrack Analytics Report', 14, 22);

        doc.setFontSize(11);
        doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30);
        doc.text(`Period: Last ${dateRange.replace('d', ' Days')}`, 14, 36);

        // Usage Summary
        const summaryData = [
            ['Metric', 'Value'],
            ['Total Collections', totalCollections],
            ['Recycling Rate', `${recyclingRate}%`],
            ['Active Residents', activeResidents],
            ['Estimated Revenue', `LKR ${(revenue / 1000).toFixed(1)}k`],
            ['Efficiency Score', `${efficiency}%`]
        ];

        autoTable(doc, {
            startY: 45,
            head: [['Metric', 'Value']],
            body: summaryData.slice(1),
            theme: 'striped',
            headStyles: { fillColor: [34, 139, 34] } // Forest Green
        });

        // Detailed Composition
        autoTable(doc, {
            startY: (doc as any).lastAutoTable.finalY + 15,
            head: [['Waste Type', 'Count']],
            body: [
                ['General', composition.General],
                ['Recycling', composition.Recycling],
                ['Organic', composition.Organic],
                ['Hazardous/Other', composition.Haz],
            ],
            theme: 'grid',
            headStyles: { fillColor: [46, 139, 87] }
        });

        doc.save(`analytics_report_${new Date().toISOString().split('T')[0]}.pdf`);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Analytics Overview</h2>
                    <p className="text-neutral-500">Performance metrics and waste collection trends.</p>
                </div>
                <div className="flex gap-2">
                    <div className="flex bg-white border border-neutral-200 rounded-md overflow-hidden">
                        {(['7d', '30d', '90d'] as const).map(range => (
                            <button
                                key={range}
                                onClick={() => setDateRange(range)}
                                className={`px-3 py-2 text-sm font-medium transition-colors ${dateRange === range ? 'bg-forest-50 text-forest-700' : 'hover:bg-neutral-50 text-neutral-600'}`}
                            >
                                {range.toUpperCase()}
                            </button>
                        ))}
                    </div>
                    <Button variant="outline" onClick={exportPDF}>
                        <Download className="h-4 w-4 mr-2" /> Export PDF
                    </Button>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                    <CardContent className="p-6">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-sm font-medium text-neutral-500">Total Collections</p>
                                <h3 className="text-2xl font-bold mt-2">{totalCollections}</h3>
                            </div>
                            <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                                <Truck className="h-5 w-5" />
                            </div>
                        </div>
                        <div className="flex items-center mt-4 text-xs">
                            <span className="text-neutral-400">
                                In the last {dateRange.replace('d', ' days')}
                            </span>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-sm font-medium text-neutral-500">Recycling Rate</p>
                                <h3 className="text-2xl font-bold mt-2">{recyclingRate}%</h3>
                            </div>
                            <div className="p-2 bg-green-50 rounded-lg text-green-600">
                                <TrendingUp className="h-5 w-5" />
                            </div>
                        </div>
                        <div className="flex items-center mt-4 text-xs">
                            <span className="text-neutral-400">Target: 40%</span>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-sm font-medium text-neutral-500">Active Residents</p>
                                <h3 className="text-2xl font-bold mt-2">{activeResidents}</h3>
                            </div>
                            <div className="p-2 bg-purple-50 rounded-lg text-purple-600">
                                <Users className="h-5 w-5" />
                            </div>
                        </div>
                        <div className="flex items-center mt-4 text-xs">
                            <span className="text-green-600 flex items-center font-medium">
                                <TrendingUp className="h-3 w-3 mr-1" /> Live
                            </span>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-sm font-medium text-neutral-500">Est. Revenue</p>
                                <h3 className="text-2xl font-bold mt-2">LKR {(revenue / 1000).toFixed(1)}k</h3>
                            </div>
                            <div className="p-2 bg-amber-50 rounded-lg text-amber-600">
                                <DollarSign className="h-5 w-5" />
                            </div>
                        </div>
                        <div className="flex items-center mt-4 text-xs">
                            <span className="text-neutral-400">Based on active subs</span>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="min-h-[300px]">
                    <CardHeader>
                        <CardTitle className="text-sm">Waste Composition</CardTitle>
                    </CardHeader>
                    <CardContent className="flex items-center justify-center p-6">
                        {/* Dynamic Visuals */}
                        <div className="flex gap-4 items-end h-48 w-full justify-around px-4">
                            {[
                                { label: 'General', val: composition.General, color: 'bg-blue-500' },
                                { label: 'Recycle', val: composition.Recycling, color: 'bg-green-500' },
                                { label: 'Organic', val: composition.Organic, color: 'bg-amber-500' },
                                { label: 'Haz.', val: composition.Haz, color: 'bg-red-500' },
                            ].map((item, i) => {
                                const heightPercent = filteredSchedules.length > 0 ? (item.val / filteredSchedules.length) * 100 : 5;
                                return (
                                    <div key={i} className="flex flex-col items-center gap-2 group cursor-pointer w-full">
                                        <div
                                            className={`w-full max-w-[60px] rounded-t-lg ${item.color} opacity-80 group-hover:opacity-100 transition-all relative`}
                                            style={{ height: `${Math.max(heightPercent * 1.5, 10)}%` }} // Scaling for visibility
                                        >
                                            <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                                                {item.val}
                                            </span>
                                        </div>
                                        <span className="text-xs text-neutral-500 font-medium">{item.label}</span>
                                    </div>
                                );
                            })}
                        </div>
                        {filteredSchedules.length === 0 && <p className="text-xs text-neutral-400 absolute">No data for this period</p>}
                    </CardContent>
                </Card>

                <Card className="min-h-[300px]">
                    <CardHeader>
                        <CardTitle className="text-sm">Collection Metrics</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6 p-6">
                        {[
                            { label: 'Issue Resolution Rate', val: `${efficiency}%`, color: 'bg-emerald-500' },
                            { label: 'Recycling Adherence', val: `${recyclingRate}%`, color: 'bg-blue-500' },
                        ].map((item, i) => (
                            <div key={i}>
                                <div className="flex justify-between text-sm mb-1 font-medium">
                                    <span>{item.label}</span>
                                    <span>{item.val}</span>
                                </div>
                                <div className="w-full bg-neutral-100 rounded-full h-2">
                                    <div className={`h-2 rounded-full ${item.color}`} style={{ width: item.val }} />
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
