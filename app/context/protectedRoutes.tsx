import React, { createContext, useContext, useEffect, useState, type Dispatch, type ReactNode, type SetStateAction } from 'react'
import { getStoredUser, useAuth } from './auth'
export type ProtectedRoutesType = 'light' | 'dark'
export type ProtectedRoutesContextType = {}
import { usePathname, useRootNavigationState, useRouter, useSegments } from 'expo-router'

const ProtectedRoutesContext = createContext<ProtectedRoutesContextType | null>(null)

export default function ProtectedRoutesProvider({ children }: { children: ReactNode }) {
  const { user: useAuthUser } = useAuth()
  const value: ProtectedRoutesContextType = {}
  const pathname = usePathname()
  const router = useRouter()
  const rootNavigationState = useRootNavigationState()

  useEffect(() => {
    const user = getStoredUser()
    if (!rootNavigationState?.key) return

    const isAuthenticated = !!user?.customerId
    const isOnboardingCompleted = !!user?.profile?.username

    // Forcing to finish onboarding
    if (pathname !== '/onboarding' && isAuthenticated && !isOnboardingCompleted) {
      setTimeout(() => router.push('/onboarding'), 0)
      return
    }

    // Forcing to login screen if not authenticated
    if (pathname !== '/' && !isAuthenticated) {
      setTimeout(() => router.push('/'), 0)
      return
    }
  }, [rootNavigationState, pathname, useAuthUser])

  return <ProtectedRoutesContext.Provider value={value}>{children}</ProtectedRoutesContext.Provider>
}

export const useProtectedRoutes = () => {
  const context = useContext(ProtectedRoutesContext)
  if (!context) throw new Error("useProtectedRoutes can't be null")
  return context
}
