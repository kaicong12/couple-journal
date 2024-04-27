import { useEffect, useState, useCallback, useMemo } from "react"
import { 
    Box,
    SimpleGrid,
    Spinner,
    Text,
    useDisclosure,
} from '@chakra-ui/react';
import Fuse from 'fuse.js';
import { AddEventModal } from "./Components/AddEventModal";
import { SearchFilter } from "./Components/SearchFilter"
import { EventCard } from "./Components/EventCard";
import { EventModal } from "./Components/EventModal";
import { getEvents, uploadEvent } from "../../db";


const EventPage = () => {
    const defaultEventData = {
        title: '',
        description: '',
        dateTime: null,
        category: '',
        rating: 3,
    }

    const [newEvent, setNewEvent] = useState(defaultEventData)
    const [eventData, setEventData] = useState([])
    const [isLoading, setIsLoading] = useState(false);
    const [category, setCategory] = useState('')
    const [searchTerm, setSearchTerm] = useState('')
    const [debouncedSearch, setDebouncedSearch] = useState(searchTerm)
    
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
            // Keys to search in each event object
            keys: ['title', 'description', 'pros', 'cons'],
            includeScore: true, // Include the score of how each item matched the search
            threshold: 0.4,    // Adjust this for more or less strictness
        };
    
        const fuse = new Fuse(events, options);
        return fuse.search(query).map(result => result.item);
    }, [])

    const filteredEventData = useMemo(() => {
        if (debouncedSearch && debouncedSearch.length) {
            return fuzzySearchEvents(eventData, debouncedSearch)
        }
        
        return eventData
    }, [debouncedSearch, eventData, fuzzySearchEvents])

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

    useEffect(() => {
        const searchTimeout = setTimeout(() => {
            setDebouncedSearch(searchTerm)
        }, 500)

        return () => {
            clearTimeout(searchTimeout)
        }
    }, [searchTerm])

    return (
        <Box background="brown.50">
            <SearchFilter
                onAddModalOpen={onAddModalOpen}
                onSearchEvent={onSearchEvent}
                onSelectCategory={onSelectCategory} 
            />
            { isLoading ? <Spinner size="xl" /> : (
                <Box>
                    <Text mt="5" mb="4">{`Showing Events for: ${category.length ? category : 'All'}`}</Text>
                    <SimpleGrid columns={{ sm: 2, md: 3 }} spacing="40px" p="5">
                        {filteredEventData.map(event => (
                            <EventCard key={event.id} event={event} onOpen={() => handleCardClick(event)} />
                        ))}
                    </SimpleGrid>
                    {selectedEvent && (
                        <EventModal event={selectedEvent} isOpen={isOpen} onClose={onClose} />
                    )}
                    <AddEventModal 
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