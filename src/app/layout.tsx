import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Script from 'next/script'
import './globals.css'
import { TwoPlayerProvider } from '../components/providers/TwoPlayerProvider'
import GlobalMiniPlayer from '../components/GlobalMiniPlayer'
import GlobalModal from '../components/GlobalModal'
import DebugInfo from '../components/DebugInfo'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'LinkFlyer - Music Discovery Platform',
  description: 'Discover and listen to amazing music tracks',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Script 
          src="https://w.soundcloud.com/player/api.js" 
          strategy="beforeInteractive"
        />
        <TwoPlayerProvider>
          {/* Global player container for iframe management */}
          <div id="global-player-container" />
          
          {/* Main content */}
          <main>
            {children}
          </main>
          
          {/* Global components */}
          <GlobalMiniPlayer />
          <GlobalModal />
          
          {/* Debug panel (development only) */}
          {process.env.NODE_ENV === 'development' && <DebugInfo />}
        </TwoPlayerProvider>
      </body>
    </html>
  )
}