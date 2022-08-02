import firebase from 'firebase/compat/app'
import 'firebase/compat/auth'
import 'firebase/firestore'
import 'firebase/storage'

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

// Initialize Firebase only once
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

export const auth = firebase.auth();
export const firestore = firebase.firestore();
export const storage = firebase.storage();