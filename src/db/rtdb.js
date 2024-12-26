import { rtdb } from './firebase'
import {
    get,
    off,
    onValue,
    onChildAdded,
    onChildChanged,
    onChildRemoved,
    onChildMoved,
    ref as rRef,
    remove,
    update
} from "firebase/database";


export const getNodeRef = (nodePath) => {
    return rRef(rtdb, nodePath);
}

export const getValue = async (nodePath) => {
    const nodeRef = getNodeRef(nodePath)
    const snap = await get(nodeRef)

    return snap.val()
}

const listenOnNodeRef = (ref, cb, type) => {
    let listenerFunction;

    switch (type) {
        case "value":
            listenerFunction = onValue;
            break;
        case "child_added":
            listenerFunction = onChildAdded;
            break;
        case "child_changed":
            listenerFunction = onChildChanged;
            break;
        case "child_removed":
            listenerFunction = onChildRemoved;
            break;
        case "child_moved":
            listenerFunction = onChildMoved;
            break;
        default:
            break;
    }

    if (listenerFunction) {
        listenerFunction(ref, cb);
    }
}

const removeListener = (refString, type, cb) => {
    off(getNodeRef(refString), type, cb);
}

export const addListenerToNode = (refString, cb, type = 'child_changed') => {
    listenOnNodeRef(getNodeRef(refString), cb, type)
    return () => removeListener(refString, type, cb)
}

export const deleteNode = async (nodePath) => {
    const nodeRef = getNodeRef(nodePath);
    try {
        await remove(nodeRef);
    } catch (error) {
        console.error("Error deleting node: ", error);
    }
}

export const multiUpdate = async (nodePath, updates) => {
    const nodeRef = getNodeRef(nodePath);
    await update(nodeRef, updates)
}