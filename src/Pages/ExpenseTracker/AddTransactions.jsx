import {
    Box,
    Button,
    Drawer,
    DrawerBody,
    DrawerFooter,
    DrawerOverlay,
    DrawerContent,
    Input,
    Flex,
    HStack,
    Text,
    FormControl,
    FormErrorMessage,
} from '@chakra-ui/react';
import Select from 'react-select';
import { useState, useCallback, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDeleteLeft, faPlus, faMultiply, faEquals } from '@fortawesome/free-solid-svg-icons';


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
    const [expression, setExpression] = useState("");
    const CALCULATOR_BUTTON_RADIUS = "16px";

    useEffect(() => {
        if (transactionToEdit) {
            setNewTransaction(transactionToEdit);
            setExpression(transactionToEdit.amount.toString());
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

    const evaluateExpression = useCallback((currentExpression) => {
        try {
            const sanitisedExpression = currentExpression.replace(/x/g, '*');
            const result = new Function(`return ${sanitisedExpression}`)();
            setExpression(result.toFixed(2).toString());
        } catch (error) {
            setErrors(prev => ({
                ...prev,
                amount: 'Invalid expression'
            }));
        }
    }, [])

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

    const handleExpressionChange = useCallback((value) => {
        const isValidValue = /^(\d+(\.\d{0,2})?)(\+(\d+(\.\d{0,2})?))*$/.test(value);
        setExpression(value.toString());
        if (isValidValue) {
            setErrors(prev => ({
                ...prev,
                amount: null
            }))
        }
    }, [])

    const handleButtonClick = useCallback((number) => {
        let newExpression 
        if (number === "=") {
            evaluateExpression(expression);
            return;
        } else if (number === "backspace") {
            newExpression = expression.slice(0, -1);
        } else {
            newExpression = expression + number;
        }
        handleExpressionChange(newExpression)
    }, [expression, handleExpressionChange, evaluateExpression])

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name === "amount") {
            handleExpressionChange(value);
            return
        }
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

    const handleClose = useCallback(() => {
        setExpression("");
        setNewTransaction({})
        setErrors({});
        handleDrawerClose();
    }, [handleDrawerClose]);

    const handleSave = useCallback(async () => {
        const newErrors = {};
        if (!expression.length) {
            newErrors.amount = 'Please key in an amount';
        }
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
            newErrors.account = 'Account is required';
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        newTransaction.amount = parseFloat(expression);
        if (transactionToEdit) {
            await updateTransaction(newTransaction);
        } else {
            await addTransaction(newTransaction);
        }
        handleClose();
    }, [expression, newTransaction, transactionToEdit, handleClose, updateTransaction, addTransaction]);

    const onDeleteTransaction = useCallback(() => {
        setIsDeleteModalOpen(true);
    }, []);

    return (
        <Drawer autoFocus={false} isOpen={isDrawerOpen} placement="bottom" onClose={handleClose}>
            <DrawerOverlay />
            <DrawerContent borderTopRadius={"16px"}>
                <DrawerBody mt="25px">
                    <FormControl mt={4} isInvalid={errors.date}>
                        <Input
                            name="date" 
                            type="date" 
                            value={newTransaction.date || ''} onChange={handleInputChange} 
                        />
                        { errors.date && <FormErrorMessage>{errors.date}</FormErrorMessage> }
                    </FormControl>
                    <HStack mt="12px" spacing={4} justify="space-between">
                        <FormControl flex="1" isInvalid={errors.account}>
                            <Select
                                onChange={(selectedOption) => handleSelectInputChange(selectedOption, 'account')}
                                options={accountsConfig.map(name => ({ value: name, label: name }))}
                                isClearable={true}
                                styles={customSelectStyles(errors.account)}
                                value={newTransaction.account ? { value: newTransaction.account, label: newTransaction.account } : null}
                                isSearchable={false}
                                placeholder="Account..."
                            />
                            { errors.account && <FormErrorMessage>{errors.account}</FormErrorMessage> }

                        </FormControl>
                        <FormControl flex="1" isInvalid={errors.account}>
                            <Select
                                name="category" 
                                onChange={(selectedOption) => handleSelectInputChange(selectedOption, 'category')}
                                options={expensesConfig.map(name => ({ value: name, label: name }))}
                                isClearable={true}
                                value={newTransaction.category ? { value: newTransaction.category, label: newTransaction.category } : null}
                                styles={customSelectStyles(errors.category)}
                                isSearchable={false}
                                maxMenuHeight={200}
                                placeholder="Category..."
                            />
                            { errors.category && <FormErrorMessage>{errors.category}</FormErrorMessage> }
                        </FormControl>
                    </HStack>

                    <Flex flexDir="column" justifyContent="center" alignItems="center" my="16px" gap="12px">
                        <Text fontSize="16px" color="gray">
                            Expenses
                        </Text>
                        <Flex gap="6px" alignItems="center" paddingLeft="30%">
                            <Text display="inline" color="gray" fontSize="24px">$</Text>
                            <Input 
                                type="text"
                                value={expression || ''} 
                                onChange={handleInputChange} 
                                name="amount" 
                                placeholder='0.00'
                                border="none"
                                _placeholder={{
                                    color: "black",
                                    fontWeight: "bold",
                                    fontSize: "36px",
                                }}
                                _focus={{
                                    outline: "none", // Removes the default outline
                                    boxShadow: "none",// Removes any shadow that might be applied on focus
                                }}
                                color="black"
                                fontSize="36px"
                                fontWeight="bold"
                            />
                        </Flex>
                        { errors.amount && <Text color="red" fontSize="16px">{errors.amount}</Text> }
                        <Input 
                            width="80%"
                            value={newTransaction.title || ''} 
                            onChange={handleInputChange} 
                            name="title" 
                            placeholder="Add a title..."
                            border="none"
                            _placeholder={{
                                color: "black",
                                fontWeight: "bold",
                                textAlign: "center"
                            }}
                            _focus={{
                                outline: "none", // Removes the default outline
                                boxShadow: "none",// Removes any shadow that might be applied on focus
                                _placeholder: {
                                    color: "transparent", // Hides the placeholder on focus
                                },
                            }}
                            color="black"
                            fontSize="18px"
                            textAlign="center"
                        />
                        { errors.title && <Text color="red" fontSize="16px">{errors.title}</Text> }
                    </Flex>
                    <Flex gap="4px">
                        <Box flex="3">
                            <Flex flexWrap="wrap" gap="4px">
                                {[...Array(9).keys()].map(number => (
                                    <Button
                                        key={number + 1}
                                        onClick={() => handleButtonClick((number + 1).toString())}
                                        size="lg"
                                        colorScheme="gray"
                                        borderRadius={CALCULATOR_BUTTON_RADIUS}
                                        flex={"1 1 calc(33.333% - 4px)"}
                                    >
                                        {number + 1}
                                    </Button>
                                ))}
                            </Flex>
                            <Flex flexWrap="wrap" gap="4px" mt="2px">
                                <Button
                                    key="button-0"
                                    onClick={() => handleButtonClick("0")}
                                    size="lg"
                                    colorScheme="gray"
                                    borderRadius={CALCULATOR_BUTTON_RADIUS}
                                    flex={"1 1 calc(66.666% - 4px)"}
                                >
                                    {"0"}
                                </Button>
                                <Button
                                    key="button-dot"
                                    onClick={() => handleButtonClick(".")}
                                    size="lg"
                                    colorScheme="gray"
                                    borderRadius={CALCULATOR_BUTTON_RADIUS}
                                    flex={"1 1 calc(33.333% - 4px)"}
                                >
                                    {"."}
                                </Button>
                            </Flex>
                        </Box>
                        
                        <Flex flex="1" flexDir="column" gap="4px">
                            <Button
                                size="lg"
                                colorScheme="gray"
                                width={"100%"}
                                borderRadius={CALCULATOR_BUTTON_RADIUS}
                                onClick={() => handleButtonClick("backspace")}
                            >
                                <FontAwesomeIcon icon={faDeleteLeft} />
                            </Button>
                            <Button
                                size="lg"
                                colorScheme="gray"
                                width={"100%"}
                                borderRadius={CALCULATOR_BUTTON_RADIUS}
                                onClick={() => handleButtonClick("+")}
                            >
                                <FontAwesomeIcon icon={faPlus} />
                            </Button>
                            <Button
                                size="lg"
                                colorScheme="gray"
                                width={"100%"}
                                borderRadius={CALCULATOR_BUTTON_RADIUS}
                                onClick={() => handleButtonClick("x")}
                            >
                                <FontAwesomeIcon icon={faMultiply} />
                            </Button>
                            <Button
                                size="lg"
                                colorScheme="gray"
                                width={"100%"}
                                borderRadius={CALCULATOR_BUTTON_RADIUS}
                                onClick={() => handleButtonClick("=")}
                            >
                                <FontAwesomeIcon icon={faEquals} />
                            </Button>
                        </Flex>
                    </Flex>
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