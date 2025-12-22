import '../styles/globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

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
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen bg-gray-50">
          {/* Header could go here */}
          <main>
            {children}
          </main>
          {/* Footer could go here */}
        </div>
      </body>
    </html>
  )
}