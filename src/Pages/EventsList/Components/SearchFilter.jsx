import {
    Button,
    Box,
    Input,
    InputGroup,
    InputLeftElement,
} from '@chakra-ui/react'
import { AddIcon } from '@chakra-ui/icons'


import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';


export const SearchFilter = ({ onAddModalOpen, onSearchEvent }) => {
    return (
        <Box display="flex" gap="12px" pt="20px" px="20px">
            <InputGroup>
                <InputLeftElement pointerEvents='none'>
                    <FontAwesomeIcon icon={faMagnifyingGlass} />
                </InputLeftElement>
                <Input 
                    placeholder='Search Event' 
                    padding="10px"
                    pl="35px"
                    borderWidth='2px'
                    borderColor='brown.200'
                    onChange={onSearchEvent}
                    _focus={{ 
                        boxShadow: '0 0 0 1px rgba(255, 181, 62, 0.6)',
                        borderWidth: '2px',
                        borderColor: 'brown.200',
                        outline: 'none' 
                    }} 
                />
            </InputGroup>
            
            <Button 
                onClick={onAddModalOpen} 
                bg="brown.200" 
                minWidth="80px"
            >
                <AddIcon mr="6px" />
                Add
            </Button>
        </Box>
    )
}