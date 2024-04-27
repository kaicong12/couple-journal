import {
    Box,
    Flex,
    Image,
    InputGroup,
    InputLeftElement,
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
} from '@chakra-ui/react';

import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { StarRating } from './StarRating'; 
import { CalendarIcon } from '@chakra-ui/icons';
import LocationIcon from '../../../Icons/Location.svg'


const DatepickerInput = () => {
    return <Input type="date" border="1px solid red"/>
}

export const AddEventModal = ({ newEvent, setNewEvent, isAddModalOpen, onAddModalClose, handleAddEvent }) => {
    const [previewImage, setPreviewImage] = useState([])

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

    return (
        <Modal isOpen={isAddModalOpen} onClose={onAddModalClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Add New Event</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <FormControl mb={4}>
                        { previewImage.length ? (
                            <Box> {previewImage.map((image, imageIdx) => (
                                <Image 
                                    key={imageIdx} 
                                    src={image.preview || 'https://via.placeholder.com/150'} 
                                    alt="Uploaded thumbnail" 
                                />
                            ))} </Box>
                        ) : (
                            <div {...getRootProps()} style={{ 
                                    borderWidth: '2px',
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
                    </FormControl>
                    <FormControl>
                        <FormLabel>Title</FormLabel>
                        <Input name="title" value={newEvent.title} onChange={handleInputChange} />
                    </FormControl>
                    <FormControl mt={4}>
                        <FormLabel>Description</FormLabel>
                        <Input name="description" value={newEvent.description} onChange={handleInputChange} />
                    </FormControl>
                    <FormControl mt={4}>
                        <FormLabel>Category</FormLabel>
                        <Select name="category" value={newEvent.category} onChange={handleInputChange}>
                            <option value="Catering">Catering</option>
                            <option value="Gifts">Gifts</option>
                        </Select>
                    </FormControl>
                    <FormControl mt={4}>
                        <FormLabel>Rating</FormLabel>
                        <StarRating rating={newEvent.rating} setRating={(rating) => setNewEvent(prev => ({ ...prev, rating }))} />
                    </FormControl>
                    <Flex mt={4} justifyContent="space-between" alignItems="center">
                        <FormControl flex="1" mr={2}>
                            <FormLabel>Date of Event</FormLabel>
                            <DatePicker
                                selected={newEvent.date || Date.now()}
                                onChange={handleDateChange}
                                dateFormat="MMMM d, yyyy"
                                className="chakra-input css-1es6f7d"
                                wrapperClassName="date-picker"
                                calendarClassName="chakra-calendar"
                                as={Input}
                            />
                        </FormControl>
                        <FormControl flex="1" ml={2}>
                            <FormLabel>Where is this</FormLabel>
                            <InputGroup>
                                <InputLeftElement
                                    pointerEvents="none"
                                    children={<LocationIcon color="gray.500" />}
                                />
                                <Input name="location" value={newEvent.location} onChange={handleInputChange} />
                            </InputGroup>
                        </FormControl>
                    </Flex>
                </ModalBody>
                <ModalFooter>
                    <Button colorScheme="blue" mr={3} onClick={() => handleAddEvent(newEvent)}>
                        Save
                    </Button>
                    <Button onClick={onAddModalClose}>Cancel</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}