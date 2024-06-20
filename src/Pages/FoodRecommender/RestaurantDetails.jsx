import { useState, useEffect, useRef } from 'react' 
import { useLocation, useNavigate } from 'react-router-dom';
import { Box, Button, Text, Flex, IconButton } from '@chakra-ui/react';
import { ArrowBackIcon } from '@chakra-ui/icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLocationDot, faStar } from '@fortawesome/free-solid-svg-icons';

import { RestaurantTag, RestaurantTags } from './Components/RestaurantCard';
import { ReviewCard } from './ReviewCard';

export const RestaurantDetails = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [currentIndex, setCurrentIndex] = useState(0);
    const carouselRef = useRef(null);
    const restaurant = location.state?.restaurant;
    
    const handleScroll = () => {
        const carousel = carouselRef.current;
        if (carousel) {
            const index = Math.round(carousel.scrollLeft / carousel.clientWidth);
            setCurrentIndex(index);
        }
    };

    useEffect(() => {
        const carousel = carouselRef.current;
        if (carousel) {
            carousel.addEventListener('scroll', handleScroll);
            return () => {
                carousel.removeEventListener('scroll', handleScroll);
            };
        }
    }, []);

    if (!restaurant) {
        return <Box>Restaurant not found</Box>;
    }

    return (
        <Box position="relative" height="calc(100vh - 80px)">
            <IconButton
                icon={<ArrowBackIcon />}
                position="absolute"
                top="15px"
                left="15px"
                onClick={() => navigate(-1)}
                bg="white"
                borderRadius="50%"
            />

            <Box
                id="carousel"
                className="snap"
                overflowX="auto"
                display="flex"
                whiteSpace="nowrap"
                scrollSnapType="x mandatory"
                width="100%"
                height="300px"
                ref={carouselRef}
            >
                {restaurant.photos.map((photo, index) => (
                    <Box
                        key={index}
                        minWidth="100%"
                        height="100%"
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                        scrollSnapAlign="center"
                    >
                        <img
                        //   src={`https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photo.name}`}
                            src={'/foodRecommendations/Placeholder.svg'}
                            alt={`placeholder ${index + 1}`}
                            style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                        />
                    </Box>
                ))}
            </Box>

            <Text position="absolute" top="15px" right="15px" bg="white" p="5px 10px" borderRadius="10px">
                {currentIndex + 1}/{restaurant.photos.length}
            </Text>
            
            <Box p="20px" bg="brown.50" textAlign="left">
                <Box>
                    <Flex justifyContent="space-between">
                        <Text isTruncated maxWidth="80%" fontSize="2xl" fontWeight="bold">{restaurant.displayName.text}</Text>
                        <Flex align="center">
                            <FontAwesomeIcon color="#8F611B" icon={faStar} />
                            <Text color="#8F611B" fontWeight="bold" ml="2">{restaurant.rating}</Text>
                        </Flex>
                    </Flex>
                    
                    <Flex gap="8px" mt="10px" alignItems="center">
                        <FontAwesomeIcon icon={faLocationDot} />
                        <Text ml="4px">{restaurant.formattedAddress}</Text>
                    </Flex>

                    <Flex gap="8px" my="12px">
                        <Box>
                            { RestaurantTags[restaurant.priceLevel] || RestaurantTags["PRICE_LEVEL_UNSPECIFIED"]}
                        </Box>
                        <Box>
                            { restaurant?.primaryTypeDisplayName?.text ? <RestaurantTag upperCaseText={restaurant?.primaryTypeDisplayName?.text} /> : null}
                        </Box>
                    </Flex>
                </Box>
                
                <Box mt="24px">
                    <Text fontSize="24px" textAlign="left" fontWeight="bold" mb="12px">Top Reviews</Text>
                    { restaurant.reviews.map((review, index) => (
                        <ReviewCard key={index} review={review} />
                    ))}
                </Box>
            </Box>
            

            <Box position="sticky" bottom="0" width="100%" bg="white" p="20px">
                <Button bg="#EAD9BF" color="#8F611B" width="100%">
                    <a href={restaurant.googleMapsUri} target="_blank" rel="noopener noreferrer">View on Google Map</a>
                </Button>
            </Box>
        </Box>
    );
};
