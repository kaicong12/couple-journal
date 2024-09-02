import React from 'react';
import { components } from 'react-select';
import { Box } from '@chakra-ui/react';

// Truncate function to limit the length of text
const truncate = (str, maxLength) => {
    if (str?.length <= maxLength) return str;
    return `${str?.slice(0, maxLength)}...`;
};

export const CustomOption = (props) => {
    const { data = {} } = props;
    const { restaurant } = data;
    return (
        <components.Option {...props}>
            <Box style={{ display: 'flex', alignItems: 'center' }}>
                <img
                    src={restaurant.thumbnailUrl || 'https://via.placeholder.com/150'} 
                    alt="avatar"
                    style={{
                        width: 40,
                        height: 40,
                        borderRadius: '50%',
                        marginRight: 10,
                    }}
                />
                <Box display="flex" flexDirection="column" alignItems="flex-start">
                    <Box style={{ fontWeight: 'bold' }}>
                        {truncate(data.label, 30)}
                    </Box>
                    <Box style={{ color: 'gray', fontSize: '12px' }}>
                        {truncate(restaurant.formattedAddress, 40)}
                    </Box>
                </Box>
            </Box>
        </components.Option>
    );
};
