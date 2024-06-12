import { 
    Box,
    Flex,
    Skeleton, 
    SkeletonText, 
    SkeletonCircle
} from '@chakra-ui/react';


export const RestaurantSkeleton = () => {
    return (
        <Box my="12px" padding='6' boxShadow='lg' bg='white' minWidth="300px" borderRadius="20px">
            <Skeleton h="100px" />
            <SkeletonText mt="6" noOfLines={3} spacing="4" skeletonHeight="2" />
            <Flex gap="20px" mt="6">
                <SkeletonCircle width='20%' />
                <SkeletonCircle width='20%' />
                <SkeletonCircle width='20%' />
            </Flex>
        </Box>
    )
}