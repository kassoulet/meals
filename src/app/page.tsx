'use client'

import { useState } from 'react'
import DarkModeToggle from '@/components/ui/DarkModeToggle'
import { useRouter } from 'next/navigation'

export default function HomePage() {
  const [count, setCount] = useState(0)
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">MealFill</h1>
            </div>
            <div className="flex items-center space-x-4">
              <DarkModeToggle />
              <button
                onClick={() => router.push('/auth/login')}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Sign In
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex min-h-screen flex-col items-center justify-between">
            <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
              <p className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto  lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
                Welcome to the Meal Planning App
              </p>
            </div>

            <div className="relative flex place-items-center before:absolute before:h-[300px] before:w-[480px] before:-translate-x-1/2 before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-[240px] after:translate-x-1/3 after:bg-gradient-conic after:from-sky-200 after:via-blue-200 after:blur-2xl after:content-[''] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-blue-700 before:dark:opacity-10 after:dark:from-sky-900 after:dark:via-[#0141ff] after:dark:opacity-40">
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Meal Planning App</h1>
            </div>

            <div className="mb-32 grid text-center lg:max-w-5xl lg:w-full lg:mb-0 lg:grid-cols-4 lg:text-left">
              <div className="bg-gray-200 dark:bg-gray-800/30 rounded-lg p-4">
                <h2 className="mb-3 text-2xl font-semibold">
                  Get Started
                </h2>
                <p className="m-0 max-w-[30ch] text-sm opacity-50">
                  Find in-depth information about the meal planning features.
                </p>
              </div>

              <div className="bg-gray-200 dark:bg-gray-800/30 rounded-lg p-4">
                <h2 className="mb-3 text-2xl font-semibold">
                  Deploy
                </h2>
                <p className="m-0 max-w-[30ch] text-sm opacity-50">
                  Instantly deploy your meal planning app to a public URL with Vercel.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}