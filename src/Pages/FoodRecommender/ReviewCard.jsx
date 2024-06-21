import { 
    Box, 
    Flex, 
    Text, 
    Avatar,
    Accordion, 
    AccordionItem, 
    AccordionButton, 
    AccordionPanel, 
    AccordionIcon 
} from '@chakra-ui/react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';

export const ReviewCard = ({ review }) => {
    return (
        <Accordion allowToggle>
            <AccordionItem border="1px solid #e2e8f0" borderRadius="lg" mb="10px">
                <AccordionButton bg="#D9D9D9" borderRadius="6px">
                    <Box flex="1" textAlign="left" >
                        <Flex justifyContent="space-between">
                            <Flex alignItems="center">
                                <Avatar src={review.authorAttribution.photoUri} name={review.authorAttribution.displayName} />
                                <Box ml="3">
                                    <Text fontWeight="bold">{review.authorAttribution.displayName}</Text>
                                    {review.relativePublishTimeDescription ? (
                                        <Text fontSize="sm" color="gray.500">
                                            Reviewed {review.relativePublishTimeDescription}
                                        </Text>
                                    ) : null}
                                </Box>
                            </Flex>
                            <Flex align="center">
                                <FontAwesomeIcon color="#8F611B" icon={faStar} />
                                <Text color="#8F611B" fontWeight="bold" ml="2">{review.rating}</Text>
                            </Flex>
                        </Flex>
                    </Box>
                    <AccordionIcon />
                </AccordionButton>
                <AccordionPanel pb="4" bg="#D9D9D9">
                    <Text textAlign="left" noOfLines={4} mt="3">{review.text.text}</Text>
                </AccordionPanel>
            </AccordionItem>
        </Accordion>
    );
};
