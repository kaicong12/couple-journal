import { 
    Box,
    Image, 
    Text,
    Icon
} from '@chakra-ui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLocationDot, faCalendar } from '@fortawesome/free-solid-svg-icons';
import { convertFbTimestampToDate } from '../../../utils'

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
                <Icon as={FontAwesomeIcon} icon={faLocationDot} />
                <Text isTruncated maxWidth="80%" color="#49516F">
                    {event.location}
                </Text>
            </Box>
            <Box mt="2" display="flex" alignItems="center" justifyContent="center" gap="4px">
                <Icon as={FontAwesomeIcon} icon={faCalendar} />
                <Text color="#49516F">
                    { convertFbTimestampToDate(event.date) }
                </Text>
            </Box>
        </Box>
    </Box>
);