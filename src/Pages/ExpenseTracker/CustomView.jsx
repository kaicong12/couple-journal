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


export const CustomView = ({ transactions }) => {
    return (
        <Box>
            { transactions.length < 2 ? (
                <EmptyState patternId="customView" />
            ) : <Text>Custom View</Text> }
        </Box>
    )
}