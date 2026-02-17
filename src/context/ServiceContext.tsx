import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { issueService, Issue as ServiceIssue } from '../services/issueService';
import { pickupService } from '../services/pickupService';
import { billingService } from '../services/billingService';

export interface Pickup {
    id: string;
    date: Date;
    type: 'Waste' | 'Recycling' | 'Organic' | 'Hazardous';
    status: 'Scheduled' | 'In Progress' | 'Completed' | 'Missed';
    location: string;
}

export const WASTE_PRICES = {
    'Waste': 1500,
    'Recycling': 1300,
    'Hazardous': 3000,
    'Organic': 1400
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

// Re-export or alias if needed, but we'll try to align with issueService
export interface Issue extends ServiceIssue { }

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

export interface Service {
    id: string;
    name: string;
    description: string;
    frequency: string;
    area: string;
    nextCollection: string;
}

interface ServiceContextType {
    services: Service[];
    pickups: Pickup[];
    activeTracking: TrackingStatus | null;
    notifications: Notification[];
    issues: Issue[];
    billing: BillingState;
    createService: (service: Omit<Service, 'id'>) => void;
    schedulePickup: (date: Date, type: Pickup['type'], location: string) => void;
    reportIssue: (issue: Omit<Issue, 'id' | 'status' | 'date' | 'createdAt' | 'userId' | 'residentName' | 'address' | 'priority'>) => Promise<void>;
    startTracking: (pickupId: string) => void;
    simulateMovement: () => void;
    addNotification: (title: string, message: string, type?: Notification['type']) => void;
    addPaymentMethod: (method: string) => void;
    payBill: (amount: number) => void;
}

const ServiceContext = createContext<ServiceContextType | undefined>(undefined);

export function ServiceProvider({ children }: { children: React.ReactNode }) {
    const { user } = useAuth();
    const [pickups, setPickups] = useState<Pickup[]>([]);
    const [activeTracking, setActiveTracking] = useState<TrackingStatus | null>(null);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [issues, setIssues] = useState<Issue[]>([]);
    const [billing, setBilling] = useState<BillingState>({
        balance: 0,
        paymentMethods: [],
        history: []
    });

    // Load from local storage on init (keeping pickups/billing generic for now)
    useEffect(() => {
        const stored = localStorage.getItem('ecotrack_pickups');
        if (stored) {
            setPickups(JSON.parse(stored).map((p: any) => ({
                ...p,
                date: new Date(p.date)
            })));
        }
    }, []);

    // Subscribe to User Pickups
    useEffect(() => {
        if (!user) {
            setPickups([]);
            return;
        }

        const unsubscribe = pickupService.subscribeToUserPickups(user.uid, (fetchedPickups) => {
            // Map service Pickup to context Pickup
            const mappedPickups: Pickup[] = fetchedPickups.map(p => ({
                id: p.id || 'unknown',
                date: new Date(p.date), // Convert string back to Date object for UI
                type: p.type,
                status: p.status,
                location: p.location
            }));
            setPickups(mappedPickups);
        });

        return () => unsubscribe();
    }, [user]);

    // Subscribe to User Issues
    useEffect(() => {
        if (!user) {
            setIssues([]);
            return;
        }

        const unsubscribe = issueService.subscribeToUserIssues(user.uid, (fetchedIssues) => {
            setIssues(fetchedIssues);
        });

        return () => unsubscribe();
    }, [user]);


    // Save pickups only
    useEffect(() => {
        localStorage.setItem('ecotrack_pickups', JSON.stringify(pickups));
    }, [pickups]);

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

    const schedulePickup = async (date: Date, type: Pickup['type']) => {
        if (!user) {
            addNotification('Error', 'You must be logged in to schedule a pickup.', 'error');
            return;
        }

        try {
            await pickupService.createPickup({
                userId: user.uid,
                residentName: user.name || 'Anonymous',
                date: date.toISOString(), // Store as ISO string in Firestore
                type,
                location: user.address || 'Unknown Location',
            });
            addNotification('Pickup Scheduled', `Your ${type} pickup has been scheduled for ${date.toLocaleDateString()}.`, 'success');
        } catch (error) {
            console.error(error);
            addNotification('Error', 'Failed to schedule pickup.', 'error');
        }
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

    const reportIssue = async (issueData: Omit<Issue, 'id' | 'status' | 'date' | 'createdAt' | 'userId' | 'residentName' | 'address' | 'priority'>) => {
        if (!user) {
            addNotification('Error', 'You must be logged in to report an issue.', 'error');
            return;
        }

        try {
            await issueService.reportIssue({
                ...issueData,
                userId: user.uid,
                residentName: user.name || 'Anonymous',
                address: user.address || 'Unknown Location',
                date: new Date().toLocaleDateString(),
                status: 'Open',
                priority: 'Medium' // Default priority
            });
            addNotification('Issue Reported', 'Your issue has been reported successfully.', 'success');
        } catch (error) {
            console.error(error);
            addNotification('Error', 'Failed to report issue. Please try again.', 'error');
        }
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

    // Services Management
    const [services, setServices] = useState<Service[]>([
        {
            id: '1',
            name: 'General Waste Collection',
            description: 'Regular household waste pickup',
            frequency: 'Weekly',
            area: 'All Areas',
            nextCollection: 'Monday, 8 AM'
        },
        {
            id: '2',
            name: 'Recycling Pickup',
            description: 'Plastic, paper, and glass recycling',
            frequency: 'Bi-Weekly',
            area: 'All Areas',
            nextCollection: 'Wednesday, 10 AM'
        }
    ]);

    const createService = (serviceData: Omit<Service, 'id'>) => {
        const newService = {
            id: Math.random().toString(36).substr(2, 9),
            ...serviceData
        };
        setServices(prev => [...prev, newService]);
        addNotification('Service Created', `New service "${serviceData.name}" has been created.`, 'success');
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

    const payBill = async (amount: number) => {
        if (!user) {
            addNotification('Error', 'You must be logged in to pay bills.', 'error');
            return;
        }

        try {
            await billingService.createPayment({
                userId: user.uid,
                residentName: user.name || 'Anonymous',
                amount: amount,
                method: 'Credit Card', // Hardcoded for now
                status: 'Paid',
                date: new Date().toISOString().split('T')[0]
            });

            // Update local state
            setBilling(prev => ({
                ...prev,
                balance: Math.max(0, prev.balance - amount),
                history: [{
                    id: Math.random().toString(36).substr(2, 9),
                    date: new Date().toLocaleDateString(),
                    amount: `LKR ${amount.toFixed(2)}`,
                    status: 'Paid',
                    method: 'Credit Card'
                }, ...prev.history]
            }));

            addNotification('Payment Successful', `Payment of LKR ${amount.toFixed(2)} was successful.`, 'success');
        } catch (error) {
            console.error("Payment failed", error);
            addNotification('Error', 'Payment failed. Please try again.', 'error');
        }
    };

    return (
        <ServiceContext.Provider value={{
            services, pickups, activeTracking, notifications, billing, issues,
            schedulePickup, startTracking, simulateMovement, addNotification,
            addPaymentMethod, payBill, reportIssue, createService
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
