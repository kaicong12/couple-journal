import { useState, useEffect, useCallback, useMemo } from "react";
import { useRecoilValue } from 'recoil';
import { popularRestaurantsCache } from '../../recoil/restaurantAtoms';

import { 
    Box, 
    Flex,
    forwardRef,
    Spinner, 
    Text, 
    Button, 
    ButtonGroup, 
    Menu, 
    MenuButton, 
    MenuList, 
    MenuOptionGroup, 
    MenuItemOption,
    Input,
    InputGroup, 
    InputLeftElement,
} from '@chakra-ui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSort, faPizzaSlice } from '@fortawesome/free-solid-svg-icons';

import { SearchBar } from "../../Components/SearchBar";
import { RestaurantCard } from './Components/RestaurantCard';
import { RestaurantSkeleton } from './Components/RestaurantSkeleton';
import { EmptySearchState } from './EmptyState';
import { fetchRestaurants, getLocation } from "./services/places";
import { cuisineCategories } from "./services/cuisineList";
import { flatten } from 'lodash'


const FilterButton = forwardRef((props, ref) => {
    const { rightIcon, buttontext } = props;
    return (
        <Button {...props} rightIcon={rightIcon} ref={ref}>
            { buttontext }
        </Button>
    );
});

export const AllPopularFood = () => {
    const popularRestaurants = useRecoilValue(popularRestaurantsCache);
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [filteredRestaurants, setFilteredRestaurants] = useState([]);
    const [restaurantSort, setRestaurantSort] = useState('Name (A to Z)');
    const [selectedCategories, setSelectedCategories] = useState(['Popular']);

    const renderRestaurants = (restaurantsToRender) => {
        if (!restaurantsToRender.length) {
            return <EmptySearchState />;
        }
        return (
            <>
                {restaurantsToRender.map((restaurant, idx) => (
                    <RestaurantCard restaurant={restaurant} key={`restaurant-card-${idx}`} isBookmarked={false} />
                ))}
            </>
        );
    };

    const handleSearchChange = useCallback((event) => {
        setSearchQuery(event.target.value);
    }, []);

    const handleSearch = () => {

    }

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

    useEffect(() => {
        const restaurantData = flatten(Object.values(popularRestaurants).map(({ data }) =>  data))
        setFilteredRestaurants(restaurantData)
    }, [popularRestaurants])

    return (
        <Box>
            <SearchBar 
                searchQuery={searchQuery}
                onSearchChange={handleSearchChange}
                displayActionButton={true}
                onSearch={handleSearch}
            />
            <ButtonGroup display="flex" mt="10px" px="20px">
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
            <Flex flexWrap="wrap" justifyContent="center" gap="24px" mt="10px" px="20px">
                {isLoading ? Array.from({ length: 3 }, (_, idx) => <RestaurantSkeleton key={`restaurant-skeleton-${idx}`} />) : (
                    renderRestaurants(filteredRestaurants)
                )}
            </Flex>
        </Box>
    );
};
