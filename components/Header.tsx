import getMenuBySlug from '@/lib/queries/getMenuBySlug'
import Link from 'next/link'

/**
 * Header component.
 */
export default async function Header() {
  const menu = await getMenuBySlug('menu-cabecera')

  return (
    <header>
      <div>
        <h1 className="mb-0">Next.js WordPress</h1>
        {/* <p>It&apos;s Headless WordPress</p> */}
      </div>
      <nav className="flex justify-between gap-4">
        {/* {menu ? <p>Si</p> : <p>No</p>} */}

        {!!menu &&
          menu.menuItems.edges.map((item) => (
            <Link key={item.node.databaseId} href={item.node.uri}>
              {item.node.label}
            </Link>
          ))}
      </nav>
    </header>
  )
}
