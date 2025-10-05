import React, { createContext, useContext, useEffect, useState, type Dispatch, type ReactNode, type SetStateAction } from 'react'
import { useAuth } from './auth'
export type ProtectedRoutesType = 'light' | 'dark'
export type ProtectedRoutesContextType = {}
import { usePathname, useRouter } from 'expo-router'
import ProtectedScreen from '../shared/layout/protectedScreen'

const ProtectedRoutesContext = createContext<ProtectedRoutesContextType | null>(null)

export default function ProtectedRoutesProvider({ children }: { children: ReactNode }) {
  const auth = useAuth()
  const value: ProtectedRoutesContextType = {}
  const pathname = usePathname()
  const router = useRouter()

  const [allowRoute, setAllowRoute] = useState(false)

  const nonProtectedRoutes = ['/']

  useEffect(() => {
    const isAuthenticated = !!auth.user?.email
    let isProtectedRoute = true

    if (!nonProtectedRoutes.includes(pathname)) {
      isProtectedRoute = false
    }

    const newAllowRoute = !isProtectedRoute || isAuthenticated

    if (newAllowRoute) {
      setAllowRoute(newAllowRoute)
    } else {
      router.push('/')
    }
  }, [])

  return <ProtectedRoutesContext.Provider value={value}>{allowRoute ? children : <ProtectedScreen />}</ProtectedRoutesContext.Provider>
}

export const useProtectedRoutes = () => {
  const context = useContext(ProtectedRoutesContext)
  if (!context) throw new Error("useProtectedRoutes can't be null")
  return context
}
