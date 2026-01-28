import React, { createContext, useContext, useState, useEffect } from 'react';

// Interfaces
export interface Truck {
    id: string;
    driver: string;
    status: 'En Route' | 'Collection' | 'Idle' | 'Maintenance';
    location: string;
    battery: number; // 0-100
    fuel: number; // 0-100
    route: string;
    type: string;
}

export interface AdminIssue {
    id: string;
    type: string;
    resident: string;
    address: string;
    date: string;
    status: 'Open' | 'In Progress' | 'Resolved';
    priority: 'High' | 'Medium' | 'Low';
    desc: string;
}

export interface Resident {
    id: string;
    name: string;
    email: string;
    address: string;
    status: 'Active' | 'Suspended' | 'Pending';
    joinDate: string;
    phone: string;
    type: 'Residential' | 'Commercial';
}

export interface AdminUser {
    id: number;
    name: string;
    email: string;
    role: string;
    status: 'Active' | 'Offline';
    lastActive: string;
}

export interface SystemSettings {
    appName: string;
    supportEmail: string;
    contactPhone: string;
    timezone: string;
    notifications: {
        email: boolean;
        sms: boolean;
        push: boolean;
    };
    security: {
        minPasswordLength: number;
        requireSpecialChars: boolean;
        sessionTimeout: number; // in minutes
    };
}

export interface AdminRoute {
    id: string;
    name: string;
    driver: string;
    status: 'Active' | 'Completed' | 'Pending';
    progress: string;
}

interface AdminContextType {
    trucks: Truck[];
    issues: AdminIssue[];
    residents: Resident[];
    users: AdminUser[];
    routes: AdminRoute[];
    updateTruckStatus: (id: string, status: Truck['status']) => void;
    updateIssueStatus: (id: string, status: AdminIssue['status']) => void;
    addIssue: (issue: Omit<AdminIssue, 'id'>) => void;
    updateIssue: (id: string, data: Partial<AdminIssue>) => void;
    deleteIssue: (id: string) => void;
    addTruck: (truck: Omit<Truck, 'id'>) => void;
    updateTruck: (id: string, data: Partial<Truck>) => void;
    deleteTruck: (id: string) => void;
    // Resident Actions
    updateResidentStatus: (id: string, status: Resident['status']) => void;
    addResident: (resident: Omit<Resident, 'id'>) => void;
    updateResident: (id: string, data: Partial<Resident>) => void;
    deleteResident: (id: string) => void;
    // User Actions
    updateUserStatus: (id: number, status: AdminUser['status']) => void;
    addUser: (user: Omit<AdminUser, 'id'>) => void;
    updateUser: (id: number, data: Partial<AdminUser>) => void;
    deleteUser: (id: number) => void;
    // Route Actions
    addRoute: (route: Omit<AdminRoute, 'id'>) => void;
    updateRoute: (id: string, data: Partial<AdminRoute>) => void;
    deleteRoute: (id: string) => void;
    // Schedule Actions
    schedules: Schedule[];
    addSchedule: (schedule: Omit<Schedule, 'id'>) => void;
    updateSchedule: (id: number, data: Partial<Schedule>) => void;
    deleteSchedule: (id: number) => void;
    // Billing Actions
    invoices: Invoice[];
    addInvoice: (invoice: Omit<Invoice, 'id'>) => void;
    updateInvoiceStatus: (id: string, status: Invoice['status']) => void;
    generateMonthlyStatement: () => void;
    // System Settings
    settings: SystemSettings;
    updateSettings: (newSettings: SystemSettings) => void;
}

export interface Schedule {
    id: number;
    day: string;
    date: string; // Add date field for specific calendar support
    route: string;
    truck: string;
    type: string;
    status: 'Scheduled' | 'Draft' | 'Completed';
}

