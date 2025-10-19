import { createContext, type Dispatch, type ReactNode, type SetStateAction, useContext, useEffect, useState } from 'react'
import storage from '@/app/_shared/storage/storage'
import { useApi } from './api'
import type { CompanionAttributes, CompanionInfos, CustomerProfile, MarketplaceProduct, SubscriptionOption } from './auth.types'

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
  const api = useApi()

  const [user, setUser] = useState<UserType | null>(getStoredUser())

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
    return subscriptionOption?.activeUntil != null && subscriptionOption.activeUntil > new Date()
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
    setUser(user)
  }, [user])

  useEffect(() => {
    const handler = ({ customer }: any) => {
      console.log('Socket event (customer_update): ', customer)
      // api.socketState?.customer = parseCustomerProfile(rawCustomer)
    }

    api.socketState?.on('customer_update', handler)

    return () => {
      api.socketState?.off('customer_update', handler)
    }
  }, [])

  const value = { user, setUser, updateUser, getSubscriptionOption, isSubscriptionOptionActive, hasAdditionalAISubscription, friendLimitReached, friendLimitReachedDialog, isPurchaseActive }

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>
}

export const useUser = () => {
  const context = useContext(UserContext)
  if (!context) throw new Error("useUser can't be null")
  return context
}
