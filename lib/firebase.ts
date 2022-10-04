// import firebase from 'firebase/compat/app'
// import 'firebase/compat/auth'
// import 'firebase/compat/firestore'
// import 'firebase/compat/storage'

import firebase from 'firebase/app'
import { initializeApp } from "firebase/app";
import { getFirestore, collection, where, query, limit, getDocs, Timestamp, serverTimestamp as st, increment as ic } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getStorage } from "firebase/storage";
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyAUwc9nRgWRdi9-H0KGbWD8KGPLb14CVwQ",
    authDomain: "fireblog-73da5.firebaseapp.com",
    projectId: "fireblog-73da5",
    storageBucket: "fireblog-73da5.appspot.com",
    messagingSenderId: "707114009804",
    appId: "1:707114009804:web:7283ab90908fcab31f6e69",
    measurementId: "G-KPJT8YWLN1"
};
const app = initializeApp(firebaseConfig)
// // Initialize Firebase only once
// if (!firebase.apps.length) {
//     firebase.initializeApp(firebaseConfig);
// }

export const auth = getAuth(app);
export const googleAuthProvider = new GoogleAuthProvider();

//export const firestore = firebase.firestore();
export const firestore = getFirestore(app);

//export const storage = firebase.storage();
export const storage = getStorage(app);

//export const STATE_CHANGED = firebase.storage.TaskEvent.STATE_CHANGED;
export const STATE_CHANGED = "state_changed";

export const serverTimestamp = st;
export const increment = ic;

/*
    Gets a users/{uid} document with username
*/

export async function getUserWithUsername(username) {
    const usersRef = collection(firestore, 'users');
    const q = query(usersRef, where("username", "==", username), limit(1)); //where('username', '==', username).limit(1);
    const userDoc = (await getDocs(q)).docs[0];
    return userDoc;
}

/**`
 * Converts a firestore document to JSON
 * @param  {DocumentSnapshot} doc
 */
export function postToJSON(doc) {
    const data = doc.data();
    return {
        ...data,
        // Gotcha! firestore timestamp NOT serializable to JSON. Must convert to milliseconds
        createdAt: data.createdAt.toMillis(),
        updatedAt: data.updatedAt.toMillis(),
    };
}

export const fromMillis = Timestamp.fromMillis;
