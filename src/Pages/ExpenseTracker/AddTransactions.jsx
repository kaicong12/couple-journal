import {
    Box,
    Button,
    Drawer,
    DrawerBody,
    DrawerFooter,
    DrawerHeader,
    DrawerOverlay,
    DrawerContent,
    DrawerCloseButton,
    Input,
    FormLabel,
    FormControl,
    FormErrorMessage,
    Flex
} from '@chakra-ui/react';
import Select from 'react-select';
import { useState, useCallback, useEffect } from 'react';

import { DeleteConfirmation } from './DeleteConfirmation';

export const AddTransactions = ({ 
    isSaving,
    isDeleting,
    expensesConfig,
    accountsConfig,
    isDrawerOpen, 
    addTransaction, 
    updateTransaction,
    handleDrawerClose,
    transactionToEdit,
    handleDelete
}) => {
    const [newTransaction, setNewTransaction] = useState({})
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    useEffect(() => {
        if (transactionToEdit) {
            setNewTransaction(transactionToEdit);
        } else {
            setNewTransaction({});
        }
    }, [transactionToEdit]);

    const [errors, setErrors] = useState({});
    const customSelectStyles = (isError) => ({
        control: (base) => ({
            ...base,
            borderColor: isError ? 'red' : base.borderColor,
            boxShadow: isError ? '0 0 0 1px red' : base.boxShadow,
        }),
    })

    const handleSelectInputChange = (selectedOption, name) => {
        if (selectedOption) {
            const { value } = selectedOption;
            setNewTransaction(prev => ({
                ...prev,
                [name]: value
            }));

            if (errors[name]) {
                setErrors(prev => ({
                    ...prev,
                    [name]: null
                }));
            }
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewTransaction(prev => ({
            ...prev,
            [name]: name === "amount" ? Number(value) : value
        }));

        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: null
            }));
        }
    }

    const handleClose = useCallback(() => {
        setNewTransaction({})
        setErrors({});
        handleDrawerClose();
    }, [handleDrawerClose]);

    const handleSave = useCallback(async () => {
        const newErrors = {};
        if (!newTransaction.title || !newTransaction.title.length) {
            newErrors.title = 'Title is required'
        }
        if (!newTransaction.category) {
            newErrors.category = 'Category is required';
        }
        if (!newTransaction.date) {
            newErrors.date = 'Date is required';
        }
        if (!newTransaction.account) {
            newErrors.account = 'Specify who made the transaction';
        }
        if (newTransaction.amount === undefined) {
            newErrors.amount = 'Amount is required';
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        if (transactionToEdit) {
            await updateTransaction(newTransaction);
        } else {
            await addTransaction(newTransaction);
        }
        handleClose();
    }, [newTransaction, transactionToEdit, handleClose, updateTransaction, addTransaction]);

    const onDeleteTransaction = useCallback(() => {
        setIsDeleteModalOpen(true);
    }, []);

    return (
        <Drawer isOpen={isDrawerOpen} placement="bottom" onClose={handleClose}>
            <DrawerOverlay />
            <DrawerContent>
                <DrawerCloseButton />
                <DrawerHeader>Add new transaction</DrawerHeader>
                <DrawerBody>
                    <FormControl mt={4} isInvalid={errors.date}>
                        <Flex alignItems="center">
                            <FormLabel width="25%">Date</FormLabel>
                            <Box width="75%">
                                <Input name="date" type="date" value={newTransaction.date || ''} onChange={handleInputChange} />
                                { errors.date && <FormErrorMessage>{errors.date}</FormErrorMessage> }
                            </Box>
                        </Flex>
                    </FormControl>
                    <FormControl mt={4} isInvalid={errors.account}>
                        <Flex alignItems="center">
                            <FormLabel width="25%">Account</FormLabel>
                            <Box width="75%">
                                <Select
                                    onChange={(selectedOption) => handleSelectInputChange(selectedOption, 'account')}
                                    options={accountsConfig.map(name => ({ value: name, label: name }))}
                                    isClearable={true}
                                    styles={customSelectStyles(errors.account)}
                                    value={newTransaction.account ? { value: newTransaction.account, label: newTransaction.account } : null}
                                />
                                { errors.account && <FormErrorMessage>{errors.account}</FormErrorMessage> }
                            </Box>
                        </Flex>
                    </FormControl>
                    <FormControl mt={4} isInvalid={errors.category}>
                        <Flex alignItems="center">
                            <FormLabel width="25%">Category</FormLabel>
                            <Box width="75%">
                                <Select
                                    name="category" 
                                    onChange={(selectedOption) => handleSelectInputChange(selectedOption, 'category')}
                                    options={expensesConfig.map(name => ({ value: name, label: name }))}
                                    isClearable={true}
                                    value={newTransaction.category ? { value: newTransaction.category, label: newTransaction.category } : null}
                                    styles={customSelectStyles(errors.category)}
                                />
                                { errors.category && <FormErrorMessage>{errors.category}</FormErrorMessage> }
                            </Box>
                        </Flex>
                    </FormControl>
                    <FormControl mt={4} isInvalid={errors.amount}>
                        <Flex alignItems="center">
                            <FormLabel width="25%">Amount</FormLabel>
                            <Box width="75%">
                                <Input type="number" value={newTransaction.amount || ''} onChange={handleInputChange} name="amount" placeholder='E.g. 50'/>
                                { errors.amount && <FormErrorMessage>{errors.amount}</FormErrorMessage> }
                            </Box>
                        </Flex>
                    </FormControl>
                    <FormControl mt={4} isInvalid={errors.title}>
                        <Flex alignItems="center">
                            <FormLabel width="25%">Title</FormLabel>
                            <Box width="75%">
                                <Input value={newTransaction.title || ''} onChange={handleInputChange} name="title" placeholder="E.g. Dinner at Tiong Bahru" />
                                { errors.title && <FormErrorMessage>{errors.title}</FormErrorMessage> }
                            </Box>
                        </Flex>
                    </FormControl>
                </DrawerBody>
                <DrawerFooter>
                    <Flex width="full" gap="12px">
                        { transactionToEdit ? (
                            <Button 
                                width="full" 
                                bg="#FFD6DA" 
                                color="#C53030"
                                onClick={onDeleteTransaction}
                                isLoading={isDeleting}
                            >
                                Delete
                            </Button>
                        ) : null }
                        <Button 
                            width="full" 
                            isLoading={isSaving || isDeleting} 
                            bg="#EAD9BF" 
                            color="#8F611B"
                            onClick={handleSave}
                        >
                            Save
                        </Button>  
                    </Flex>
                </DrawerFooter>
            </DrawerContent>
            { isDeleteModalOpen ? (
                <DeleteConfirmation 
                    isOpen={isDeleteModalOpen} 
                    isDeleting={isDeleting}
                    onClose={() => setIsDeleteModalOpen(false)} 
                    onDelete={async () => {
                        await handleDelete(newTransaction);
                        setIsDeleteModalOpen(false);
                        handleDrawerClose();
                    }}
                />
            ) : null }
        </Drawer>
    )
}