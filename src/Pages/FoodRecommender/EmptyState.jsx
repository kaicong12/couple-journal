import { 
    Box,
    Text,
    Image,
} from '@chakra-ui/react';

export const EmptySearchState = () => {
    return (
        <Box height="calc(100vh - 160px)">
            <Box>
                <Image aspectRatio="16/9" src="/images/foodRecommenderEmptyState.svg" alt="No restaurant found"/>
                <Text fontSize="18px" padding={"0 2rem 2rem 2rem"}>
                    Uh oh! Seems like there is no restaurant that suit the search criteria. 
                    Try <span style={{ fontWeight: 600 }}>searching other keyword</span>
                </Text>
            </Box>
        </Box>
    )
}