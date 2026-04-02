import { useEffect, useState } from 'react'
import {
    Box,
    Text,
    HStack,
} from '@chakra-ui/react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faBowlFood,
    faPlane,
    faGift,
} from '@fortawesome/free-solid-svg-icons'
import { ArrowDownUp, Calendar as CalendarIcon, Tag, X, ChevronDown } from 'lucide-react'
import { Calendar } from '@/components/ui/calendar'

export const FilterPanel = ({
    isOpen,
    onClose,
    // Sort
    eventSort,
    setEventSort,
    sortOptions,
    // Categories
    selectedCategories,
    onSelectCategory,
    menuLists,
    // Date
    dateFilterParam,
    updateDateFilterParam,
    handleDeactivateDateFilter,
}) => {
    const [showCalendar, setShowCalendar] = useState(false)

    // Build the date range object for the Calendar component
    const dateRange = {
        from: dateFilterParam?.startDate ? new Date(dateFilterParam.startDate) : undefined,
        to: dateFilterParam?.endDate ? new Date(dateFilterParam.endDate) : undefined,
    }

    const handleDateRangeSelect = (range) => {
        if (!range) {
            // User cleared the selection
            handleDeactivateDateFilter()
            return
        }
        const toDateStr = (d) => {
            if (!d) return ''
            const year = d.getFullYear()
            const month = String(d.getMonth() + 1).padStart(2, '0')
            const day = String(d.getDate()).padStart(2, '0')
            return `${year}-${month}-${day}`
        }
        updateDateFilterParam({
            ...dateFilterParam,
            startDate: toDateStr(range.from),
            endDate: toDateStr(range.to),
            dateFilterApplied: !!(range.from || range.to),
        })
    }

    // Reset calendar visibility when panel closes
    useEffect(() => {
        if (!isOpen) setShowCalendar(false)
    }, [isOpen])

    if (!isOpen) return null

    const handleBackdropClick = () => {
        onClose()
    }

    const categoryIcons = {
        Meals: faBowlFood,
        Gifts: faGift,
        Trips: faPlane,
    }

    const toggleCategory = (label) => {
        if (selectedCategories.includes(label)) {
            onSelectCategory(selectedCategories.filter(c => c !== label))
        } else {
            onSelectCategory([...selectedCategories, label])
        }
    }

    const hasDateFilter = dateFilterParam?.dateFilterApplied
    const hasAnyFilter = hasDateFilter || selectedCategories.length > 0 || eventSort !== 'Date (Latest To Oldest)'

    const clearAllFilters = () => {
        setEventSort('Date (Latest To Oldest)')
        onSelectCategory([])
        if (hasDateFilter) {
            handleDeactivateDateFilter()
        }
    }

    // Format date for display
    const formatDisplayDate = (dateStr) => {
        if (!dateStr) return null
        const d = new Date(dateStr)
        return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    }

    const startDisplay = formatDisplayDate(dateFilterParam?.startDate)
    const endDisplay = formatDisplayDate(dateFilterParam?.endDate)
    const dateLabel = startDisplay && endDisplay
        ? `${startDisplay} - ${endDisplay}`
        : startDisplay
            ? `From ${startDisplay}`
            : endDisplay
                ? `Until ${endDisplay}`
                : 'Select date range'

    return (
        <>
        {/* Backdrop overlay to prevent card interactions */}
        <Box
            position="fixed"
            top="0"
            left="0"
            right="0"
            bottom="0"
            zIndex="19"
            onClick={handleBackdropClick}
        />
        <Box
            position="absolute"
            top="100%"
            left="0"
            right="0"
            mt="8px"
            mx="20px"
            bg="white"
            borderRadius="4px"
            boxShadow="0 10px 40px -10px rgba(42, 37, 33, 0.12)"
            border="1px solid #E3D8CE"
            zIndex="20"
            overflow="hidden"
        >
            {/* Header */}
            <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                px="20px"
                py="14px"
                borderBottom="1px solid #F0EBE5"
            >
                <Text
                    fontSize="11px"
                    fontWeight="600"
                    letterSpacing="0.08em"
                    textTransform="uppercase"
                    color="#8E867E"
                >
                    Filters
                </Text>
                {hasAnyFilter && (
                    <Text
                        fontSize="12px"
                        color="#B48261"
                        cursor="pointer"
                        fontWeight="500"
                        onClick={clearAllFilters}
                        _hover={{ color: '#9A6A4E' }}
                    >
                        Clear all
                    </Text>
                )}
            </Box>

            {/* Sort Section */}
            <Box px="20px" py="16px" borderBottom="1px solid #F0EBE5">
                <HStack spacing="6px" mb="10px">
                    <ArrowDownUp size={13} color="#8E867E" />
                    <Text fontSize="11px" fontWeight="600" letterSpacing="0.06em" textTransform="uppercase" color="#8E867E">
                        Sort by
                    </Text>
                </HStack>
                <Box display="flex" flexWrap="wrap" gap="6px">
                    {sortOptions.map(opt => {
                        const isActive = eventSort === opt
                        return (
                            <Box
                                key={opt}
                                as="button"
                                onClick={() => setEventSort(opt)}
                                px="10px"
                                py="6px"
                                fontSize="13px"
                                borderRadius="4px"
                                border="1px solid"
                                borderColor={isActive ? '#B48261' : '#E3D8CE'}
                                bg={isActive ? '#B48261' : 'transparent'}
                                color={isActive ? 'white' : '#2A2521'}
                                fontWeight={isActive ? '500' : '400'}
                                cursor="pointer"
                                transition="all 0.15s ease"
                                _hover={{
                                    borderColor: '#B48261',
                                    bg: isActive ? '#9A6A4E' : '#FBF8F4',
                                }}
                            >
                                {opt}
                            </Box>
                        )
                    })}
                </Box>
            </Box>

            {/* Category Section */}
            <Box px="20px" py="16px" borderBottom="1px solid #F0EBE5">
                <HStack spacing="6px" mb="10px">
                    <Tag size={13} color="#8E867E" />
                    <Text fontSize="11px" fontWeight="600" letterSpacing="0.06em" textTransform="uppercase" color="#8E867E">
                        Category
                    </Text>
                </HStack>
                <Box display="flex" gap="6px">
                    {menuLists.map(menu => {
                        const isActive = selectedCategories.includes(menu.label)
                        return (
                            <Box
                                key={menu.label}
                                as="button"
                                onClick={() => toggleCategory(menu.label)}
                                display="flex"
                                alignItems="center"
                                gap="6px"
                                px="10px"
                                py="6px"
                                fontSize="13px"
                                borderRadius="4px"
                                border="1px solid"
                                borderColor={isActive ? '#B48261' : '#E3D8CE'}
                                bg={isActive ? '#B48261' : 'transparent'}
                                color={isActive ? 'white' : '#2A2521'}
                                fontWeight={isActive ? '500' : '400'}
                                cursor="pointer"
                                transition="all 0.15s ease"
                                _hover={{
                                    borderColor: '#B48261',
                                    bg: isActive ? '#9A6A4E' : '#FBF8F4',
                                }}
                            >
                                <FontAwesomeIcon
                                    icon={categoryIcons[menu.label]}
                                    style={{ fontSize: '12px', opacity: isActive ? 1 : 0.6 }}
                                />
                                {menu.label}
                            </Box>
                        )
                    })}
                </Box>
            </Box>

            {/* Date Range Section */}
            <Box px="20px" py="16px">
                <HStack spacing="6px" mb="10px" justifyContent="space-between">
                    <HStack spacing="6px">
                        <CalendarIcon size={13} color="#8E867E" />
                        <Text fontSize="11px" fontWeight="600" letterSpacing="0.06em" textTransform="uppercase" color="#8E867E">
                            Date Range
                        </Text>
                    </HStack>
                    {hasDateFilter && (
                        <Box
                            as="button"
                            onClick={handleDeactivateDateFilter}
                            display="flex"
                            alignItems="center"
                            gap="4px"
                            fontSize="12px"
                            color="#B48261"
                            cursor="pointer"
                            _hover={{ color: '#9A6A4E' }}
                        >
                            <X size={12} />
                            Clear
                        </Box>
                    )}
                </HStack>

                {/* Date range toggle button */}
                <Box
                    as="button"
                    onClick={() => setShowCalendar(prev => !prev)}
                    display="flex"
                    alignItems="center"
                    justifyContent="space-between"
                    width="100%"
                    px="12px"
                    py="8px"
                    fontSize="13px"
                    borderRadius="4px"
                    border="1px solid"
                    borderColor={hasDateFilter ? '#B48261' : '#E3D8CE'}
                    bg={hasDateFilter ? '#FBF8F4' : 'transparent'}
                    color={hasDateFilter ? '#2A2521' : '#8E867E'}
                    cursor="pointer"
                    transition="all 0.15s ease"
                    _hover={{ borderColor: '#B48261', bg: '#FBF8F4' }}
                >
                    <span>{dateLabel}</span>
                    <ChevronDown
                        size={14}
                        style={{
                            transition: 'transform 0.2s ease',
                            transform: showCalendar ? 'rotate(180deg)' : 'rotate(0deg)',
                        }}
                    />
                </Box>

                {/* Calendar */}
                {showCalendar && (
                    <Box
                        mt="10px"
                        display="flex"
                        justifyContent="center"
                    >
                        <Calendar
                            mode="range"
                            selected={dateRange.from ? dateRange : undefined}
                            onSelect={handleDateRangeSelect}
                            numberOfMonths={1}
                            className="!p-0"
                        />
                    </Box>
                )}
            </Box>
        </Box>
        </>
    )
}
