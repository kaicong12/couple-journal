import { useEffect, useState, useCallback, useMemo } from "react"
import { 
    Box,
    SimpleGrid,
    Spinner,
    Text,
    Button,
    ButtonGroup,
    useDisclosure,
} from '@chakra-ui/react';
import { motion, AnimatePresence } from 'framer-motion';
import Fuse from 'fuse.js';
import { useDebounce } from "../../hooks/useDebounce";
import { AddEventModal } from "./Components/AddEventModal";
import { SearchFilter } from "./Components/SearchFilter"
import { EventCard } from "./Components/EventCard";
import { EventModal } from "./Components/EventModal";
import { EmptySearchState } from "./Components/EmptyState";
import { SearchFood } from "./Components/FilterOptions"
import { getEvents, uploadEvent, deleteEvent, updateEvent } from "../../db";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBowlFood, faPlane, faGift, faHeart } from '@fortawesome/free-solid-svg-icons';

const MotionBox = motion(Box);

const EventPage = () => {
    const defaultEventData = {
        title: '',
        description: '',
        category: null,
        rating: 3,
        date: null,
    }

    const menuLists = useMemo(() => {
        return [
            {
                leftIcon: <FontAwesomeIcon icon={faHeart} />,
                label: "All"
            },
            {
                leftIcon: <FontAwesomeIcon icon={faBowlFood} />,
                label: "Meals"
            },
            {
                leftIcon: <FontAwesomeIcon icon={faGift} />,
                label: "Gifts"
            },
            {
                leftIcon: <FontAwesomeIcon icon={faPlane} />,
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

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;
    
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { isOpen: isAddModalOpen, onOpen: onAddModalOpen, onClose: onAddModalClose } = useDisclosure();
    const { isOpen: isFilterOpen, onOpen: onFilterOpen, onClose: onFilterClose } = useDisclosure();
    const [selectedEvent, setSelectedEvent] = useState(null);

    const toggleFilterOpen = () => {
        if (isFilterOpen) {
            onFilterClose()
        } else {
            onFilterOpen()
        }
    }

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

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentEvents = filteredEventData.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredEventData.length / itemsPerPage);

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

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    // Generate the page numbers to display
    const pageNumbersToShow = 5; // Number of page buttons to display
    const startPage = Math.max(1, currentPage - Math.floor(pageNumbersToShow / 2));
    const endPage = Math.min(totalPages, startPage + pageNumbersToShow - 1);

    return (
        <Box minH="calc(100vh - 80px)" background="brown.50" width="100vw">
            <SearchFilter
                onAddModalOpen={onAddModalOpen}
                onSearchEvent={onSearchEvent}
                onFilterClose={onFilterClose}
                toggleFilterOpen={toggleFilterOpen}
            />
            <Box position="relative">
                <AnimatePresence>
                    {isFilterOpen && (
                        <MotionBox
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            position="absolute"
                            width="100%"
                            height="100%"
                        >
                            <SearchFood 
                                menuLists={menuLists} 
                                selectedCategory={category} 
                                onSelectCategory={onSelectCategory}
                                onClose={onFilterClose} // Pass the onFilterClose function to SearchFood component
                            />
                        </MotionBox>
                    )}
                </AnimatePresence>
            </Box>
            
            <Box>
                <AnimatePresence>
                    { !isFilterOpen ? (
                        <MotionBox
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            {isLoading ? (
                                <Box display="flex" justifyContent="center" alignItems="center">
                                    <Spinner size="xl" /> 
                                </Box>
                            ) : (
                                <Box overflow="auto">
                                    {currentEvents.length ? (
                                        <Box>
                                            <Text>{`Showing Events for: ${category.length ? category : 'All'}`}</Text>
                                            <SimpleGrid columns={{ sm: 2, md: 3 }} spacing="40px" p="10px" justifyItems="center" alignItems="center">
                                                {currentEvents.map(event => (
                                                    <EventCard key={event.id} event={event} onOpen={() => handleCardClick(event)} />
                                                ))}
                                            </SimpleGrid>

                                            <ButtonGroup mt="4" padding="20px" display="flex" justifyContent="center">
                                                <Button bg="brown.200" onClick={() => handlePageChange(currentPage - 1)} isDisabled={currentPage === 1}>
                                                    Previous
                                                </Button>
                                                {Array.from({ length: endPage - startPage + 1 }, (_, i) => (
                                                    <Button
                                                        bg="brown.200"
                                                        key={i + startPage}
                                                        onClick={() => handlePageChange(i + startPage)}
                                                        isActive={currentPage === i + startPage}
                                                    >
                                                        {i + startPage}
                                                    </Button>
                                                ))}
                                                <Button bg="brown.200" onClick={() => handlePageChange(currentPage + 1)} isDisabled={currentPage === totalPages}>
                                                    Next
                                                </Button>
                                            </ButtonGroup>
                                        </Box>
                                    ) : <EmptySearchState />}
                                    {selectedEvent && (
                                        <EventModal 
                                            handleDeleteEvent={handleDeleteEvent}
                                            handleUpdateEvent={handleUpdateEvent}
                                            event={selectedEvent} 
                                            isOpen={isOpen} 
                                            onClose={onClose} 
                                            availableCategories={menuLists}
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
                        </MotionBox>
                    ) : null }
                </AnimatePresence>
            </Box>
        </Box>
    )
}

export default EventPage
