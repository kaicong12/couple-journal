import { useState, useEffect, useCallback } from 'react';
import { getCollectionValues, addFirestoreValue } from '../../db/firestore';

export const useExpenseTracker = () => {
    const [transactions, setTransactions] = useState([]);
    const [expensesConfig, setExpensesConfig] = useState([]);
    const [accountsConfig, setAccountsConfig] = useState([]);
    const [isSaving, setIsSaving] = useState(false);
    const [isSyncing, setIsSyncing] = useState(false);

    const onSyncTransactions = useCallback(async () => {
        setIsSyncing(true);
        const data = await getCollectionValues("expenses");
        setTransactions(data);
        setIsSyncing(false);
    }, [])

    useEffect(() => {
        const fetchConfigs = async () => {
            const expenseConfigData = await getCollectionValues("expensesConfig");
            const accountConfigData = await getCollectionValues("accountsConfig");
            setExpensesConfig(expenseConfigData.map(({ name }) => name));
            setAccountsConfig(accountConfigData.map(({ name }) => name));
        }

        onSyncTransactions();
        fetchConfigs();
    }, [onSyncTransactions])


    const addTransaction = useCallback(async (payload) => {
        setIsSaving(true);
        await addFirestoreValue("expenses", payload);
        await onSyncTransactions();
        setIsSaving(false);
    }, [onSyncTransactions]);

    return {
        transactions,
        expensesConfig,
        accountsConfig,
        isSyncing,
        isSaving,
        addTransaction,
        onSyncTransactions
    }
}