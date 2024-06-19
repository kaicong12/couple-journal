import { Timestamp } from "firebase/firestore";

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