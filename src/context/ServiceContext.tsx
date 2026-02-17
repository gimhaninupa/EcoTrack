import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { issueService, Issue as ServiceIssue } from '../services/issueService';
import { pickupService } from '../services/pickupService';
import { billingService } from '../services/billingService';
import { truckService, Truck } from '../services/truckService';

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
    amount: number;
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
    trucks: Truck[]; // Expose available trucks
    activeTracking: TrackingStatus | null;
    notifications: Notification[];
    issues: Issue[];
    billing: BillingState;
    createService: (service: Omit<Service, 'id'>) => void;
    schedulePickup: (date: Date, type: Pickup['type'], location: string, truckId?: string) => void;
    reportIssue: (issue: Omit<Issue, 'id' | 'status' | 'date' | 'createdAt' | 'userId' | 'residentName' | 'address' | 'priority'>) => Promise<void>;
    startTracking: (pickupId: string) => void;
    simulateMovement: () => void;
    addNotification: (title: string, message: string, type?: Notification['type']) => void;
    addPaymentMethod: (method: string) => void;
    payBill: (amount: number) => void;
    updatePickup: (id: string, updates: Partial<Pickup>) => Promise<void>;
    deletePickup: (id: string) => Promise<void>;
}

const ServiceContext = createContext<ServiceContextType | undefined>(undefined);

