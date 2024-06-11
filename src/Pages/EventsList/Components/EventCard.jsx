import { 
    Box,
    Image, 
    Text,
    HStack,
} from '@chakra-ui/react';
import { StarIcon } from '@chakra-ui/icons';
import LocationIcon from '../../../Icons/Location.svg'


export const EventCard = ({ event, onOpen }) => (
    <Box 
        width="sm" 
        borderWidth="1px" 
        borderRadius="lg" 
        overflow="hidden" 
        onClick={onOpen} 
        p="16px" 
        background="#D9D9D9"
        display="flex"
        flexDir="column"
        alignItems="center"
    >
        <Image 
            src={event.thumbnail || 'https://via.placeholder.com/150'} 
            alt={`Thumbnail for ${event.title}`}
            fit="cover"
            width="300px"
            height="300px"
        />
        <Box padding="6px 6px 0 6px">
            <HStack mt="2" display="flex" justifyContent="center">
                {Array(5)
                .fill("")
                .map((_, i) => (
                    <StarIcon key={i} color={i < Math.floor(event.rating) ? "#ffc107" : "#e4e5e9" } />
                ))}
            </HStack>
            <Box mt="2" d="flex" alignItems="baseline">
                <Box
                    color="#49516F"
                    fontWeight="semibold"
                    letterSpacing="wide"
                    textTransform="capitalize"
                    ml="2"
                >
                    {event.title}
                </Box>
            </Box>
            <Box mt="2" display="flex" alignItems="center" justifyContent="center" gap="4px">
                <LocationIcon fill="#49516F" />
                <Text color="#49516F">
                    {event.location}
                </Text>
            </Box>
        </Box>
    </Box>
);