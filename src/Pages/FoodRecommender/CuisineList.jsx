import { Flex, Text, Box, Image } from '@chakra-ui/react';

import { cuisineCategories, cuisineIconMappings } from "./services/cuisineList"

const CuisineButton = ({ cuisine, handleCuisineClick, isSelected }) => {
    return (
        <Box 
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            p={4}
            borderRadius="100"
            minHeight="120px"
            minWidth="100px"
            gap="8px"
            bg={isSelected ? '#D1AB70' : '#EDF2F7'}
            boxShadow="0px 4px 4px rgba(0, 0, 0, 0.15)"
            onClick={() => { handleCuisineClick(cuisine) }}
        >
            <Image height="50px" width="50px" src={cuisineIconMappings[cuisine]} alt={`${cuisine}-icon`}/>
            <Text fontWeight="semibold" textOverflow="ellipsis" overflow="hidden" whiteSpace="nowrap">
                { cuisine }
            </Text>
        </Box>
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
            { Object.keys(cuisineCategories).map((cuisine, index) => (
                <CuisineButton 
                    key={`${cuisine}-${index}`}
                    handleCuisineClick={handleCuisineClick} 
                    cuisine={cuisine} 
                    isSelected={selectedCuisine === cuisine}
                />
            ))}
        </Flex>
    )
}