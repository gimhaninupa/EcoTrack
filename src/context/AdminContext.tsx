import React, { createContext, useContext, useState, useEffect } from 'react';
import { issueService } from '../services/issueService';
import { userService } from '../services/userService';
import { pickupService } from '../services/pickupService';
import { billingService, Payment } from '../services/billingService';

// Interfaces
import { truckService, Truck } from '../services/truckService';


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
    id: string; // Changed to string for Firestore compatibility
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
    startLocation: string;
    endLocation: string;
    startCoords?: { lat: number, lng: number };
    endCoords?: { lat: number, lng: number };
}

export interface Schedule {
    id: string; // Changed to string for Firestore compatibility
    day: string;
    date: string;
    route: string;
    truck: string;
    type: string;
    status: 'Scheduled' | 'Draft' | 'Completed';
}

export interface Invoice {
    id: string;
    residentId?: string; // Optional for now
    residentName: string; // Made required to match billing service
    resident?: string; // Legacy support
    date?: string;
    dueDate?: string;
    amount: number;
    status: 'Paid' | 'Pending' | 'Overdue';
    method?: string;
    items: { description: string; amount: number }[] | string[];
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

const AdminContext = createContext<AdminContextType | undefined>(undefined);

// Initial Mock Data

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
    const [trucks, setTrucks] = useState<Truck[]>([]);
    const [issues, setIssues] = useState<AdminIssue[]>(INITIAL_ISSUES);
    const [residents, setResidents] = useState<Resident[]>(INITIAL_RESIDENTS);
    const [users, setUsers] = useState<AdminUser[]>(INITIAL_USERS);

    const [routes, setRoutes] = useState<AdminRoute[]>(INITIAL_ROUTES);
    const [schedules, setSchedules] = useState<Schedule[]>(INITIAL_SCHEDULES);
    const [invoices, setInvoices] = useState<Invoice[]>(INITIAL_INVOICES);
    const [settings, setSettings] = useState<SystemSettings>(INITIAL_SETTINGS);

    // Load from local storage and Subscribe to Firestore
    useEffect(() => {

        const storedUsers = localStorage.getItem('ecotrack_admin_users');
        const storedRoutes = localStorage.getItem('ecotrack_admin_routes');
        const storedSchedules = localStorage.getItem('ecotrack_admin_schedules');
        const storedInvoices = localStorage.getItem('ecotrack_admin_invoices');


        // Residents and Issues are now fetched from Firestore
        if (storedUsers) setUsers(JSON.parse(storedUsers));
        if (storedRoutes) setRoutes(JSON.parse(storedRoutes));
        if (storedSchedules) setSchedules(JSON.parse(storedSchedules));
        if (storedInvoices) setInvoices(JSON.parse(storedInvoices));

        const storedSettings = localStorage.getItem('ecotrack_admin_settings');
        if (storedSettings) setSettings(JSON.parse(storedSettings));

        // Subscribe to Firestore Issues
        const unsubscribeIssues = issueService.subscribeToAllIssues((fetchedIssues) => {
            const mappedIssues: AdminIssue[] = fetchedIssues.map(i => ({
                id: i.id || 'unknown',
                type: i.type,
                resident: i.residentName,
                address: i.address,
                date: i.date,
                status: i.status,
                priority: i.priority,
                desc: i.description
            }));
            setIssues(mappedIssues);
        });

        // Subscribe to Firestore Residents
        const unsubscribeResidents = userService.subscribeToAllResidents((fetchedResidents) => {
            console.log("AdminContext: Received residents from service:", fetchedResidents);
            const mappedResidents: Resident[] = fetchedResidents.map(u => ({
                id: u.uid,
                name: u.name,
                email: u.email,
                address: u.address || 'N/A',
                phone: u.phone || 'N/A',
                type: 'Residential',
                status: 'Active',
                joinDate: u.createdAt ? new Date(u.createdAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]
            }));
            setResidents(mappedResidents);
        });

        // Subscribe to Firestore Pickups (Schedules)
        const unsubscribePickups = pickupService.subscribeToAllPickups((fetchedPickups) => {
            console.log("AdminContext: Received pickups:", fetchedPickups);
            const mappedSchedules: Schedule[] = fetchedPickups.map(p => ({
                id: p.id || 'unknown',
                date: new Date(p.date).toISOString().split('T')[0],
                day: new Date(p.date).toLocaleString('en-US', { weekday: 'long' }),
                route: p.location,
                truck: p.truckId || 'Unassigned',
                status: p.status === 'Completed' ? 'Completed' : 'Scheduled',
                type: p.type
            }));
            setSchedules(mappedSchedules);
        });

        // Subscribe to Firestore Payments (Billing/Invoices)
        const unsubscribePayments = billingService.subscribeToAllPayments((fetchedPayments) => {
            console.log("AdminContext: Received payments:", fetchedPayments);
            const mappedInvoices: Invoice[] = fetchedPayments.map(p => ({
                id: p.id || 'unknown',
                resident: p.residentName,
                // Handle optional residentId/Name for UI compatibility
                residentId: p.userId || 'unknown',
                residentName: p.residentName || 'Unknown',
                amount: p.amount,
                status: p.status === 'Paid' ? 'Paid' : 'Pending',
                dueDate: p.date,
                date: p.date,
                items: [{ description: 'Waste Collection Service', amount: p.amount }]
            }));
            setInvoices(mappedInvoices);
        });

        // Subscribe to Firestore Trucks
        const unsubscribeTrucks = truckService.subscribeToAllTrucks((fetchedTrucks) => {
            setTrucks(fetchedTrucks);
        });

        return () => {
            unsubscribeIssues();
            unsubscribeResidents();
            unsubscribePickups();
            unsubscribePayments();
            unsubscribeTrucks();
        };
    }, []);

