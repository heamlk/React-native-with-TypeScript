import * as Linking from 'expo-linking'
import { ReactNode, createContext, useContext, useEffect } from 'react'
import { useAuth } from './descope'

export type DeepLinkContextType = {}
export type DeeplinkProviderProps = { children: ReactNode }

const DeepLinkContext = createContext<DeepLinkContextType | null>(null)

export default function DeeplinkProvider({ children }: DeeplinkProviderProps) {
  const auth = useAuth()

  useEffect(() => {
    const handleDeepLink = async ({ url }: { url: string }) => {
      const { queryParams } = Linking.parse(url)
      if (queryParams?.code) {
        auth.oAuthCodeExchange({ code: String(queryParams?.code) })
      }
    }

    const subscription = Linking.addEventListener('url', handleDeepLink)

    // Check initial URL if app is opened via deep link
    Linking.getInitialURL().then((url) => {
      if (url) handleDeepLink({ url })
    })

    return () => {
      subscription.remove()
    }
  }, [])

  return <DeepLinkContext.Provider value={{}}>{children}</DeepLinkContext.Provider>
}

export const useDeepLink = () => {
  const context = useContext(DeepLinkContext)
  if (!context) throw new Error("useDeepLink can't be null")
  return context
}
