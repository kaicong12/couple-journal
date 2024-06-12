import { useState, useEffect, useCallback } from 'react';
import { useRecoilValue } from 'recoil';
import { bookmarkedRestaurantState } from '../../recoil/restaurantAtoms';
import { 
    Box, 
    Button, 
    Flex, 
    Input, 
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
} from '@chakra-ui/react';
import { ChevronDownIcon } from '@chakra-ui/icons'
import { useSearchParams } from 'react-router-dom';

import { RestaurantSkeleton } from './Components/RestaurantSkeleton';
import { fetchRestaurants } from "./services/places"


export const AllPopularFood = () => {
    const bookmarkedRestaurants = useRecoilValue(bookmarkedRestaurantState);
    const [searchParams] = useSearchParams();
    const search = searchParams.get('search') ?? ''
    const [searchQuery, setSearchArea] = useState(search);
    const [searchType, setSearchType] = useState('area');
    const [restaurants, setRestaurants] = useState([]);
    const [nextPageToken, setNextPageToken] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingNew, setIsLoadingNew] = useState(false);

    const fetchAndSetRestaurants = useCallback(async  (textQuery, pageToken, isLoadMore = false) => {
        if (isLoadMore) {
            setIsLoadingNew(true);
        } else {
            setIsLoading(true);
        }

        const data = await fetchRestaurants({ 
            textQuery,
            pageToken,
        });

        const newRestaurants = data.places ?? [];
        setRestaurants(prevRestaurants => [ ...prevRestaurants, ...newRestaurants ]);
        setNextPageToken(data.nextPageToken ?? null);

        if (isLoadMore) {
            setIsLoadingNew(false);
        } else {
            setIsLoading(false);
        }
    }, [])

    useEffect(() => {
        if (search && search?.length) {
            fetchAndSetRestaurants(search, null, false);
        }
    }, [fetchAndSetRestaurants, search]);

    const handleSearchButtonClick = async () => {
        await fetchAndSetRestaurants(searchQuery, null, false)
    };

    const handleSearchChange = (event) => {
        setSearchArea(event.target.value);
    };

    const handleLoadMore = async () => {
        await fetchAndSetRestaurants(searchQuery, nextPageToken, true)
    }


    return (
        <Box padding="12px" display="flex">
            <Menu>
                <MenuButton 
                    bg="#EAD9BF"
                    color="#8F611B"
                    fontWeight="bold" 
                    as={Button} 
                    rightIcon={<ChevronDownIcon />}
                    textTransform="capitalize"
                    mr={2}
                >
                    { searchType }
                </MenuButton>
                <MenuList>
                    <MenuItem onClick={() => { setSearchType('food') }}>Food</MenuItem>
                    <MenuItem onClick={() => { setSearchType('area') }}>Area</MenuItem>
                </MenuList>
            </Menu>
            <Flex>
                <Input value={searchQuery} onChange={handleSearchChange} placeholder="Search by Area" mr={2} />
            </Flex>
            <Button 
                bg="#EAD9BF"
                color="#8F611B"
                fontWeight="bold" 
                onClick={handleSearchButtonClick}
            >
                Search
            </Button>

            <Box>
                { isLoading ? (
                    <Flex>
                        { Array(3).map((idx) => <RestaurantSkeleton key={`restaurant-skeleton-${idx}`} /> )}
                    </Flex>
                ) : null }

                {/* <RestaurantList restaurants={restaurants} /> */}
                {isLoadingNew ? (
                    <Flex>
                        { Array(3).map((idx) => <RestaurantSkeleton key={`restaurant-skeleton-${idx}`} /> )}
                    </Flex>
                ) : (
                    nextPageToken && (
                        <Button onClick={handleLoadMore} mt="4">
                            Load More
                        </Button>
                    )
                )}
            </Box>
        </Box>
    )
}