    // Save to local storage (Excluding items now in Firestore)
    useEffect(() => {

        localStorage.setItem('ecotrack_admin_users', JSON.stringify(users));
        localStorage.setItem('ecotrack_admin_routes', JSON.stringify(routes));
        // Schedules, Residents, Issues, Invoices are now in Firestore
        localStorage.setItem('ecotrack_admin_settings', JSON.stringify(settings));
    }, [users, routes, settings]);

    const updateTruckStatus = async (id: string, status: Truck['status']) => {
        try {
            await truckService.updateTruck(id, { status });
        } catch (error) {
            console.error("Failed to update truck status", error);
        }
    };

    const updateIssueStatus = async (id: string, status: AdminIssue['status']) => {
        // Optimistic update
        setIssues(prev => prev.map(i => i.id === id ? { ...i, status } : i));

        try {
            // await issueService.updateIssueStatus(id, status); // Need to implement this in service if needed
        } catch (error) {
            console.error("Failed to update issue status", error);
        }
    };

    const addIssue = (issueData: Omit<AdminIssue, 'id'>) => {
        const newIssue = {
            ...issueData,
            id: `ISS-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`
        };
        setIssues(prev => [newIssue, ...prev]);
    };

    const updateIssue = (id: string, data: Partial<AdminIssue>) => {
        setIssues(prev => prev.map(i => i.id === id ? { ...i, ...data } : i));
    };

    const deleteIssue = async (id: string) => {
        // Optimistic delete
        setIssues(prev => prev.filter(i => i.id !== id));
        try {
            // await issueService.deleteIssue(id); // Implement in service
        } catch (error) {
            console.error("Failed to delete issue", error);
        }
    };

    const addTruck = async (truckData: Omit<Truck, 'id'>) => {
        try {
            await truckService.addTruck({
                ...truckData,
                latitude: 6.8533, // Default start
                longitude: 80.0575,
                vehicleNumber: truckData.vehicleNumber || 'Unassigned',
                contactNumber: truckData.contactNumber || 'N/A',
                type: truckData.type || 'Standard',
                route: truckData.route || 'Unassigned',
                battery: truckData.battery || 100,
                fuel: truckData.fuel || 100
            });
        } catch (error) {
            console.error("Failed to add truck", error);
        }
    };

    const updateTruck = async (id: string, data: Partial<Truck>) => {
        try {
            await truckService.updateTruck(id, data);
        } catch (error) {
            console.error("Failed to update truck", error);
        }
    };

    const deleteTruck = async (id: string) => {
        try {
            await truckService.deleteTruck(id);
        } catch (error) {
            console.error("Failed to delete truck", error);
        }
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

    const updateUserStatus = (id: string, status: AdminUser['status']) => {
        setUsers(prev => prev.map(u => u.id === id ? { ...u, status } : u));
    };

    const addUser = (userData: Omit<AdminUser, 'id'>) => {
        const newUser = {
            ...userData,
            id: Date.now().toString()
        };
        setUsers(prev => [...prev, newUser]);
    };

    const updateUser = (id: string, data: Partial<AdminUser>) => {
        setUsers(prev => prev.map(u => u.id === id ? { ...u, ...data } : u));
    };

    const deleteUser = (id: string) => {
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

    const addSchedule = async (scheduleData: Omit<Schedule, 'id'>) => {
        try {
            // Map Schedule to Pickup format for Firestore
            await pickupService.createPickup({
                userId: 'admin_generated', // Placeholder since admin created it
                residentName: 'Admin Scheduled',
                date: scheduleData.date,
                type: scheduleData.type as any,
                status: scheduleData.status as any,
                location: scheduleData.route, // Using route as location
                truckId: scheduleData.truck,
                notes: `Scheduled via Admin Panel`
            });
            // No need to update local state manually; subscription will catch it
        } catch (error) {
            console.error("Failed to add schedule:", error);
            alert("Failed to save schedule to database.");
        }
    };

    const updateSchedule = async (id: string, data: Partial<Schedule>) => {
        try {
            const updates: any = {};
            if (data.date) updates.date = data.date;
            if (data.type) updates.type = data.type;
            if (data.status) updates.status = data.status;
            if (data.type) updates.type = data.type;
            if (data.status) updates.status = data.status;
            if (data.route) updates.location = data.route;
            if (data.truck) updates.truckId = data.truck;

            await pickupService.updatePickup(id, updates);
        } catch (error) {
            console.error("Failed to update schedule:", error);
        }
    };

    const deleteSchedule = async (id: string) => {
        try {
            await pickupService.deletePickup(id);
        } catch (error) {
            console.error("Failed to delete schedule:", error);
        }
    };

    const addInvoice = async (invoiceData: Omit<Invoice, 'id'>) => {
        try {
            await billingService.createPayment({
                userId: invoiceData.residentId || 'admin_generated',
                residentName: invoiceData.residentName,
                amount: invoiceData.amount,
                method: 'Cash', // Default for admin creation
                status: 'Pending',
                date: invoiceData.date || new Date().toISOString().split('T')[0]
            });
        } catch (error) {
            console.error("Failed to create invoice:", error);
            alert("Failed to save invoice.");
        }
    };

    const updateInvoiceStatus = async (id: string, status: Invoice['status']) => {
        try {
            await billingService.updatePayment(id, { status });
        } catch (error) {
            console.error("Failed to update invoice status", error);
        }
    };

    const generateMonthlyStatement = () => {
        // Generate mock invoices for all residents
        const newInvoices = residents.map(resident => ({
            id: `INV-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`,
            residentId: resident.id,
            residentName: resident.name,
            resident: resident.name, // Legacy
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
