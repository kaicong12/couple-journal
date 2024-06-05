import { Box, Image, Flex, Text } from '@chakra-ui/react';
import { StarIcon } from '@chakra-ui/icons';



const priceLevelEnums = {
    "PRICE_LEVEL_UNSPECIFIED": -1,
    "PRICE_LEVEL_FREE": 0,
    "PRICE_LEVEL_INEXPENSIVE": 1,
    "PRICE_LEVEL_MODERATE": 2,
    "PRICE_LEVEL_EXPENSIVE": 3,
    "PRICE_LEVEL_VERY_EXPENSIVE": 4
}

export const RestaurantCard = ({ restaurant }) => {
    return (
        <Box
            display="flex"
            flexDir="column"
            gap="20px"
            borderRadius="lg"
            width="100%"
            minWidth="350px"
            boxShadow="lg"
        >
            <Box
                aspectRatio="1.96"
                position="relative"
                overflow="hidden"
                borderRadius="lg"
            >
                <Image 
                    src={restaurant.thumbnailUrl || 'https://via.placeholder.com/150'} 
                    alt={`Thumbnail for ${restaurant.displayName?.text ?? 'restaurant'}`}
                    width="100%"
                    height="100%"
                    position="absolute"
                    inset="0"
                    objectFit="cover"
                    objectPosition="center"
                />
            </Box>
            
            <Box>
                
                <Flex>
                    <StarIcon color="#ffc107" />
                    <Text>{ restaurant.rating }</Text>
                </Flex>
            </Box>
            
            <Box>
                <Text fontWeight="bold">{restaurant.displayName?.text ?? ''}</Text>
            </Box>
        </Box>
    )
}