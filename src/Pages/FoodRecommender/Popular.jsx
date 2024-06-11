import { useState } from 'react';
import { 
    Box, 
    Button, 
    Flex, 
    Input, 
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    Text, 
    Skeleton, 
    SkeletonText, 
    SkeletonCircle
} from '@chakra-ui/react';
import { ChevronDownIcon } from '@chakra-ui/icons'
import { useSearchParams } from 'react-router-dom';

import { useDebounce } from "../../hooks/useDebounce"

export const AllPopularFood = () => {
    const [searchParams] = useSearchParams();
    const search = searchParams.get('search')
    const [searchQuery, setSearchArea] = useState(search);
    const debouncedSearchTerm = useDebounce(searchQuery, 500)
    const [searchType, setSearchType] = useState('area');

    const handleSearchButtonClick = () => {
        console.log('search button clicked')
    }

    const handleSearchChange = (event) => {
        setSearchArea(event.target.value);
    };


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
        </Box>
    )
}