import { 
    Box, 
    Flex, 
    Text
} from '@chakra-ui/react';
import { NoTransactions } from '../../Icons/NoTransactions';

export const EmptyState = ({ patternId }) => {
    // Empty State takes in patternId to allow re-using of svg icon
    return (
        <Box>
            <Flex justifyContent="center" alignItems="center">
                <NoTransactions patternId={patternId} height="200px" width="200px" />
            </Flex>
            <Box mt="10px" fontWeight="600">
                <Text>No transactions yet</Text>
                <Text>Start adding transactions to see them here</Text>
            </Box>
        </Box>
    )
}