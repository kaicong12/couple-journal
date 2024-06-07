import { useState, useEffect, useCallback } from "react"
import { Link } from "react-router-dom";
import { Box, Flex, Input, Text, Skeleton, SkeletonText, SkeletonCircle } from '@chakra-ui/react';
import { ChevronRightIcon } from '@chakra-ui/icons'

import { CuisineList } from "./CuisineList";
import { RestaurantCard } from "./RestaurantCard";
import { useDebounce } from "../../hooks/useDebounce"
import { addListenerToNode, multiUpdate } from "../../db/rtdb";
import { fetchRestaurants, getLocation, getGeocode } from "./services/places"


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
    const [userLocation, setUserLocation] = useState({ latitude: null, longitude: null })
    const [locationError, setUserLocationError] = useState(null)
    const [isLoading, setIsLoading] = useState(true);
    const [isBookmarkedLoading, setIsBookmarkedLoading] = useState(true)
    const [searchArea, setSearchArea] = useState('');
    const debouncedSearchArea = useDebounce(searchArea, 500)
    const [selectedCuisine, setSelectedCuisine] = useState('');
    const [bookmarkedRestaurants, setBookmarkedRestaurants] = useState([])
    const [restaurants, setRestaurants] = useState([]);

    const handleSearchChange = (event) => {
        setSearchArea(event.target.value);
    };

    const toggleBookmark = useCallback(async (currentlyIsBookmarked, restaurant) => {
        const updates = {}
        if (currentlyIsBookmarked) {
            // clicking on this should remove the restaurant from bookmark list
            updates[restaurant.id] = null
        } else {
            updates[restaurant.id] = restaurant
        }

        const pathToUpdate = "bookmarkedLocations"
        await multiUpdate(pathToUpdate, updates)
    }, [])

    const handleCuisineClick = useCallback(async (cuisine) => {
        if (selectedCuisine === cuisine) {
            setSelectedCuisine(null);
        } else {
            setSelectedCuisine(cuisine);
        }

        const data = await fetchRestaurants(cuisine, userLocation)
        setRestaurants(data || []);
    }, [selectedCuisine, userLocation])

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

        const bookmarkedRestaurantIds = bookmarkedRestaurants.map(restaurant => restaurant.id)

        return restaurantsToRender.length ? (
            <Flex overflow="auto" gap="20px" padding="10px" pb="20px">
                { restaurantsToRender.map((restaurant, idx) => (
                    <RestaurantCard 
                        key={`restaurant-${idx}`} 
                        restaurant={restaurant} 
                        toggleBookmark={toggleBookmark}
                        isBookmarked={bookmarkedRestaurantIds.includes(restaurant.id)}
                    />
                ))}
            </Flex>
        ) : <NoRestaurantSection noRestaurantMessage={noRestaurantMessage} />
    }, [bookmarkedRestaurants, locationError, toggleBookmark])

    useEffect(() => {
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
    
            const data = await fetchRestaurants(selectedCuisine, location)
            setUserLocation(location)
            setRestaurants(data || []);
            setIsLoading(false);
        }

        fetchPopularRestaurants()

        const cb = (snapshot) => {
            const val = snapshot.val() || {}
            setBookmarkedRestaurants(Object.entries(val).map(([restaurantId, restaurantDetails]) => {
                return { ...restaurantDetails, id: restaurantId }
            }))
            setIsBookmarkedLoading(false)
        }

        const offListener = addListenerToNode('/bookmarkedLocations', cb, 'value')
        return offListener;
    }, [debouncedSearchArea, selectedCuisine, locationError])

    return (
        <Box>
            <Box>
                <Box p={4}>
                    <Flex mb={4}>
                        <Input value={searchArea} onChange={handleSearchChange} placeholder="Search by Area" mr={2} />
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
                            <Link to={`/food/viewAllPopular`}>View All</Link>
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
                    {renderRestaurants(isBookmarkedLoading, bookmarkedRestaurants, "You have not bookmarked any restaurants")}
                </Box>
            </Box>
        </Box>
        
    );
}

export default FoodRecommendations