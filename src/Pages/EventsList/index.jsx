import { useEffect, useState, useCallback, useMemo } from "react"
import { useNavigate } from "react-router-dom";
import {
    Box,
    Spinner,
    Button,
    ButtonGroup,
    useDisclosure,
} from '@chakra-ui/react';

import Fuse from 'fuse.js';
import { useDebounce } from "../../hooks/useDebounce";
import { useModalParams } from "../../hooks/useModalParams";
import { AddEventModal } from "./Components/AddEventModal";
import { SearchFilter } from "./Components/SearchFilter"
import { FilterPanel } from "./Components/FilterPanel"
import { EventCard } from "./Components/EventCard";
import { EmptySearchState } from "./Components/EmptyState";
import { getEvents, uploadEvent } from "../../db";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faBowlFood,
    faPlane,
    faGift,
} from '@fortawesome/free-solid-svg-icons';


const EventPage = () => {
    const navigate = useNavigate();
    const defaultEventData = {
        title: '',
        description: '',
        category: null,
        date: null,
    }

    const menuLists = useMemo(() => {
        return [
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

    const sortOptions = useMemo(() => {
        return [
            'Date (Latest To Oldest)',
            'Date (Oldest To Latest)',
            'Name (A to Z)',
            'Name (Z to A)',
        ]
    }, [])

    const [eventSort, setEventSort] = useState('Date (Latest To Oldest)')
    const [newEvent, setNewEvent] = useState(defaultEventData)
    const [eventData, setEventData] = useState([])
    const [isLoading, setIsLoading] = useState(false);
    const [selectedCategories, setSelectedCategories] = useState([])
    const [searchTerm, setSearchTerm] = useState('')
    const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false)
    const debouncedSearch = useDebounce(searchTerm, 500)

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;

    const { isOpen: isAddModalOpen, onOpen: onAddModalOpen, onClose: onAddModalClose } = useDisclosure();
    const [isDateFilterOpen, dateFilterParam, openDateFilter, closeDateFilter, updateDateFilterParam] = useModalParams();

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
        setCurrentPage(1)
        let filteredResults = eventData

        if (debouncedSearch && debouncedSearch.length) {
            filteredResults = fuzzySearchEvents(eventData, debouncedSearch)
        }

        if (selectedCategories.length) {
            filteredResults = filteredResults.filter(event => {
                const eventCats = event.categories?.length
                    ? event.categories
                    : (event.category ? [event.category] : [])
                return eventCats.some(c => selectedCategories.includes(c))
            })
        }

        const hasDateRange = dateFilterParam?.startDate || dateFilterParam?.endDate
        if (hasDateRange) {
            const paramStartDate = new Date(dateFilterParam?.startDate)
            const paramEndDate =  new Date(dateFilterParam?.endDate)

            filteredResults = filteredResults.filter(event => {
                const fbTimestampDate = event.date.toDate()
                if (dateFilterParam.startDate && fbTimestampDate < paramStartDate) {
                    return false;
                }
                if (dateFilterParam.endDate && fbTimestampDate > paramEndDate) {
                    return false;
                }
                return true;
            });
        }

        const sortedFilteredResults = filteredResults.sort((a, b) => {
            if (eventSort === 'Date (Latest To Oldest)') {
                return b.date - a.date
            } else if (eventSort === 'Date (Oldest To Latest)') {
                return a.date - b.date
            } else if (eventSort === 'Name (A to Z)') {
                return a.title.localeCompare(b.title)
            } else {
                return b.title.localeCompare(a.title)
            }
        })

        return sortedFilteredResults
    }, [eventData, debouncedSearch, selectedCategories, dateFilterParam, fuzzySearchEvents, eventSort])

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

    const onSelectCategory = (categories) => {
        setSelectedCategories(categories)
    }

    const onSearchEvent = (e) => {
        setSearchTerm(e.target.value)
    }

    const handleCardClick = (event) => {
        navigate(`/events/${event.id}`, { state: { event } });
    };

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    const handleDeactivateDateFilter = () => {
        closeDateFilter(true);
    };

    // Generate the page numbers to display
    const pageNumbersToShow = 3; // Number of page buttons to display
    const startPage = Math.max(1, currentPage - Math.floor(pageNumbersToShow / 2));
    const endPage = Math.min(totalPages, startPage + pageNumbersToShow - 1);

    const hasActiveFilters = selectedCategories.length > 0 ||
        dateFilterParam?.dateFilterApplied ||
        eventSort !== 'Date (Latest To Oldest)'

    return (
        <Box minH="calc(100vh - 80px)" background="brown.50" width="100vw">
            <Box position="relative">
                <SearchFilter
                    onAddModalOpen={onAddModalOpen}
                    onSearchEvent={onSearchEvent}
                    hasActiveFilters={hasActiveFilters}
                    isFilterOpen={isFilterPanelOpen}
                    onToggleFilterPanel={() => setIsFilterPanelOpen(prev => !prev)}
                />

                <FilterPanel
                    isOpen={isFilterPanelOpen}
                    onClose={() => setIsFilterPanelOpen(false)}
                    eventSort={eventSort}
                    setEventSort={setEventSort}
                    sortOptions={sortOptions}
                    selectedCategories={selectedCategories}
                    onSelectCategory={onSelectCategory}
                    menuLists={menuLists}
                    dateFilterParam={dateFilterParam}
                    updateDateFilterParam={updateDateFilterParam}
                    handleDeactivateDateFilter={handleDeactivateDateFilter}
                />
            </Box>

            <Box>
                {isLoading ? (
                    <Box  minH="calc(100vh - 80px)" display="flex" justifyContent="center" alignItems="center">
                        <Spinner position="relative" top="-100px" size="xl" />
                    </Box>
                ) : (
                    <Box overflow="auto">
                        {currentEvents.length ? (
                            <Box>
                                <Box
                                    display="grid"
                                    gridTemplateColumns={{ base: "1fr", md: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" }}
                                    gap="20px"
                                    px="20px"
                                    pt="20px"
                                >
                                    {currentEvents.map(event => (
                                        <EventCard key={event.id} event={event} onOpen={() => handleCardClick(event)} />
                                    ))}
                                </Box>

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
        </Box>
    )
}

export default EventPage
