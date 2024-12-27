import { 
    Box, 
    Flex, 
    Text,
    Tabs, 
    TabList, 
    TabPanels, 
    Tab, 
    TabPanel
} from '@chakra-ui/react';
import { useState, useMemo } from 'react';

import { useAuth } from '../../AuthContext';
import { useExpenseTracker } from './useExpenseTracker';
import { MaleAvatar1 } from '../../Icons/MaleAvatar';
import { FemaleAvatar1 } from '../../Icons/FemaleAvatar';
import { MonthlyView } from './MonthlyView';
import { WeeklyView } from './WeeklyView';
import { CustomView } from './CustomView';

export const ExpenseTracker = () => {
    const { user } = useAuth();
    const { transactions } = useExpenseTracker();
    // 0 is Weekly, 1 is Monthly, 2 is Custom
    const [activeTab, setActiveTab] = useState(0);

    const totalExpenses = useMemo(() => {
        return transactions.reduce((total, transaction) => {
            // don't count transactions which are out of range
            if (transaction.createdAt < Date.now() - 30 * 24 * 60 * 60 * 1000) return total;
            return total + transaction.amount;
        }, 0);
    }, [transactions])

    return (
        <Flex flexDir={"column"} alignItems="center">
            <Flex w="80%" bg="#D9D9D9" fontWeight="500" p="15px 40px" m="30px" borderRadius="20px" flexDir={"column"} alignItems="center" gap="12px">
                <MaleAvatar1 />
                <Text fontSize="xl">Hello  <span style={{ fontWeight: "800"}}>{user.displayName}</span></Text>
                <Flex flexWrap="wrap" w="full" gap="8px">
                    <Flex flexDir="column" alignItems="flex-start">
                        <Text fontSize="md">Total Expenditure</Text>
                        <Text><span style={{ fontWeight: "800", fontSize: "24px"}}>${(totalExpenses / 30).toFixed(2)}</span> (Last 30 days)</Text>
                    </Flex>
                    <Flex flexDir="column" alignItems="flex-start">
                        <Text fontSize="md">Average Expenditure</Text>
                        <Text><span style={{ fontWeight: "800", fontSize: "24px"}}>${totalExpenses}</span> (Last 30 days)</Text>
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
                        <WeeklyView transactions={transactions} />
                    </TabPanel>
                    <TabPanel>
                        <MonthlyView transactions={transactions} />
                    </TabPanel>
                    <TabPanel>
                        <CustomView transactions={transactions} />
                    </TabPanel>
                </TabPanels>
            </Tabs>

        </Flex>      
    )
}