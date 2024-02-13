import React from 'react';
import { Text, Box, Image } from '@chakra-ui/react'

const Moments = () => {
    return (
        <Box bg="#F2F2F2" pt="55px">
            <Text
                fontSize="40px"
                fontWeight="600"
                fontFamily="actor"
                mb="10px"
            >
                Testimonials
            </Text>
            
            <Box boxSize="300px" mt="55px">
                <Image src="/images/coupleCouch.svg" alt="Couple Couch"/>
            </Box>
        </Box>
    )
}

export default Moments