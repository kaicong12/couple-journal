import { atom, selector } from "recoil";

export const bookmarkedRestaurant = atom({
    key: "bookmarkedRestaurantAtom",
    default: [],
});

export const popularRestaurantsCache = atom({
    key: "popularRestaurantsCacheAtom",
    default: {},
})

export const bookmarkedRestaurantState = selector({
    key: 'bookmarkedRestaurantState',
    get: ({get}) => {
        const restaurantList = get(bookmarkedRestaurant);
        
        return restaurantList.reduce((acc, restaurant) => {
            acc[restaurant.id] = restaurant
            return acc
        }, {})
    },
});

export const popularRestaurants = selector({
    key: 'popularRestaurants',
    get: ({ get }) => {
        const popularRestaurants = get(popularRestaurantsCache);
        const flattened = [];
        for (const [category, { data }] of Object.entries(popularRestaurants)) {
            data.forEach((restaurant) => {
                flattened.push({ ...restaurant, category });
            });
        }
        return flattened;
    },
});