import { useState, useEffect } from 'react';
import { getCollectionValues } from '../../db/firestore';

export const useExpenseTracker = () => {
    const [transactions, setTransactions] = useState([]);

    useEffect(() => {
        const fetchTransactions = async () => {
            const data = await getCollectionValues("expenses");
            setTransactions(data);
        }

        fetchTransactions();
    }, [])

    return {
        transactions
    }
}