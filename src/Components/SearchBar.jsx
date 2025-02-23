import React from 'react';
import { Input, InputGroup, InputLeftElement, Button, Box } from '@chakra-ui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';

export const SearchBar = ({
    searchQuery,
    onSearchChange,
    onSearch,
    placeholder = 'Search...',
    displayActionButton = false,
    actionButtonLabel = 'Search',
    actionButtonProps = {},
    ...props
}) => {
    return (
        <Box display="flex" gap="12px" pt="20px" px="20px" {...props}>
            <InputGroup>
                <InputLeftElement pointerEvents='none'>
                    <FontAwesomeIcon icon={faMagnifyingGlass} />
                </InputLeftElement>
                <Input 
                    placeholder={placeholder}
                    padding="10px"
                    pl="35px"
                    borderWidth='2px'
                    borderColor='brown.200'
                    value={searchQuery}
                    onChange={onSearchChange}
                    _focus={{ 
                        boxShadow: '0 0 0 1px rgba(255, 181, 62, 0.6)',
                        borderWidth: '2px',
                        borderColor: 'brown.200',
                        outline: 'none' 
                    }} 
                />
            </InputGroup>
            {displayActionButton ? (
                <Button 
                    onClick={onSearch} 
                    bg="brown.200" 
                    minWidth="80px"
                    {...actionButtonProps}
                >
                    {actionButtonLabel}
                </Button>
            ) : null }
        </Box>
    );
};
