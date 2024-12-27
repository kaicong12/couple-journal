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

import { useState, useCallback } from 'react';

export const AddTransactions = ({ 
    isSaving,
    expensesConfig,
    accountsConfig,
    isDrawerOpen, 
    addTransaction, 
    handleDrawerClose 
}) => {
    const [newTransaction, setNewTransaction] = useState({})

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

        await addTransaction(newTransaction);
        handleClose();
    }, [newTransaction, addTransaction, handleClose]);

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
                                <Input name="date" type="date" onChange={handleInputChange} />
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
                                <Input type="number" onChange={handleInputChange} name="amount" placeholder='E.g. 50'/>
                                { errors.amount && <FormErrorMessage>{errors.amount}</FormErrorMessage> }
                            </Box>
                        </Flex>
                    </FormControl>
                    <FormControl mt={4} isInvalid={errors.title}>
                        <Flex alignItems="center">
                            <FormLabel width="25%">Title</FormLabel>
                            <Box width="75%">
                                <Input onChange={handleInputChange} name="title" placeholder="E.g. Dinner at Tiong Bahru" />
                                { errors.title && <FormErrorMessage>{errors.title}</FormErrorMessage> }
                            </Box>
                        </Flex>
                    </FormControl>
                </DrawerBody>
                <DrawerFooter>
                    <Button 
                        width="full" 
                        isLoading={isSaving} 
                        bg="#EAD9BF" 
                        color="#8F611B"
                        onClick={handleSave}
                    >
                        Save
                    </Button>  
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    )
}