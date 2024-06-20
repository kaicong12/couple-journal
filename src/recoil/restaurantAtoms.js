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
