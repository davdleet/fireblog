import { auth } from '../lib/firebase';

//sign out user using firebase
export default function signOut() {
    return (
        <main>
            <button onClick={auth.signOut}>
                Sign Out
            </button >
        </main>
    )
}