export function ServiceProvider({ children }: { children: React.ReactNode }) {
    const { user } = useAuth();
    const [pickups, setPickups] = useState<Pickup[]>([]);
    const [trucks, setTrucks] = useState<Truck[]>([]);
    const [activeTracking, setActiveTracking] = useState<TrackingStatus | null>(null);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [issues, setIssues] = useState<Issue[]>([]);
    const [billing, setBilling] = useState<BillingState>({
        balance: 0,
        paymentMethods: [],
        history: []
    });

    // Load from local storage on init (keeping pickups/billing generic for now)
    // REMOVED: Conflicting with Firestore source of truth
    // useEffect(() => {
    //     const stored = localStorage.getItem('ecotrack_pickups');
    //     if (stored) {
    //         setPickups(JSON.parse(stored).map((p: any) => ({
    //             ...p,
    //             date: new Date(p.date)
    //         })));
    //     }
    // }, []);

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

    // Subscribe to User Payments (Billing)
    useEffect(() => {
        if (!user) {
            setBilling(prev => ({ ...prev, history: [] }));
            return;
        }

        const unsubscribe = billingService.subscribeToUserPayments(user.uid, (fetchedPayments) => {
            // Map to Transaction interface
            const transactions: Transaction[] = fetchedPayments.map(p => ({
                id: p.id || 'unknown',
                date: new Date(p.date).toLocaleDateString(),
                amount: p.amount,
                status: p.status,
                method: p.method
            }));

            // Calculate Balance (Sum of Pending Payments)
            const pendingTotal = fetchedPayments
                .filter(p => p.status === 'Pending')
                .reduce((sum, p) => sum + p.amount, 0);

            setBilling(prev => ({
                ...prev,
                history: transactions,
                balance: pendingTotal // Update calculated balance
            }));
        });

        return () => unsubscribe();
    }, [user]);

    // Subscribe to Active Trucks (Real-time Tracking)
    useEffect(() => {
        // Find any active truck
        const unsubscribe = truckService.subscribeToAllTrucks((fetchedTrucks) => {
            setTrucks(fetchedTrucks); // Update list of all trucks
            const activeTruck = fetchedTrucks.find(t => t.status === 'En Route' || t.status === 'Collection');

            if (activeTruck) {
                setActiveTracking({
                    isActive: true,
                    location: activeTruck.location || 'Unknown',
                    coordinates: [activeTruck.latitude || 6.8533, activeTruck.longitude || 80.0575],
                    eta: activeTruck.eta || 'Calculating...',
                    status: activeTruck.status === 'En Route' ? 'En Route' : 'Arrived',
                    progress: activeTruck.currentStopIndex ? (activeTruck.currentStopIndex / 5) * 100 : 0, // Approx progress
                    destination: activeTruck.headingTo || 'Next Stop'
                });
            } else {
                setActiveTracking(null);
            }
        });

        return () => unsubscribe();
    }, []);


    // Save pickups only - REMOVED
    // useEffect(() => {
    //     localStorage.setItem('ecotrack_pickups', JSON.stringify(pickups));
    // }, [pickups]);

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


    const schedulePickup = async (date: Date, type: Pickup['type'], location: string, truckId?: string) => {
        if (!user) {
            addNotification('Error', 'You must be logged in to schedule a pickup.', 'error');
            return;
        }

        try {
            await pickupService.createPickup({
                userId: user.uid,
                residentName: user.name || 'Anonymous',
                date: date.toISOString(),
                type,
                location: location || user.address || 'Unknown Location',
                truckId: truckId || 'Unassigned', // Save selected truck
                status: 'Scheduled'
            });

            // Create Pending Payment Record
            const price = WASTE_PRICES[type] || 1500;
            await billingService.createPayment({
                userId: user.uid,
                residentName: user.name || 'Anonymous',
                amount: price,
                date: date.toISOString().split('T')[0],
                status: 'Pending',
                method: 'Credit Card' // Default or could be 'Unpaid'
            });

            addNotification('Pickup Scheduled', `Your ${type} pickup has been scheduled for ${date.toLocaleDateString()}. Bill: LKR ${price}`, 'success');
            // No manual state update needed, subscription will catch it
        } catch (error) {
            console.error(error);
            addNotification('Error', 'Failed to schedule pickup.', 'error');
        }
    };

    const startTracking = (pickupId: string) => {
        // In real-time mode, tracking is automatic based on truck status.
        // We can just trigger a notification or focus the map.
        addNotification('Tracking Enabled', `Looking for active trucks nearby...`, 'info');
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
                priority: 'Medium'
            });
            addNotification('Issue Reported', 'Your issue has been reported successfully.', 'success');
            // No manual state update needed
        } catch (error) {
            console.error(error);
            addNotification('Error', 'Failed to report issue. Please try again.', 'error');
        }
    };

    const simulateMovement = () => {
        // Client-side simulation is disabled in favor of Real-time Firestore updates.
        // This function is kept to avoid breaking consumers but does nothing.
        console.log("Simulation is handled by backend/admin.");
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
            // Find all pending payments
            const pendingPayments = billing.history.filter(t => t.status === 'Pending');

            if (pendingPayments.length === 0) {
                addNotification('Info', 'No pending bills to pay.', 'info');
                return;
            }

            // Update each pending payment to 'Paid'
            const updatePromises = pendingPayments.map(payment =>
                billingService.updatePayment(payment.id, {
                    status: 'Paid',
                    method: 'Credit Card',
                    date: new Date().toISOString().split('T')[0]
                })
            );

            await Promise.all(updatePromises);

            addNotification('Payment Successful', `Payment of LKR ${amount.toFixed(2)} was successful.`, 'success');
        } catch (error) {
            console.error("Payment failed", error);
            addNotification('Error', 'Payment failed. Please try again.', 'error');
        }
    };

    const updatePickup = async (id: string, updates: Partial<Pickup>) => {
        try {
            await pickupService.updatePickup(id, updates);
            addNotification('Pickup Updated', 'Your pickup schedule has been updated.', 'info');
        } catch (error) {
            console.error("Error updating pickup:", error);
            addNotification('Error', 'Failed to update pickup.', 'error');
        }
    };

    const deletePickup = async (id: string) => {
        try {
            await pickupService.deletePickup(id);
            addNotification('Pickup Cancelled', 'Your pickup has been cancelled.', 'warning');
        } catch (error) {
            console.error("Error cancelling pickup:", error);
            addNotification('Error', 'Failed to cancel pickup.', 'error');
        }
    };

    return (
        <ServiceContext.Provider value={{
            services,
            pickups,
            trucks,
            activeTracking,
            notifications,
            issues,
            billing,
            createService,
            schedulePickup,
            reportIssue,
            startTracking,
            simulateMovement,
            addNotification,
            addPaymentMethod,
            payBill,
            updatePickup,
            deletePickup
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
