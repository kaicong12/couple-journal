import { Timestamp } from "firebase/firestore";
import { multiUpdate, getValue } from "../db/rtdb";

export const convertFbTimestampToDate = (firestoreTimestamp) => {
    if (!firestoreTimestamp) return 'This event does not have a date';

    // Convert Firestore Timestamp to JavaScript Date object
    let date
    if (typeof firestoreTimestamp === 'number') {
        date = new Date(firestoreTimestamp);
    } else {
        date = firestoreTimestamp?.toDate()
    }

    const day = date.getDate();
    const month = date.getMonth() + 1; // Months are zero-based
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
}

export const convertInputDateToFbTimestamp = (date) => {
    return Timestamp.fromDate(new Date(date))
}

export const checkIfBookmarked = async (restaurantId) => {
    const snapshot = await getValue(`/bookmarkedLocations/${restaurantId}`);
    return Object.keys(snapshot).length;
};

export const toggleBookmark = async (isBookmarked, restaurant) => {
    const updates = {};
    if (isBookmarked) {
        updates[`/bookmarkedLocations/${restaurant.id}`] = null;
    } else {
        updates[`/bookmarkedLocations/${restaurant.id}`] = restaurant;
    }
    await multiUpdate("/", updates);
};