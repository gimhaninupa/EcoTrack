import { useState, useEffect } from 'react';
import {
    collection,
    query,
    where,
    onSnapshot,
    QueryConstraint,
    orderBy,
    DocumentData
} from 'firebase/firestore';
import { db } from '../firebase';

interface UseFirestoreListenerProps {
    collectionName: string;
    filters?: QueryConstraint[];
    sort?: { field: string; direction: 'asc' | 'desc' };
}

export function useFirestoreListener<T = DocumentData>({
    collectionName,
    filters = [],
    sort
}: UseFirestoreListenerProps) {
    const [data, setData] = useState<T[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setLoading(true);

        try {
            const constraints: QueryConstraint[] = [...filters];

            if (sort) {
                constraints.push(orderBy(sort.field, sort.direction));
            }

            const q = query(collection(db, collectionName), ...constraints);

            const unsubscribe = onSnapshot(q, (snapshot) => {
                const documents = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                })) as T[];

                setData(documents);
                setLoading(false);
            }, (err) => {
                console.error(`Error fetching ${collectionName}:`, err);
                setError(err.message);
                setLoading(false);
            });

            return () => unsubscribe();
        } catch (err: any) {
            console.error(`Error setting up listener for ${collectionName}:`, err);
            setError(err.message);
            setLoading(false);
        }
    }, [collectionName, JSON.stringify(filters), sort?.field, sort?.direction]);

    return { data, loading, error };
}
