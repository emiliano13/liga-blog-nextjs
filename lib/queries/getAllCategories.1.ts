import {fetchGraphQL} from '@/lib/functions'
import {Category} from '@/lib/types'

/**
 * Fetch all pages.
 */
export default async function getAllCategories() {
  const query = `
    query GetAllCategories {
      categories(where: {}) {
        nodes {
        id
        name
        slug
        uri
            seo {
                metaDesc
                title
            }    
        }      
    }
  `

  const response = await fetchGraphQL(query)

  return response.data.pages.nodes as Category[]
}
