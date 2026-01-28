import React, { useState } from 'react';
import { Card, CardContent } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Search, MoreVertical, Mail, Phone, MapPin, Trash2, Edit2, Filter, X, Plus, Download } from 'lucide-react';
import { useAdmin, Resident } from '../../context/AdminContext';

export function AdminResidentDirectory() {
    const { residents, deleteResident, addResident, updateResident } = useAdmin();
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [showFilters, setShowFilters] = useState(false);
    const [statusFilter, setStatusFilter] = useState('All');
    const [typeFilter, setTypeFilter] = useState('All');
    const [editingResident, setEditingResident] = useState<Resident | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        address: '',
        phone: '',
        type: 'Residential' as 'Residential' | 'Commercial',
        status: 'Active' as 'Active' | 'Suspended' | 'Pending',
    });

    const filteredResidents = residents.filter(r => {
        const matchesSearch = r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            r.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            r.address.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus = statusFilter === 'All' || r.status === statusFilter;
        const matchesType = typeFilter === 'All' || r.type === typeFilter;

        return matchesSearch && matchesStatus && matchesType;
    });

    const handleOpenAdd = () => {
        setEditingResident(null);
        setFormData({
            name: '',
            email: '',
            address: '',
            phone: '',
            type: 'Residential',
            status: 'Active',
            joinDate: new Date().toISOString().split('T')[0]
        });
        setIsModalOpen(true);
    };

    const handleOpenEdit = (resident: Resident) => {
        setEditingResident(resident);
        setFormData({
            name: resident.name,
            email: resident.email,
            address: resident.address,
            phone: resident.phone,
            type: resident.type,
            status: resident.status,
            joinDate: resident.joinDate
        });
        setIsModalOpen(true);
    };

    const handleSubmit = () => {
        if (!formData.name || !formData.email) {
            alert('Please fill in at least Name and Email');
            return;
        }

        if (editingResident) {
            updateResident(editingResident.id, formData);
        } else {
            addResident(formData);
        }
        setIsModalOpen(false);
    };

    const handleExportPDF = () => {
        const doc = new jsPDF();

        // Add title
        doc.setFontSize(18);
        doc.text('Resident Directory Report', 14, 22);
        doc.setFontSize(11);
        doc.setTextColor(100);
        doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30);

        // Add table
        autoTable(doc, {
            head: [['Name', 'Email', 'Phone', 'Address', 'Type', 'Status']],
            body: filteredResidents.map(r => [
                r.name,
                r.email,
                r.phone,
                r.address,
                r.type,
                r.status
            ]),
            startY: 40,
            styles: { fontSize: 9 },
            headStyles: { fillColor: [34, 139, 34] } // Forest Green
        });

        doc.save(`residents-report-${new Date().toISOString().split('T')[0]}.pdf`);
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Resident Directory</h2>
                    <p className="text-neutral-500">Manage resident accounts and service details.</p>
                </div>
                <Button onClick={handleOpenAdd}>
                    <Plus className="mr-2 h-4 w-4" /> Add New Resident
                </Button>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <Card className="w-full max-w-md p-6 space-y-4 max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center">
                            <h3 className="text-lg font-bold">{editingResident ? 'Edit Resident' : 'Add New Resident'}</h3>
                            <Button variant="ghost" size="icon" onClick={() => setIsModalOpen(false)}>
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                        <div className="space-y-3">
                            <div>
                                <label className="text-sm font-medium">Name</label>
                                <Input
                                    placeholder="Full Name"
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium">Email</label>
                                <Input
                                    placeholder="Email Address"
                                    value={formData.email}
                                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium">Phone</label>
                                <Input
                                    placeholder="Phone Number"
                                    value={formData.phone}
                                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium">Address</label>
                                <Input
                                    placeholder="Full Address"
                                    value={formData.address}
                                    onChange={e => setFormData({ ...formData, address: e.target.value })}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-medium">Type</label>
                                    <select
                                        className="w-full h-9 rounded-md border border-neutral-200 px-3 text-sm"
                                        value={formData.type}
                                        onChange={e => setFormData({ ...formData, type: e.target.value as any })}
                                    >
                                        <option value="Residential">Residential</option>
                                        <option value="Commercial">Commercial</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-sm font-medium">Status</label>
                                    <select
                                        className="w-full h-9 rounded-md border border-neutral-200 px-3 text-sm"
                                        value={formData.status}
                                        onChange={e => setFormData({ ...formData, status: e.target.value as any })}
                                    >
                                        <option value="Active">Active</option>
                                        <option value="Suspended">Suspended</option>
                                        <option value="Pending">Pending</option>
                                    </select>
                                </div>
                            </div>
                            <Button className="w-full" onClick={handleSubmit}>
                                {editingResident ? 'Save Changes' : 'Add Resident'}
                            </Button>
                        </div>
                    </Card>
                </div>
            )}

            <Card>
                <div className="p-4 border-b border-neutral-100 flex flex-col md:flex-row gap-4 justify-between items-center">
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                        <Input
                            placeholder="Search by name, email, or address..."
                            className="pl-9"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-2 w-full md:w-auto">
                        <Button
                            variant={showFilters ? 'secondary' : 'outline'}
                            className="flex-1 md:flex-none"
                            onClick={() => setShowFilters(!showFilters)}
                        >
                            <Filter className="h-4 w-4 mr-2" /> Filter
                        </Button>
                        <Button variant="outline" className="flex-1 md:flex-none" onClick={handleExportPDF}>
                            <Download className="h-4 w-4 mr-2" /> Export PDF
                        </Button>
                    </div>
                </div>

                {/* Filter Bar */}
                {showFilters && (
                    <div className="bg-neutral-50 px-4 py-3 border-b border-neutral-100 flex flex-wrap gap-4 animate-in slide-in-from-top-2">
                        <div className="flex flex-col gap-1">
                            <label className="text-xs font-medium text-neutral-500">Status</label>
                            <select
                                className="h-8 rounded-md border border-neutral-200 text-xs px-2 bg-white"
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                            >
                                <option value="All">All Statuses</option>
                                <option value="Active">Active</option>
                                <option value="Suspended">Suspended</option>
                                <option value="Pending">Pending</option>
                            </select>
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="text-xs font-medium text-neutral-500">Account Type</label>
                            <select
                                className="h-8 rounded-md border border-neutral-200 text-xs px-2 bg-white"
                                value={typeFilter}
                                onChange={(e) => setTypeFilter(e.target.value)}
                            >
                                <option value="All">All Types</option>
                                <option value="Residential">Residential</option>
                                <option value="Commercial">Commercial</option>
                            </select>
                        </div>
                        <div className="flex items-end">
                            <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 text-neutral-500"
                                onClick={() => {
                                    setStatusFilter('All');
                                    setTypeFilter('All');
                                }}
                            >
                                Reset
                            </Button>
                        </div>
                    </div>
                )}

                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-neutral-500 uppercase bg-neutral-50/50">
                            <tr>
                                <th className="px-6 py-3 font-medium">Resident</th>
                                <th className="px-6 py-3 font-medium">Contact</th>
                                <th className="px-6 py-3 font-medium">Address</th>
                                <th className="px-6 py-3 font-medium">Status</th>
                                <th className="px-6 py-3 font-medium text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-100">
                            {filteredResidents.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-neutral-500">
                                        No residents found. Add a new resident to get started.
                                    </td>
                                </tr>
                            ) : (
                                filteredResidents.map((resident) => (
                                    <tr key={resident.id} className="hover:bg-neutral-50/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="h-8 w-8 rounded-full bg-forest-100 text-forest-700 flex items-center justify-center font-bold text-xs">
                                                    {resident.name.substring(0, 2).toUpperCase()}
                                                </div>
                                                <div>
                                                    <div className="font-medium text-neutral-900">{resident.name}</div>
                                                    <div className="text-xs text-neutral-500">{resident.type}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2 text-neutral-600">
                                                    <Mail className="h-3 w-3" /> {resident.email}
                                                </div>
                                                <div className="flex items-center gap-2 text-neutral-600">
                                                    <Phone className="h-3 w-3" /> {resident.phone}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-neutral-600">
                                            <div className="flex items-start gap-2">
                                                <MapPin className="h-3 w-3 mt-0.5 shrink-0" />
                                                {resident.address}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <Badge variant={resident.status === 'Active' ? 'success' : 'destructive'} className="uppercase text-[10px]">
                                                {resident.status}
                                            </Badge>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button size="icon" variant="ghost" className="h-8 w-8 text-neutral-500 hover:text-neutral-900" onClick={() => handleOpenEdit(resident)}>
                                                    <Edit2 className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    size="icon"
                                                    variant="ghost"
                                                    className="h-8 w-8 text-neutral-500 hover:text-red-600"
                                                    onClick={() => {
                                                        if (confirm('Are you sure you want to delete this resident?')) {
                                                            deleteResident(resident.id);
                                                        }
                                                    }}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="p-4 border-t border-neutral-100 text-xs text-neutral-500 flex justify-between items-center">
                    <span>Showing {filteredResidents.length} residents</span>
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm" disabled>Previous</Button>
                        <Button variant="outline" size="sm">Next</Button>
                    </div>
                </div>
            </Card>
        </div>
    );
}
