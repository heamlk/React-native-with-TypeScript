import { createContext, type Dispatch, type ReactNode, type SetStateAction, useContext, useEffect, useRef, useState } from 'react'
import storage from '@/app/_shared/storage/storage'
import { ServerToClientEvents, useApi } from './api'
import type { CompanionAttributes, CompanionInfos, CustomerProfile, MarketplaceProduct, SubscriptionOption } from './auth.types'
import { useSounds } from '@/app/_hooks/useSounds'
import { playArrayBuffer } from '../_lib/utils'

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
  const audioQueueRef = useRef<any[]>([])
  const isPlayingRef = useRef(false)

  const updateUser = async () => {
    const [getProfileRes, getLifetimeInfoRes] = await Promise.all([api.getProfile(), api.getLifetimeInfo()])
    const newUser = { ...user, profile: getProfileRes?.data?.customer, companions: getProfileRes?.data?.companions, lifetimeInfo: getLifetimeInfoRes?.data }
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
    return isSubscriptionOptionActive({ subscriptionId: 'additional_ai' }) || !!user?.profile?.lifetime_subscription
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

  const enqueueAudio = (audio: any) => {
    audioQueueRef.current.push(audio)
    playQueue()
  }

  const playQueue = async () => {
    if (isPlayingRef.current) return
    isPlayingRef.current = true

    while (audioQueueRef.current.length > 0) {
      const nextAudio = audioQueueRef.current.shift()!
      try {
        await playArrayBuffer(nextAudio)
      } catch (err) {
        console.error('Error playing audio', err)
      }
    }

    isPlayingRef.current = false
  }

  useEffect(() => {
    if (!user) {
      return
    }

    storage.set('user', JSON.stringify(user))
  }, [user])

  useEffect(() => {
    api.socketState?.on('customer_update', (event) => {
      console.log('customer_update event: ', event)
      setUser((prev) => ({ ...(prev as UserType), profile: event.customer }))
    })

    api.socketState?.on('companion_is_typing', (event) => {
      console.log('companion_is_typing event: ', event)
      setCompanionIsTyping(event)
    })

    api.socketState?.on('new_chat_message', async (event) => {
      console.log('new_chat_message event: ', event)
      if (event?.audio) {
        enqueueAudio(event.audio)
      } else {
        if (event?.message?.role === 'companion') {
          if (event?.message?.type === 'text') {
            sounds?.newMessage()
          } else if (event?.message?.type === 'image') {
            sounds?.newImage()
          } else {
            sounds?.error()
          }
        }
      }
    })

    api.socketState?.on('companion_update', (event) => {
      console.log('companion_update event: ', event)
    })

    api.socketState?.on('companion_media_update', (event) => {
      console.log('companion_media_update event: ', event)
    })

    api.socketState?.on('companion_emotion', (event) => {
      console.log('companion_emotion event: ', event)
    })

    // new_chat_message: (eventData: { companion_id: string; message: ChatMessage; local_message_id?: string; audio?: Uint8Array }) => void
    // companion_is_typing: (eventData: { companion_id: string; is_typing: boolean }) => void
    // companion_update: (eventData: { companion: CompanionInfos }) => void
    // companion_edit_error: () => void
    // companion_deletion: (eventData: { companion_id: string }) => void
    // companion_media_update: (eventData: { companion_id: string; images: any[] }) => void
    // companion_emotion: (eventData: { companion_id: string; emotion: string }) => void
    // customer_update: (eventData: { customer: CustomerProfile }) => void

    return () => {
      api.socketState?.off('customer_update')
      api.socketState?.off('companion_is_typing')
      api.socketState?.off('new_chat_message')

      api.socketState?.off('companion_update')
      api.socketState?.off('companion_media_update')
      api.socketState?.off('companion_emotion')
    }
  }, [api.socketState])

  const value = { user, companionIsTyping, setUser, updateUser, getSubscriptionOption, isSubscriptionOptionActive, hasAdditionalAISubscription, friendLimitReached, friendLimitReachedDialog, isPurchaseActive }

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>
}

export const useUser = () => {
  const context = useContext(UserContext)
  if (!context) throw new Error("useUser can't be null")
  return context
}
