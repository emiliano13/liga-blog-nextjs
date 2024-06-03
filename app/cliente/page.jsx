'use client'
import getAllPosts from '@/lib/queries/getAllPosts'
import getPostsByCategory from '@/lib/queries/getPostsByCategory'
import getAllCategories from '@/lib/queries/getAllCategories'
import {Suspense} from 'react'
import SetQueryFilters from '../SetQueryFilters'
import Image from 'next/image'
import Link from 'next/link'
import {gql, NetworkStatus} from '@apollo/client'
import {useSuspenseQuery} from '@apollo/experimental-nextjs-app-support/ssr'
import {useState, useEffect, use} from 'react'
import React from 'react'
import ShareButtons from '@/components/ShareButtons'

const CATEGORIES_QUERY = gql`
  query NewQuery {
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
  }
`
const GET_QUERY = gql`
  query Query($first: Int!, $slug: String, $after: String) {
    posts(where: {categoryName: $slug}, first: $first, after: $after) {
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

const BATCH_SIZE = 2
const initialPostList = 2 // Number of articles to display initially
const incrementInitialPostList = 2 // Number of articles to add each time the "load more" button is clicked
async function getCategories() {
  return await getAllCategories()
}
function Cliente({searchParams}) {
  if (searchParams.cate == 'todos') searchParams.cate = ''
  const {loading, error, data, refetch, networkStatus} = useSuspenseQuery(
    GET_QUERY,
    {
      context: {},
      variables: {first: BATCH_SIZE, slug: searchParams.cate, after: null},
      notifyOnNetworkStatusChange: true
    }
  )

  const [displayPosts, setDisplayPosts] = React.useState(initialPostList)
  const [cargarMas, setCargarMas] = React.useState()
  const [newArticles, setnewArticles] = React.useState(data.posts.nodes)

  const posts = data.posts.nodes
  const haveMorePosts = data?.posts?.pageInfo?.hasNextPage
  //console.log(categorias)

  //   useEffect(() => {
  //     console.log('params')
  //   }, [searchParams])
  useEffect(() => {
    //console.log('data changes')
    if (!cargarMas) {
      setnewArticles(data.posts.nodes)
    } else {
      if (newArticles[0]?.databaseId != data?.posts.nodes[0]?.databaseId) {
        // console.log('dif')
        // console.log(displayPosts)
        setnewArticles([...newArticles, ...data.posts.nodes])
        setCargarMas(false)
      } else {
      }
    }
    // console.log(articles[0]?.databaseId)
    // console.log(data?.posts?.nodes[0]?.databaseId)
  }, [data])

  //   const loadMore = () => {
  //     setDisplayPosts(displayPosts + incrementInitialPostList)

  //     setCargarMas(true)
  //     refetch({after: data.posts.pageInfo.endCursor})
  //     // console.log(data.posts.nodes)
  //     //const {data2} = cargarMas(data.posts.pageInfo.endCursor)
  //   }
  function loadMore() {
    setDisplayPosts(displayPosts + incrementInitialPostList)

    setCargarMas(true)
    refetch({after: data.posts.pageInfo.endCursor})
  }

  if (networkStatus === NetworkStatus.refetch) return 'Refetching!'
  if (loading) return null
  if (error) return `Error! ${error}`

  if (loading) return <p>Loading...</p>
  if (!data) return <p>No hay entradas</p>

  return (
    <div>
      <Suspense fallback={<div>Cargando...</div>}>
        <SetQueryFilters />
      </Suspense>

      {/* <div className="flex flex-wrap gap-8"> */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
        {newArticles &&
          newArticles.map((post) => (
            <article
              className="w-1/4_ rounded overflow-hidden shadow-lg hover:shadow-2xl"
              key={post.databaseId}
            >
              <Image
                className="w-full my-0"
                alt={post.featuredImage?.node.altText}
                // height={post.featuredImage?.node.mediaDetails.height}
                // src={post.featuredImage?.node.sourceUrl}
                // width={post.featuredImage?.node.mediaDetails.width}
                height={post.featuredImage?.node.mediaDetails.sizes[0].height}
                src={post.featuredImage?.node.mediaDetails.sizes[0].sourceUrl}
                width={post.featuredImage?.node.mediaDetails.sizes[0].width}
                priority={true}
              />
              <div className="px-6 py-2">
                <Link href={`/blog/${post.slug}`}>
                  <h2 dangerouslySetInnerHTML={{__html: post.title}} />
                </Link>
                <div dangerouslySetInnerHTML={{__html: post.excerpt}} />
              </div>

              <ShareButtons post={post} />
            </article>
          ))}
      </div>
      <div className="flex flex-wrap items-center justify-center mt-8">
        {haveMorePosts ? (
          <button
            onClick={loadMore}
            className="load-more bg-blue-400 text-slate-900 px-4 py-2.5 hover:bg-blue-500"
            type="submit"
          >
            Ver más noticias
          </button>
        ) : (
          <p>✅ Todas las entradas han sido cargadas.</p>
        )}
      </div>
    </div>
  )
}

export default Cliente
