import { 
    Button,
    Modal,
    ModalBody,
    ModalFooter,
    ModalHeader,
    ModalContent,
    ModalCloseButton,
    ModalOverlay
} from "@chakra-ui/react";

export const DeleteConfirmation = ({ isOpen, isDeleting, onClose, onDelete }) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose} isCentered>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Delete Transaction</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    Are you sure you want to delete this transaction?
                </ModalBody>
                <ModalFooter>
                    <Button isLoading={isDeleting} colorScheme="red" mr={3} onClick={onDelete}>
                        Delete
                    </Button>
                    <Button isLoading={isDeleting} variant="ghost" onClick={onClose}>Cancel</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}