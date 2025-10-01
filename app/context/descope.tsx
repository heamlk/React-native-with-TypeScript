import * as AuthSession from 'expo-auth-session'
import * as WebBrowser from 'expo-web-browser'
import { createContext, type Dispatch, type ReactNode, type SetStateAction, useContext, useEffect, useState } from 'react'
import axios from 'axios'
import * as Linking from 'expo-linking'
import storage from '@/app/shared/storage/storage'

WebBrowser.maybeCompleteAuthSession()

export type AuthContextType = {
  oAuth: ({ provider }: { provider: 'google' | 'microsoft' }) => Promise<void>
  oAuthCodeExchange: ({ code }: { code: string }) => Promise<{ successful: boolean; data: any }>
  otp: ({ email }: { email: string }) => Promise<{ successful: boolean; data: any }>
  otpVerify: ({ email, code }: { email: string; code: string }) => Promise<{ successful: boolean; data: any }>
  authenticate: ({ name, email, picture }: { name: string; email: string; picture: string }) => void
  logout: () => void
  user: UserType | null
  setUser: Dispatch<SetStateAction<UserType | null>>
}
export type AuthProviderProps = { children: ReactNode }

const AuthContext = createContext<AuthContextType | null>(null)

export type UserType = {
  name: string
  email: string
  picture?: string
}

const getStoredUser = (): UserType | null => {
  const data = storage.getString('user')

  try {
    const parsedData = JSON.parse(data as any)
    if (parsedData?.email) {
      return parsedData
    }

    return null
  } catch (error) {
    console.warn(error)
    return null
  }
}

export default function AuthProvider({ children }: AuthProviderProps) {
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
        authenticate({ email: data?.user?.email, name: data?.user?.name, picture: data?.user?.picture })
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
      }
    } catch (error) {
      console.warn(error)
      return {
        successful: false,
        data: null,
      }
    }
  }

  const otpVerify = async ({ email, code }: { email: string; code: string }) => {
    try {
      const req = await axios.post(`https://api.descope.com/v1/auth/otp/verify/email`, { loginId: email, code }, { headers: { Authorization: `Bearer ${descopeProjectId}` } })
      const data = req?.data
      const successful = !!data?.user?.email

      if (successful) {
        authenticate({ email: data?.user?.email, name: data?.user?.name, picture: data?.user?.picture })
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

  const authenticate = ({ name, email, picture }: { name: string; email: string; picture: string }) => {
    storage.set('user', JSON.stringify({ name, email, picture }))
    setUser({ name, email, picture })
  }

  const logout = () => {
    setUser(null)
    storage.delete('user')
  }

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
