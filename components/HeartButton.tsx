import { firestore, auth, increment } from "../lib/firebase";
import { useDocument } from 'react-firebase-hooks/firestore';
import { doc, collection, writeBatch } from 'firebase/firestore';
export default function Heart({ postRef }) {
    // listen to heart document for current user
    console.log(postRef.path);
    const heartRef = doc(firestore, 'hearts', auth.currentUser.uid) //postRef.collection('hearts').doc(auth.currentUser.uid);
    const [heartDoc] = useDocument(heartRef);


    // create a user-to-post relationship
    const addHeart = async () => {
        const uid = auth.currentUser.uid;
        const batch = writeBatch(firestore);
        batch.update(postRef, { heartCount: increment(1) });
        batch.set(heartRef, { uid });

        await batch.commit();
    }

    // remove user-to-post relationship
    const removeHeart = async () => {
        const batch = writeBatch(firestore);
        batch.update(postRef, { heartCount: increment(-1) });
        batch.delete(heartRef);

        await batch.commit();
    }

    return heartDoc?.exists() ? (
        <button onClick={removeHeart}>💔 Unheart</button>
    ) : (
        <button onClick={addHeart}>💗 Heart</button>
    );
}