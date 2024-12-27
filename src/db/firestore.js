import { db } from "./firebase";
import { doc, getDoc, deleteDoc, collection, getDocs, addDoc, updateDoc, onSnapshot } from "firebase/firestore";


export const getDocumentValue = async (collectionName, docId) => {
    const docRef = doc(db, collectionName, docId);
    const docSnap = await getDoc(docRef);
    return docSnap.data();
}

export const getCollectionValues = async (collectionName) => {
    const dataSnapshot = await getDocs(collection(db, collectionName));
    return dataSnapshot.docs.map(doc => ( { id: doc.id, ...doc.data() } ));
}

export const updateFirestoreValue = async (collectionName, docId, data) => {
    const docRef = doc(db, collectionName, docId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        await updateDoc(docRef, data);
    } else {
        console.log(`Document with ID ${docId} not found in collection ${collectionName}`);
    }
}

export const deleteFirestoreValue = async (collectionName, docId) => {
    const docRef = doc(db, collectionName, docId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        await deleteDoc(docRef);
    } else {
        console.log(`Document with ID ${docId} not found in collection ${collectionName}`);
    }
}

export const listenOnFirestore = (collectionName, cb) => {
    const q = collection(db, collectionName);
    const unsubscribe = onSnapshot(q, cb);
    return unsubscribe;
}

export const addFirestoreValue = async (collectionName, data) => {
    const docRef = await addDoc(collection(db, collectionName), data);
    return docRef.id;
}