import { useState, useEffect, useCallback, useMemo } from 'react';
import { getCollectionValues, addFirestoreValue, deleteFirestoreValue, updateFirestoreValue } from '../../db/firestore';


export const useExpenseTracker = () => {
    const [activeUser, setActiveUser] = useState("Kai Cong");
    const [transactions, setTransactions] = useState([]);
    const [expensesConfig, setExpensesConfig] = useState([]);
    const [accountsConfig, setAccountsConfig] = useState([]);
    const [isSaving, setIsSaving] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isSyncing, setIsSyncing] = useState(false);
    const [transactionToEdit, setTransactionToEdit] = useState(null);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false)

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

    const updateTransaction = useCallback(async (payload) => {
        setIsSaving(true);
        const docId = payload.id
        if (docId) {
            await updateFirestoreValue("expenses", docId, payload);
            await onSyncTransactions();
        }
        setIsSaving(false);
    }, [onSyncTransactions])

    const handleDrawerClose = () => {
        setIsDrawerOpen(false);
        setTransactionToEdit(null);
    };

    const handleEditTransaction = (transaction) => {
        setTransactionToEdit(transaction);
        setIsDrawerOpen(true);
    };

    const handleDeleteTransaction = useCallback(async (transaction) => {
        setIsDeleting(true);
        await deleteFirestoreValue("expenses", transaction.id);
        await onSyncTransactions();
        setIsDeleting(false);
    }, [onSyncTransactions]);

    const relevantTransactions = useMemo(() => {
        return transactions.filter(transaction => {
            // don't count transactions which are out of range
            const dataOutOfRange = transaction.createdAt < Date.now() - 30 * 24 * 60 * 60 * 1000
            // if activeUser is total, all transactions are relevant
            const irrelevantData = activeUser === "Total" ? false : transaction.account !== activeUser;
            return !(dataOutOfRange || irrelevantData)
        })
    }, [activeUser, transactions])

    return {
        isDeleting,
        isDrawerOpen,
        transactions,
        relevantTransactions,
        expensesConfig,
        accountsConfig,
        isSyncing,
        isSaving,
        transactionToEdit,
        activeUser,
        setActiveUser,
        addTransaction,
        updateTransaction,
        setIsDrawerOpen,
        onSyncTransactions,
        handleDrawerClose,
        handleEditTransaction,
        handleDeleteTransaction
    }
}