import React, { useState } from 'react';
import { 
    Box, 
    Button, 
    Input, 
    SimpleGrid,
    Heading, 
    Stack,
    RadioGroup, 
    Flex, 
    HStack,
    FormControl,
    FormLabel
} from '@chakra-ui/react';

export const SearchFood = ({ menuLists, selectedCategory, onSelectCategory, onClose }) => {
    const [sortOrder, setSortOrder] = useState('latest');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    return (
    <Box p={4} borderWidth="1px" borderRadius="lg" w="full" maxW="md" mx="auto" bg="brown.50">
        <Stack spacing={8}>
            <Box>
                <Heading as="h4" size="md" mb={4} textAlign="left">Category</Heading>
                <SimpleGrid columns={Math.ceil(Math.sqrt(menuLists.length))} spacing={2}>
                    { menuLists.map(({ leftIcon, label }) => {
                        const isSelected = label === selectedCategory
                        return <Button 
                                    key={label} 
                                    leftIcon={leftIcon}
                                    bg={isSelected ? '#EAD9BF' : 'none'}
                                    variant={isSelected ? 'solid' : 'ghost'}
                                    onClick={() => { onSelectCategory(label) }}
                                >
                                    { label }
                                </Button>
                    }) }
                </SimpleGrid>
            </Box>
            <Box>
                <Heading as="h4" size="md" mb={4} textAlign="left">Sort by Date</Heading>
                <HStack spacing={4}>
                    <Button bg={true ? '#EAD9BF' : 'none'} variant={true ? 'solid' : 'ghost'}>None</Button>
                    <Button bg={false ? '#EAD9BF' : 'none'} variant={false ? 'solid' : 'ghost'}>Latest to Oldest</Button>
                    <Button bg={false ? '#EAD9BF' : 'none'} variant={false ? 'solid' : 'ghost'}>Oldest to Latest</Button>
                </HStack>
            </Box>
            <Box>
                <Heading as="h4" size="md" mb={4} textAlign="left">Filter by Date Range</Heading>
                <Flex>
                    <FormControl>
                        <FormLabel>Start Date</FormLabel>
                        <Input 
                            type="date" 
                            value={startDate} 
                            onChange={(e) => setStartDate(e.target.value)} 
                        />
                    </FormControl>
                    <FormControl>
                        <FormLabel>End Date</FormLabel>
                        <Input 
                            type="date" 
                            value={endDate} 
                            onChange={(e) => setEndDate(e.target.value)} 
                        />
                    </FormControl>
                </Flex>
                
            </Box>
        </Stack>
        <SimpleGrid columns={2} spacing={4} mt="36px">
            <Button variant="solid" colorScheme="brown">Search</Button>
            <Button variant="outline" colorScheme="brown" onClick={() => { onClose() }}>Cancel</Button>
        </SimpleGrid>
    </Box>
    );
};
