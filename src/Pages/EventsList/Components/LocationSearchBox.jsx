import { useState, useEffect } from "react";
import AsyncSelect from 'react-select/async';
import { components } from 'react-select';
import { useDebounce } from '../../../hooks/useDebounce';
import { Box } from '@chakra-ui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLocationDot } from '@fortawesome/free-solid-svg-icons';

export const LocationSearchBox = ({ onSelectLocation, currentLocation, editMode }) => {
    const [searchInput, setSearchInput] = useState(currentLocation);
    const [displayInput, setDisplayInput] = useState(currentLocation);
    const debouncedSearch = useDebounce(searchInput, 500);
    const [results, setResults] = useState([]);

    const handleOnSelectLocation = (location) => {
        setDisplayInput(location.label);
        setResults([]);
        if (onSelectLocation) {
            onSelectLocation(location);
        }
    };

    const fetchAutocomplete = async (search) => {
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("X-Goog-Api-Key", "AIzaSyA7qFAV9taIxXIbzm2rnrdNOlnFBtHSp-8");

        const raw = JSON.stringify({
            "input": search
        });

        const requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: raw,
            redirect: "follow"
        };

        const url = "https://places.googleapis.com/v1/places:autocomplete";
        try {
            const response = await fetch(url, requestOptions);
            const data = await response.json();
            setResults(data.suggestions ?? []);
        } catch (error) {
            console.error('Error fetching autocomplete results:', error);
            setResults([]);
        }
    };

    useEffect(() => {
        if (debouncedSearch) {
            fetchAutocomplete(debouncedSearch);
        } else {
            setResults([]);
        }
    }, [debouncedSearch]);

    const loadOptions = (inputValue, callback) => {
        fetchAutocomplete(inputValue).then(() => {
            console.log(results);
            const options = results.map((result) => ({
                label: result.placePrediction.text.text,
                value: result.placePrediction.placeId
            }));
            callback(options);
        });
    };

    return (
        <Box width="100%" minW={0}>
            <AsyncSelect
                cacheOptions
                loadOptions={loadOptions}
                onInputChange={(value) => setSearchInput(value)}
                onChange={handleOnSelectLocation}
                placeholder="Search for locations..."
                defaultInputValue={displayInput}
                menuPortalTarget={typeof document !== 'undefined' ? document.body : null}
                menuPosition="fixed"
                components={{
                    DropdownIndicator: editMode
                        ? null // Do not render the dropdown indicator in edit mode
                        : (props) => (
                            <components.DropdownIndicator {...props}>
                                <FontAwesomeIcon icon={faLocationDot} style={{ padding: '0 8px' }} />
                            </components.DropdownIndicator>
                        ),
                }}
                styles={{
                    container: (provided) => ({ ...provided, width: '100%', minWidth: 0 }),
                    control: (provided) => ({
                        ...provided,
                        width: '100%',
                        padding: '4px',
                        boxShadow: 'none',
                        borderColor: 'lightgray',
                        ':hover': { borderColor: 'gray' },
                    }),
                    valueContainer: (provided) => ({ ...provided, flexWrap: 'nowrap', overflow: 'hidden', minWidth: 0 }),
                    singleValue: (provided) => ({ ...provided, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '100%' }),
                    input: (provided) => ({ ...provided, minWidth: 0 }),
                    menuPortal: (provided) => ({ ...provided, zIndex: 60 }),
                    menu: (provided) => ({ ...provided, zIndex: 60 }),
                    option: (provided) => ({ ...provided, whiteSpace: 'normal', wordBreak: 'break-word' }),
                    indicatorSeparator: () => ({ display: 'none' }),
                }}
            />
        </Box>
    );
};