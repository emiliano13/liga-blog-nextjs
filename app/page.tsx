import getAllCategories from '@/lib/queries/getAllCategories'
import getAllPosts from '@/lib/queries/getAllPosts'
import getPageBySlug from '@/lib/queries/getPageBySlug'
import {Category, Post} from '@/lib/types'
import Image from 'next/image'
import Link from 'next/link'
import {notFound} from 'next/navigation'
/**
 * The homepage route.
 *
 * @see https://nextjs.org/docs/app/building-your-application/routing/pages-and-layouts#pages
 */

async function getPosts() {
  return await getAllPosts()
}
export default async function Home() {
  // Fetch homepage from WordPress.
  const homepage = await getPageBySlug('inicio')

  // Fetch posts from WordPress.
  const posts = await getAllPosts()
  //const posts = use(getPosts())

  // Fetch categories
  const categories = await getAllCategories()

  // No data? Bail...
  if (!posts || !posts.length || !homepage) {
    notFound()
  }

  return (
    <main className="flex flex-col gap-8">
      <article>
        <h1 dangerouslySetInnerHTML={{__html: homepage.title}} />
        <div dangerouslySetInnerHTML={{__html: homepage.content}} />
      </article>

      <aside>
        <h2>Latest Posts</h2>
        <select
          //onChange={handleChange}
          className="product-dropdown"
          name="product-dropdown"
        >
          <option value="all">All</option>
          {categories.map((category: Category) => (
            <option value={category.databaseId} key={category.databaseId}>
              {category.name}
            </option>
          ))}
        </select>
        <div className="flex flex-wrap gap-8">
          {posts.map((post: Post) => (
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
              <p className="text-sm text-gray-500">
                {post.commentCount} Comments
              </p>
              <div dangerouslySetInnerHTML={{__html: post.excerpt}} />
              <Link className="button" href={`/blog/${post.slug}`}>
                View Post
              </Link>
            </article>
          ))}
        </div>
      </aside>
    </main>
  )
}
