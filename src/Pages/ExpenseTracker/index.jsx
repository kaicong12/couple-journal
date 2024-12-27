import { 
    Box, 
    Flex, 
    Text,
    Tabs, 
    TabList, 
    TabPanels, 
    Tab, 
    TabPanel,
    IconButton,
    Spinner,
} from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons';
import { useState, useMemo, useCallback } from 'react';
import Select from 'react-select';

import { useExpenseTracker } from './useExpenseTracker';
import { MaleAvatar1 } from '../../Icons/MaleAvatar';
import { FemaleAvatar1 } from '../../Icons/FemaleAvatar';
import { MonthlyView } from './MonthlyView';
import { WeeklyView } from './WeeklyView';
import { CustomView } from './CustomView';
import { Transactions } from './Transactions';
import { AddTransactions } from './AddTransactions';

export const ExpenseTracker = () => {
    const { 
        activeUser,
        setActiveUser,
        isDrawerOpen,
        isDeleting,
        isSyncing,
        isSaving,
        relevantTransactions, 
        expensesConfig,
        accountsConfig,
        transactionToEdit,
        addTransaction,
        updateTransaction,
        setIsDrawerOpen,
        handleDrawerClose,
        handleEditTransaction,
        handleDeleteTransaction
    } = useExpenseTracker();
    // 0 is Weekly, 1 is Monthly, 2 is Custom
    const [activeTab, setActiveTab] = useState(0);

    const totalExpenses = useMemo(() => {
        return relevantTransactions.reduce((total, transaction) => {
            return total + Number(transaction.amount) ?? 0;
        }, 0);
    }, [relevantTransactions])

    const userOptions = useMemo(() => {
        return [
            { value: "Kai Cong", label: "Kai Cong" },
            { value: "Hui Wen", label: "Hui Wen" },
            { value: "Combined", label: "Combined" },
            { value: "Total", label: "Total" },
        ]
    }, []);

    return (
        <Box>
            { isSyncing ? (
                <Box  minH="calc(100vh - 80px)" display="flex" justifyContent="center" alignItems="center">
                    <Spinner position="relative" top="-100px" size="xl" /> 
                </Box>
            ) : (
                <Box>
                    <Flex flexDir={"column"} alignItems="center">
                        <Flex w="80%" bg="#FFF0DA" fontWeight="500" p="15px 40px" m="30px" borderRadius="20px" flexDir={"column"} alignItems="center" gap="12px">
                            { activeUser === "Hui Wen" ? (
                                <FemaleAvatar1 />
                            ) : <MaleAvatar1 /> }
                            <Flex alignItems="center" width="full" mt="12px" gap="2px">
                                <Text flex="1" fontWeight="600" fontSize="xl">Hello</Text>
                                <Box flex="3">
                                    <Select
                                        defaultValue={{ value: activeUser, label: activeUser }}
                                        name="color"
                                        options={userOptions}
                                        onChange={(selectedOption) => setActiveUser(selectedOption.value)}
                                        isSearchable={false}
                                    />
                                </Box>
                            </Flex>
                            <Flex flexWrap="wrap" w="full" gap="8px">
                                <Flex flexDir="column" alignItems="flex-start">
                                    <Text color="gray" fontSize="14px">Average Daily Expenditure</Text>
                                    <Text><span style={{ fontWeight: "800", fontSize: "24px"}}>${(totalExpenses / 30).toFixed(2)}</span> (Last 30 days)</Text>
                                </Flex>
                                <Flex flexDir="column" alignItems="flex-start">
                                    <Text color="gray" fontSize="14px">Total Expenditure</Text>
                                    <Text><span style={{ fontWeight: "800", fontSize: "24px"}}>${Number.parseFloat(totalExpenses).toFixed(2)}</span> (Last 30 days)</Text>
                                </Flex>
                            </Flex>
                        </Flex>
                        <Tabs variant='soft-rounded' colorScheme="brown" index={activeTab} onChange={(index) => setActiveTab(index)}>
                            <TabList w="100vw" justifyContent="center">
                                <Tab>Weekly</Tab>
                                <Tab>Monthly</Tab>
                                <Tab>Custom</Tab>
                            </TabList>
                            <TabPanels>
                                <TabPanel>
                                    <WeeklyView 
                                        transactions={relevantTransactions}
                                    />
                                </TabPanel>
                                <TabPanel>
                                    <MonthlyView transactions={relevantTransactions} />
                                </TabPanel>
                                <TabPanel>
                                    <CustomView transactions={relevantTransactions} />
                                </TabPanel>
                            </TabPanels>
                        </Tabs>
                    </Flex>    
                    { relevantTransactions.length ? <Transactions transactions={relevantTransactions} onEdit={handleEditTransaction} /> : null }
                </Box>
            )}
            <IconButton
                icon={<AddIcon color="#8F611B" />}
                isRound
                size="lg"
                position="fixed"
                bg="#EAD9BF"
                bottom="30px"
                right="30px"
                onClick={() => setIsDrawerOpen(true)}
            />
            <AddTransactions 
                isSaving={isSaving}
                isDeleting={isDeleting}
                expensesConfig={expensesConfig}
                accountsConfig={accountsConfig}
                isDrawerOpen={isDrawerOpen} 
                addTransaction={addTransaction} 
                updateTransaction={updateTransaction}
                handleDrawerClose={handleDrawerClose} 
                transactionToEdit={transactionToEdit}
                handleDelete={handleDeleteTransaction}
            />
        </Box>  
    )
}