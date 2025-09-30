import * as AuthSession from 'expo-auth-session'
import * as WebBrowser from 'expo-web-browser'
import { createContext, ReactNode, useContext } from 'react'
import axios from 'axios'
import * as Linking from 'expo-linking'
import { useRouter } from 'expo-router'

WebBrowser.maybeCompleteAuthSession()

export type AuthContextType = {
  oAuth: ({ provider }: { provider: 'google' | 'microsoft' }) => Promise<void>
  oAuthCodeExchange: ({ code }: { code: string }) => void
}
export type AuthProviderProps = { children: ReactNode }

const AuthContext = createContext<AuthContextType | null>(null)

export default function AuthProvider({ children }: AuthProviderProps) {
  const router = useRouter()
  const descopeProjectId = process.env.EXPO_PUBLIC_DESCOPE_PROJECT_ID!

  const oAuth = async ({ provider }: { provider: 'google' | 'microsoft' }) => {
    axios.post(`https://api.descope.com/v1/auth/oauth/authorize?provider=${provider}&redirectUrl=${encodeURIComponent(AuthSession.makeRedirectUri({ scheme: 'bfflai' }))}`, {}, { headers: { Authorization: `Bearer ${descopeProjectId}` } }).then((res) => {
      Linking.openURL(res.data?.url)
    })
  }

  const oAuthCodeExchange = ({ code }: { code: string }) => {
    axios
      .post('https://api.descope.com/v1/auth/oauth/exchange', { code }, { headers: { Authorization: `Bearer ${descopeProjectId}` } })
      .then((res) => {
        const data = res?.data
        router.navigate('/')
        console.log('data: ', data)
      })
      .catch((error) => {
        console.log(error)
        router.navigate('/')
      })
  }

  const value = { oAuth, oAuthCodeExchange }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error("useAuth can't be null")
  return context
}
