import React, { createContext, useContext, useEffect, useState, type Dispatch, type ReactNode, type SetStateAction } from 'react'
import { getStoredUser, useAuth } from './auth'
export type ProtectedRoutesType = 'light' | 'dark'
export type ProtectedRoutesContextType = {}
import { usePathname, useRootNavigationState, useRouter, useSegments } from 'expo-router'

const ProtectedRoutesContext = createContext<ProtectedRoutesContextType | null>(null)

export default function ProtectedRoutesProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const value: ProtectedRoutesContextType = {}
  const pathname = usePathname()
  const router = useRouter()
  const rootNavigationState = useRootNavigationState()

  const authenticatedPaths = ['/friend', '/profile', '/profile/edit', '/referral', '/subscription']

  useEffect(() => {
    const user = getStoredUser()
    if (!rootNavigationState?.key) return

    const isAuthenticated = !!user?.customerId
    const isOnboardingCompleted = !!user?.profile?.username

    // Redirecting to onboarding if profile is not setup
    if (pathname !== '/onboarding' && isAuthenticated && !isOnboardingCompleted) {
      setTimeout(() => router.push('/onboarding'), 0)
      return
    }

    // Redirecting to main page if user is authenticated and profile is setup
    if (!authenticatedPaths.includes(pathname) && isAuthenticated && isOnboardingCompleted) {
      setTimeout(() => router.push('/friend'), 0)
      return
    }

    // Redirecting to login page if not authenticated
    if (pathname !== '/' && !isAuthenticated) {
      setTimeout(() => router.push('/'), 0)
      return
    }
  }, [pathname, user])

  return <ProtectedRoutesContext.Provider value={value}>{children}</ProtectedRoutesContext.Provider>
}

export const useProtectedRoutes = () => {
  const context = useContext(ProtectedRoutesContext)
  if (!context) throw new Error("useProtectedRoutes can't be null")
  return context
}
