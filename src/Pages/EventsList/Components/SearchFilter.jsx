import {
    Button,
    Box,
    Input,
    InputGroup,
    InputLeftElement,
    InputRightElement,
} from '@chakra-ui/react'
import { AddIcon } from '@chakra-ui/icons'


import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSliders, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';


export const SearchFilter = ({ onAddModalOpen, onSearchEvent, onFilterClose, toggleFilterOpen }) => {
    return (
        <Box display="flex" gap="12px" py="20px" px="20px">
            <InputGroup onClick={() => { toggleFilterOpen() }}>
                <InputLeftElement pointerEvents='none'>
                    <FontAwesomeIcon icon={faMagnifyingGlass} />
                </InputLeftElement>
                <Input 
                    placeholder='Search Event' 
                    padding="10px"
                    pl="35px"
                    borderWidth='2px'
                    borderColor='brown.200'
                    // onChange={onSearchEvent}
                    _focus={{ 
                        boxShadow: '0 0 0 1px rgba(255, 181, 62, 0.6)',
                        borderWidth: '2px',
                        borderColor: 'brown.200',
                        outline: 'none' 
                    }} 
                />
                <InputRightElement>
                    <FontAwesomeIcon onClick={() => { toggleFilterOpen() }} icon={faSliders} />
                </InputRightElement>
            </InputGroup>
            
            <Button 
                onClick={() => {
                    onFilterClose()
                    onAddModalOpen()
                }} 
                bg="brown.200" 
                minWidth="80px"
            >
                <AddIcon mr="6px" />
                Add
            </Button>
        </Box>
    )
}