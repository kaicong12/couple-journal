import { useState } from 'react';
import AsyncSelect from 'react-select/async';
import { useNavigate } from 'react-router-dom';
import { fetchRestaurants } from '../services/places';
import debounce from 'lodash.debounce';
import { CustomOption } from './CustomOption';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';

const SingleValue = ({ data }) => (
    <div style={{ display: 'flex', alignItems: 'center' }}>
        <FontAwesomeIcon icon={faMagnifyingGlass} style={{ marginRight: 8 }} />
        {data.label}
    </div>
);

export const RestaurantSearchBar = () => {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const fetchPlaces = async (searchQuery) => {
        setLoading(true);
        try {
            const restaurants = await fetchRestaurants({ textQuery: searchQuery, pageSize: 5 });
            const options = restaurants.map((place) => ({
                label: place.displayName.text,
                value: place.id,
                restaurant: place
            }));

            return options
        } catch (error) {
            console.error('Error fetching places:', error);
        } finally {
            setLoading(false);
        }
    }

    const loadOptions = debounce((inputValue, callback) => {
        fetchPlaces(inputValue).then(callback);
    }, 500)

    const handleSelectChange = (selectedOption) => {
        if (selectedOption) {
            const { restaurant, value: restaurantId } = selectedOption
            navigate(`/food/${restaurantId}`, { state: { restaurant } });
        }
    };

    return (
        <AsyncSelect
            cacheOptions 
            defaultOptions 
            loadOptions={loadOptions}
            onChange={handleSelectChange}
            placeholder="Search for a restaurant..."
            noOptionsMessage={() => (loading ? 'Searching...' : 'No results found')}
            isLoading={loading}
            components={{ 
                Option: CustomOption, 
                SingleValue,
                DropdownIndicator: () => null
            }}
            styles={{
                control: (provided) => ({
                    ...provided,
                    padding: '4px', // Add padding to the control
                    boxShadow: 'none',
                    borderColor: 'lightgray',
                    ':hover': {
                        borderColor: 'gray',
                    },
                }),
                indicatorSeparator: (provided) => ({
                    ...provided,
                    display: 'none',
                }),
            }}
        />
    );
}