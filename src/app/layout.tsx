import type { Metadata } from 'next'
import { Playfair_Display, Crimson_Pro, IBM_Plex_Mono } from 'next/font/google'
import './globals.css'

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
})

const crimson = Crimson_Pro({
  subsets: ['latin'],
  weight: ['300', '400', '600'],
  style: ['normal', 'italic'],
  variable: '--font-crimson',
  display: 'swap',
})

const ibmMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-ibm-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://asbury-park-postcards.vercel.app'),
  title: 'Asbury Park Postmarks — A Strolling Guide',
  description: 'Fifteen stops from Bangs Ave to the Boardwalk. Collect postmarks as you walk Asbury Park.',
  openGraph: {
    title: 'Asbury Park Postmarks — A Strolling Guide',
    description: 'Fifteen stops from Bangs Ave to the Boardwalk. Collect postmarks as you walk Asbury Park.',
    images: [{ url: '/opengraph-image.jpg', width: 1200, height: 630, alt: 'Asbury Park Postmarks' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Asbury Park Postmarks — A Strolling Guide',
    description: 'Fifteen stops from Bangs Ave to the Boardwalk. Collect postmarks as you walk Asbury Park.',
    images: ['/opengraph-image.jpg'],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${playfair.variable} ${crimson.variable} ${ibmMono.variable}`}>
        {children}
      </body>
    </html>
  )
}
