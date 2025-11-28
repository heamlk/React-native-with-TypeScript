import React, { createContext, useContext, type ReactNode } from 'react'
import { Redirect, usePathname } from 'expo-router'
import { useUser } from './user'

export type ProtectedRoutesContextType = {}

const ProtectedRoutesContext = createContext<ProtectedRoutesContextType | null>(null)

export default function ProtectedRoutesProvider({ children }: { children: ReactNode }) {
  const { user, friendLimitReached } = useUser()
  const value: ProtectedRoutesContextType = {}
  const pathname = usePathname()

  const authenticatedPaths = ['/friend', '/friend/new', '/profile', '/profile/edit', '/referral', '/subscription', '/subscription/mobile', '/marketplace', '/marketplace/mobile', '/model']

  const isPathAuthenticated = (pathname: string) => {
    return authenticatedPaths.some((path) => pathname === path || pathname.startsWith('/friend/')) // match /friend/${companionId}
  }

  const isAuthenticated = !!user?.customerId
  const isOnboardingCompleted = !!user?.profile?.username
  const isSubscribed = user?.profile?.is_subscribed

  // Redirecting to onboarding if profile is not setup
  if (pathname !== '/onboarding' && isAuthenticated && !isOnboardingCompleted) {
    return <Redirect href={`/onboarding`} />
  }

  // Redirect to main page if authenticated, profile set, and on login page
  if (!isPathAuthenticated(pathname) && pathname !== '/onboarding' && pathname === '/' && isAuthenticated && isOnboardingCompleted) {
    if (user?.companions?.length > 0) {
      return <Redirect href={`/friend/${user?.companions?.[0]?.id}`} />
    } else {
      return <Redirect href='/friend' />
    }
  }

  // Redirect to profile page if authenticated, profile set, and on an incorrect page
  if (!isPathAuthenticated(pathname) && pathname !== '/onboarding' && isAuthenticated && isOnboardingCompleted) {
    return <Redirect href='/profile' />
  }

  // Redirecting to login page if not authenticated
  if (pathname !== '/' && !isAuthenticated) {
    return <Redirect href='/' />
  }

  // Redirecting to /profile if free trial has ended
  if (pathname === '/friend/new' && !isSubscribed) {
    return <Redirect href='/profile' />
  }

  // Redirecting to /profile if friend limit have reached
  if (pathname === '/friend/new' && friendLimitReached()) {
    return <Redirect href='/profile' />
  }

  return <ProtectedRoutesContext.Provider value={value}>{children}</ProtectedRoutesContext.Provider>
}

export const useProtectedRoutes = () => {
  const context = useContext(ProtectedRoutesContext)
  if (!context) throw new Error("useProtectedRoutes can't be null")
  return context
}
