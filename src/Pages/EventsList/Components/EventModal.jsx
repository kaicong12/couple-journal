import {
    Badge,
    Box,
    Button,
    ButtonGroup,
    Divider,
    Image,
    Text, 
    Modal, 
    ModalOverlay,
    ModalHeader,
    ModalCloseButton,
    ModalContent,
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

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faLocationDot,
    faCalendar, 
    faEllipsis, 
    faTrash, 
    faPenToSquare, 
    faHeart 
} from '@fortawesome/free-solid-svg-icons';

import { ChevronDownIcon } from '@chakra-ui/icons';
import { useState, useMemo } from 'react';
import { Timestamp } from "firebase/firestore";
import { convertFbTimestampToDate as formatDate } from '../../../utils';
import { LocationSearchBox } from './LocationSearchBox';

export const EventModal = ({ handleDeleteEvent, handleUpdateEvent, event, isOpen, onClose, availableCategories }) => {
    const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();
    const [editMode, setEditMode] = useState(false);
    const [editedEvent, setEditedEvent] = useState(event);

    const categoryWithoutAll = useMemo(() => {
        return availableCategories.filter(category => category.label !== "All")
    }, [availableCategories])

    const handleEdit = () => {
        setEditedEvent(event)
        setEditMode(true);
    };

    const handleSave = () => {
        setEditMode(false);
        handleUpdateEvent(editedEvent)
    };
    
    const handleCancelEdit = () => {
        setEditMode(false);
        setEditedEvent(event);
    };

    const handleDelete = () => {
        onDeleteOpen();
    };

    const handleConfirmDelete = () => {
        handleDeleteEvent(event);
        onDeleteClose();
    };

    const handleCancelDelete = () => {
        onDeleteClose();
    };

    const handleChange = (field, value) => {
        if (field === 'date') {
            const newDate = Timestamp.fromDate(new Date(value));
            setEditedEvent(prev => ({ ...prev, date: newDate }));

        } else {
            setEditedEvent(prev => ({ ...prev, [field]: value }));
        }
    };

    const formattedDate = editedEvent.date ? new Date(editedEvent.date.seconds * 1000).toISOString().substring(0, 10) : ""
    
    return (
        <Modal isOpen={isOpen} onClose={onClose} size="sm" bg="#F2F2F2">
            <ModalOverlay />
            <ModalContent>
                <ModalBody>
                    <Box mt="20px">
                        <Image 
                            src={event.thumbnail || 'https://via.placeholder.com/150'} 
                            alt={`Thumbnail for ${event.title}`} 
                            fit="cover"
                            width="350px"
                            height="350px"
                            borderRadius={"10px"}
                        />

                        <Box mt="24px" mb="20px" display="flex" justifyContent="space-between" alignItems="center">
                            {editMode ? (
                                <Menu>
                                    <MenuButton
                                        as={Button}
                                        aria-label='Options'
                                        rightIcon={<ChevronDownIcon />}
                                        variant='outline'
                                    >
                                        { editedEvent.category || "Unknown category" }
                                    </MenuButton>
                                    <MenuList>
                                        <MenuItem 
                                            onClick={() => {handleChange('category', '') }} 
                                            icon={<FontAwesomeIcon icon={faHeart} />}
                                        >Select a category</MenuItem>
                                        { categoryWithoutAll.map(({ label, leftIcon }) => {
                                            return (
                                                <MenuItem 
                                                    onClick={() => {handleChange('category', label) }} 
                                                    key={label} 
                                                    icon={leftIcon}
                                                >
                                                    { label }
                                                </MenuItem>
                                            )
                                        })}
                                    </MenuList>
                                </Menu>
                            ) : (
                                <Badge p="2" borderRadius="6px" colorScheme='green'>{event.category || "Unknown Category"}</Badge>
                            )}

                            { editMode ? (
                                <ButtonGroup>
                                    <Button onClick={handleSave} colorScheme='brown' variant='solid'>Save</Button>
                                    <Button onClick={handleCancelEdit} colorScheme='red' variant='outline'>Cancel</Button>
                                </ButtonGroup>
                            ) : (
                                <Menu>
                                    <MenuButton
                                        as={IconButton}
                                        aria-label='Options'
                                        icon={<FontAwesomeIcon fontSize="20px" icon={faEllipsis} />}
                                        variant='outline'
                                    />
                                    <MenuList>
                                        <MenuItem 
                                            icon={<FontAwesomeIcon icon={faTrash} />}
                                            onClick={() => { handleDelete() }}
                                        >
                                            Delete
                                        </MenuItem>
                                        <MenuItem 
                                            icon={<FontAwesomeIcon icon={faPenToSquare} />}
                                            onClick={() => { handleEdit() }}
                                        >
                                            Edit
                                        </MenuItem>
                                    </MenuList>
                                </Menu>
                            ) }
                        </Box>

                        <Box mb="26px">
                            {editMode ? (
                                <Box>
                                    <Input
                                        value={editedEvent.title}
                                        onChange={(e) => handleChange('title', e.target.value)}
                                        placeholder="Edit your title here"
                                        mb="8px"
                                    />
                                    <Textarea
                                        value={editedEvent.description}
                                        onChange={(e) => handleChange('description', e.target.value)}
                                        placeholder="Edit your description here"
                                    />
                                </Box>
                            ) : (
                                <Box>
                                    <Text fontSize="20px" fontWeight="semibold">{event.title}</Text>
                                    <Text mt="8px" fontSize="16px" lineHeight="1.5rem">{event.description || "This event has no description"}</Text>
                                </Box>
                            )}
                        </Box>

                        <Divider height="2px" />

                        <Box py="16px">
                            <Box display="flex" gap="8px" alignItems="center">
                                <FontAwesomeIcon color="#8F611B" icon={faCalendar} />
                                {editMode ? (
                                    <Input
                                        placeholder='Edit event date and time' 
                                        size='md' 
                                        value={formattedDate}
                                        onChange={(e) => handleChange('date', e.target.value)}
                                        type='date' 
                                    />
                                ) : (
                                    <Text color="#333333">{event.date ? formatDate(event.date) : "Missing date for this event"}</Text>
                                )}
                            </Box>
                            <Box mt="12px" display="flex" gap="8px" alignItems="center">
                                <FontAwesomeIcon color="#8F611B" icon={faLocationDot} />
                                {editMode ? (
                                    <Box width="100%">
                                        <LocationSearchBox onSelectLocation={(location) => handleChange('location', location.text.text)} />
                                    </Box>
                                ) : (
                                    <Text maxW="90%" isTruncated color="#333333">{event.location || "Unknown Location"}</Text>
                                )}
                            </Box>
                        </Box>

                    </Box>
                </ModalBody>

                {isDeleteOpen && (
                        <Modal isOpen={isOpen} onClose={onDeleteClose} size="sm" bg="#F2F2F2" isCentered>
                            <ModalOverlay />
                            <ModalContent>
                                <ModalHeader fontWeight="semibold">Modal Title</ModalHeader>
                                <ModalCloseButton />
                                <Divider />
                                <ModalBody>
                                    <Text>Are you sure you want to continue with your action?</Text>
                                </ModalBody>
                                <Divider />
                                <ModalFooter>
                                    <Button mr="6px" variant="solid" colorScheme="red" onClick={handleConfirmDelete}>
                                        Confirm
                                    </Button>
                                    <Button variant="outline" colorScheme="red" onClick={handleCancelDelete}>
                                        Cancel
                                    </Button>
                                </ModalFooter>
                            </ModalContent>
                        </Modal>
                    )}
            </ModalContent>
        </Modal>
    );
}