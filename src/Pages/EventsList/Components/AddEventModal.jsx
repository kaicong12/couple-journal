import {
    Box,
    Flex,
    Image,
    Modal, 
    Button,
    ModalOverlay,
    ModalContent, 
    ModalHeader, 
    ModalCloseButton, 
    ModalFooter,
    ModalBody,
    FormControl,
    FormLabel,
    Input,
    Select,
    FormErrorMessage
} from '@chakra-ui/react';

import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useMemo, useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { StarRating } from './StarRating'; 
import { LocationSearchBox } from './LocationSearchBox';

export const AddEventModal = ({ menuLists, newEvent, setNewEvent, isAddModalOpen, onAddModalClose, handleAddEvent }) => {
    const [previewImage, setPreviewImage] = useState([])
    const [errors, setErrors] = useState({});

    const menuListWithoutAll = useMemo(() => {
        return menuLists.slice(1, menuLists.length)
    }, [menuLists])

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewEvent(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleDateChange = (date) => {
        setNewEvent(prev => ({
            ...prev,
            date: date
        }));
    };

    const handleLocationChange = (location) => {
        const locationText = location?.text?.text ?? ''
        setNewEvent(prev => ({
            ...prev,
            location: locationText,
        }));
    }

    const handleOnClose = () => {
        onAddModalClose()
        setNewEvent({
            title: '',
            description: '',
            category: '',
            rating: 3,
        })
    }

    const {getRootProps, getInputProps, isDragActive} = useDropzone({
        accept: {
            'image/*': []
        },
        onDrop: acceptedFiles => {
            setPreviewImage(acceptedFiles.map(file => Object.assign(file, {
                preview: URL.createObjectURL(file)
            })));
            setNewEvent(prev => ({
                ...prev,
                file: acceptedFiles[0]
            }));
        }
    });

    const handleSave = useCallback((newEvent) => {
        const newErrors = {};
        if (!newEvent.title || !newEvent.title.length) {
            newErrors.title = 'Title is required'
        }
        if (!newEvent.file) {
            newErrors.file = 'Thumbnail is required';
        }
        if (!newEvent.category) {
            newErrors.category = 'Category is required';
        }
        if (!newEvent.date) {
            newErrors.date = 'Date is required';
        }
        if (!newEvent.location || !newEvent.location.length) {
            newErrors.location = 'Location is required'
        }
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }
        handleAddEvent(newEvent);
    }, [handleAddEvent])

    useEffect(() => {
        const dateInput = document.querySelector('.react-datepicker__input-container input');
        if (errors.date && dateInput) {
            dateInput.style.borderColor = '#E53E3E';
            dateInput.style.boxShadow = '0 0 0 1px #E53E3E';
        } else if (dateInput) {
            dateInput.style.borderColor = '';
            dateInput.style.boxShadow = '';
        }
    }, [errors.date]);

    return (
        <Modal isOpen={isAddModalOpen} onClose={handleOnClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Add New Event</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <FormControl mb={4} isInvalid={errors.file}>
                        { previewImage.length ? (
                            <Box display="flex" justifyContent="center"> {previewImage.map((image, imageIdx) => (
                                <Image 
                                    key={imageIdx} 
                                    src={image.preview || 'https://via.placeholder.com/150'} 
                                    alt="Uploaded thumbnail" 
                                    fit="cover"
                                    width="300px"
                                    height="300px"
                                />
                            ))} </Box>
                        ) : (
                            <div {...getRootProps()} style={{ 
                                    borderWidth: '2px',
                                    borderColor: errors.file ? '#E53E3E' : 'inherit',
                                    boxShadow: errors.file ? '0 0 0 1px #E53E3E' : 'inherit',
                                    padding: '20px', 
                                    textAlign: 'center',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center'
                                }}>
                                <input {...getInputProps()} />
                                {
                                    isDragActive ?
                                        <p>Drop the files here ...</p> :
                                        <p>Upload thumbnail...</p>
                                }
                            </div>
                        ) }
                        { errors.file && <FormErrorMessage>{errors.file}</FormErrorMessage> }
                    </FormControl>
                    <FormControl isInvalid={errors.title}>
                        <FormLabel>Title</FormLabel>
                        <Input name="title" value={newEvent.title} onChange={handleInputChange} />
                        { errors.title && <FormErrorMessage>{errors.title}</FormErrorMessage> }
                    </FormControl>
                    <FormControl mt={4}>
                        <FormLabel>Description</FormLabel>
                        <Input name="description" value={newEvent.description} onChange={handleInputChange} />
                    </FormControl>
                    <FormControl mt={4} isInvalid={errors.category}>
                        <FormLabel>Category</FormLabel>
                        <Select name="category" value={newEvent.category} onChange={handleInputChange}>
                            <option value="">Select a category</option>
                            { menuListWithoutAll.map(({ label }) => <option key={label} value={label}>{label}</option>) }
                        </Select>
                        { errors.category && <FormErrorMessage>{errors.category}</FormErrorMessage> }
                    </FormControl>
                    <FormControl flex="1" mt={4} isInvalid={errors.location}>
                        <FormLabel>Where is this</FormLabel>
                        <LocationSearchBox onSelectLocation={handleLocationChange} />
                        { errors.location && <FormErrorMessage>{errors.location}</FormErrorMessage> }
                    </FormControl>
                    <Flex mt={4} justifyContent="space-between" alignItems="center">
                        <FormControl flex="1" mr={2} isInvalid={errors.date}>
                            <FormLabel>Date of Event</FormLabel>
                            <DatePicker
                                selected={newEvent.date}
                                onChange={handleDateChange}
                                dateFormat="MMMM d, yyyy"
                                className="chakra-input css-1es6f7d"
                                wrapperClassName="date-picker"
                                calendarClassName="chakra-calendar"
                                as={Input}
                            />
                            { errors.date && <FormErrorMessage>{errors.date}</FormErrorMessage> }
                        </FormControl>
                        <FormControl>
                        <FormLabel>Rating</FormLabel>
                            <StarRating rating={newEvent.rating} setRating={(rating) => setNewEvent(prev => ({ ...prev, rating }))} />
                        </FormControl>
                    </Flex>
                </ModalBody>
                <ModalFooter>
                    <Button colorScheme="blue" mr={3} onClick={() => handleSave(newEvent)}>
                        Save
                    </Button>
                    <Button onClick={handleOnClose}>Cancel</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}