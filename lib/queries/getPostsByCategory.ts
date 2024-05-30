import {fetchGraphQL} from '@/lib/functions'
import {Post} from '../types'
/**
 * Fetch blog posts by category.
 */

export default async function getPostsByCategory(slug: string) {
  const query = `
    query GetPostsByCategory($slug: String) {
      posts(where: {categoryName: $slug}) {
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
  const variables = {
    slug: slug
  }

  const response = await fetchGraphQL(query, variables)

  return response.data.posts.nodes as Post[]
  //return response.data.posts
}
