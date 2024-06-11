import { Text } from '@chakra-ui/react';
import { useSearchParams } from 'react-router-dom';

export const AllPopularFood = () => {
    const [searchParams] = useSearchParams();
    const areaSearchParam = searchParams.get('area')
    const foodSearchParam = searchParams.get('food')

    return <Text>This is popular page</Text>
}