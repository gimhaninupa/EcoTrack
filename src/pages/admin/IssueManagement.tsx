import React, { useState } from 'react';
import { Card, CardContent } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { CheckCircle2, Clock, Filter, AlertCircle, ChevronRight, MoreHorizontal, Search, Plus, X, Pencil, Trash2 } from 'lucide-react';
import { useAdmin, AdminIssue } from '../../context/AdminContext';

export function AdminIssueManagement() {
    const { issues, updateIssueStatus, addIssue, updateIssue, deleteIssue } = useAdmin();
    const [filter, setFilter] = useState('All');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingIssue, setEditingIssue] = useState<AdminIssue | null>(null);
    const [formData, setFormData] = useState({
        type: '',
        resident: '',
        address: '',
        date: new Date().toISOString().split('T')[0],
        status: 'Open' as 'Open' | 'In Progress' | 'Resolved',
        priority: 'Medium' as 'High' | 'Medium' | 'Low',
        desc: ''
    });

    const filteredIssues = filter === 'All'
        ? issues
        : issues.filter(i => i.status === filter);

    const handleOpenAdd = () => {
        setEditingIssue(null);
        setFormData({
            type: '',
            resident: '',
            address: '',
            date: new Date().toISOString().split('T')[0],
            status: 'Open',
            priority: 'Medium',
            desc: ''
        });
        setIsModalOpen(true);
    };

    const handleOpenEdit = (issue: AdminIssue) => {
        setEditingIssue(issue);
        setFormData({
            type: issue.type,
            resident: issue.resident,
            address: issue.address,
            date: issue.date,
            status: issue.status,
            priority: issue.priority,
            desc: issue.desc
        });
        setIsModalOpen(true);
    };

    const handleDelete = (id: string) => {
        if (confirm('Are you sure you want to delete this issue?')) {
            deleteIssue(id);
        }
    };

    const handleSubmit = () => {
        if (!formData.type || !formData.resident) return;

        if (editingIssue) {
            updateIssue(editingIssue.id, formData);
        } else {
            addIssue(formData);
        }
        setIsModalOpen(false);
    };

    const handleExportCSV = () => {
        try {
            const headers = ['ID', 'Type', 'Resident', 'Address', 'Date', 'Status', 'Priority', 'Description'];
            const csvContent = [
                headers.join(','),
                ...issues.map(i => [
                    i.id || '',
                    `"${(i.type || '').replace(/"/g, '""')}"`,
                    `"${(i.resident || '').replace(/"/g, '""')}"`,
                    `"${(i.address || '').replace(/"/g, '""')}"`,
                    i.date || '',
                    i.status || '',
                    i.priority || '',
                    `"${(i.desc || '').replace(/"/g, '""')}"`
                ].join(','))
            ].join('\n');

            // Add BOM for Excel compatibility
            const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `issues-report-${new Date().toISOString().split('T')[0]}.csv`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Failed to export CSV:", error);
            alert("Failed to export CSV. Please check console for details.");
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Issue Management</h2>
                    <p className="text-neutral-500">Track and resolve resident reports and complaints.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={handleExportCSV}>Export CSV</Button>
                    <Button onClick={handleOpenAdd}>
                        <Plus className="mr-2 h-4 w-4" /> Raise Issue
                    </Button>
                </div>
            </div>

            {/* Filters & Search */}
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between pb-2">
                <div className="flex gap-2 bg-neutral-100 p-1 rounded-lg">
                    {['All', 'Open', 'In Progress', 'Resolved'].map(tab => (
                        <button
                            key={tab}
                            onClick={() => setFilter(tab)}
                            className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${filter === tab ? 'bg-white text-forest-600 shadow-sm' : 'text-neutral-500 hover:text-neutral-700'}`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
                <div className="relative w-full md:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                    <Input placeholder="Search issues..." className="pl-9 h-9" />
                </div>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <Card className="w-full max-w-md p-6 space-y-4 max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center">
                            <h3 className="text-lg font-bold">{editingIssue ? 'Edit Issue' : 'Raise New Issue'}</h3>
                            <Button variant="ghost" size="icon" onClick={() => setIsModalOpen(false)}>
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                        <div className="space-y-3">
                            <div>
                                <label className="text-sm font-medium">Issue Type</label>
                                <Input
                                    placeholder="e.g. Missed Pickup"
                                    value={formData.type}
                                    onChange={e => setFormData({ ...formData, type: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium">Resident Name</label>
                                <Input
                                    placeholder="Resident Name"
                                    value={formData.resident}
                                    onChange={e => setFormData({ ...formData, resident: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium">Address</label>
                                <Input
                                    placeholder="Location Address"
                                    value={formData.address}
                                    onChange={e => setFormData({ ...formData, address: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium">Description</label>
                                <Input
                                    placeholder="Details about the issue..."
                                    value={formData.desc}
                                    onChange={e => setFormData({ ...formData, desc: e.target.value })}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-medium">Priority</label>
                                    <select
                                        className="w-full h-9 rounded-md border border-neutral-200 px-3 text-sm"
                                        value={formData.priority}
                                        onChange={e => setFormData({ ...formData, priority: e.target.value as any })}
                                    >
                                        <option value="Low">Low</option>
                                        <option value="Medium">Medium</option>
                                        <option value="High">High</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-sm font-medium">Status</label>
                                    <select
                                        className="w-full h-9 rounded-md border border-neutral-200 px-3 text-sm"
                                        value={formData.status}
                                        onChange={e => setFormData({ ...formData, status: e.target.value as any })}
                                    >
                                        <option value="Open">Open</option>
                                        <option value="In Progress">In Progress</option>
                                        <option value="Resolved">Resolved</option>
                                    </select>
                                </div>
                            </div>
                            <Button className="w-full" onClick={handleSubmit}>
                                {editingIssue ? 'Save Changes' : 'Submit Issue'}
                            </Button>
                        </div>
                    </Card>
                </div>
            )}

            <div className="grid grid-cols-1 gap-4">
                {issues.length === 0 ? (
                    <div className="text-center p-12 bg-neutral-50 rounded-lg border border-dashed text-neutral-500">
                        <AlertCircle className="h-10 w-10 mx-auto mb-3 opacity-50" />
                        <h3 className="text-lg font-medium">No Issues Found</h3>
                        <p className="mb-4">There are no active issues reported.</p>
                        <Button variant="outline" onClick={handleOpenAdd}>Report an Issue</Button>
                    </div>
                ) : (
                    filteredIssues.map(issue => (
                        <Card key={issue.id} className="hover:border-forest-200 transition-colors group">
                            <CardContent className="p-0">
                                <div className="flex flex-col md:flex-row">
                                    {/* Status Strip */}
                                    <div className={`w-full md:w-2 h-2 md:h-auto ${issue.status === 'Open' ? 'bg-red-500' :
                                        issue.status === 'In Progress' ? 'bg-amber-500' : 'bg-emerald-500'
                                        }`} />

                                    <div className="p-6 flex-1 flex flex-col md:flex-row gap-6 items-start md:items-center">
                                        <div className="flex-1 space-y-2">
                                            <div className="flex items-center gap-3">
                                                <span className="font-mono text-sm text-neutral-500">{issue.id}</span>
                                                <Badge variant={
                                                    issue.priority === 'High' ? 'destructive' :
                                                        issue.priority === 'Medium' ? 'default' : 'secondary'
                                                } className="h-5 text-[10px] px-1.5 py-0 uppercase">
                                                    {issue.priority}
                                                </Badge>
                                                <span className="text-xs text-neutral-400 flex items-center gap-1">
                                                    <Clock className="h-3 w-3" /> {issue.date}
                                                </span>
                                            </div>
                                            <h3 className="font-semibold text-lg">{issue.type}</h3>
                                            <p className="text-neutral-600 line-clamp-1">{issue.desc}</p>

                                            <div className="flex items-center gap-4 text-xs text-neutral-500 pt-1">
                                                <span className="flex items-center gap-1">
                                                    <CheckCircle2 className="h-3 w-3" /> {issue.resident}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <AlertCircle className="h-3 w-3" /> {issue.address}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3 w-full md:w-auto mt-4 md:mt-0 pt-4 md:pt-0 border-t md:border-t-0 border-neutral-100">
                                            <select
                                                className="h-9 rounded-md border border-neutral-200 text-sm px-3 py-1 bg-white focus:outline-none focus:ring-2 focus:ring-forest-500"
                                                value={issue.status}
                                                onChange={(e) => updateIssueStatus(issue.id, e.target.value as any)}
                                            >
                                                <option value="Open">Open</option>
                                                <option value="In Progress">In Progress</option>
                                                <option value="Resolved">Resolved</option>
                                            </select>

                                            <Button variant="ghost" size="icon" onClick={() => handleOpenEdit(issue)}>
                                                <Pencil className="h-4 w-4" />
                                            </Button>
                                            <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600" onClick={() => handleDelete(issue.id)}>
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
}
