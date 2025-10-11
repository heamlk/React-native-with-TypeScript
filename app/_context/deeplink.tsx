import * as Linking from 'expo-linking'
import { ReactNode, createContext, useContext, useEffect } from 'react'
import { useAuth } from './auth'
import { useRouter } from 'expo-router'

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
