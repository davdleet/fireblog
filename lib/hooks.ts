import { auth, firestore } from './firebase';
import { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { collection, doc, onSnapshot } from "firebase/firestore";

export function UseUserData() {
    const [user] = useAuthState(auth as any)
    const [username, setUsername] = useState(null)

    useEffect(() => {
        //turn off realtime subscription
        let unsubscribe;
        if (user) {
            //const ref = firestore.collection('users').doc(user.uid);
            const ref = doc(firestore, 'users', user.uid);
            // unsubscribe = ref.onSnapshot(doc => {
            //     setUsername(doc.data()?.username);
            // });
            unsubscribe = onSnapshot(ref, doc => {
                setUsername(doc.data()?.username);
            });
        } else {
            setUsername(null)
        }
    }, [user]);
    return { user, username };
}