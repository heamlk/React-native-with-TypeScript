import * as AuthSession from 'expo-auth-session'
import * as WebBrowser from 'expo-web-browser'
import { createContext, type Dispatch, type ReactNode, type SetStateAction, useContext, useEffect, useState } from 'react'
import axios from 'axios'
import * as Linking from 'expo-linking'
import storage from '@/app/shared/storage/storage'
import { useRouter } from 'expo-router'
import { useApi } from './api'
import type { CompanionAttributes, CompanionInfos, CustomerProfile, MarketplaceProduct } from './auth.types'

WebBrowser.maybeCompleteAuthSession()

export type AuthContextType = {
  oAuth: ({ provider }: { provider: 'google' | 'microsoft' }) => Promise<void>
  oAuthCodeExchange: ({ code }: { code: string }) => Promise<{ successful: boolean; data: any }>
  otp: ({ email }: { email: string }) => Promise<{ successful: boolean; data: any; error: null } | { successful: boolean; data: null; error: any }>
  otpVerify: ({ email, code }: { email: string; code: string }) => Promise<{ successful: boolean; data: any; error: null } | { successful: boolean; data: null; error: any }>
  authenticate: ({ sessionJWT }: { sessionJWT: string }) => void
  logout: () => void
  user: UserType | null
  setUser: Dispatch<SetStateAction<UserType | null>>
}
export type AuthProviderProps = { children: ReactNode }

const AuthContext = createContext<AuthContextType | null>(null)

export type UserType = {
  customerId: string
  companions: CompanionInfos[]
  profile: CustomerProfile
  products: MarketplaceProduct[]
  interests: Record<string, string>
  lifetimeInfo?: {
    left: number
    price: number
    tier: number
  }
  companionAttributes?: CompanionAttributes
}

export const getStoredUser = (): UserType | null => {
  const data = storage.getString('user')

  try {
    const parsedData = JSON.parse(data as any)
    if (parsedData?.customerId) {
      return parsedData
    }

    return null
  } catch (error) {
    console.warn(error)
    return null
  }
}

export default function AuthProvider({ children }: AuthProviderProps) {
  const router = useRouter()
  const api = useApi()
  const descopeProjectId = process.env.EXPO_PUBLIC_DESCOPE_PROJECT_ID!

  const [user, setUser] = useState<UserType | null>(getStoredUser())

  const oAuth = async ({ provider }: { provider: 'google' | 'microsoft' }) => {
    axios.post(`https://api.descope.com/v1/auth/oauth/authorize?provider=${provider}&redirectUrl=${encodeURIComponent(AuthSession.makeRedirectUri({ scheme: 'bfflai' }))}`, {}, { headers: { Authorization: `Bearer ${descopeProjectId}` } }).then((res) => {
      Linking.openURL(res.data?.url)
    })
  }

  const oAuthCodeExchange = async ({ code }: { code: string }) => {
    try {
      const req = await axios.post('https://api.descope.com/v1/auth/oauth/exchange', { code }, { headers: { Authorization: `Bearer ${descopeProjectId}` } })
      const data = req?.data
      const successful = !!data?.user?.email

      if (successful) {
        await authenticate({ sessionJWT: data?.sessionJwt })
      }

      return {
        successful,
        data: data,
      }
    } catch (error) {
      console.warn(error)
      return {
        successful: false,
        data: null,
      }
    }
  }

  const otp = async ({ email }: { email: string }) => {
    try {
      const req = await axios.post(`https://api.descope.com/v1/auth/otp/signup-in/email`, { loginId: email }, { headers: { Authorization: `Bearer ${descopeProjectId}` } })
      const data = req?.data
      const successful = !!data?.maskedEmail

      return {
        successful,
        data: data,
        error: null,
      }
    } catch (error) {
      console.warn(error)
      return {
        successful: false,
        data: null,
        error: error,
      }
    }
  }

  const otpVerify = async ({ email, code }: { email: string; code: string }) => {
    try {
      const req = await axios.post(`https://api.descope.com/v1/auth/otp/verify/email`, { loginId: email, code }, { headers: { Authorization: `Bearer ${descopeProjectId}` } })
      const data = req?.data
      const successful = !!data?.user?.email

      if (successful) {
        await authenticate({ sessionJWT: data?.sessionJwt })
      }

      return {
        successful,
        data: data,
        error: null,
      }
    } catch (error) {
      console.warn(error)
      return {
        successful: false,
        data: null,
        error: error,
      }
    }
  }

  const authenticate = async ({ sessionJWT }: { sessionJWT: string }) => {
    storage.set('session', sessionJWT)

    const [loginRes, getProfileRes, getProductsRes, getAvailableInterestsRes] = await Promise.all([api.login(), api.getProfile(), api.getProducts(), api.getAvailableInterests()])

    const newUser: UserType = {
      customerId: loginRes?.data?.customer_id,
      companions: getProfileRes?.data?.companions,
      profile: getProfileRes?.data?.customer,
      products: getProductsRes?.data,
      interests: getAvailableInterestsRes?.data,
    }
    storage.set('user', JSON.stringify(newUser))
    setUser(newUser)

    if (newUser?.profile) {
      if (newUser?.profile?.username) {
        // router.navigate('/main')
      } else {
        router.navigate('/onboarding')
      }
    }
  }

  const logout = () => {
    setUser(null)
    storage.delete('session')
    router.navigate('/')
  }

  // useEffect(() => {
  //   console.log('user: ', user)
  // }, [user])

  useEffect(() => {
    const user = getStoredUser()
    if (user) {
      setUser(user)
    }
  }, [])

  // useEffect(() => {
  //   console.log('user: ', user)
  //   logout()
  // }, [user])

  // useEffect(() => {
  //   // otp({ email: 'davidbalayandev@gmail.com' })
  //   // otpVerify({ email: 'davidbalayandev@gmail.com', code: '' })
  // }, [])

  const value = { oAuth, oAuthCodeExchange, otp, otpVerify, authenticate, logout, user, setUser }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error("useAuth can't be null")
  return context
}
