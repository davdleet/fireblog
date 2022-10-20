import UserProfile from '../../components/UserProfile';
import PostFeed from '../../components/PostFeed';
import Metatags from '../../components/Metatags';
import { getUserWithUsername, postToJSON } from '../../lib/firebase';
import { query as qry, collection, getDocs, where } from 'firebase/firestore';
import { UserContext } from '../../lib/context';
import { useContext } from 'react';
import { firestore } from '../../lib/firebase';
import { auth } from '../../lib/firebase';
export async function getServerSideProps({ query }) {
    const { username } = query

    const userDoc = await getUserWithUsername(username);
    if (!userDoc) {
        return {
            notFound: true,
        }
    }

    let user = null;
    let posts = null;
    if (userDoc) {
        console.log("userDoc exists");
        user = userDoc.data();
        const postsQuery = qry(collection(userDoc.ref, 'posts'), where('published', '==', true));
        posts = (await getDocs(postsQuery)).docs.map(postToJSON);
        // const postsQuery = userDoc.ref
        //     .collection('posts')
        //     .where('published', '==', true)
        //     .orderBy('created', 'desc')
        //     .limit(5);
        //posts = (await postsQuery.get()).docs.map(postToJSON)
    }
    console.log("user", user);
    console.log("posts", posts);
    return {
        props: { user, posts }
    }
}

function signOut() {
    auth.signOut();
    //redirect to home page
    window.location.href = "/";
}

export default function UserProfilePage({ user, posts }) {
    const { username } = useContext(UserContext);
    const currentUser = username;
    return (
        <main>
            <Metatags title={user.username} image={user.photoURL} description={`${user.username}'s public profile`} />
            <UserProfile user={user} />
            <div>
                {currentUser == user.username && <button onClick={signOut}>Sign Out</button>}
            </div>
            <PostFeed posts={posts} />
        </main>
    );
}