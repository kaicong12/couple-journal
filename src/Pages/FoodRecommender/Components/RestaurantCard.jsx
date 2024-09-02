import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Image, Flex, Text } from '@chakra-ui/react';
import { StarIcon } from '@chakra-ui/icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBookmark as unSaved } from '@fortawesome/free-regular-svg-icons';
import { faBookmark as saved, faLocationDot, faQuestion } from '@fortawesome/free-solid-svg-icons';

import { multiUpdate } from "../../../db/rtdb";



export const RestaurantTag = ({ leftIcon, leftMessage, upperCaseText}) => {
    return (
        <Box p="8px" bg="#EAD9BF" borderRadius="10px">
            <Text isTruncated color="#8F611B" fontSize="14px" fontWeight="semibold">
                { leftIcon } {leftMessage} {upperCaseText.toUpperCase()}
            </Text>
            
        </Box>
    )
}

export const RestaurantTags = {
    "PRICE_LEVEL_UNSPECIFIED": <RestaurantTag leftIcon={<FontAwesomeIcon icon={faQuestion} />} upperCaseText="price unspecified" />,
    "PRICE_LEVEL_FREE": <RestaurantTag leftMessage="$" upperCaseText="free" />,
    "PRICE_LEVEL_INEXPENSIVE": <RestaurantTag leftMessage="$" upperCaseText="affordable" />,
    "PRICE_LEVEL_MODERATE": <RestaurantTag leftMessage="$$" upperCaseText="moderate" />,
    "PRICE_LEVEL_EXPENSIVE": <RestaurantTag leftMessage="$$$" upperCaseText="expensive" />,
    "PRICE_LEVEL_VERY_EXPENSIVE": <RestaurantTag leftMessage="$" upperCaseText="very expensive" />
}

export const RestaurantCard = ({ restaurant, _isBookmarked }) => {
    const navigate = useNavigate();
    const [isBookmarked, setIsBookmarked] = useState(_isBookmarked)
    const toggleBookmark = useCallback(async (currentlyIsBookmarked, restaurant) => {
        const updates = {}
        if (currentlyIsBookmarked) {
            // clicking on this should remove the restaurant from bookmark list
            updates[restaurant.id] = null
            setIsBookmarked(false)  
        } else {
            updates[restaurant.id] = restaurant
            setIsBookmarked(true)
        }

        const pathToUpdate = "/bookmarkedLocations"
        await multiUpdate(pathToUpdate, updates)
    }, [])

    const handleCardClick = () => {
        navigate(`/food/${restaurant.id}`, { state: { restaurant } });
    };

    return (
        <Box
            display="flex"
            flexDir="column"
            borderRadius="lg"
            width="100%"
            minWidth="350px"
            maxWidth="500px"
            boxShadow="lg"
            position="relative"
            onClick={handleCardClick}
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
            
            <Box 
                position="absolute" 
                top="15px"
                left="15px"
                p="8px 10px" 
                display="inline-flex" 
                bg="white" 
                borderRadius="100" 
                alignItems="center" 
                gap="8px"
            >
                <StarIcon color="#ffc107" />
                <Text>{ restaurant.rating }</Text>
            </Box>

            <Box 
                position="absolute" 
                top="15px"
                right="15px"
                display="flex" 
                bg="white" 
                borderRadius="100" 
                height="40px"
                width="40px" 
                justifyContent="center" 
                alignItems="center"
                onClick={(e) => { 
                    e.stopPropagation();
                    toggleBookmark(isBookmarked, restaurant) 
                }}
            >
                <FontAwesomeIcon icon={isBookmarked ? saved : unSaved} />
            </Box>
            
            <Box py="20px" px="12px" display="flex" flexDir="column" gap="10px">
                <Text isTruncated fontWeight="bold" textAlign="left">{restaurant.displayName?.text ?? ''}</Text>
                <Box>
                    <Flex alignItems="center" gap="8px">
                        <FontAwesomeIcon icon={faLocationDot} />
                        <Text isTruncated>
                            { restaurant.formattedAddress }
                        </Text>
                    </Flex>
                </Box>

                <Flex gap="8px">
                    <Box>
                        { RestaurantTags[restaurant.priceLevel] || RestaurantTags["PRICE_LEVEL_UNSPECIFIED"]}
                    </Box>
                    <Box>
                        { restaurant?.primaryTypeDisplayName?.text ? <RestaurantTag upperCaseText={restaurant?.primaryTypeDisplayName?.text} /> : null}
                    </Box>
                </Flex>
            </Box>
        </Box>
    )
}
