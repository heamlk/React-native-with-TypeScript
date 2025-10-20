import React, { createContext, useContext, useEffect, type ReactNode } from 'react'
export type ProtectedRoutesType = 'light' | 'dark'
export type ProtectedRoutesContextType = {}
import { usePathname, useRootNavigationState, useRouter } from 'expo-router'
import { useUser } from './user'

const ProtectedRoutesContext = createContext<ProtectedRoutesContextType | null>(null)

export default function ProtectedRoutesProvider({ children }: { children: ReactNode }) {
  const { user, friendLimitReached } = useUser()
  const value: ProtectedRoutesContextType = {}
  const pathname = usePathname()
  const router = useRouter()
  const rootNavigationState = useRootNavigationState()

  const authenticatedPaths = ['/friend', '/friend/new', '/profile', '/profile/edit', '/referral', '/subscription', '/marketplace', '/model']

  const isPathAuthenticated = (pathname: string) => {
    return authenticatedPaths.some((path) => pathname === path || pathname.startsWith('/friend/')) // match /friend/${companionId}
  }

  useEffect(() => {
    if (!rootNavigationState?.key) return

    const isAuthenticated = !!user?.customerId
    const isOnboardingCompleted = !!user?.profile?.username
    const isSubscribed = user?.profile?.is_subscribed

    // Redirecting to onboarding if profile is not setup
    if (pathname !== '/onboarding' && isAuthenticated && !isOnboardingCompleted) {
      setTimeout(() => router.push('/onboarding'), 0)
      return
    }

    // Redirect to main page if authenticated, profile set, and on login page
    if (!isPathAuthenticated(pathname) && pathname !== '/onboarding' && pathname === '/' && isAuthenticated && isOnboardingCompleted) {
      setTimeout(() => router.push('/friend'), 0)
      return
    }

    // Redirect to profile page if authenticated, profile set, and on an incorrect page
    if (!isPathAuthenticated(pathname) && pathname !== '/onboarding' && isAuthenticated && isOnboardingCompleted) {
      setTimeout(() => router.push('/profile'), 0)
      return
    }

    // Redirecting to login page if not authenticated
    if (pathname !== '/' && !isAuthenticated) {
      setTimeout(() => router.push('/'), 0)
      return
    }

    // Redirecting to /profile if free trial has ended
    if (pathname === '/friend/new' && !isSubscribed) {
      setTimeout(() => router.push('/profile'), 0)
      return
    }

    // Redirecting to /profile if friend limit have reached
    if (pathname === '/friend/new' && friendLimitReached()) {
      setTimeout(() => router.push('/profile'), 0)
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