export interface Invoice {
    id: string;
    residentId: string;
    residentName: string;
    date: string;
    amount: number;
    status: 'Paid' | 'Pending' | 'Overdue';
    method: string;
    items: { description: string; amount: number }[];
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

// Initial Mock Data
const INITIAL_TRUCKS: Truck[] = [];

const INITIAL_ISSUES: AdminIssue[] = [];

const INITIAL_RESIDENTS: Resident[] = [];

const INITIAL_USERS: AdminUser[] = [];

const INITIAL_SCHEDULES: Schedule[] = [];

const INITIAL_INVOICES: Invoice[] = [];

const INITIAL_ROUTES: AdminRoute[] = [];

const INITIAL_SETTINGS: SystemSettings = {
    appName: 'EcoTrack Waste Management System',
    supportEmail: 'support@ecotrack.lk',
    contactPhone: '+94 11 234 5678',
    timezone: 'Asia/Colombo (GMT+5:30)',
    notifications: {
        email: true,
        sms: false,
        push: true
    },
    security: {
        minPasswordLength: 8,
        requireSpecialChars: true,
        sessionTimeout: 30
    }
};

export function AdminProvider({ children }: { children: React.ReactNode }) {
    const [trucks, setTrucks] = useState<Truck[]>(INITIAL_TRUCKS);
    const [issues, setIssues] = useState<AdminIssue[]>(INITIAL_ISSUES);
    const [residents, setResidents] = useState<Resident[]>(INITIAL_RESIDENTS);
    const [users, setUsers] = useState<AdminUser[]>(INITIAL_USERS);

    const [routes, setRoutes] = useState<AdminRoute[]>(INITIAL_ROUTES);
    const [schedules, setSchedules] = useState<Schedule[]>(INITIAL_SCHEDULES);
    const [invoices, setInvoices] = useState<Invoice[]>(INITIAL_INVOICES);
    const [settings, setSettings] = useState<SystemSettings>(INITIAL_SETTINGS);

    // Load from local storage
    useEffect(() => {
        const storedTrucks = localStorage.getItem('ecotrack_admin_trucks');
        const storedIssues = localStorage.getItem('ecotrack_admin_issues');
        const storedResidents = localStorage.getItem('ecotrack_admin_residents');
        const storedUsers = localStorage.getItem('ecotrack_admin_users');
        const storedRoutes = localStorage.getItem('ecotrack_admin_routes');
        const storedSchedules = localStorage.getItem('ecotrack_admin_schedules');
        const storedInvoices = localStorage.getItem('ecotrack_admin_invoices');

        if (storedTrucks) setTrucks(JSON.parse(storedTrucks));
        if (storedIssues) setIssues(JSON.parse(storedIssues));
        if (storedResidents) setResidents(JSON.parse(storedResidents));
        if (storedUsers) setUsers(JSON.parse(storedUsers));
        if (storedRoutes) setRoutes(JSON.parse(storedRoutes));
        if (storedSchedules) setSchedules(JSON.parse(storedSchedules));
        if (storedInvoices) setInvoices(JSON.parse(storedInvoices));

        const storedSettings = localStorage.getItem('ecotrack_admin_settings');
        if (storedSettings) setSettings(JSON.parse(storedSettings));
    }, []);

    // Save to local storage
    useEffect(() => {
        localStorage.setItem('ecotrack_admin_trucks', JSON.stringify(trucks));
        localStorage.setItem('ecotrack_admin_issues', JSON.stringify(issues));
        localStorage.setItem('ecotrack_admin_residents', JSON.stringify(residents));
        localStorage.setItem('ecotrack_admin_users', JSON.stringify(users));
        localStorage.setItem('ecotrack_admin_routes', JSON.stringify(routes));
        localStorage.setItem('ecotrack_admin_schedules', JSON.stringify(schedules));
        localStorage.setItem('ecotrack_admin_invoices', JSON.stringify(invoices));
        localStorage.setItem('ecotrack_admin_settings', JSON.stringify(settings));
    }, [trucks, issues, residents, users, routes, schedules, invoices, settings]);

    const updateTruckStatus = (id: string, status: Truck['status']) => {
        setTrucks(prev => prev.map(t => t.id === id ? { ...t, status } : t));
    };

    const updateIssueStatus = (id: string, status: AdminIssue['status']) => {
        setIssues(prev => prev.map(i => i.id === id ? { ...i, status } : i));
    };

    const addIssue = (issueData: Omit<AdminIssue, 'id'>) => {
        const newIssue = {
            ...issueData,
            id: `ISS-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`
        };
        setIssues(prev => [newIssue, ...prev]);
    };

    const updateIssue = (id: string, data: Partial<AdminIssue>) => {
        setIssues(prev => prev.map(i => i.id === id ? { ...i, ...data } : i));
    };

    const deleteIssue = (id: string) => {
        setIssues(prev => prev.filter(i => i.id !== id));
    };

    const addTruck = (truckData: Omit<Truck, 'id'>) => {
        const newTruck = {
            ...truckData,
            id: `TRK-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`
        };
        setTrucks(prev => [...prev, newTruck]);
    };

    const updateTruck = (id: string, data: Partial<Truck>) => {
        setTrucks(prev => prev.map(t => t.id === id ? { ...t, ...data } : t));
    };

    const deleteTruck = (id: string) => {
        setTrucks(prev => prev.filter(t => t.id !== id));
    };

    const addResident = (residentData: Omit<Resident, 'id'>) => {
        const newResident = {
            ...residentData,
            id: `RES-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`
        };
        setResidents(prev => [...prev, newResident]);
    };

    const updateResident = (id: string, data: Partial<Resident>) => {
        setResidents(prev => prev.map(r => r.id === id ? { ...r, ...data } : r));
    };

    const updateResidentStatus = (id: string, status: Resident['status']) => {
        setResidents(prev => prev.map(r => r.id === id ? { ...r, status } : r));
    };

    const deleteResident = (id: string) => {
        setResidents(prev => prev.filter(r => r.id !== id));
    };

    const updateUserStatus = (id: number, status: AdminUser['status']) => {
        setUsers(prev => prev.map(u => u.id === id ? { ...u, status } : u));
    };

    const addUser = (userData: Omit<AdminUser, 'id'>) => {
        const newUser = {
            ...userData,
            id: Date.now() // Simple ID generation
        };
        setUsers(prev => [...prev, newUser]);
    };

    const updateUser = (id: number, data: Partial<AdminUser>) => {
        setUsers(prev => prev.map(u => u.id === id ? { ...u, ...data } : u));
    };

    const deleteUser = (id: number) => {
        setUsers(prev => prev.filter(u => u.id !== id));
    };

    const addRoute = (routeData: Omit<AdminRoute, 'id'>) => {
        const newRoute = {
            ...routeData,
            id: `RT-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`
        };
        setRoutes(prev => [...prev, newRoute]);
    };

    const updateRoute = (id: string, data: Partial<AdminRoute>) => {
        setRoutes(prev => prev.map(r => r.id === id ? { ...r, ...data } : r));
    };

    const deleteRoute = (id: string) => {
        setRoutes(prev => prev.filter(r => r.id !== id));
    };

    const addSchedule = (scheduleData: Omit<Schedule, 'id'>) => {
        const newSchedule = {
            ...scheduleData,
            id: Date.now() // Simple ID generation
        };
        setSchedules(prev => [...prev, newSchedule]);
    };

    const updateSchedule = (id: number, data: Partial<Schedule>) => {
        setSchedules(prev => prev.map(s => s.id === id ? { ...s, ...data } : s));
    };

    const deleteSchedule = (id: number) => {
        setSchedules(prev => prev.filter(s => s.id !== id));
    };

    const addInvoice = (invoiceData: Omit<Invoice, 'id'>) => {
        const newInvoice = {
            ...invoiceData,
            id: `INV-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`
        };
        setInvoices(prev => [newInvoice, ...prev]);
    };

    const updateInvoiceStatus = (id: string, status: Invoice['status']) => {
        setInvoices(prev => prev.map(inv => inv.id === id ? { ...inv, status } : inv));
    };

    const generateMonthlyStatement = () => {
        // Generate mock invoices for all residents
        const newInvoices = residents.map(resident => ({
            id: `INV-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`,
            residentId: resident.id,
            residentName: resident.name,
            date: new Date().toISOString().split('T')[0],
            amount: resident.type === 'Commercial' ? 4500 : 500,
            status: 'Pending' as const,
            method: 'Bank Transfer',
            items: [{
                description: `${resident.type} Waste Collection - ${new Date().toLocaleString('default', { month: 'short' })}`,
                amount: resident.type === 'Commercial' ? 4500 : 500
            }]
        }));

        setInvoices(prev => [...newInvoices, ...prev]);
    };


    const updateSettings = (newSettings: SystemSettings) => {
        setSettings(newSettings);
    };

    return (
        <AdminContext.Provider value={{
            trucks, issues, residents, users, schedules, routes,
            updateTruckStatus, updateIssueStatus, addIssue, updateIssue, deleteIssue, addTruck, updateTruck, deleteTruck,
            updateResidentStatus, deleteResident, addResident, updateResident, updateUserStatus, addRoute,
            addUser, updateUser, deleteUser,
            updateRoute, deleteRoute, addSchedule, updateSchedule, deleteSchedule,
            invoices, addInvoice, updateInvoiceStatus, generateMonthlyStatement,
            settings, updateSettings
        }}>
            {children}
        </AdminContext.Provider>
    );
}

export function useAdmin() {
    const context = useContext(AdminContext);
    if (context === undefined) {
        throw new Error('useAdmin must be used within an AdminProvider');
    }
    return context;
}
