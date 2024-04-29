import { useEffect, useState, useCallback, useMemo } from "react"
import { 
    Box,
    SimpleGrid,
    Spinner,
    Text,
    useDisclosure,
} from '@chakra-ui/react';
import Fuse from 'fuse.js';
import { useDebounce } from "../../hooks/useDebounce";
import { AddEventModal } from "./Components/AddEventModal";
import { SearchFilter } from "./Components/SearchFilter"
import { EventCard } from "./Components/EventCard";
import { EventModal } from "./Components/EventModal";
import { getEvents, uploadEvent, deleteEvent, updateEvent } from "../../db";
import AllCategoryIcon from '../../Icons/AllCategory.svg'
import DiningIcon from '../../Icons/DiningIcon.svg'
import GiftIcon from '../../Icons/Gifts.svg'

import { FaPlaneDeparture } from "react-icons/fa";


const EventPage = () => {
    const defaultEventData = {
        title: '',
        description: '',
        category: '',
        rating: 3,
        date: Date.now(),
    }

    const menuLists = useMemo(() => {
        return [
            {
                leftIcon: <AllCategoryIcon />,
                label: "All"
            },
            {
                leftIcon: <DiningIcon />,
                label: "Meals"
            },
            {
                leftIcon: <GiftIcon />,
                label: "Gifts"
            },
            {
                leftIcon: <FaPlaneDeparture fontSize="20px" />,
                label: "Trips"
            }
        ]
    }, [])

    const [newEvent, setNewEvent] = useState(defaultEventData)
    const [eventData, setEventData] = useState([])
    const [isLoading, setIsLoading] = useState(false);
    const [category, setCategory] = useState('All')
    const [searchTerm, setSearchTerm] = useState('')
    const debouncedSearch = useDebounce(searchTerm, 500)
    
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { isOpen: isAddModalOpen, onOpen: onAddModalOpen, onClose: onAddModalClose } = useDisclosure();
    const [selectedEvent, setSelectedEvent] = useState(null);

    const fetchEvents = async () => {
        setIsLoading(true)
        
        try {
            const eventData = await getEvents('events')
            setEventData(eventData)
        } catch (error) {
            console.error('Error fetching events:', error);
        } finally {
            setIsLoading(false);
        }
    }

    const fuzzySearchEvents = useCallback((events, query) => {
        const options = {
            keys: ['title', 'description', 'category', 'location'],
            includeScore: true,
            threshold: 0.4,
        };
    
        const fuse = new Fuse(events, options);
        return fuse.search(query).map(result => result.item);
    }, [])

    const filteredEventData = useMemo(() => {
        let filteredResults = eventData

        if (debouncedSearch && debouncedSearch.length) {
            filteredResults = fuzzySearchEvents(eventData, debouncedSearch)
        }

        if (category !== 'All') {
            filteredResults = filteredResults.filter(event => event.category === category)
        }
        
        return filteredResults
    }, [category, debouncedSearch, eventData, fuzzySearchEvents])

    useEffect(() => {
        fetchEvents()
    }, [])

    const handleAddEvent = async (newEvent) => {
        setIsLoading(true);

        try {
            await uploadEvent(newEvent)
            await fetchEvents()
        } catch (err) {
            console.log(err)
        } finally {
            setNewEvent(defaultEventData)
            setIsLoading(false)
        }
        
        onAddModalClose();
    };

    const handleDeleteEvent = async (event) => {
        setIsLoading(true)

        try {
            await deleteEvent(event.id)
            await fetchEvents()
        } catch (err) {
            console.log(err, 'delete event failed')
        } finally {
            setIsLoading(false)
            onClose();
        }
    };

    const onSelectCategory = (label) => {
        setCategory(label)
    }

    const onSearchEvent = (e) => {
        setSearchTerm(e.target.value)
    }

    const handleCardClick = (event) => {
        setSelectedEvent(event);
        onOpen();
    };

    const handleUpdateEvent = async (event) => {
        setIsLoading(true)

        try {
            await updateEvent(event)
            await fetchEvents()
        } catch (err) {
            console.log(err, 'error updating event')
        } finally {
            handleCardClick(event)
        }
    }

    return (
        <Box background="brown.50" height="100%">
            <SearchFilter
                menuLists={menuLists}
                onAddModalOpen={onAddModalOpen}
                onSearchEvent={onSearchEvent}
                onSelectCategory={onSelectCategory} 
            />
            { isLoading ? (
                <Box height="calc(100vh - 200px)" display="flex" justifyContent="center" alignItems="center">
                    <Spinner size="xl" /> 
                </Box>
            ) : (
                <Box>
                    <Text>{`Showing Events for: ${category.length ? category : 'All'}`}</Text>
                    <SimpleGrid columns={{ sm: 2, md: 3 }} spacing="40px" p="10px" justifyItems="center" alignItems="center">
                        {filteredEventData.map(event => (
                            <EventCard key={event.id} event={event} onOpen={() => handleCardClick(event)} />
                        ))}
                    </SimpleGrid>
                    {selectedEvent && (
                        <EventModal 
                            handleDeleteEvent={handleDeleteEvent}
                            handleUpdateEvent={handleUpdateEvent}
                            event={selectedEvent} 
                            isOpen={isOpen} 
                            onClose={onClose} 
                        />
                    )}
                    <AddEventModal 
                        menuLists={menuLists}
                        newEvent={newEvent}
                        setNewEvent={setNewEvent}
                        isAddModalOpen={isAddModalOpen}
                        onAddModalClose={onAddModalClose}
                        handleAddEvent={handleAddEvent}
                    />
                </Box>
            )}
        </Box>
    )
}

export default EventPage