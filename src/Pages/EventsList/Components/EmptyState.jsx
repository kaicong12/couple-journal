import { 
    Box,
    Text,
    Image,
} from '@chakra-ui/react';

export const EmptySearchState = () => {
    return (
        <Box height="calc(100vh - 160px)">
            <Box position="relative" top="120px">
                <Image aspectRatio="16/9" src="/images/emptyState.svg" alt="No event found"/>
                <Text fontSize="18px" padding={"0 2rem 2rem 2rem"}>
                    Uh oh! Seems like there is no event that suit the search criteria. 
                    Try <span style={{ fontWeight: 600 }}>searching other keyword</span>
                </Text>
            </Box>
        </Box>
    )
}