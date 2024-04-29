import {
    Menu,
    MenuButton,
    MenuList,
    Button,
    Box,
    Input,
    MenuOptionGroup,
    MenuItemOption
} from '@chakra-ui/react'
import { AddIcon } from '@chakra-ui/icons'
import CategoryIcon from '../../../Icons/CategoryIcon.svg'


export const SearchFilter = ({ menuLists, onAddModalOpen, onSearchEvent, onSelectCategory }) => {
    return (
        <Box display="flex" gap="12px" py="20px" px="20px">
            <Menu>
                <MenuButton 
                    bg="brown.200"
                    as={Button}
                    _expanded={{ bg: 'brown.400' }}
                    leftIcon={<CategoryIcon style={{ marginRight: '-8px' }} color="brown.700" />}
                >
                </MenuButton>
                <MenuList>
                    <MenuOptionGroup defaultValue='All' type='radio'>
                        { menuLists.map(({ label, leftIcon }, index) => (
                            <MenuItemOption 
                                key={index}
                                value={label}
                                mt={ index === 0 ? '0' : '10px' } 
                                _focus={{ bg: 'brown.200' }}
                                display="flex"
                                onClick={() => onSelectCategory(label)}
                            >
                                <Box display="flex" gap="8px">
                                    <span>{ leftIcon }</span> 
                                    { label }
                                </Box>
                            </MenuItemOption>
                        ))}
                    </MenuOptionGroup>
                </MenuList>
            </Menu>
            <Input 
                placeholder='Search Event' 
                padding="10px"
                borderWidth='2px'
                borderColor='brown.200'
                onChange={onSearchEvent}
                _focus={{ 
                    boxShadow: '0 0 0 1px rgba(255, 181, 62, 0.6)',
                    borderWidth: '2px',
                    borderColor: 'brown.200',
                    outline: 'none' 
                }} />
            <Button onClick={onAddModalOpen} bg="brown.200" minWidth="80px">
                <AddIcon mr="6px" />
                Add
            </Button>
        </Box>
    )
}