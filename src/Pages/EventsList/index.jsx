import { useEffect, useState, useCallback, useMemo } from "react"
import { 
    forwardRef,
    Box,
    SimpleGrid,
    Spinner,
    Text,
    Button,
    ButtonGroup,
    Menu,
    MenuButton,
    MenuList,
    MenuOptionGroup,
    MenuItemOption,
    HStack,
    VStack,
    Input,
    Popover,
    PopoverTrigger,
    PopoverContent,
    PopoverBody,
    PopoverArrow,
    useDisclosure,
} from '@chakra-ui/react';

import Fuse from 'fuse.js';
import { useDebounce } from "../../hooks/useDebounce";
import { useModalParams } from "../../hooks/useModalParams";
import { AddEventModal } from "./Components/AddEventModal";
import { SearchFilter } from "./Components/SearchFilter"
import { EventCard } from "./Components/EventCard";
import { EventModal } from "./Components/EventModal";
import { EmptySearchState } from "./Components/EmptyState";
import { getEvents, uploadEvent, deleteEvent, updateEvent } from "../../db";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faBowlFood, 
    faCalendar,
    faPlane, 
    faGift, 
    faList, 
    faX,
    faSort
} from '@fortawesome/free-solid-svg-icons';


const FilterButton = forwardRef((props, ref) => {
    const { rightIcon, buttontext } = props
    return (
        <Button {...props} rightIcon={rightIcon} ref={ref}>
            { buttontext }
        </Button>
    )
})

const EventPage = () => {
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
            'Name (Z to Z)',
        ]
    }, [])

    const [eventSort, setEventSort] = useState('Date (Latest To Oldest)')
    const [newEvent, setNewEvent] = useState(defaultEventData)
    const [eventData, setEventData] = useState([])
    const [isLoading, setIsLoading] = useState(false);
    const [selectedCategories, setSelectedCategories] = useState([])
    const [searchTerm, setSearchTerm] = useState('')
    const debouncedSearch = useDebounce(searchTerm, 500)

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;
    
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { isOpen: isAddModalOpen, onOpen: onAddModalOpen, onClose: onAddModalClose } = useDisclosure();
    const [selectedEvent, setSelectedEvent] = useState(null);
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
                if (!selectedCategories.length) {
                    return true
                } else {
                    return selectedCategories.includes(event.category)
                }
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

    const onSelectCategory = (categories) => {
        setSelectedCategories(categories)
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

    const handleDeactivateDateFilter = (e) => {
        e.stopPropagation()
        closeDateFilter(true);
    };

    // Generate the page numbers to display
    const pageNumbersToShow = 5; // Number of page buttons to display
    const startPage = Math.max(1, currentPage - Math.floor(pageNumbersToShow / 2));
    const endPage = Math.min(totalPages, startPage + pageNumbersToShow - 1);
    const hasActiveCategories = selectedCategories.length

    return (
        <Box minH="calc(100vh - 80px)" background="brown.50" width="100vw">
            <SearchFilter
                onAddModalOpen={onAddModalOpen}
                onSearchEvent={onSearchEvent}
            />
            
            <Box>
                {isLoading ? (
                    <Box  minH="calc(100vh - 80px)" display="flex" justifyContent="center" alignItems="center">
                        <Spinner position="relative" top="-100px" size="xl" /> 
                    </Box>
                ) : (
                    <Box overflow="auto">
                        <ButtonGroup display="flex" mt="10px" px="20px">
                            <Popover isOpen={isDateFilterOpen} onClose={closeDateFilter} placement="bottom-end">
                                <PopoverTrigger>
                                    <FilterButton 
                                        buttontext={'Date'}
                                        onClick={() => { openDateFilter(dateFilterParam) }}
                                        bg={dateFilterParam?.dateFilterApplied ? '#8F611B' : '#EAD9BF' }
                                        color={dateFilterParam?.dateFilterApplied ? 'white' : '#8F611B'}
                                        leftIcon={<FontAwesomeIcon icon={faCalendar} />}
                                        rightIcon={dateFilterParam?.dateFilterApplied && <FontAwesomeIcon icon={faX} onClick={(e) => handleDeactivateDateFilter(e) } />}
                                    />
                                </PopoverTrigger>
                                <PopoverContent>
                                    <PopoverArrow />
                                    <PopoverBody>
                                        <VStack spacing="4" py="12px">
                                            <HStack>
                                                <Text>Start Date:</Text>
                                                <Input 
                                                    type="date" 
                                                    value={dateFilterParam?.startDate || ''} 
                                                    onChange={(e) => updateDateFilterParam({ ...dateFilterParam, startDate: e.target.value, dateFilterApplied: true })} 
                                                />
                                            </HStack>
                                            <HStack>
                                                <Text>End Date:</Text>
                                                <Input 
                                                    type="date" 
                                                    value={dateFilterParam?.endDate || ''} 
                                                    onChange={(e) => updateDateFilterParam({ ...dateFilterParam, endDate: e.target.value, dateFilterApplied: true })} 
                                                />
                                            </HStack>
                                        </VStack>
                                    </PopoverBody>
                                </PopoverContent>
                            </Popover>
                            <Menu>
                                <MenuButton
                                    as={FilterButton}
                                    buttontext={'Sort By'}
                                    bg='#EAD9BF'
                                    color='#8F611B'
                                    leftIcon={<FontAwesomeIcon icon={faSort} />}
                                >
                                </MenuButton>
                                <MenuList>
                                    <MenuOptionGroup defaultValue={eventSort} onChange={(value) => { setEventSort(value) }}>
                                        {sortOptions.map(sortOpt => (
                                            <MenuItemOption 
                                                key={sortOpt} 
                                                value={sortOpt}
                                            >
                                                <Box display="flex" gap="10px" alignItems="center">
                                                    <Text>{ sortOpt }</Text>
                                                </Box>
                                            </MenuItemOption>
                                        ))}
                                    </MenuOptionGroup>
                                </MenuList>
                            </Menu>
                            <Menu closeOnSelect={false}>
                                <MenuButton
                                    as={FilterButton}
                                    buttontext={'Category'}
                                    bg={hasActiveCategories ? '#8F611B' : '#EAD9BF' }
                                    color={hasActiveCategories ? 'white' : '#8F611B'}
                                    leftIcon={<FontAwesomeIcon icon={faList} />}
                                >
                                </MenuButton>
                                <MenuList>
                                    <MenuOptionGroup onChange={(value) => { onSelectCategory(value) }} type="checkbox">
                                        {menuLists.map(menu => (
                                            <MenuItemOption 
                                                isChecked={selectedCategories.includes(menu.label)}
                                                key={menu.label} 
                                                value={menu.label}
                                            >
                                                <Box display="flex" gap="10px" alignItems="center">
                                                    { menu.leftIcon }
                                                    <Text>{ menu.label }</Text>
                                                </Box>
                                            </MenuItemOption>
                                        ))}
                                    </MenuOptionGroup>
                                </MenuList>
                            </Menu>
                        </ButtonGroup>

                        {currentEvents.length ? (
                            <Box>
                                <SimpleGrid columns={{ sm: 2, md: 3 }} spacing="10px" p="10px" justifyItems="center" alignItems="center">
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
            </Box>
        </Box>
    )
}

export default EventPage
