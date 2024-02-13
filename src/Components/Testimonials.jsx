import React, { useRef, useEffect, useState } from 'react';
import { Text, Box, Flex, Image, HStack } from '@chakra-ui/react'

const imagesWithDescriptions = [
    {
        image: '/images/dSands.jpg',
        description: 'Hiccups during Batam trip but it was our first outing together!'
    },
    {
        image: '/images/kluangCafe.jpeg',
        description: 'Your family brought me to Kluang!'
    },
    {
        image: '/images/melakaCafe.jpeg',
        description: 'Melaka trip that eventually brought us together.'
    },
    {
        image: '/images/moviesTogether.webp',
        description: 'Enjoyed every movies we have watched together.'
    },
]

const TestimonialCard = ({ image, description }) => {
    return (
        <Box 
            bg="#D9D9D9"
            borderRadius="10px"
            display="flex" 
            flexDir="column"
            minWidth="220px"
            padding="20px"
            height="350px"
        >
            <Image borderRadius="10px" src={image} alt={description} height="200px" />
            <Flex mt="10px" flex="1" width="100%" justifyContent="center" alignItems="center">
                <Text fontFamily="actor" fontSize="18px" textAlign="center">{description}</Text>
            </Flex>
        </Box>
    )
}

const Testimonials = () => {
    const scrollRef = useRef(null);
    const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const container = scrollRef.current;
    const handleScroll = () => {
      // Assuming all cards have the same width
      const cardWidth = container.firstChild.offsetWidth + parseInt(getComputedStyle(container.firstChild).marginRight, 10);
      const scrollLeft = container.scrollLeft;
      const index = Math.round(scrollLeft / cardWidth);
      setCurrentIndex(index);
    };

    container.addEventListener('scroll', handleScroll);

    return () => container.removeEventListener('scroll', handleScroll);
  }, []);

    return (
        <Box bg="#F2F2F2" pt="55px" px="35px" pb="75px">
            <Text
                fontSize="40px"
                fontWeight="600"
                fontFamily="actor"
                mb="10px"
            >
                Testimonials
            </Text>
            <Text fontFamily="actor" fontSize="20px" px="2px">
                Every adventures with you are never boring. Recall my words when I mentioned that being with you is when I have the most fun - I truly meant every word.
            </Text>
            
            <Flex mt="40px" overflowX="auto" ref={scrollRef} gap="15px">
                { imagesWithDescriptions.map(({ image, description }, index) => (
                    <TestimonialCard key={index} image={image} description={description} />
                )) }
            </Flex>
            <HStack justify="center" spacing={2} mt={4}>
                { imagesWithDescriptions.map((_, index) => (
                    <Box key={index} w="10px" h="10px" borderRadius="full" bg={currentIndex === index ? "#8C8C8C" : "#D9D9D9"} />
                )) }
            </HStack>
        </Box>
    )
}

export default Testimonials