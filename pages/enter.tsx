import { auth, googleAuthProvider } from "../lib/firebase"
import { useContext, useEffect, useCallback } from "react"
import { UserContext } from "../lib/context"
import { useState } from "react"
import { firestore } from "../lib/firebase"
import { signInWithPopup } from "firebase/auth"
import { writeBatch, doc, collection, getDoc } from "firebase/firestore"
import debounce from 'lodash.debounce';
export default function EnterPage({ }) {

    const { user, username } = useContext(UserContext)

    // 1. user signed out <SignInButton />
    // 2. user signed in, but missing username <UsernameForm />
    // 3. user signed in, has username <SignOutButton />
    return (
        <main>
            {user ?
                !username ? <UsernameForm /> : window.location.href = '/'
                : <SignInButton />
            }

        </main>
    )
}

// sign in with Google button
function SignInButton() {
    const signInWithGoogle = async () => {
        await signInWithPopup(auth, googleAuthProvider);
    };

    return (
        <button className='btn-google' onClick={signInWithGoogle}>
            <img src={'/google.png'} alt="" /> Sign in with Google
        </button>
    )
}

// Sign out button
function SignOutButton() {
    return (
        <button onClick={() => auth.signOut()}>Sign Out</button>
    )
}

function UsernameForm() {
    const [formValue, setFormValue] = useState('')
    const [isValid, setIsValid] = useState(false)
    const [loading, setLoading] = useState(false)
    const [taken, setTaken] = useState(false)
    const { user, username } = useContext(UserContext)

    useEffect(() => { }, [formValue])

    const onChange = (e) => {
        const val = e.target.value.toLowerCase()
        const re = /^(?=[a-zA-Z0-9._]{3,15}$)(?!.*[_.]{2})[^_.].*[^_.]$/;
        if (val.length < 3) {
            setFormValue(val)
            setLoading(false)
            setIsValid(false)
        }
        if (re.test(val)) {
            setFormValue(val)
            setLoading(true)
            setIsValid(false)
        }
    }

    useEffect(() => {
        checkUsername(formValue);
    }, [formValue]);

    const checkUsername = useCallback(
        debounce(async (username) => {
            if (username.length >= 3) {
                setIsValid(true)
                const ref = doc(firestore, 'usernames', `${username}`);
                //const { exists } = await ref.get();
                const snap = await getDoc(ref);
                if (snap.exists()) {
                    setTaken(true);
                }
                else {
                    setTaken(false);
                }
                setLoading(false)
            }
            else {
                setIsValid(false)
                setLoading(false)
            }
        }, 500),
        []
    )

    const onSubmit = async (e) => {
        e.preventDefault()
        //const userDoc = firestore.doc(`users/${user.uid}`);
        const userDoc = doc(firestore, `users/${user.uid}`);
        //const usernameDoc = firestore.doc(`usernames/${formValue}`);
        const usernameDoc = doc(firestore, `usernames/${formValue}`);

        //const batch = firestore.batch();
        const batch = writeBatch(firestore);
        batch.set(userDoc, { username: formValue, photoURL: user.photoURL, displayName: user.displayName });
        batch.set(usernameDoc, { uid: user.uid });
        await batch.commit();
    }

    return (
        !username && (
            <section>
                <h3>Choose Username</h3>
                <form onSubmit={onSubmit} >
                    <input name="username" placeholder="username" value={formValue} onChange={onChange} />

                    <UsernameMessage username={formValue} isValid={isValid} loading={loading} taken={taken} />
                    <button type='submit' className="btn-green" disabled={!isValid}>
                        Choose
                    </button>

                    <h3>Debug State</h3>
                    <div>
                        Username:{formValue}
                        <br />
                        Loading: {loading.toString()}
                        <br />
                        Username Valid: {isValid.toString()}
                    </div>
                </form>
            </section>
        )
    )
}

function UsernameMessage({ username, isValid, loading, taken }) {
    if (loading) {
        return <p>Checking username...</p>
    }
    else if (isValid) {
        return <p className="text-success">{username} is available!</p>
    }
    else if (username && !isValid) {
        return <p className="text-danger">That username is not valid!</p>
    }
    else if (username && isValid && !taken) {
        return <p className="text-danger">{username} is taken!</p>
    }
    else {
        return <p></p>
    }
}