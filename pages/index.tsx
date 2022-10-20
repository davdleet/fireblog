import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import Link from 'next/link'
import MetaTags from '../components/Metatags'
import { useState } from 'react';
import Loader from '../components/Loader'
import { firestore, fromMillis, postToJSON } from '../lib/firebase';
import { query, collectionGroup, where, getDocs, orderBy, limit, startAfter, doc } from 'firebase/firestore';
import PostFeed from '../components/PostFeed';
import toast from 'react-hot-toast'

const LIMIT = 10;

export async function getServerSideProps(context) {
  // const postsQuery = firestore
  //   .collectionGroup('posts')
  //   .where('published', '==', true)
  //   .orderBy('createdAt', 'desc')
  //   .limit(LIMIT);
  const postsQuery = query(collectionGroup(firestore, 'posts'), where('published', '==', true), orderBy('createdAt', 'desc'), limit(LIMIT));
  const posts = (await getDocs(postsQuery)).docs.map(postToJSON);
  return {
    props: { posts } // pass to page component
  }
}

export default function Home(props) {
  const [posts, setPosts] = useState(props.posts);
  const [loading, setLoading] = useState(false);
  const [postsEnd, setPostsEnd] = useState(false);

  const getMorePosts = async () => {
    setLoading(true);
    const last = posts[posts.length - 1];
    if (!posts.length) {
      setPostsEnd(true);
      setLoading(false);
    }
    try {
      const cursor = typeof last.createdAt === 'number' ? fromMillis(last.createdAt) : last.createdAt;
      // const query = firestore
      //   .collectionGroup('posts')
      //   .where('published', '==', true)
      //   .orderBy('createdAt', 'desc')
      //   .startAfter(cursor)
      //   .limit(LIMIT);
      const q = query(collectionGroup(firestore, 'posts'), where('published', '==', true), orderBy('createdAt', 'desc'), startAfter(cursor), limit(LIMIT));
      const newPosts = (await getDocs(q)).docs.map((doc) => doc.data());

      setPosts(posts.concat(newPosts));
      setLoading(false);

      if (newPosts.length < LIMIT) {
        setPostsEnd(true);
      }
    }
    catch (e) {
      toast.error("There are no messages to show");
    }

  }
  return (
    <main className="">
      <MetaTags title="Home" description="A social media platform for developers" image="static/favicon/favicon.ico" />
      <PostFeed posts={posts} />

      {!loading && !postsEnd && <button onClick={getMorePosts}>Load More</button>}
      <Loader show={loading} />

      {postsEnd && <div className='font-semibold w-auto flex mx-auto justify-center'>You have reached the end</div>}
    </main>
  )
}
