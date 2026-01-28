import React, { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Search, Shield, Mail, Plus, Edit2, Trash2, X, Check } from 'lucide-react';
import { useAdmin, AdminUser } from '../../context/AdminContext';

export function AdminUserManagement() {
    const { users, updateUserStatus, addUser, updateUser, deleteUser } = useAdmin();
    const [searchTerm, setSearchTerm] = useState('');

    // Modal States
    const [showUserModal, setShowUserModal] = useState(false);
    const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
    const [showRolesModal, setShowRolesModal] = useState(false);
    const [showPermsModal, setShowPermsModal] = useState(false);

    // Form States
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        role: 'Driver'
    });

    const filteredUsers = users.filter(u =>
        u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleAddUser = () => {
        setEditingUser(null);
        setFormData({ name: '', email: '', role: 'Driver' });
        setShowUserModal(true);
    };

    const handleEditUser = (user: AdminUser) => {
        setEditingUser(user);
        setFormData({ name: user.name, email: user.email, role: user.role });
        setShowUserModal(true);
    };

    const handleSubmitUser = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingUser) {
            updateUser(editingUser.id, {
                ...formData,
                status: editingUser.status
            });
        } else {
            addUser({
                ...formData,
                status: 'Active',
                lastActive: 'Just now'
            });
        }
        setShowUserModal(false);
    };

    const handleDeleteUser = (id: number) => {
        if (confirm('Are you sure you want to delete this user?')) {
            deleteUser(id);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">User Management</h2>
                    <p className="text-neutral-500">Manage system access and roles.</p>
                </div>
                <Button onClick={handleAddUser}>
                    <Plus className="mr-2 h-4 w-4" /> Add User
                </Button>
            </div>

            <Card>
                <div className="p-4 border-b border-neutral-100 flex justify-between items-center gap-4">
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                        <Input
                            placeholder="Search users..."
                            className="pl-9"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" onClick={() => setShowRolesModal(true)}>Roles</Button>
                        <Button variant="outline" onClick={() => setShowPermsModal(true)}>Permissions</Button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-neutral-500 uppercase bg-neutral-50/50">
                            <tr>
                                <th className="px-6 py-3 font-medium">User</th>
                                <th className="px-6 py-3 font-medium">Role</th>
                                <th className="px-6 py-3 font-medium">Status</th>
                                <th className="px-6 py-3 font-medium">Last Active</th>
                                <th className="px-6 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-100">
                            {filteredUsers.length > 0 ? (
                                filteredUsers.map((user) => (
                                    <tr key={user.id} className="hover:bg-neutral-50/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="h-9 w-9 rounded-full bg-neutral-200 flex items-center justify-center text-neutral-600 font-bold">
                                                    {user.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <div className="font-medium text-neutral-900">{user.name}</div>
                                                    <div className="flex items-center gap-1 text-xs text-neutral-500">
                                                        <Mail className="h-3 w-3" /> {user.email}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <Badge variant="outline" className="flex w-fit items-center gap-1 bg-white">
                                                <Shield className="h-3 w-3 text-neutral-400" />
                                                {user.role}
                                            </Badge>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <div className={`h-2 w-2 rounded-full ${user.status === 'Active' ? 'bg-emerald-500' : 'bg-neutral-400'}`} />
                                                <span
                                                    className={`cursor-pointer hover:underline ${user.status === 'Active' ? 'text-emerald-700' : 'text-neutral-500'}`}
                                                    onClick={() => updateUserStatus(user.id, user.status === 'Active' ? 'Offline' : 'Active')}
                                                >
                                                    {user.status}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-neutral-500">
                                            {user.lastActive}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button size="icon" variant="ghost" onClick={() => handleEditUser(user)}>
                                                    <Edit2 className="h-4 w-4 text-neutral-400 hover:text-forest-600" />
                                                </Button>
                                                <Button size="icon" variant="ghost" onClick={() => handleDeleteUser(user.id)}>
                                                    <Trash2 className="h-4 w-4 text-neutral-400 hover:text-red-600" />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="px-6 py-8 text-center text-neutral-500">
                                        No users found. Click "Add User" to create one.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>

            {/* Add/Edit User Modal */}
            {showUserModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-bold">{editingUser ? 'Edit User' : 'Add New User'}</h3>
                            <button onClick={() => setShowUserModal(false)}><X className="h-5 w-5 text-neutral-500" /></button>
                        </div>
                        <form onSubmit={handleSubmitUser} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Full Name</label>
                                <Input required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Email Address</label>
                                <Input required type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Role</label>
                                <select
                                    className="w-full h-10 px-3 rounded-md border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-forest-500"
                                    value={formData.role}
                                    onChange={e => setFormData({ ...formData, role: e.target.value })}
                                >
                                    <option value="Administrator">Administrator</option>
                                    <option value="Driver">Driver</option>
                                    <option value="Support">Support Staff</option>
                                    <option value="Manager">Manager</option>
                                </select>
                            </div>
                            <div className="flex justify-end gap-3 mt-6">
                                <Button type="button" variant="outline" onClick={() => setShowUserModal(false)}>Cancel</Button>
                                <Button type="submit">{editingUser ? 'Save Changes' : 'Create User'}</Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Roles Modal */}
            {showRolesModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-bold">Manage Roles</h3>
                            <button onClick={() => setShowRolesModal(false)}><X className="h-5 w-5 text-neutral-500" /></button>
                        </div>
                        <div className="space-y-2">
                            {['Administrator', 'Driver', 'Support Staff', 'Manager'].map(role => (
                                <div key={role} className="flex justify-between items-center p-3 bg-neutral-50 rounded-lg">
                                    <span className="font-medium">{role}</span>
                                    <Badge variant="outline">Default</Badge>
                                </div>
                            ))}
                        </div>
                        <div className="mt-4 p-4 bg-yellow-50 text-yellow-800 text-sm rounded-md border border-yellow-200">
                            Custom role creation is available in the Enterprise plan.
                        </div>
                        <div className="flex justify-end mt-4">
                            <Button onClick={() => setShowRolesModal(false)}>Close</Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Permissions Modal */}
            {showPermsModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-bold">System Permissions</h3>
                            <button onClick={() => setShowPermsModal(false)}><X className="h-5 w-5 text-neutral-500" /></button>
                        </div>
                        <div className="space-y-2 max-h-60 overflow-y-auto">
                            {[
                                'Manage Users', 'View Financials', 'Edit Routes',
                                'Resolve Issues', 'Delete Records', 'System Settings'
                            ].map(perm => (
                                <div key={perm} className="flex items-center gap-3 p-2 hover:bg-neutral-50 rounded">
                                    <Check className="h-4 w-4 text-forest-600" />
                                    <span>{perm}</span>
                                </div>
                            ))}
                        </div>
                        <div className="flex justify-end mt-4">
                            <Button onClick={() => setShowPermsModal(false)}>Close</Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
