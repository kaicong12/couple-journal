import {
    Box,
    Image,
    Text, 
    Modal, 
    ModalOverlay,
    ModalContent, 
    ModalHeader, 
    ModalCloseButton, 
    ModalBody,
    VStack
} from '@chakra-ui/react';

export const EventModal = ({ event, isOpen, onClose }) => (
    <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
            <ModalHeader>{event.title}</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
                <Image src={event.thumbnail || 'https://via.placeholder.com/150'} alt={`Thumbnail for ${event.title}`} />
                <Text mb="4">
                    {event.description}
                </Text>
                <VStack align="start">
                    {
                        event.pros ? (
                            <Box>
                                <Text fontWeight="bold">Pros:</Text>
                                {event.pros.map((pro, i) => <Text key={i}>- {pro}</Text>)}
                            </Box>
                        ) : null
                    }
                    {
                        event.cons ? (
                            <Box>
                                <Text fontWeight="bold">Cons:</Text>
                                {event.cons.map((con, i) => <Text key={i}>- {con}</Text>)}
                            </Box>
                        ) : null
                    }
                </VStack>
            </ModalBody>
        </ModalContent>
    </Modal>
);