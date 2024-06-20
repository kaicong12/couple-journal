import { useState, useEffect, useCallback } from "react"
import { useRecoilState } from "recoil"
import { bookmarkedRestaurant, popularRestaurantsCache } from "../../recoil/restaurantAtoms";
import { Link, useNavigate } from "react-router-dom";
import { 
    Box, 
    Flex, 
    Text,
} from '@chakra-ui/react';
import { ChevronRightIcon } from '@chakra-ui/icons'

import { SearchBar } from '../../Components/SearchBar' 
import { CuisineList } from "./Components/CuisineList";
import { RestaurantCard } from "./Components/RestaurantCard";
import { RestaurantSkeleton } from "./Components/RestaurantSkeleton";
import { addListenerToNode } from "../../db/rtdb";
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
    const [bookmarkedRestaurants, setBookmarkedRestaurants] = useRecoilState(bookmarkedRestaurant)
    const [restaurants, setRestaurants] = useState([]);

    const [cuisineCache, setCuisineCache] = useRecoilState(popularRestaurantsCache);
    const cacheTimeout = 15 * 60 * 1000; // 15 minutes in milliseconds

    const handleSearchChange = (event) => {
        setSearchArea(event.target.value);
    };

    const handleSearchButtonClick = () => {
        navigate({ pathname: "/food/viewAll", search: `?search=${searchQuery}` });
    };

    const handleCuisineClick = async (cuisine) => {
        if (selectedCuisine === cuisine) {
            setSelectedCuisine('Popular');
        } else {
            setSelectedCuisine(cuisine);
        }

        const currentTime = new Date().getTime();
        if (cuisineCache[cuisine] && (currentTime - cuisineCache[cuisine].timestamp < cacheTimeout)) {
            // Use cached data if it's not expired
            setRestaurants(cuisineCache[cuisine].data);
        } else {
            setIsLoading(true);

            try {
                const data = await fetchRestaurants({
                    cuisine,
                    locationCoord: userLocation
                })
                
                setCuisineCache(cuisineCache => ({ 
                    ...cuisineCache, 
                    [cuisine]: { data, timestamp: currentTime } 
                }));
    
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
            return <RestaurantSkeleton />
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
                { restaurantsToRender.map(restaurant => (
                    <RestaurantCard 
                        key={restaurant.id} 
                        restaurant={restaurant} 
                        isBookmarked={bookmarkedRestaurantIds.includes(restaurant.id)}
                    />
                ))}
            </Flex>
        ) : <NoRestaurantSection noRestaurantMessage={noRestaurantMessage} />
    }, [bookmarkedRestaurants])

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

                setCuisineCache(cuisineCache => ({ 
                    ...cuisineCache, 
                    'Popular': { data, timestamp: new Date().getTime() } 
                }));

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
                <SearchBar
                    searchQuery={searchQuery}
                    onSearchChange={handleSearchChange}
                    displayActionButton={true}
                    onSearch={handleSearchButtonClick}
                />
                
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
                            <Link to={`/food/viewAllPopular`}>View All</Link>
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
                            <Link to={`/food/viewAllBookmarked`}>View All</Link>
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