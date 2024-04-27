import React from 'react';
import { Text, Box, Image } from '@chakra-ui/react'

const Whisper = () => {
    return (
        <Box 
            bg="#D9D9D9" 
            py="60px"
            px="35px"
            textAlign="center" 
            display="flex" 
            flexDir="column" 
            justifyContent="center" 
            alignItems="center"
        >
            <Text
                fontSize="40px"
                fontWeight="600"
                fontFamily="actor"
                mb="20px"
            >
                To My Dearest
            </Text>
            <Text fontFamily="actor" fontSize="20px" px="2px">
                To my dearest, who has traversed the globe and brought back not just souvenirs, but pieces of the world itself: I am in awe of you.
                I am honored to have shared in your growth over the past few years, and here's to stepping into the frame with you on your next adventure.
            </Text>
            <Box boxSize="300px" mb="35px" mt="40px">
                <Image borderRadius="20px" src="/images/photo1.png" alt="Favourite Photo"/>
            </Box>
            <Text fontFamily="actor" fontSize="17px" mt="5px">
                {'**很喜欢这张你的照片。长发和太阳眼镜真的和适合你哦哈哈 :)) 希望以后能多看到呀.'}
            </Text>
        </Box>
    );
}

export default Whisper