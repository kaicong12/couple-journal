import { useState, useRef, useEffect } from 'react'
import {
    Button,
    Box,
    Input,
    InputGroup,
    InputLeftElement,
} from '@chakra-ui/react'
import { AddIcon } from '@chakra-ui/icons'
import { SlidersHorizontal, Search } from 'lucide-react'
import { useNavigate } from 'react-router-dom'


export const SearchFilter = ({ onAddModalOpen, onSearchEvent, hasActiveFilters, onToggleFilterPanel, isFilterOpen }) => {
    const navigate = useNavigate()
    return (
        <Box display="flex" gap="10px" pt="20px" px="20px" alignItems="center">
            <InputGroup flex="1">
                <InputLeftElement pointerEvents='none' height="100%" display="flex" alignItems="center">
                    <Search size={16} color="#8E867E" />
                </InputLeftElement>
                <Input
                    placeholder='Search Event'
                    padding="10px"
                    pl="35px"
                    height="40px"
                    fontSize="14px"
                    borderWidth='1.5px'
                    borderColor='#E3D8CE'
                    borderRadius="4px"
                    bg="white"
                    onChange={onSearchEvent}
                    _placeholder={{ color: '#8E867E', fontSize: '14px' }}
                    _focus={{
                        boxShadow: '0 0 0 1px rgba(180, 130, 97, 0.3)',
                        borderWidth: '1.5px',
                        borderColor: '#B48261',
                        outline: 'none'
                    }}
                />
            </InputGroup>

            {/* Filter toggle */}
            <Box position="relative">
                <Button
                    onClick={onToggleFilterPanel}
                    bg={isFilterOpen ? '#B48261' : 'white'}
                    color={isFilterOpen ? 'white' : '#8E867E'}
                    borderWidth="1.5px"
                    borderColor={isFilterOpen ? '#B48261' : '#E3D8CE'}
                    borderRadius="4px"
                    height="40px"
                    width="40px"
                    minWidth="40px"
                    padding="0"
                    _hover={{
                        bg: isFilterOpen ? '#9A6A4E' : '#F7F5F0',
                        borderColor: '#B48261',
                        color: isFilterOpen ? 'white' : '#B48261',
                    }}
                    transition="all 0.2s ease"
                >
                    <SlidersHorizontal size={16} />
                </Button>
                {/* Active filter indicator dot */}
                {hasActiveFilters && !isFilterOpen && (
                    <Box
                        position="absolute"
                        top="-2px"
                        right="-2px"
                        width="8px"
                        height="8px"
                        borderRadius="full"
                        bg="#B48261"
                        border="2px solid white"
                    />
                )}
            </Box>

            <Button
                onClick={() => navigate('/events/new')}
                bg="#B48261"
                color="white"
                height="40px"
                minWidth="80px"
                borderRadius="4px"
                fontSize="14px"
                fontWeight="500"
                letterSpacing="0.02em"
                _hover={{ bg: '#9A6A4E' }}
                transition="all 0.2s ease"
            >
                <AddIcon mr="6px" boxSize="10px" />
                Add
            </Button>
        </Box>
    )
}
