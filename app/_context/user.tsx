import { createContext, type Dispatch, type ReactNode, type SetStateAction, useContext, useEffect, useState } from 'react'
import storage from '@/app/_shared/storage/storage'
import { ServerToClientEvents, useApi } from './api'
import type { CompanionAttributes, CompanionInfos, CustomerProfile, MarketplaceProduct, SubscriptionOption } from './auth.types'
import { useSounds } from '@/app/_hooks/useSounds'

export type UserContextType = {
  user: UserType | null
  setUser: Dispatch<SetStateAction<UserType | null>>
  getSubscriptionOption: ({ subscriptionId }: { subscriptionId: string }) => SubscriptionOption | undefined
  isSubscriptionOptionActive: ({ subscriptionId }: { subscriptionId: string }) => boolean
  hasAdditionalAISubscription: () => boolean
  friendLimitReached: () => boolean
  friendLimitReachedDialog: () => string
  isPurchaseActive: ({ purchaseId }: { purchaseId: string }) => boolean
  updateUser: () => Promise<{
    profile: any
    lifetimeInfo: any
    customerId?: string | undefined
    companions?: CompanionInfos[] | undefined
    activeCompanion?: CompanionInfos | null
    products?: MarketplaceProduct[] | undefined
    interests?: Record<string, string> | undefined
    companionAttributes?: CompanionAttributes
  }>
  companionIsTyping: { companion_id: string; is_typing: boolean } | null
}
export type UserProviderProps = { children: ReactNode }

const UserContext = createContext<UserContextType | null>(null)

export type UserType = {
  customerId: string
  companions: CompanionInfos[]
  activeCompanion?: CompanionInfos | null
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

export default function UserProvider({ children }: UserProviderProps) {
  const sounds = useSounds()
  const api = useApi()

  const [user, setUser] = useState<UserType | null>(getStoredUser())
  const [companionIsTyping, setCompanionIsTyping] = useState<{ companion_id: string; is_typing: boolean } | null>(null)

  const updateUser = async () => {
    const [getProfileRes, getLifetimeInfoRes] = await Promise.all([api.getProfile(), api.getLifetimeInfo()])
    const newUser = { ...user, profile: getProfileRes?.data?.customer, companions: getProfileRes?.data?.companions, lifetimeInfo: getLifetimeInfoRes?.data, activeCompanion: null }
    setUser(newUser as UserType)
    return newUser
  }

  const getSubscriptionOption = ({ subscriptionId }: { subscriptionId: string }) => {
    return user?.profile?.subscription?.options?.[subscriptionId]
  }

  const isSubscriptionOptionActive = ({ subscriptionId }: { subscriptionId: string }) => {
    if (user?.profile?.lifetime_subscription) {
      const product = user?.products.find((product) => product.id === subscriptionId)
      if (product?.included_in_lifetime_subscription === true) {
        return !product.is_nsfw || user?.profile?.is_age_verified
      }
    }

    const subscriptionOption = getSubscriptionOption({ subscriptionId })
    return subscriptionOption?.active_until != null && subscriptionOption?.active_until >= Math.floor(Date.now() / 1000)
  }

  const hasAdditionalAISubscription = () => {
    return isSubscriptionOptionActive({ subscriptionId: 'additional_ai' })
  }

  const friendLimitReached = () => {
    const companionLimit = hasAdditionalAISubscription() ? 3 : 1
    const companionLimitReached = (user?.companions?.length || 0) >= companionLimit
    return companionLimitReached
  }

  const friendLimitReachedDialog = () => {
    return friendLimitReached() ? (hasAdditionalAISubscription() ? 'Unable to create a new friend. Please delete an existing one to proceed.' : 'Unable to create a new friend. You can either delete an existing one or purchase the Additional AI subscription in the marketplace.') : ''
  }

  const isPurchaseActive = ({ purchaseId }: { purchaseId: string }) => {
    if (user?.profile?.lifetime_subscription) {
      const product = user?.products.find((product) => product.id === purchaseId)
      if (product?.included_in_lifetime_subscription === true) {
        return !product.is_nsfw || user?.profile?.is_age_verified
      }
    }
    return user?.profile.purchases?.[purchaseId] != null
  }

  useEffect(() => {
    const user = getStoredUser()
    if (user) {
      setUser(user)
    }
  }, [])

  useEffect(() => {
    console.log('user: ', user)
    if (!user) {
      return
    }

    storage.set('user', JSON.stringify(user))

    if (!user?.activeCompanion && user?.companions?.length > 0) {
      const newUser = { ...user, activeCompanion: user?.companions?.[0] }
      setUser(newUser)
      return
    }

    setUser(user)
  }, [user])

  useEffect(() => {
    api.socketState?.on('companion_is_typing', (event) => {
      setCompanionIsTyping(event)
    })

    api.socketState?.on('new_chat_message', (event) => {
      if (event?.message?.role === 'companion') {
        if (event?.message?.type === 'text') {
          sounds?.newMessage()
        } else if (event?.message?.type === 'image') {
          sounds?.newImage()
        } else {
          sounds?.error()
        }
      }
    })

    return () => {
      api.socketState?.off('companion_is_typing')
      api.socketState?.off('new_chat_message')
    }
  }, [api.socketState?.active])

  const value = { user, companionIsTyping, setUser, updateUser, getSubscriptionOption, isSubscriptionOptionActive, hasAdditionalAISubscription, friendLimitReached, friendLimitReachedDialog, isPurchaseActive }

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>
}

export const useUser = () => {
  const context = useContext(UserContext)
  if (!context) throw new Error("useUser can't be null")
  return context
}
