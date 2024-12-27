import { 
    Box, 
    Flex, 
    Text,
} from '@chakra-ui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faPlane, 
    faBowlFood, 
    faMoneyBill, 
    faCartShopping, 
    faBasketShopping,
    faUser 
} from '@fortawesome/free-solid-svg-icons';
import { EmptyWallet } from '../../Icons/EmptyWallet'


const NoTransactions = () => {
    return (
        <Flex alignItems="center" justifyContent="center" flexDir="column" p="20px" height="full">
            <EmptyWallet height="100px" width="100px" />
            <Text mt="12px" fontSize="16px" color="gray">You have no transaction on this day</Text>
        </Flex>
    )
}

export const Transactions = ({ transactions, onEdit }) => {
    // transaction.category includes (meal, travel, shopping, utilities, other)
    const iconMapping = {
        meal: {
            background: "#DBE1FF",
            icon: faBowlFood
        },
        travel: {
            background: "#DBF8FF",
            icon: faPlane
        },
        shopping: {
            background: "#FFDBF6",
            icon: faCartShopping
        },
        utilities: {
            background: "#E2FFDB",
            icon: faMoneyBill
        },
        other: {
            background: "#FFEEDB",
            icon: faUser
        },
        grocery: {
            background: "#63e6be",
            icon: faBasketShopping
        }
    }

    return (
        <Box padding="10px 30px">
            <Text fontWeight="600" fontSize="16px" textAlign="left" mb="16px">Transactions</Text>
            <Box height="300px" overflowY="auto">
                { transactions.length ? (
                    <Box>
                        { transactions.map((transaction, index) => {
                            return (
                                <Flex key={index} bg="#FFF0DA" p="10px" borderRadius="10px" alignItems="center" justifyContent="space-between" mb="10px" onClick={() => onEdit(transaction)}>
                                    <Flex alignItems="center" gap="10px" maxW="70%">
                                        <Box bg={iconMapping[transaction.category]?.background || iconMapping.other.background} p="15px" borderRadius="16px">
                                            <FontAwesomeIcon icon={iconMapping[transaction.category]?.icon || iconMapping.other.icon} size="xl" />
                                        </Box>
                                        <Box maxW="60%">
                                            <Text isTruncated fontWeight="600" fontSize="16px">{transaction.title}</Text>
                                            <Text color="gray" fontSize="14px" textAlign="left" textTransform="capitalize">{ transaction.category }</Text>
                                        </Box>
                                    </Flex>
                                    <Box>
                                        <Text fontWeight="600" textAlign="right" mr="10px">$ {Number.parseFloat(transaction.amount).toFixed(2)}</Text>
                                    </Box>
                                </Flex>
                            )
                        }) }
                    </Box>
                )  : <NoTransactions /> }
            </Box>
        </Box>
    )
}