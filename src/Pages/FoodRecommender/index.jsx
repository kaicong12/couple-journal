import { useState, useEffect, useCallback } from "react"
import { Box, Button, Flex, Input, Text, Skeleton, SkeletonText, SkeletonCircle } from '@chakra-ui/react';
import { ChevronRightIcon } from '@chakra-ui/icons'
import { CuisineList } from "./CuisineList";
import { RestaurantCard } from "./RestaurantCard";

import { useDebounce } from "../../hooks/useDebounce"
import { getLocation, getGeocode } from "./services/places"


const NoRestaurantSection = ({ noRestaurantMessage }) => {
    return (
        <Box minH="25vh" display="flex" alignItems="center" justifyContent="center">
            <Text fontWeight="600" fontSize="18px">
                { noRestaurantMessage }
            </Text>
        </Box>
    )
}

const FoodRecommendations = () => {
    const [locationError, setUserLocationError] = useState(null)
    const [isLoading, setIsLoading] = useState(true);
    const [isBookmarkedLoading, setIsBookmarkedLoading] = useState(false)
    const [searchArea, setSearchArea] = useState('');
    const debouncedSearchArea = useDebounce(searchArea, 500)
    const [selectedCuisine, setSelectedCuisine] = useState('');
    const [restaurants, setRestaurants] = useState([]);
    const apiKey = 'AIzaSyA7qFAV9taIxXIbzm2rnrdNOlnFBtHSp-8';

    const fetchRestaurantImage = async (imageName) => {
        const photoUrl = `https://places.googleapis.com/v1/${imageName}/media?maxHeightPx=400&key=${apiKey}`;
        const imageFetchRes = await fetch(photoUrl)

        return imageFetchRes.url
    }

    const fetchPopularRestaurants = async () => {
        setIsLoading(true)
        setUserLocationError(null)

        let location
        if (debouncedSearchArea) {
            location = await getGeocode(debouncedSearchArea);
            if (!location) {
                setRestaurants([]);
                setIsLoading(false)
                setUserLocationError('No restaurants can be found in this area')
                return
            }
        } else { 
            const position = await getLocation()
            try {
                location = {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude
                }
            } catch (error) {
                setUserLocationError(error.message);
            }
        }
    
        const response = await fetch('https://places.googleapis.com/v1/places:searchNearby', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Goog-Api-Key': apiKey,
                'X-Goog-FieldMask': '*'
            },
            body: JSON.stringify({
                'includedTypes': [
                    'restaurant'
                ],
                'maxResultCount': 10,
                'locationRestriction': {
                    'circle': {
                        'center': location,
                        'radius': 500
                    }
                }
            })
        });

        if (!response.ok) {
            throw new Error('Failed to fetch restaurants');
        }
    
        const data = await response.json();
        const restaurantImagePromise = data?.places?.map(async (place) => {
            const firstPhoto = place?.photos?.[0]
            return {
                ...place,
                thumbnailUrl: firstPhoto ? await fetchRestaurantImage(firstPhoto.name) : null
            }
        }) ?? []

        const restaurantData = await Promise.all(restaurantImagePromise)
        const dataSortByRating = restaurantData.sort((a, b) => b.rating - a.rating)
        console.log(restaurantData, ' res dat')
        setRestaurants(dataSortByRating || []);
        setIsLoading(false);
    }

    const handleSearchChange = (event) => {
        setSearchArea(event.target.value);
    };

    const handleCuisineClick = useCallback((cuisine, cuisineOptions) => {
        setSelectedCuisine(cuisine);
    }, [])

    const renderRestaurants = useCallback((isSectionLoading, restaurantsToRender, noRestaurantMessage) => {
        if (isSectionLoading) {
            return (
                // Display skeletons while loading
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
        } else if (locationError) {
            return (
                <Box minH="25vh" display="flex" alignItems="center" justifyContent="center">
                    <Text fontWeight="600" fontSize="18px">
                        Unable to find any restaurants in this area
                    </Text>
                </Box>
            )
        }

        return restaurantsToRender.length ? (
            <Flex overflow="auto" gap="20px" padding="10px" pb="20px">
                { restaurantsToRender.map((restaurant, idx) => (
                    <RestaurantCard key={`restaurant-${idx}`} restaurant={restaurant}/>
                ))}
            </Flex>
        ) : <NoRestaurantSection noRestaurantMessage={noRestaurantMessage} />
    }, [locationError])

    useEffect(() => {
        fetchPopularRestaurants()
    }, [])

    return (
        <Box>
            <Box>
                <Box p={4}>
                    <Flex mb={4}>
                        <Input value={searchArea} onChange={handleSearchChange} placeholder="Search by Area" mr={2} />
                        <Button onClick={fetchPopularRestaurants}>Search</Button>
                    </Flex>
                    
                </Box>
            </Box>
            <Box bg="#F2F2F2">
                <CuisineList handleCuisineClick={handleCuisineClick} selectedCuisine={selectedCuisine} />
                <Box padding={'1rem 1rem 0 1rem'}>
                    <Box mb="12px" display="flex" justifyContent="space-between" alignItems="center">
                        <Text fontWeight="600" fontSize="24px">Popular Near You</Text>
                        <Text 
                            fontWeight="600" 
                            fontSize="16px"
                            color="#806b56" 
                            decoration="underline" 
                            cursor="pointer"
                        >
                            View All 
                            <ChevronRightIcon />
                        </Text>
                    </Box>
                    {renderRestaurants(isLoading, restaurants, "There is no restaurants near you")}
                </Box>
                <Box px={4} pt="0.5rem" pb="1rem">
                    <Box mb="12px" display="flex" justifyContent="space-between" alignItems="center">
                        <Text fontWeight="600" fontSize="24px">Bookmarked</Text>
                        <Text 
                            fontWeight="600" 
                            fontSize="16px"
                            color="#806b56" 
                            decoration="underline" 
                            cursor="pointer"
                        >
                            View All 
                            <ChevronRightIcon />
                        </Text>
                    </Box>
                    {renderRestaurants(isBookmarkedLoading, [], "You have not bookmarked any restaurants")}
                </Box>
            </Box>
        </Box>
        
    );
}

export default FoodRecommendations