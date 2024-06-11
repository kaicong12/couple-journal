import { useState, useEffect, useCallback, useRef } from "react"
import { Link, useNavigate } from "react-router-dom";
import { 
    Box, 
    Button, 
    Flex, 
    Input,
    Text, 
    Skeleton, 
    SkeletonText, 
    SkeletonCircle
} from '@chakra-ui/react';
import { ChevronRightIcon } from '@chakra-ui/icons'

import { CuisineList } from "./CuisineList";
import { RestaurantCard } from "./RestaurantCard";
import { addListenerToNode, multiUpdate } from "../../db/rtdb";
import { fetchRestaurants, getLocation } from "./services/places"


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
    const navigate = useNavigate();
    const [userLocation, setUserLocation] = useState({ latitude: null, longitude: null })
    const [locationError, setUserLocationError] = useState(null)
    const [isLoading, setIsLoading] = useState(true);
    const [isBookmarkedLoading, setIsBookmarkedLoading] = useState(true)
    const [searchQuery, setSearchArea] = useState('');
    const [selectedCuisine, setSelectedCuisine] = useState('Popular');
    const [bookmarkedRestaurants, setBookmarkedRestaurants] = useState([])
    const [restaurants, setRestaurants] = useState([]);


    const cuisineCache = useRef({});
    const cacheTimeout = 15 * 60 * 1000; // 15 minutes in milliseconds

    const handleSearchChange = (event) => {
        setSearchArea(event.target.value);
    };

    const handleSearchButtonClick = () => {
        navigate({ pathname: "/food/viewAll", search: `?search=${searchQuery}` });
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

    const handleCuisineClick = async (cuisine) => {
        if (selectedCuisine === cuisine) {
            setSelectedCuisine('Popular');
        } else {
            setSelectedCuisine(cuisine);
        }

        const currentTime = new Date().getTime();
        if (cuisineCache.current[cuisine] && (currentTime - cuisineCache.current[cuisine].timestamp < cacheTimeout)) {
            // Use cached data if it's not expired
            setRestaurants(cuisineCache.current[cuisine].data);
        } else {
            setIsLoading(true);

            try {
                const data = await fetchRestaurants({
                    cuisine,
                    locationCoord: userLocation
                })
    
                cuisineCache.current[cuisine] = {
                    data,
                    timestamp: new Date().getTime()
                };
    
                setRestaurants(data || []);
            } catch (error) {
                setUserLocationError(error.message);
            } finally {
                setIsLoading(false);
            }
        }
    }

    const renderRestaurants = useCallback((isSectionLoading, _locationError, restaurantsToRender, noRestaurantMessage) => {
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
        } else if (_locationError) {
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
    }, [bookmarkedRestaurants, toggleBookmark])

    useEffect(() => {
        const fetchPopularRestaurants = async () => {
            setIsLoading(true)
            setUserLocationError(null)
    
            const position = await getLocation()
            try {
                const location = {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude
                }

                const data = await fetchRestaurants({
                    cuisine: 'Popular',
                    locationCoord: location,
                })

                cuisineCache.current['Popular'] = {
                    data,
                    timestamp: new Date().getTime()
                };

                setUserLocation(location)
                setRestaurants(data || []);
                setIsLoading(false);
            } catch (error) {
                setUserLocationError(error.message);
            }
        }

        fetchPopularRestaurants()
    }, [])

    useEffect(() => {
        const cb = (snapshot) => {
            const val = snapshot.val() || {}
            setBookmarkedRestaurants(Object.entries(val).map(([restaurantId, restaurantDetails]) => {
                return { ...restaurantDetails, id: restaurantId }
            }))
            setIsBookmarkedLoading(false)
        }

        const offListener = addListenerToNode('/bookmarkedLocations', cb, 'value')
        return offListener;
    }, [])

    return (
        <Box>
            <Box bg="#F2F2F2">
                <Box padding="12px" display="flex">
                    <Input value={searchQuery} onChange={handleSearchChange} placeholder="Search for food" mr={2} />
                    <Button 
                        bg="#EAD9BF"
                        color="#8F611B"
                        fontWeight="bold" 
                        onClick={handleSearchButtonClick}
                    >
                        Search
                    </Button>
                </Box>
                <CuisineList handleCuisineClick={handleCuisineClick} selectedCuisine={selectedCuisine} />
            
                <Box padding={'0 1rem'}>
                    <Box mb="12px" display="flex" justifyContent="space-between" alignItems="center">
                        <Text fontWeight="600" fontSize="24px">Popular Near You</Text>
                        <Text 
                            fontWeight="600" 
                            fontSize="16px"
                            color="#806b56" 
                            decoration="underline" 
                            cursor="pointer"
                        >
                            <Link to={`/food/viewAll`}>View All</Link>
                            <ChevronRightIcon />
                        </Text>
                    </Box>
                    {renderRestaurants(isLoading, locationError, restaurants, "There is no restaurants near you")}
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
                    {renderRestaurants(isBookmarkedLoading, null, bookmarkedRestaurants, "You have not bookmarked any restaurants")}
                </Box>
            </Box>
        </Box>
        
    );
}

export default FoodRecommendations