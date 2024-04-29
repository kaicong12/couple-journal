import {
    Box,
    Button,
    Image,
    Text, 
    Modal, 
    ModalOverlay,
    ModalContent, 
    ModalHeader,
    ModalBody,
    ModalFooter,
    IconButton,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    useDisclosure,
    Input,
    Textarea
} from '@chakra-ui/react';
import { HamburgerIcon } from '@chakra-ui/icons';
import { MdEdit, MdDelete } from 'react-icons/md';
import { useState } from 'react';
import CalendarIcon from '../../../Icons/Calendar.svg'


const formatDate = (firestoreTimestamp) => {
    if (!firestoreTimestamp) return 'This event does not have a date';

    // Convert Firestore Timestamp to JavaScript Date object
    let date
    if (typeof firestoreTimestamp === 'number') {
        date = new Date(firestoreTimestamp);
    } else {
        date = firestoreTimestamp?.toDate()
    }

    const options = {
        year: 'numeric', // "2021"
        month: 'long',   // "July"
        day: 'numeric'   // "20"
    };

    return date.toLocaleDateString('en-US', options); // "July 20, 2021"
};

export const EventModal = ({ handleDeleteEvent, handleUpdateEvent, event, isOpen, onClose }) => {
    const { onOpen: onEditOpen, onClose: onEditClose } = useDisclosure();
    const [editMode, setEditMode] = useState(false);
    const [editedEvent, setEditedEvent] = useState(event);

    const handleEdit = () => {
        setEditedEvent(event)
        setEditMode(true);
        onEditOpen();
    };

    const handleSave = () => {
        setEditMode(false);
        handleUpdateEvent(editedEvent)
        onEditClose();
    };
    
    return (
        <Modal isOpen={isOpen} onClose={onClose} size="sm">
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>
                    {editMode ? (
                        <Input 
                            value={editedEvent.title} 
                            width="80%" 
                            onChange={(e) => setEditedEvent({...editedEvent, title: e.target.value})} 
                        />
                    ) : (
                        event.title
                    )}
                    <Menu>
                        <MenuButton
                            as={IconButton} 
                            bg="brown.200"
                            icon={<HamburgerIcon />} 
                            position="absolute" 
                            right="1rem" 
                            top="1rem" 
                        />
                        <MenuList>
                            <MenuItem icon={<MdEdit fontSize="24px" />} onClick={handleEdit}>
                                <Text ml="4px">Edit</Text> 
                            </MenuItem>
                            <MenuItem 
                                icon={<MdDelete fontSize="24px" />} 
                                onClick={() => { handleDeleteEvent(event) }}
                            >
                                <Text ml="4px">Delete</Text> 
                            </MenuItem>
                        </MenuList>
                    </Menu>
                </ModalHeader>
                <ModalBody>
                    <Box mt="20px" display="flex" flexDirection="column" alignItems="center">
                        <Image 
                            src={event.thumbnail || 'https://via.placeholder.com/150'} 
                            alt={`Thumbnail for ${event.title}`} 
                            fit="cover"
                            width="300px"
                            height="300px"
                        />
                        <Box display="flex" gap="8px" mt="20px">
                            <CalendarIcon fill="black" />
                            <Text>
                                { event.date ? formatDate(event.date) : 'This event does not have a date'}
                            </Text>
                        </Box>
                        <Text width="100%" textAlign="center" mt="12px" mb={ editMode ? "0" : "4" }>
                            {editMode ? (
                                <Textarea 
                                    value={editedEvent.description} 
                                    onChange={(e) => setEditedEvent({...editedEvent, description: e.target.value})} 
                                />
                            ) : (
                                event.description
                            )}
                        </Text>
                    </Box>
                </ModalBody>
                { editMode ? <ModalFooter>
                    <Button bg="brown.200" mr={3} onClick={handleSave}>
                        Save
                    </Button>
                    <Button onClick={() => { setEditMode(false) }}>Cancel</Button>
                </ModalFooter> : null}
            </ModalContent>
        </Modal>
    );
}