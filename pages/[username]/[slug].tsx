import { firestore, getUserWithUsername } from "../../lib/firebase";
import { doc, collection, collectionGroup, getDoc, getDocs } from 'firebase/firestore';
import { useDocumentData } from 'react-firebase-hooks/firestore';
import { postToJSON } from "../../lib/firebase";
import PostContent from "../../components/PostContent";
import styles from "../../styles/Post.module.css";
import AuthCheck from "../../components/AuthCheck";
import HeartButton from "../../components/HeartButton";
import Link from "next/link";
export async function getStaticProps({ params }) {
    const { username, slug } = params;
    const userDoc = await getUserWithUsername(username);

    let post;
    let path;

    if (userDoc) {
        // const postRef= userDoc.ref.collection('posts').doc(slug);
        const postRef = doc(collection(userDoc.ref, 'posts'), slug);
        post = postToJSON(await getDoc(postRef));

        path = postRef.path
    }

    return {
        props: { post, path },
        revalidate: 5000,
    }
}

export async function getStaticPaths() {
    //const snapshot = await firestore.collectionGroup('posts').get();
    const snapshot = await getDocs(collectionGroup(firestore, 'posts'));
    const paths = snapshot.docs.map((doc) => {
        const { slug, username } = doc.data();
        return {
            params: { username, slug },
        };
    });
    return {
        paths,
        fallback: 'blocking',
    };
}

export default function Post(props) {
    const postRef = doc(firestore, props.path);
    //const postRef = firestore.doc(props.path);
    const [realtimePost] = useDocumentData(postRef);
    const post = realtimePost || props.post;
    return (
        <main className={styles.container}>

            <section>
                <PostContent post={post} />
            </section>

            <aside className="card">
                <p>
                    <strong>{post.heartCount || 0} 🤍</strong>
                </p>
                <AuthCheck
                    fallback={
                        <Link href="/enter">
                            <button>💗 Sign up</button>
                        </Link>
                    }>
                    <HeartButton postRef={doc(firestore, props.path)} />
                </AuthCheck>
            </aside>
        </main>
    )
}