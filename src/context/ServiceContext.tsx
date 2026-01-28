import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Pickup {
    id: string;
    date: Date;
    type: 'Waste' | 'Recycling' | 'Organic' | 'Hazardous';
    status: 'Scheduled' | 'In Progress' | 'Completed' | 'Missed';
    location: string;
}

export const WASTE_PRICES = {
    'Waste': 500,
    'Recycling': 300,
    'Hazardous': 2000,
    'Organic': 400
};

export interface TrackingStatus {
    isActive: boolean;
    location: string;
    coordinates: [number, number];
    eta: string;
    status: 'Waiting' | 'En Route' | 'Arrived' | 'Completed';
    progress: number; // 0-100
    destination: string;
}

const ROUTE_WAYPOINTS: [number, number][] = [
    [6.8533, 80.0575], // Meepe
    [6.8520, 80.0500], // Meegoda Area
    [6.8480, 80.0300], // Godagama
    [6.8430, 80.0000], // Homagama
    [6.8410, 79.9900], // Makumbura
    [6.8412, 79.9700]  // Kottawa (End)
];

export interface Notification {
    id: string;
    title: string;
    message: string;
    time: string;
    read: boolean;
    type: 'info' | 'success' | 'warning' | 'error';
}

export interface Issue {
    id: string;
    type: string;
    description: string;
    date: string;
    status: 'Pending' | 'In Review' | 'Resolved';
    images: string[];
}

export interface PaymentMethod {
    id: string;
    type: string;
    last4: string;
    expiry: string;
    isDefault: boolean;
}

export interface Transaction {
    id: string;
    date: string;
    amount: string;
    status: 'Paid' | 'Pending' | 'Failed';
    method: string;
}

export interface BillingState {
    balance: number;
    paymentMethods: PaymentMethod[];
    history: Transaction[];
}

interface ServiceContextType {
    pickups: Pickup[];
    activeTracking: TrackingStatus | null;
    notifications: Notification[];
    issues: Issue[];
    billing: BillingState;
    schedulePickup: (date: Date, type: Pickup['type'], location: string) => void;
    reportIssue: (issue: Omit<Issue, 'id' | 'status' | 'date'>) => void;
    startTracking: (pickupId: string) => void;
    simulateMovement: () => void;
    addNotification: (title: string, message: string, type?: Notification['type']) => void;
    addPaymentMethod: (method: string) => void;
    payBill: (amount: number) => void;
}

const ServiceContext = createContext<ServiceContextType | undefined>(undefined);

