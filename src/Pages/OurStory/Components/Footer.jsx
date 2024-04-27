import React from 'react';
import { Text, Box, Button } from '@chakra-ui/react'

import { ArrowForwardIcon} from '@chakra-ui/icons'

function Footer({ setActiveTab }) {
  return (
    <Box 
      bg="#F2F2F2"
      py="60px"
      px="37px"
      textAlign="center" 
      display="flex" 
      flexDir="column" 
      justifyContent="center" 
      alignItems="center"
    >
      <Text fontSize="22px" fontWeight="600" fontFamily="actor">In Love We Trust, Together We Grow</Text>
      <Text mt="15px" fontSize="20px" fontFamily="actor" px="10px">
        Thank you for being part of my journey. Here's to many more years of love, laughter, and happiness.
      </Text>

      <Box mt="20px" width="100%" display="flex" justifyContent="flex-end">
        <Button 
          bg="#EAD9BF" 
          size='md' 
          onClick={() => {
            setActiveTab(1)
            window.scrollTo({
              top: 0,
            })
          }}  
        >
          <ArrowForwardIcon color="#8F611B" mr="5px" fontWeight="600" /> 
          <Text color="#8F611B" fontFamily="actor">
            Gallery
          </Text>
        </Button>
      </Box>
    </Box>
  );
}

export default Footer;