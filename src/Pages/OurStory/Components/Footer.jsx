import React from 'react';
import { Text, Box, Button } from '@chakra-ui/react'
import { useAuth } from '../../../AuthContext';

function Footer() {
  const { handleLogout } = useAuth();
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

      <Button
          w="full"
          onClick={handleLogout}
          bg='#EAD9BF'
          color='#8F611B'
          mt="30px"
      >
          See you next time!
      </Button>
    </Box>
  );
}

export default Footer;