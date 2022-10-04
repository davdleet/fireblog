import UserProfile from '../../components/UserProfile';
import PostFeed from '../../components/PostFeed';
import Metatags from '../../components/Metatags';
import { getUserWithUsername, postToJSON } from '../../lib/firebase';
import { query as qry, collection, getDocs, where } from 'firebase/firestore';

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


export default function UserProfilePage({ user, posts }) {
    return (
        <main>
            <Metatags title={user.username} image={user.photoURL} description={`${user.username}'s public profile`} />
            <UserProfile user={user} />
            <PostFeed posts={posts} />
        </main>
    );
}