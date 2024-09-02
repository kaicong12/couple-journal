import { useState, useEffect, useCallback, useMemo } from "react";
import { useRecoilValue } from 'recoil';
import { useLocation } from 'react-router-dom';
import { bookmarkedRestaurant, popularRestaurantsCache } from '../../recoil/restaurantAtoms';
import { 
    Box, 
    Button,
    Flex,
    Heading,
    ButtonGroup, 
    Menu, 
    MenuButton, 
    MenuList, 
    MenuOptionGroup, 
    MenuItemOption,
    forwardRef,
    Text
} from '@chakra-ui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSort, faPizzaSlice } from '@fortawesome/free-solid-svg-icons';

import Fuse from 'fuse.js';
import { flatten } from 'lodash';

import { RestaurantSearchBar } from './Components/RestaurantSearchBar';
import { RestaurantCard } from './Components/RestaurantCard';
import { RestaurantSkeleton } from './Components/RestaurantSkeleton';
import { EmptySearchState } from './EmptyState';
import { cuisineCategories } from "./services/cuisineList";


const FilterButton = forwardRef((props, ref) => {
    const { rightIcon, buttontext } = props;
    return (
        <Button {...props} rightIcon={rightIcon} ref={ref}>
            { buttontext }
        </Button>
    );
});

export const RestaurantListView = () => {
    const location = useLocation();
    const isBookmarked = location.pathname.includes('viewAllBookmarked');
    const pageHeading = isBookmarked ? 'Your Bookmarked Restaurants' : 'Popular Near You';
    const pageSubheading = isBookmarked ? 'Your favorite spots, all in one place. Discover something delicious from your saved list.' 
    : 'Explore trending dining options near you, recommended by our vibrant community.';

    const restaurants = useRecoilValue(isBookmarked ? bookmarkedRestaurant : popularRestaurantsCache);
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [filteredRestaurants, setFilteredRestaurants] = useState([]);
    const [restaurantSort, setRestaurantSort] = useState('Name (A to Z)');
    const [selectedCategories, setSelectedCategories] = useState(isBookmarked ? [] : ['Popular']);

    const fuzzySearch = useCallback((restaurants, query) => {
        const options = {
            keys: ['displayName.text', 'formattedAddress', 'primaryTypeDisplayName.text'],
            includeScore: true,
            threshold: 0.4,
        };
    
        const fuse = new Fuse(restaurants, options);
        return fuse.search(query).map(result => result.item);
    }, []);

    const handleSortChange = (value) => {
        setRestaurantSort(value);
        setFilteredRestaurants(prev => {
            const sortedRestaurants = [...prev];
            if (value === 'Name (A to Z)') {
                sortedRestaurants.sort((a, b) => a.displayName.text.localeCompare(b.displayName.text));
            } else {
                sortedRestaurants.sort((a, b) => b.displayName.text.localeCompare(a.displayName.text));
            }
            return sortedRestaurants;
        });
    };

    const handleCategoryChange = (categories) => {
        setSelectedCategories(categories);
    };

    const sortOptions = useMemo(() => [
        'Name (A to Z)', 
        'Name (Z to A)'
    ], []);

    const renderRestaurants = (restaurantsToRender) => {
        if (!restaurantsToRender.length) {
            return <EmptySearchState />;
        }
        return (
            <>
                {restaurantsToRender.map((restaurant, idx) => (
                    <RestaurantCard 
                        restaurant={restaurant} 
                        key={`restaurant-card-${idx}`}
                    />
                ))}
            </>
        );
    };

    return (
        <Box padding="24px">
            <Box mb="16px">
                <Heading size="lg">{ pageHeading }</Heading>
                <Text fontSize="md" color="gray.600">
                    { pageSubheading }
                </Text>
            </Box>

            <RestaurantSearchBar />

            <ButtonGroup display="flex" mt="16px">
                <Menu>
                    <MenuButton
                        as={FilterButton}
                        buttontext={'Sort By'}
                        bg='#EAD9BF'
                        color='#8F611B'
                        leftIcon={<FontAwesomeIcon icon={faSort} />}
                    >
                    </MenuButton>
                    <MenuList>
                        <MenuOptionGroup defaultValue={restaurantSort} onChange={handleSortChange}>
                            {sortOptions.map(sortOpt => (
                                <MenuItemOption key={sortOpt} value={sortOpt}>
                                    <Box display="flex" gap="10px" alignItems="center">
                                        <Text>{sortOpt}</Text>
                                    </Box>
                                </MenuItemOption>
                            ))}
                        </MenuOptionGroup>
                    </MenuList>
                </Menu>
                <Menu closeOnSelect={false}>
                    <MenuButton
                        as={FilterButton}
                        buttontext={'Cuisines'}
                        bg='#EAD9BF'
                        color='#8F611B'
                        leftIcon={<FontAwesomeIcon icon={faPizzaSlice} />}
                    >
                    </MenuButton>
                    <MenuList>
                        <MenuOptionGroup 
                            defaultValue={selectedCategories} 
                            onChange={(value) => { handleCategoryChange(value) }} 
                            type="checkbox"
                        >
                            <MenuItemOption key={'Popular'} value={'Popular'} >
                                <Box display="flex" gap="10px" alignItems="center">
                                    <Text>{'Popular'}</Text>
                                </Box>
                            </MenuItemOption>
                            {Object.keys(cuisineCategories).map(cuisineName => (
                                <MenuItemOption key={cuisineName} value={cuisineName} >
                                    <Box display="flex" gap="10px" alignItems="center">
                                        <Text>{cuisineName}</Text>
                                    </Box>
                                </MenuItemOption>
                            ))}
                        </MenuOptionGroup>
                    </MenuList>
                </Menu>
            </ButtonGroup>

            <Flex flexWrap="wrap" justifyContent="center" gap="24px" mt="10px">
                {isLoading 
                    ? Array.from({ length: 3 }, (_, idx) => <RestaurantSkeleton key={`restaurant-skeleton-${idx}`} />) 
                    : renderRestaurants(filteredRestaurants)}
            </Flex>
        </Box>
    );
};
