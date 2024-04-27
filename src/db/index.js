import { db } from "./firebase";
import { doc, getDoc, deleteDoc, collection, getDocs, addDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";


export const getEvents = async () => {
    const eventsCol = collection(db, "events");
    const eventSnapshot = await getDocs(eventsCol);

    const eventList = eventSnapshot.docs.map(doc => ( { id: doc.id, ...doc.data() } ));
    return eventList;
}

export const uploadEvent = async (newEvent) => {
    const eventsCol = collection(db, "events");
    const { file, ...eventData } = newEvent

    const completeEventData = { ...eventData }
    const storage = getStorage();

    try {
        if (file) {
            const storageRef = ref(storage, `events/${file.name}`);
            const fileSnapshot = await uploadBytes(storageRef, file);
            const photoURL = await getDownloadURL(fileSnapshot.ref);
            completeEventData["thumbnail"] = photoURL
        }

        const docRef = await addDoc(eventsCol, completeEventData);
        return docRef.id
    } catch (e) {
        console.error("Error adding document: ", e);
        throw new Error("Failed to upload event: " + e.message);
    }
}

export const deleteEvent = async (eventId) => {
    const eventDocRef = doc(db, "events", eventId);
    const storage = getStorage();

    try {
        const docSnap = await getDoc(eventDocRef);
        if (!docSnap.exists()) {
            throw new Error("Document does not exist!");
        }
        
        const eventData = docSnap.data();
        if (eventData.thumbnail) {
            const fileRef = ref(storage, eventData.thumbnail);
            await deleteObject(fileRef);
        }

        await deleteDoc(eventDocRef);
    } catch (e) {
        console.error("Error deleting event: ", e);
        throw new Error("Failed to delete event: " + e.message);
    }
}