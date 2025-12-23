import '../styles/globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { DarkModeProvider } from '@/contexts/DarkModeContext'
import Header from '@/components/ui/Header'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'MealFill - Meal Planning Made Simple',
  description: 'A utility-first web application designed to eliminate decision fatigue in meal planning',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} bg-gray-50 dark:bg-gray-900 transition-colors duration-300 h-full`}>
        <DarkModeProvider>
          <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
            <Header title="MealFill" showAuthControls={true} authButtonText="Sign In" />
            <main>
              {children}
            </main>
            {/* Footer could go here */}
          </div>
        </DarkModeProvider>
      </body>
    </html>
  )
}