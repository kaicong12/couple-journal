import { Timestamp } from "firebase/firestore";
import { multiUpdate, getValue } from "../db/rtdb";

// Tolerant Timestamp → Date.
// Router state serialization strips the Firestore `Timestamp` prototype,
// leaving a plain `{seconds, nanoseconds}` shape. Handle every variant.
export const toJsDate = (value) => {
    if (!value) return null;
    if (value instanceof Date) return value;
    if (typeof value === 'number') return new Date(value);
    if (typeof value === 'string') {
        const d = new Date(value);
        return isNaN(d.getTime()) ? null : d;
    }
    if (typeof value.toDate === 'function') return value.toDate();
    if (typeof value.seconds === 'number') {
        return new Date(value.seconds * 1000 + (value.nanoseconds || 0) / 1e6);
    }
    return null;
}

export const convertFbTimestampToDate = (firestoreTimestamp) => {
    const date = toJsDate(firestoreTimestamp);
    if (!date) return 'This event does not have a date';

    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
}

export const convertInputDateToFbTimestamp = (date) => {
    return Timestamp.fromDate(new Date(date))
}

export const checkIfBookmarked = async (restaurantId) => {
    const snapshot = (await getValue(`/bookmarkedLocations/${restaurantId}`)) ?? {};
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