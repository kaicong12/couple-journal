import { useState, useEffect, useCallback } from 'react';
import { useRecoilValue } from 'recoil';
import { bookmarkedRestaurant } from '../../recoil/restaurantAtoms';
import { 
    Box, 
    Flex, 
    Input,
} from '@chakra-ui/react';
import Fuse from 'fuse.js';

import { RestaurantSkeleton } from './Components/RestaurantSkeleton';
import { useDebounce } from "../../hooks/useDebounce"
import { RestaurantCard } from './Components/RestaurantCard';


export const AllBookmarkedRestaurants = () => {
    const bookmarkedRestaurants = useRecoilValue(bookmarkedRestaurant);
    const [searchQuery, setSearchQuery] = useState('')
    const debouncedSearchTerm = useDebounce(searchQuery, 500)
    const [isLoading, setIsLoading] = useState(false)
    const [filteredRestaurants, setFilteredRestaurants] = useState(bookmarkedRestaurants)

    const handleSearchChange = useCallback((event)  => {
        setSearchQuery(event.target.value)
    }, [])

    const fuzzySearch = useCallback((restaurants, query) => {
        const options = {
            keys: ['displayName.text', 'formattedAddress', 'primaryTypeDisplayName.text'],
            includeScore: true,
            threshold: 0.4,
        };
    
        const fuse = new Fuse(restaurants, options);
        return fuse.search(query).map(result => result.item);
    }, [])

    useEffect(() => {
        const loadBookmarkedRestaurant = () => {
            setIsLoading(true)
            let result
            if (debouncedSearchTerm) {
                result = fuzzySearch(bookmarkedRestaurants, debouncedSearchTerm);
            } else {
                result = bookmarkedRestaurants;
            }

            setFilteredRestaurants(result);
            setIsLoading(false)
        }

        loadBookmarkedRestaurant()

    }, [bookmarkedRestaurants, debouncedSearchTerm, fuzzySearch])

    return (
        <Box padding="24px">
            <Input value={searchQuery} onChange={handleSearchChange} placeholder="Search" mr={2} />
            <Flex flexWrap="wrap" justifyContent="center" gap="24px" mt="30px">
                { isLoading ? Array.from({ length: 3 }, (_, idx) => <RestaurantSkeleton key={`restaurant-skeleton-${idx}`} /> ) : (
                    filteredRestaurants.map(restaurant => <RestaurantCard key={restaurant.id} restaurant={restaurant} isBookmarked={true} />)
                ) }
            </Flex>
        </Box>
    )
}