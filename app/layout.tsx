import type { Metadata } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import { cookies } from 'next/headers'
import './globals.css'
import { Sidebar } from '@/components/layout/Sidebar'
import { TopBar } from '@/components/layout/TopBar'
import { ToastProvider } from '@/components/ui/ToastProvider'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains',
})

export const metadata: Metadata = {
  title: 'Orbit — Personal Intelligence Dashboard',
  description: 'Track people, companies, and the tech ecosystem.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = cookies()
  const theme = cookieStore.get('orbit-theme')?.value ?? 'dark'

  return (
    <html lang="en" className={theme === 'dark' ? 'dark' : ''} suppressHydrationWarning>
      <body className={`${inter.variable} ${jetbrains.variable} font-sans`}>
        <ToastProvider>
          <div className="flex h-screen overflow-hidden bg-neutral-50 dark:bg-obsidian">
            <Sidebar />
            <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
              <TopBar initialTheme={theme as 'dark' | 'light'} />
              <main className="flex-1 overflow-auto animate-fade-in">
                {children}
              </main>
            </div>
          </div>
        </ToastProvider>
      </body>
    </html>
  )
}
