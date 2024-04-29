import { useState, useEffect } from "react"
import { useDebounce } from '../../../hooks/useDebounce'
import { 
    Input, 
    InputGroup,
    InputLeftElement,
    List, 
    ListItem,
    ListIcon, 
    Box 
} from '@chakra-ui/react';
import LocationIcon from '../../../Icons/Location.svg'
import { MdLocationOn } from 'react-icons/md';


export const LocationSearchBox = ({ onSelectLocation }) => {
    const [searchInput, setSearchInput] = useState('')
    const [displayInput, setDisplayInput] = useState('')
    const debouncedSearch = useDebounce(searchInput, 500)
    const [results, setResults] = useState([]);

    const handleOnSelectLocation = (location) => {
        setDisplayInput(location.text.text)
        setResults([]);
        if (onSelectLocation) {
            onSelectLocation(location);
        }
    }

    const fetchAutocomplete = async (search) => {
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("X-Goog-Api-Key", process.env.REACT_APP_GOOGLE_APIKEY);

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

    return (
        <Box>
            <InputGroup>
                <InputLeftElement
                    pointerEvents="none"
                    children={<LocationIcon color="gray.500" />}
                />
                <Input
                    placeholder="Search for locations..."
                    value={displayInput}
                    onChange={(e) => {
                        setDisplayInput(e.target.value);
                        setSearchInput(e.target.value); // This triggers the search
                    }}
                />
            </InputGroup>
            
            {results.length > 0 && (
                <List spacing={3} mt={2} bg="white" p={4} boxShadow="md" borderRadius="md" maxH="300px" overflowY="auto">
                    {results.map(({ placePrediction }, index) => (
                        <ListItem key={index} cursor="pointer" onClick={() => handleOnSelectLocation(placePrediction)}>
                            <ListIcon as={MdLocationOn} color="green.500" />
                            { placePrediction.text.text ?? '' }
                        </ListItem>
                    ))}
                </List>
            )}
        </Box>
    );
}   