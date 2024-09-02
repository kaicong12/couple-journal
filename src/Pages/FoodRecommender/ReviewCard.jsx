import React from 'react';
import { Box, Text, Flex, Avatar } from '@chakra-ui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';

export const ReviewCard = ({ review }) => {
    return (
        <Box 
            bg="white" 
            p="20px" 
            borderRadius="10px" 
            boxShadow="md" 
            mb="20px"
            minWidth="250px"
            w="250px"
            h="250px"  
        >
            <Flex alignItems="center" mb="10px">
                <Avatar src={review.authorAttribution.photoUri} name={review.authorAttribution.displayName} size="md" />
                <Box ml="10px">
                    <Text fontWeight="bold" color="#8F611B">{review.authorAttribution.displayName}</Text>
                    <Flex alignItems="center">
                        <FontAwesomeIcon icon={faStar} color="#8F611B" />
                        <Text ml="2" color="#8F611B" fontWeight="bold">{review.rating}</Text>
                    </Flex>
                </Box>
            </Flex>
            <Text color="gray.600" mb="10px">{review.relativePublishTimeDescription}</Text>
            <Text
                noOfLines={4} 
                overflow="hidden"
                textOverflow="ellipsis" color="gray.800"
            >
                {review.text.text}
            </Text>
        </Box>
    );
};
