import React from 'react';
import { Text, Box } from '@chakra-ui/react'

function Footer() {
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
    </Box>
  );
}

export default Footer;