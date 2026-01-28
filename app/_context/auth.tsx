import { createContext, type ReactNode, useContext, useEffect } from 'react'
import axios from 'axios'
import * as Linking from 'expo-linking'
import storage from '@/app/_shared/storage/storage'
import { useRouter } from 'expo-router'
import { useApi } from './api'
import { getStoredUser, UserType, useUser } from './user'
import { Platform } from 'react-native'

export type AuthContextType = {
  oAuth: any
  oAuthCodeExchange: ({ code }: { code: string }) => Promise<{ successful: boolean; data: any }>
  otp: ({ email }: { email: string }) => Promise<{ successful: boolean; data: any; error: null } | { successful: boolean; data: null; error: any }>
  otpVerify: ({ email, code }: { email: string; code: string }) => Promise<{ successful: boolean; data: any; error: null } | { successful: boolean; data: null; error: any }>
  authenticate: ({ next }: { next?: (() => void) | undefined }) => Promise<void>
  logout: () => void
}
export type AuthProviderProps = { children: ReactNode }

const AuthContext = createContext<AuthContextType | null>(null)

export default function AuthProvider({ children }: AuthProviderProps) {
  const router = useRouter()
  const api = useApi()
  const descopeProjectId = process.env.EXPO_PUBLIC_DESCOPE_PROJECT_ID!
  const { user, setUser } = useUser()

  const redirectUrl = (Platform.OS === 'web' ? process.env.EXPO_PUBLIC_WEB_BASE_URL : `${process.env.EXPO_PUBLIC_MOBILE_BASE_URL}index`) as string

  const oAuth = async ({ provider }: { provider: 'google' | 'microsoft' | 'apple' }) => {
    axios
      .post(`https://api.descope.com/v1/auth/oauth/authorize?provider=${provider}&redirectUrl=${encodeURIComponent(redirectUrl)}`, { customClaims: { userEmail: '{{user.email}}' } }, { headers: { Authorization: `Bearer ${descopeProjectId}` } })
      .then((res) => {
        Linking.openURL(res.data?.url)
      })
      .catch((err) => {
        console.error('error: ', err.response?.data || err.message)
      })
  }

  const oAuthCodeExchange = async ({ code }: { code: string }) => {
    try {
      const req = await axios.post('https://api.descope.com/v1/auth/oauth/exchange', { code }, { headers: { Authorization: `Bearer ${descopeProjectId}` } })
      const data = req?.data
      const successful = !!data?.user?.email

      if (successful) {
        storage.set('session', data?.sessionJwt)
        await authenticate({
          next: (user) => {
            if (user?.companions?.length > 0) {
              router.push(`/friend/${user?.companions?.[0]?.id}`)
            } else {
              router.push('/friend')
            }
          },
        })
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
      const req = await axios.post(`https://api.descope.com/v1/auth/otp/signup-in/email`, { loginId: email, loginOptions: { customClaims: { userEmail: '{{user.email}}' } } }, { headers: { Authorization: `Bearer ${descopeProjectId}` } })
      const data = req?.data
      const successful = !!data?.maskedEmail

      return {
        successful,
        data: data,
        error: null,
      }
    } catch (error) {
      console.warn('auth.tsx otp error: ', error)
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
        storage.set('session', data?.sessionJwt)
        await authenticate({
          next: (user) => {
            if (user?.companions?.length > 0) {
              router.push(`/friend/${user?.companions?.[0]?.id}`)
            } else {
              router.push('/friend')
            }
          },
        })
      }

      return {
        successful,
        data: data,
        error: null,
      }
    } catch (error) {
      console.warn('auth.tsx otpVerify error: ', error)
      return {
        successful: false,
        data: null,
        error: error,
      }
    }
  }

  const authenticate = async ({ next }: { next?: (user: UserType) => void }) => {
    const [loginRes, getProfileRes, getProductsRes, getAvailableInterestsRes] = await Promise.all([api.login(), api.getProfile(), api.getProducts(), api.getAvailableInterests()])

    const newUser: UserType = {
      customerId: loginRes?.data?.customer_id,
      companions: getProfileRes?.data?.companions,
      profile: getProfileRes?.data?.customer,
      products: getProductsRes?.data,
      interests: getAvailableInterestsRes?.data,
    }
    setUser(newUser)
    storage.set('user', JSON.stringify(newUser))

    if (next) {
      next(newUser)
    }
  }

  const logout = () => {
    setUser(null)
    storage.delete('session')
    storage.delete('user')
    storage.delete('activePurchases')
    storage.delete('activeSubscriptions')
  }

  // useEffect(() => {
  //   setUser(null)
  //   storage.delete('session')
  //   storage.delete('user')

  //   console.log('mmkw session: ', storage.getString('session'))
  //   console.log('mmkw user: ', storage.getString('user'))
  // }, [])

  useEffect(() => {
    const user = getStoredUser()
    if (user) {
      setUser(user)
    }
  }, [])

  const value = {
    oAuth: oAuth,
    oAuthCodeExchange,
    otp,
    otpVerify,
    authenticate,
    logout,
    user,
    setUser,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error("useAuth can't be null")
  return context
}
