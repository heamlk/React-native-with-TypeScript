import * as Linking from 'expo-linking'
import { ReactNode, createContext, useContext, useEffect } from 'react'
import { useAuth } from './auth'
import { useRouter } from 'expo-router'
import storage from '../_shared/storage/storage'
import { Platform } from 'react-native'

export type DeeplinkContextType = {}
export type DeeplinkProviderProps = { children: ReactNode }

const DeeplinkContext = createContext<DeeplinkContextType | null>(null)

export default function DeeplinkProvider({ children }: DeeplinkProviderProps) {
  const router = useRouter()
  const auth = useAuth()

  useEffect(() => {
    const handleDeeplink = async ({ url }: { url: string }) => {
      const { queryParams } = Linking.parse(url)
      if (queryParams?.code) {
        const result = await auth.oAuthCodeExchange({ code: String(queryParams?.code) })
        router.push('/')
      }

      if (queryParams?.auth_session) {
        storage.set('session', queryParams?.auth_session as string)
        await auth.authenticate()

        if (queryParams?.age_verify && queryParams?.age_verify === 'true') {
          const url: any = process.env.EXPO_PUBLIC_WEB_BASE_URL + '/profile?age_verify=true'
          Platform.OS === 'web' ? router.push(url) : Linking.openURL(url)
        }
      }
    }

    const subscription = Linking.addEventListener('url', handleDeeplink)

    // Checking initial URL if app is opened via deep link
    Linking.getInitialURL().then((url) => {
      if (url) handleDeeplink({ url })
    })

    return () => {
      subscription.remove()
    }
  }, [])

  return <DeeplinkContext.Provider value={{}}>{children}</DeeplinkContext.Provider>
}

export const useDeeplink = () => {
  const context = useContext(DeeplinkContext)
  if (!context) throw new Error("useDeeplink can't be null")
  return context
}
