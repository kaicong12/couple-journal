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


export const WeeklyView = ({ transactions }) => {

    return (
        <Box>
            { transactions.length < 2 ? (
                <EmptyState />
            ) : <Text>Weekly View</Text> }
        </Box>
    )
}