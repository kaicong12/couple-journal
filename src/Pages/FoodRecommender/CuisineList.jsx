import { Flex, Text, Button, Image } from '@chakra-ui/react';

import { cuisineCategories, cuisineIconMappings } from "./services/cuisineList"

const CuisineButton = ({ cuisine, cuisineOptions, handleCuisineClick, isSelected }) => {
    return (
        <Button 
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            p={4}
            borderRadius="100"
            minHeight="120px"
            minWidth="100px"
            gap="8px"
            bg={isSelected ? '#B97C22' : '#EDF2F7'}
            boxShadow="0px 4px 4px rgba(0, 0, 0, 0.15)"
            _hover={{ bg: '#D1AB70' }}
            onClick={() => { handleCuisineClick(cuisine, cuisineOptions) }}
        >
            <Image height="50px" width="50px" src={cuisineIconMappings[cuisine]} alt={`${cuisine}-icon`}/>
            <Text textOverflow="ellipsis" overflow="hidden" whiteSpace="nowrap">
                { cuisine }
            </Text>
        </Button>
    )
}

export const CuisineList = ({ handleCuisineClick, selectedCuisine }) => {
    return (
        <Flex 
            overflowX="auto" 
            gap="12px" 
            padding="12px" 
            sx={{ 
                '::-webkit-scrollbar': {
                    display:'none'
                }
            }}
        >
            { Object.entries(cuisineCategories).map(([cuisine, cuisineOptions], index) => (
                <CuisineButton 
                    key={`${cuisine}-${index}`}
                    handleCuisineClick={handleCuisineClick} 
                    cuisine={cuisine} 
                    isSelected={selectedCuisine === cuisine}
                    cuisineOptions={cuisineOptions} 
                />
            ))}
        </Flex>
    )
}