export function ServiceProvider({ children }: { children: React.ReactNode }) {
    const [pickups, setPickups] = useState<Pickup[]>([]);
    const [activeTracking, setActiveTracking] = useState<TrackingStatus | null>(null);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [issues, setIssues] = useState<Issue[]>([]);
    const [billing, setBilling] = useState<BillingState>({
        balance: 0,
        paymentMethods: [],
        history: []
    });

    // Load from local storage on init
    // Load from local storage on init
    useEffect(() => {
        const stored = localStorage.getItem('ecotrack_pickups');
        if (stored) {
            setPickups(JSON.parse(stored).map((p: any) => ({
                ...p,
                date: new Date(p.date)
            })));
        }

        const storedIssues = localStorage.getItem('ecotrack_issues');
        if (storedIssues) {
            setIssues(JSON.parse(storedIssues));
        }
    }, []);

    // Save to local storage on change
    useEffect(() => {
        localStorage.setItem('ecotrack_pickups', JSON.stringify(pickups));
        localStorage.setItem('ecotrack_issues', JSON.stringify(issues));
    }, [pickups, issues]);

    const addNotification = (title: string, message: string, type: Notification['type'] = 'info') => {
        const newNotification: Notification = {
            id: Math.random().toString(36).substr(2, 9),
            title,
            message,
            time: 'Just now',
            read: false,
            type
        };
        setNotifications(prev => [newNotification, ...prev]);
    };

    const schedulePickup = (date: Date, type: Pickup['type'], location: string) => {
        const cost = WASTE_PRICES[type] || 0;
        const newPickup: Pickup = {
            id: Math.random().toString(36).substr(2, 9),
            date,
            type,
            status: 'Scheduled',
            location
        };
        // Sort by date
        setPickups(prev => [...prev, newPickup].sort((a, b) => a.date.getTime() - b.date.getTime()));

        // Add charge to balance
        setBilling(prev => ({
            ...prev,
            balance: prev.balance + cost
        }));

        addNotification('Pickup Scheduled', `Your ${type} pickup has been scheduled for ${date.toLocaleDateString()}. Added charge: LKR ${cost.toFixed(2)}`, 'success');
    };

    const startTracking = (pickupId: string) => {
        // Find the pickup to get its location
        const pickup = pickups.find(p => p.id === pickupId);
        const destination = pickup ? pickup.location : 'Kottawa';

        setActiveTracking({
            isActive: true,
            location: 'Meepe',
            coordinates: ROUTE_WAYPOINTS[0],
            eta: '25 mins',
            status: 'En Route',
            progress: 0,
            destination
        });
        addNotification('Tracking Started', `Real-time tracking is now active for your pickup from Meepe to ${destination}.`, 'info');
    };

    const reportIssue = (issueData: Omit<Issue, 'id' | 'status' | 'date'>) => {
        const newIssue: Issue = {
            id: Math.random().toString(36).substr(2, 9).toUpperCase(),
            ...issueData,
            date: new Date().toLocaleDateString(),
            status: 'Pending'
        };
        setIssues(prev => [newIssue, ...prev]);
        addNotification('Issue Reported', 'Your issue has been reported successfully.', 'success');
    };

    const simulateMovement = () => {
        if (!activeTracking) return;

        setActiveTracking(prev => {
            if (!prev) return null;

            // Advance progress
            const newProgress = Math.min(prev.progress + 5, 100);

            // Calculate current coordinate index based on progress
            const totalPoints = ROUTE_WAYPOINTS.length;
            const index = Math.floor((newProgress / 100) * (totalPoints - 1));
            const newCoords = ROUTE_WAYPOINTS[index];

            let newStatus: TrackingStatus['status'] = prev.status;
            let newLocation = prev.location;
            let newEta = prev.eta;

            // Update details based on progress
            if (newProgress < 20) {
                newLocation = 'Meepe Town';
                newEta = '20 mins';
            } else if (newProgress < 40) {
                newLocation = 'Meegoda';
                newEta = '15 mins';
            } else if (newProgress < 60) {
                newLocation = 'Godagama';
                newEta = '10 mins';
            } else if (newProgress < 80) {
                newLocation = 'Homagama';
                newEta = '5 mins';
            } else if (newProgress < 100) {
                newLocation = `Arriving at ${prev.destination}`;
                newEta = '1 min';
                newStatus = 'Arrived';
            } else {
                newStatus = 'Completed';
                newLocation = 'Completed';
                newEta = '--';
            }

            return {
                ...prev,
                progress: newProgress,
                status: newStatus,
                location: newLocation,
                coordinates: newCoords,
                eta: newEta
            };
        });
    };

    const addPaymentMethod = (method: string) => {
        setBilling(prev => ({
            ...prev,
            paymentMethods: [...prev.paymentMethods, {
                id: Math.random().toString(36).substr(2, 9),
                type: 'Card',
                last4: '4242',
                expiry: '12/25',
                isDefault: prev.paymentMethods.length === 0
            }]
        }));
        addNotification('Payment Method Added', `New payment method ending in 4242 has been added using ${method}.`, 'success');
    };

    const payBill = (amount: number) => {
        if (billing.balance < amount) return;

        // 1. Update Local State (Resident View)
        const paymentDate = new Date().toLocaleDateString();
        const transactionId = Math.random().toString(36).substr(2, 9);

        setBilling(prev => ({
            ...prev,
            balance: prev.balance - amount,
            history: [{
                id: transactionId,
                date: paymentDate,
                amount: `LKR ${amount.toFixed(2)}`,
                status: 'Paid',
                method: 'Card •••• 4242'
            }, ...prev.history]
        }));

        // 2. Sync with Admin Context (Admin View)
        // We need to find a pending invoice for this resident and mark it as paid.
        // Since we don't have the resident ID handy in this context (it's in AuthContext),
        // we'll try to match by recent pending invoices or create a new "Paid" invoice record for admin.

        try {
            const storedInvoices = localStorage.getItem('ecotrack_admin_invoices');
            let adminInvoices = storedInvoices ? JSON.parse(storedInvoices) : [];

            // For simplicity in this demo, we'll assume the current user is "RES-001" or similar if we could get it.
            // But since we can't easily cross-reference without passing props, 
            // we will search for any matching pending invoice with the same amount (heuristic)
            // OR we just create a new record.

            // Let's create a new 'Paid' invoice record in the admin system to reflect this transaction
            const newAdminInvoice = {
                id: `INV-${Date.now().toString().slice(-4)}`,
                residentId: 'RES-???', // In a real app, strict user ID
                residentName: 'Current User', // Ideally from AuthContext
                date: new Date().toISOString().split('T')[0],
                amount: amount,
                status: 'Paid',
                method: 'Card •••• 4242',
                items: [{ description: 'Bill Payment', amount: amount }]
            };

            adminInvoices = [newAdminInvoice, ...adminInvoices];
            localStorage.setItem('ecotrack_admin_invoices', JSON.stringify(adminInvoices));

        } catch (e) {
            console.error("Failed to sync payment with admin context", e);
        }

        addNotification('Payment Successful', `Payment of LKR ${amount.toFixed(2)} was successful.`, 'success');
    };

    return (
        <ServiceContext.Provider value={{
            pickups, activeTracking, notifications, billing, issues,
            schedulePickup, startTracking, simulateMovement, addNotification,
            addPaymentMethod, payBill, reportIssue
        }}>
            {children}
        </ServiceContext.Provider>
    );
}

export function useService() {
    const context = useContext(ServiceContext);
    if (context === undefined) {
        throw new Error('useService must be used within a ServiceProvider');
    }
    return context;
}
