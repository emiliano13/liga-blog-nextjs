'use client'

import getAllCategories from '@/lib/queries/getAllCategories'
//import {Category} from '@/lib/types'
import {gql} from '@apollo/client'
import {useSuspenseQuery} from '@apollo/experimental-nextjs-app-support/ssr'
import {usePathname, useRouter, useSearchParams} from 'next/navigation'
import {useCallback, useState, use} from 'react'

async function getCategories() {
  return await getAllCategories()
}
const CATEGORIES_QUERY = gql`
  query NewQuery {
    categories(where: {}) {
      nodes {
        id
        databaseId
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
function SetQueryFilters() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const {data} = useSuspenseQuery(CATEGORIES_QUERY, {context: {}})

  const createQueryString = useCallback(
    (name, value) => {
      const params = new URLSearchParams(searchParams.toString())
      params.set(name, value)
      return params.toString()
    },
    [searchParams]
  )

  const [categories, setCategories] = useState(data.categories.nodes || '')
  const [selectValue, setSelectValue] = useState(searchParams.get('cate') || '')

  function onChange(event) {
    const value = event.target.value
    setSelectValue(value)
    router.push(pathname + '?' + createQueryString('cate', event.target.value))
  }

  return (
    <>
      {/* <input
        type="text"
        value={searchParams.get('filter') || ''}
        onChange={(e) => {
          router.push(
            pathname + '?' + createQueryString('filter', e.target.value)
          )
        }}
      /> */}
      <select
        onChange={onChange}
        className="form-select"
        value={searchParams.get('cate') || ''}
      >
        <option value="todos">Todos</option>
        {categories &&
          categories.map((category) => (
            <option value={category.slug} key={category.databaseId}>
              {category.name}
            </option>
          ))}
      </select>
      {selectValue && <h2 className="mt-3">{selectValue}</h2>}
    </>
  )
}

export default SetQueryFilters
