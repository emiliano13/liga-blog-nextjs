import Footer from '@/components/Footer'
import Header from '@/components/Header'
import config from '@/lib/config'
import localFont from '@next/font/local'
import type {Metadata, Viewport} from 'next'
import {Roboto} from 'next/font/google'
import {ApolloWrapper} from '../lib/apollo-wrapper'
import './globals.css'

const roboto = Roboto({
  weight: ['400', '700'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
  display: 'swap'
})

const segoeui = localFont({
  src: [
    {
      path: '../public/fonts/SegoeUI.woff2',
      weight: '400'
    },
    {
      path: '../public/fonts/SegoeUI-Bold.woff2',
      weight: '700'
    }
  ],
  variable: '--font-segoeui'
})

/**
 * Setup metadata.
 *
 * @see https://nextjs.org/docs/app/building-your-application/optimizing/metadata
 */
export const metadata: Metadata = {
  metadataBase: new URL(config.siteUrl),
  title: `${config.siteName} - ${config.siteDescription}`,
  description: config.siteDescription
}

/**
 * Setup viewport.
 *
 * @see https://nextjs.org/docs/app/api-reference/functions/generate-viewport
 */
export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#18181b'
}

/**
 * Root layout component.
 *
 * @see https://nextjs.org/docs/app/building-your-application/routing/pages-and-layouts#root-layout-required
 */
export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="es" className={`${segoeui.variable} font-sans`}>
      <body>
        <Header />
        <ApolloWrapper>{children}</ApolloWrapper>
        <Footer />
      </body>
    </html>
  )
}
