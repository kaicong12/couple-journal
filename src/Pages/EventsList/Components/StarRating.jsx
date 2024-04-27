import { FaStar } from 'react-icons/fa';
import { Box } from '@chakra-ui/react'

export const StarRating = ({ rating, setRating }) => {
    return (
        <Box display="flex">
            {[...Array(5)].map((_, index) => {
                const ratingValue = index + 1;

                return (
                    <label key={index}>
                    <input
                        type="radio"
                        name="rating"
                        value={ratingValue}
                        onClick={() => setRating(ratingValue)}
                        style={{ display: 'none' }}
                    />
                    <FaStar
                        size={24}
                        color={ratingValue <= rating ? "#ffc107" : "#e4e5e9" }
                        style={{ cursor: 'pointer', transition: 'color 200ms' }}
                    />
                    </label>
                );
            })}
        </Box>
    );
};
