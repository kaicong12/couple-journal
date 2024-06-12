import React from 'react';
import { Text, Box, Image } from '@chakra-ui/react'


function HeroSection() {
  return (
    <Box bg="#D9D9D9" px="20px" textAlign="center" display="flex" flexDir="column" justifyContent="center" alignItems="center">
        <Text
            fontSize="40px"
            fontWeight="600"
            fontFamily="actor"
            mb="10px"
        >
            Celebrating Us
        </Text>
        <Text fontFamily="actor" fontSize="20px">
            From the first glance to endless adventures, here's to the moments that define us.
        </Text>
        <Box boxSize="300px" my="35px">
            <Image src="/images/coupleHoldingHands.svg" alt="Couple holding hands"/>
        </Box>
    </Box>
  );
}

export default HeroSection;