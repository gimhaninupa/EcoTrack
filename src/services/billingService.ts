import { db } from "../firebase";
import {
    collection,
    addDoc,
    query,
    onSnapshot,
    serverTimestamp,
    orderBy
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
    }
};
