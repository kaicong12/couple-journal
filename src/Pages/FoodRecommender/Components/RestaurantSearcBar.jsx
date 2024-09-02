import { useState } from 'react';
import AsyncSelect from 'react-select/async';
import { useNavigate } from 'react-router-dom';
import { fetchRestaurants } from '../services/places';
import debounce from 'lodash.debounce';
import { CustomOption } from './CustomOption';


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
            components={{ Option: CustomOption }}
            styles={{
                control: (provided) => ({
                    ...provided,
                    boxShadow: 'none',
                    borderColor: 'lightgray',
                    ':hover': {
                        borderColor: 'gray',
                    },
                }),
            }}
        />
    );
}