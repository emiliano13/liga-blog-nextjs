'use client'

import getAllPosts from '@/lib/queries/getAllPosts'

// import LoadMorePost from './LoadMore'
import Image from 'next/image'
import Link from 'next/link'
import {useState} from 'react'

function PostsList({listPosts}) {
  //console.log(listPosts)
  const [posts, setPosts] = useState(listPosts)
  //    const [isLoading, setLoading] = useState(true)
  return (
    <>
      {posts.map((post) => (
        <article className="w-72" key={post.databaseId}>
          <Image
            alt={post.featuredImage?.node.altText}
            height={post.featuredImage?.node.mediaDetails.height}
            src={post.featuredImage?.node.sourceUrl}
            width={post.featuredImage?.node.mediaDetails.width}
            priority={true}
          />
          <Link href={`/blog/${post.slug}`}>
            <h2 dangerouslySetInnerHTML={{__html: post.title}} />
          </Link>
          <p className="text-sm text-gray-500">{post.commentCount} Comments</p>
          <div dangerouslySetInnerHTML={{__html: post.excerpt}} />
          <Link className="button" href={`/blog/${post.slug}`}>
            View Post
          </Link>
        </article>
      ))}
      {/* <LoadMorePost posts={posts} setPosts={setPosts} /> */}
    </>
  )
}

export default PostsList
