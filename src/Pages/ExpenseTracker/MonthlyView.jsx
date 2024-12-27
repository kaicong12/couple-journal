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
import { EmptyState } from './EmptyState';
import { NoTransactions } from '../../Icons/NoTransactions';

export const MonthlyView = ({ transactions}) => {
    return (
        <Box>
            { transactions.length < 2 ? (
                <EmptyState patternId="monthlyView" />
            ) : <Text>Monthly View</Text> }
        </Box>
    )
}