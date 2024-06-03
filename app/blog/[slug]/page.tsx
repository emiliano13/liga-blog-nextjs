import CommentForm from '@/components/CommentForm'
import getAllPosts from '@/lib/queries/getAllPosts'
import getPostBySlug from '@/lib/queries/getPostBySlug'
import {gql} from '@apollo/client'
import {Metadata} from 'next'
import Image from 'next/image'
import Link from 'next/link'

import {notFound} from 'next/navigation'
//import {useSuspenseQuery} from '@apollo/experimental-nextjs-app-support/ssr'
import {getClient} from '@/lib/client'

import {Roboto} from 'next/font/google'

const roboto = Roboto({
  weight: ['400', '700'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
  display: 'swap'
})
const GET_QUERY = gql`
  query Query($currentPostId: [ID]) {
    posts(
      first: 3
      where: {orderby: {field: DATE, order: DESC}, notIn: $currentPostId}
    ) {
      pageInfo {
        hasNextPage
        endCursor
      }
      nodes {
        commentCount
        databaseId
        date
        modified
        title
        slug
        excerpt(format: RENDERED)
        featuredImage {
          node {
            altText
            sourceUrl
            mediaDetails {
              height
              width
              sizes {
                height
                name
                width
                sourceUrl
              }
            }
          }
        }
        seo {
          metaDesc
          title
        }
      }
    }
  }
`
/**
 * Generate the static routes at build time.
 *
 * @see https://nextjs.org/docs/app/api-reference/functions/generate-static-params
 */
export async function generateStaticParams() {
  // Get all blog posts.
  const posts = await getAllPosts()

  // No posts? Bail...
  if (!posts) {
    return []
  }

  // Return the slugs for each post.
  return posts.map((post: {slug: string}) => ({
    slug: post.slug
  }))
}

/**
 * Generate the metadata for each static route at build time.
 *
 * @see https://nextjs.org/docs/app/api-reference/functions/generate-metadata#generatemetadata-function
 */
export async function generateMetadata({
  params
}: {
  params: {slug: string}
}): Promise<Metadata | null> {
  // Get the blog post.
  const post = await getPostBySlug(params.slug)

  // No post? Bail...
  if (!post) {
    return {}
  }

  return {
    title: post.seo.title,
    description: post.seo.metaDesc
  }
}

/**
 * The blog post route.
 *
 * @see https://nextjs.org/docs/app/building-your-application/routing/pages-and-layouts#pages
 */
export default async function Post({params}: {params: {slug: string}}) {
  // Fetch a single post from WordPress.
  const post = await getPostBySlug(params.slug)
  // No post? Bail...
  if (!post) {
    notFound()
  }
  //Relacionadas
  const {data} = await getClient().query({
    query: GET_QUERY,
    variables: {currentPostId: post.databaseId}
  })
  //console.log(post.databaseId)

  return (
    <div className="grid grid-cols-4 p-2 gap-2">
      <div className="col-1 col-span-3  p-2">
        <article className={roboto.className}>
          <header>
            <h2 dangerouslySetInnerHTML={{__html: post.title}} />
            <p className="italic">
              Por {post.author.node.name} el <time>{post.date}</time>
            </p>
          </header>
          <div dangerouslySetInnerHTML={{__html: post.content}} />
          <footer className="flex items-center justify-between gap-4 pb-4">
            <div>
              <h3>Categorias</h3>
              <ul className="m-0 flex list-none gap-2 p-0">
                {post.categories.nodes.map((category) => (
                  <li className="m-0 p-0" key={category.databaseId}>
                    <Link href={`/blog/category/${category.name}`}>
                      {category.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3>Tags</h3>
              <ul className="m-0 flex list-none gap-2 p-0">
                {post.tags.nodes.map((tag) => (
                  <li className="m-0 p-0" key={tag.databaseId}>
                    <Link href={`/blog/tag/${tag.name}`}>{tag.name}</Link>
                  </li>
                ))}
              </ul>
            </div>
          </footer>
          <section className="border-t-2">
            <h3>Comments</h3>
            {post.comments.nodes.map((comment) => (
              <article key={comment.databaseId}>
                <header className="flex items-center gap-2">
                  <img
                    alt={comment.author.node.name}
                    className="m-0 rounded-full"
                    height={64}
                    loading="lazy"
                    src={comment.author.node.avatar.url}
                    width={64}
                  />
                  <div className="flex flex-col gap-2">
                    <h4
                      className="m-0 p-0 leading-none"
                      dangerouslySetInnerHTML={{
                        __html: comment.author.node.name
                      }}
                    />
                    <time className="italic">{comment.date}</time>
                  </div>
                </header>

                <div dangerouslySetInnerHTML={{__html: comment.content}} />
              </article>
            ))}
          </section>
          <CommentForm postID={post.databaseId} />
        </article>
      </div>
      <div className="col-2 p-2">
        <div className="grid grid-cols-1 gap-8">
          {data &&
            data.posts.nodes.map((latestPost: any) => (
              <article
                className="w-1/4_ rounded overflow-hidden shadow-lg hover:shadow-2xl"
                key={latestPost.databaseId}
              >
                <Image
                  className="w-full my-0"
                  alt={latestPost.featuredImage?.node.altText}
                  height={
                    latestPost.featuredImage?.node.mediaDetails.sizes[0].height
                  }
                  src={
                    latestPost.featuredImage?.node.mediaDetails.sizes[0]
                      .sourceUrl
                  }
                  width={
                    latestPost.featuredImage?.node.mediaDetails.sizes[0].width
                  }
                  priority={true}
                />
                <div className="px-6 py-2">
                  <Link href={`/blog/${latestPost.slug}`}>
                    <h2 dangerouslySetInnerHTML={{__html: latestPost.title}} />
                  </Link>
                  <div dangerouslySetInnerHTML={{__html: latestPost.excerpt}} />
                </div>

                {/* <ShareButtons post={post} /> */}
              </article>
            ))}
        </div>
      </div>
    </div>
  )
}
