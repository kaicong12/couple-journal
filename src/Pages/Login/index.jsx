import React from "react";
import { Button, Box, Center, Image, Spinner, Text } from "@chakra-ui/react";
import { useAuth } from "../../AuthContext";


export const LoginPage = () => {  
    const { handleGoogleLogin, loading: authChangeLoading } = useAuth();

    return (
        <Center minH="100vh" bg="#D9D9D9" p={4}>
            <Box
                maxW="md"
                w="full"
                bg="white"
                justifyContent={"center"}
                display={"flex"}
                flexDirection={"column"}
                p={6}
                borderRadius="lg"
                boxShadow="lg"
            >
                {authChangeLoading ? (
                    <Center h="full">
                        <Spinner size="xl" color="#8F611B" />
                    </Center>
                ) : (
                    <>
                        <Image src="/images/loginIcon.svg" alt="Couple Before Laptop"/>
                        <Button
                            w="full"
                            onClick={handleGoogleLogin}
                            bg='#EAD9BF'
                            color='#8F611B'
                            mt="30px"
                        >
                            Sign in with Google
                        </Button>
                    </>
                )}
            </Box>
            <Text mt="20px" fontSize="sm" color="gray.600" textAlign="center" position="absolute" bottom="10px" w="full">
                To get access, please contact <Text as="span" fontWeight="bold">kaicong12@gmail.com</Text>
            </Text>
        </Center>
    );
};