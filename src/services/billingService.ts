import { db } from "../firebase";
import {
    collection,
    addDoc,
    query,
    onSnapshot,
    serverTimestamp,
    orderBy,
    where
} from "firebase/firestore";

export interface Payment {
    id?: string;
    userId: string;
    residentName: string;
    amount: number;
    method: 'Credit Card' | 'Bank Transfer' | 'Cash';
    status: 'Paid' | 'Pending' | 'Failed';
    date: string;
    transactionId?: string;
    createdAt?: any;
}

export const billingService = {
    // Make a payment (Resident)
    async createPayment(paymentData: Omit<Payment, 'id' | 'createdAt'>) {
        try {
            await addDoc(collection(db, "payments"), {
                ...paymentData,
                createdAt: serverTimestamp()
            });
        } catch (error) {
            console.error("Error creating payment:", error);
            throw error;
        }
    },

    // Subscribe to ALL payments (Admin View - Billing Management)
    subscribeToAllPayments(callback: (payments: Payment[]) => void) {
        const q = query(
            collection(db, "payments"),
            orderBy("createdAt", "desc")
        );

        return onSnapshot(q, (snapshot) => {
            const payments = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as Payment[];
            callback(payments);
        }, (error) => {
            console.error("Error in subscribeToAllPayments:", error);
        });
    },

    // Subscribe to USER payments (Resident View - Payment History)
    subscribeToUserPayments(userId: string, callback: (payments: Payment[]) => void) {
        const q = query(
            collection(db, "payments"),
            where("userId", "==", userId)
            // orderBy("createdAt", "desc") // Removed to avoid composite index requirement
        );

        return onSnapshot(q, (snapshot) => {
            const payments = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as Payment[];
            // Sort client-side to ensure newest first
            payments.sort((a, b) => {
                const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(a.date);
                const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(b.date);
                return dateB.getTime() - dateA.getTime();
            });

            callback(payments);
        }, (error) => {
            console.error("Error in subscribeToUserPayments:", error);
        });
    },

    async updatePayment(id: string, updates: Partial<Payment>) {
        try {
            const { doc, updateDoc } = await import("firebase/firestore");
            const paymentRef = doc(db, "payments", id);
            await updateDoc(paymentRef, updates);
        } catch (error) {
            console.error("Error updating payment:", error);
            throw error;
        }
    }
};
