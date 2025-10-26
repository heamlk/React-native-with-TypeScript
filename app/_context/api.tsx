import React, { createContext, Dispatch, SetStateAction, useContext, useEffect, useState, type ReactNode } from 'react'
import axios, { type AxiosInstance, type AxiosResponse } from 'axios'
import storage from '../_shared/storage/storage'
import { io, Socket } from 'socket.io-client'
import type { ChatMessage, CompanionInfos, MarketplaceProduct, OwnModelParams } from './auth.types'

export interface ServerToClientEvents {
  new_chat_message: (eventData: { companion_id: string; message: ChatMessage; local_message_id?: string; audio?: Uint8Array }) => void
  companion_is_typing: (eventData: { companion_id: string; is_typing: boolean }) => void
  companion_update: (eventData: { companion: CompanionInfos }) => void
  companion_edit_error: () => void
  companion_deletion: (eventData: { companion_id: string }) => void
  companion_media_update: (eventData: { companion_id: string; images: any[] }) => void
  companion_emotion: (eventData: { companion_id: string; emotion: string }) => void
  customer_update: (eventData: { customer: any }) => void
}

export type ApiContextType = {
  api: AxiosInstance
  socketState: Socket<ServerToClientEvents> | null
  setSocketState: Dispatch<SetStateAction<Socket<ServerToClientEvents> | null>>
  login: () => Promise<AxiosResponse<any, any, {}>>
  getProfile: () => Promise<AxiosResponse<any, any, {}>>
  getProducts: () => Promise<AxiosResponse<any, any, {}>>
  getAvailableInterests: () => Promise<AxiosResponse<any, any, {}>>
  postConfirmAccount: ({ username, first_name, last_name, date_of_birth, interests, referral_code }: { username: string; first_name: string; last_name: string; date_of_birth: string; interests: string; referral_code: string }) => Promise<AxiosResponse<any, any, {}>>
  postUpdateProfile: ({ first_name, last_name, date_of_birth, interests, avatar }: { first_name: string; last_name: string; date_of_birth: string; interests: string; avatar?: File | null | undefined }) => Promise<AxiosResponse<any, any, {}>>
  getLifetimeInfo: () => Promise<AxiosResponse<any, any, {}>>
  getAvailableAttributes: () => Promise<AxiosResponse<any, any, {}>>
  getReferralInfo: () => Promise<AxiosResponse<any, any, {}>>
  postCreateCompanion: ({}: { name: string; age: number; gender: string; hair_color: string; facial_hair: string; hair_length: string; eye_color: string; skin_tone: string; attire: string; universe: string; personality: string; ancestral_region: string }) => Promise<AxiosResponse<any, any, {}>>
  postEditCompanion: ({
    name,
    age,
    gender,
    facial_hair,
    hair_color,
    hair_length,
    eye_color,
    skin_tone,
    attire,
    universe,
    personality,
    ancestral_region,
    companionId,
  }: {
    name: string
    age: number
    gender: string
    facial_hair: string
    hair_color: string
    hair_length: string
    eye_color: string
    skin_tone: string
    attire: string
    universe: string
    personality: string
    ancestral_region: string
    companionId: string
  }) => Promise<AxiosResponse<any, any, {}>>
  deleteCompanion: ({ id }: { id: string }) => Promise<AxiosResponse<any, any, {}>>
  postRegenerateCompanionPicture: ({ companionId }: { companionId: string }) => Promise<AxiosResponse<any, any, {}>>
  getOwnModel: () => Promise<AxiosResponse<any, any, {}>>
  postOwnModel: (params: OwnModelParams) => Promise<AxiosResponse<any, any, {}>>
  postUpdateSubscriptionStatus: ({ active }: { active: boolean }) => Promise<AxiosResponse<any, any, {}>>
  postUpdateSubscriptionOptionStatus: ({ active, product_id }: { active: boolean; product_id: string }) => Promise<AxiosResponse<any, any, {}>>
  postGetManageSubscriptionUrl: () => Promise<AxiosResponse<any, any, {}>>
  postVerifyAge: ({ agechecker_uuid }: { agechecker_uuid: string }) => Promise<AxiosResponse<any, any, {}>>
  postAddSubscriptionOption: ({ productId, success_url, cancel_url }: { productId: string; success_url: string; cancel_url: string }) => Promise<AxiosResponse<any, any, {}>>
  postGetPaymentUrl: ({ productId, success_url, cancel_url }: { productId: string; success_url: string; cancel_url: string }) => Promise<AxiosResponse<any, any, {}>>
  postGetNewSubscriptionUrl: ({ mode, success_url, cancel_url }: { mode: string; success_url: string; cancel_url: string }) => Promise<AxiosResponse<any, any, {}>>
  postUpdateAnimationStatue: ({ companionId, enabled }: { companionId: string; enabled: boolean }) => Promise<AxiosResponse<any, any, {}>>
  postClearChat: ({ companionId }: { companionId: string }) => Promise<AxiosResponse<any, any, {}>>
  postSendMessage: ({ companionId, message }: { companionId: string; message: string }) => Promise<AxiosResponse<any, any, {}>>
  getConversationsHistory: ({ companionId }: { companionId: string }) => Promise<AxiosResponse<any, any, {}>>
  getConversationMedia: ({ companionId }: { companionId: string }) => Promise<AxiosResponse<any, any, {}>>
  deleteConversationMedia: ({ companionId, mediaId }: { companionId: string; mediaId: string }) => Promise<AxiosResponse<any, any, {}>>
  postGenerateCompanionMediaAnimation: ({ companionId, mediaId }: { companionId: string; mediaId: string }) => Promise<AxiosResponse<any, any, {}>>
}

const ApiContext = createContext<ApiContextType | null>(null)

export default function ApiProvider({ children }: { children: ReactNode }) {
  const [socketState, setSocketState] = useState<Socket<ServerToClientEvents> | null>(null)

  const api: AxiosInstance = axios.create({
    baseURL: process.env.EXPO_PUBLIC_API_BASE_URL,
  })

  const socket: Socket = io(process.env.EXPO_PUBLIC_API_BASE_URL, {
    auth: {
      token: (storage.getString('session') as any) || '',
    },
    transports: ['websocket', 'polling'],
  })

  const login = async () => {
    return await api.post('login', null, {
      headers: {
        'x-session-token': (storage.getString('session') as any) || '',
      },
    })
  }

  const getProfile = async () => {
    return await api.get('customers/profile', {
      headers: {
        'x-session-token': (storage.getString('session') as any) || '',
      },
    })
  }

  const getProducts = async () => {
    return await api.get('marketplace/products', {
      headers: {
        'x-session-token': (storage.getString('session') as any) || '',
      },
    })
  }

  const getAvailableInterests = async () => {
    return await api.get('customers/available-interests', {
      headers: {
        'x-session-token': (storage.getString('session') as any) || '',
      },
    })
  }

  const postConfirmAccount = async ({ username, first_name, last_name, date_of_birth, interests, referral_code, avatar }: { username: string; first_name: string; last_name: string; date_of_birth: string; interests: string; referral_code: string; avatar?: File | null }) => {
    const formData = new FormData()
    formData.append('username', username)
    formData.append('first_name', first_name)
    formData.append('last_name', last_name)
    formData.append('date_of_birth', date_of_birth)
    formData.append('interests', interests)
    formData.append('referral_code', referral_code)

    if (avatar) {
      formData.append('avatar', avatar, avatar.name)
    }

    return await api.post('customers/confirm-account', formData, {
      headers: {
        'x-session-token': (storage.getString('session') as any) || '',
      },
    })
  }

  const postUpdateProfile = async ({ first_name, last_name, date_of_birth, interests, avatar }: { first_name: string; last_name: string; date_of_birth: string; interests: string; avatar?: File | null }) => {
    const formData = new FormData()
    formData.append('first_name', first_name)
    formData.append('last_name', last_name)
    formData.append('date_of_birth', date_of_birth)
    formData.append('interests', interests)

    if (avatar) {
      formData.append('avatar', avatar, avatar.name)
    }

    return await api.post('customers/update-profile', formData, {
      headers: {
        'x-session-token': (storage.getString('session') as any) || '',
      },
    })
  }

  const getLifetimeInfo = async () => {
    return await api.get('marketplace/lifetime-subscription-info', {
      headers: {
        'x-session-token': (storage.getString('session') as any) || '',
      },
    })
  }

  const getAvailableAttributes = async () => {
    return await api.get('companions/available-attributes', {
      headers: {
        'x-session-token': (storage.getString('session') as any) || '',
      },
    })
  }

  const getReferralInfo = async () => {
    return await api.get('referral/info', {
      headers: {
        'x-session-token': (storage.getString('session') as any) || '',
      },
    })
  }

  const postCreateCompanion = async ({
    name,
    age,
    gender,
    facial_hair,
    hair_color,
    hair_length,
    eye_color,
    skin_tone,
    attire,
    universe,
    personality,
    ancestral_region,
  }: {
    name: string
    age: number
    gender: string
    facial_hair: string
    hair_color: string
    hair_length: string
    eye_color: string
    skin_tone: string
    attire: string
    universe: string
    personality: string
    ancestral_region: string
  }) => {
    return await api.post(
      'companions/create',
      {
        name,
        age,
        gender,
        facial_hair,
        hair_color,
        hair_length,
        eye_color,
        skin_tone,
        attire,
        universe,
        personality,
        ancestral_region,
      },
      {
        headers: {
          'x-session-token': (storage.getString('session') as any) || '',
        },
      }
    )
  }

  const postEditCompanion = async ({
    name,
    age,
    gender,
    facial_hair,
    hair_color,
    hair_length,
    eye_color,
    skin_tone,
    attire,
    universe,
    personality,
    ancestral_region,
    companionId,
  }: {
    name: string
    age: number
    gender: string
    facial_hair: string
    hair_color: string
    hair_length: string
    eye_color: string
    skin_tone: string
    attire: string
    universe: string
    personality: string
    ancestral_region: string
    companionId: string
  }) => {
    return await api.post(
      `companions/${companionId}`,
      {
        name,
        age,
        gender,
        facial_hair,
        hair_color,
        hair_length,
        eye_color,
        skin_tone,
        attire,
        universe,
        personality,
        ancestral_region,
      },
      {
        headers: {
          'x-session-token': (storage.getString('session') as any) || '',
        },
      }
    )
  }

  const postRegenerateCompanionPicture = async ({ companionId }: { companionId: string }) => {
    return await api.post(`companions/${companionId}/regenerate-profile-picture`, null, {
      headers: {
        'x-session-token': (storage.getString('session') as any) || '',
      },
    })
  }

  const deleteCompanion = async ({ id }: { id: string }) => {
    return await api.delete(`companions/${id}`, {
      headers: {
        'x-session-token': (storage.getString('session') as any) || '',
      },
    })
  }

  const getOwnModel = async () => {
    return await api.get(`customers/own-model`, {
      headers: {
        'x-session-token': (storage.getString('session') as any) || '',
      },
    })
  }

  const postOwnModel = async (params: OwnModelParams) => {
    return await api.post(`customers/own-model`, params, {
      headers: {
        'x-session-token': (storage.getString('session') as any) || '',
      },
    })
  }

  const postUpdateSubscriptionStatus = async ({ active }: { active: boolean }) => {
    return await api.post(
      `marketplace/set-subscription-status`,
      { active },
      {
        headers: {
          'x-session-token': (storage.getString('session') as any) || '',
        },
      }
    )
  }

  const postUpdateSubscriptionOptionStatus = async ({ active, product_id }: { active: boolean; product_id: string }) => {
    return await api.post(
      `marketplace/set-subscription-option-status`,
      { active, product_id },
      {
        headers: {
          'x-session-token': (storage.getString('session') as any) || '',
        },
      }
    )
  }

  const postGetManageSubscriptionUrl = async () => {
    return await api.post(
      `marketplace/manage-subscription-url`,
      {
        success_url: window?.location?.origin + '/subscription',
        cancel_url: window?.location?.origin + '/subscription',
      },
      {
        headers: {
          'x-session-token': (storage.getString('session') as any) || '',
        },
      }
    )
  }

  const postVerifyAge = async ({ agechecker_uuid }: { agechecker_uuid: string }) => {
    return await api.post(
      `customers/verify-age`,
      {
        success_url: window?.location?.origin + '/subscription',
        cancel_url: window?.location?.origin + '/subscription',
      },
      {
        headers: {
          'x-session-token': (storage.getString('session') as any) || '',
        },
      }
    )
  }

  const postAddSubscriptionOption = async ({ productId, success_url, cancel_url }: { productId: MarketplaceProduct['id']; success_url: string; cancel_url: string }) => {
    return await api.post(
      `marketplace/add-subscription-option`,
      {
        product_id: productId,
        success_url,
        cancel_url,
      },
      {
        headers: {
          'x-session-token': (storage.getString('session') as any) || '',
        },
      }
    )
  }

  const postGetPaymentUrl = async ({ productId, success_url, cancel_url }: { productId: MarketplaceProduct['id']; success_url: string; cancel_url: string }) => {
    return await api.post(
      `marketplace/payment-url`,
      {
        product_id: productId,
        success_url,
        cancel_url,
      },
      {
        headers: {
          'x-session-token': (storage.getString('session') as any) || '',
        },
      }
    )
  }

  const postGetNewSubscriptionUrl = async ({ mode, success_url, cancel_url }: { mode: string; success_url: string; cancel_url: string }) => {
    return await api.post(
      `marketplace/new-subscription-url`,
      {
        mode,
        success_url,
        cancel_url,
      },
      {
        headers: {
          'x-session-token': (storage.getString('session') as any) || '',
        },
      }
    )
  }

  const postUpdateAnimationStatue = async ({ companionId, enabled }: { companionId: string; enabled: boolean }) => {
    return await api.post(
      `companions/${companionId}/set-animations-status`,
      {
        enabled,
      },
      {
        headers: {
          'x-session-token': (storage.getString('session') as any) || '',
        },
      }
    )
  }

  const postClearChat = async ({ companionId }: { companionId: string }) => {
    return await api.post(`companions/${companionId}/clear-chat`, null, {
      headers: {
        'x-session-token': (storage.getString('session') as any) || '',
      },
    })
  }

  const postSendMessage = async ({ companionId, message }: { companionId: string; message: string }) => {
    return await api.post(
      `companions/${companionId}/send-message`,
      {
        local_message_id: Math.random().toString(36).substring(7),
        message,
      },
      {
        headers: {
          'x-session-token': (storage.getString('session') as any) || '',
        },
      }
    )
  }

  const getConversationsHistory = async ({ companionId }: { companionId: string }) => {
    return await api.get(`companions/${companionId}/conversation-history`, {
      headers: {
        'x-session-token': (storage.getString('session') as any) || '',
      },
    })
  }

  const getConversationMedia = async ({ companionId }: { companionId: string }) => {
    return await api.get(`companions/${companionId}/media`, {
      headers: {
        'x-session-token': (storage.getString('session') as any) || '',
      },
    })
  }

  const deleteConversationMedia = async ({ companionId, mediaId }: { companionId: string; mediaId: string }) => {
    return await api.delete(`companions/${companionId}/media`, {
      headers: {
        'x-session-token': (storage.getString('session') as any) || '',
      },
      data: {
        media_id: mediaId,
      },
    })
  }

  const postGenerateCompanionMediaAnimation = async ({ companionId, mediaId }: { companionId: string; mediaId: string }) => {
    return await api.post(
      `companions/${companionId}/media/generate-animation`,
      { media_id: mediaId },
      {
        headers: {
          'x-session-token': (storage.getString('session') as any) || '',
        },
      }
    )
  }

  useEffect(() => {
    const newSocket = socket
    setSocketState(newSocket)

    const handleError = (err: any) => {
      console.error('Socket error:', err)
    }

    newSocket.on('connect_error', handleError)
    newSocket.on('connect_timeout', handleError)
    newSocket.on('error', handleError)

    return () => {
      newSocket.off('connect_error', handleError)
      newSocket.off('connect_timeout', handleError)
      newSocket.off('error', handleError)

      newSocket.disconnect()
    }
  }, [])

  const value = {
    api,
    socketState,
    setSocketState,
    login,
    getProfile,
    getProducts,
    getAvailableInterests,
    postConfirmAccount,
    getLifetimeInfo,
    getAvailableAttributes,
    getReferralInfo,
    postUpdateProfile,
    postCreateCompanion,
    postEditCompanion,
    deleteCompanion,
    postRegenerateCompanionPicture,
    getOwnModel,
    postOwnModel,
    postUpdateSubscriptionStatus,
    postUpdateSubscriptionOptionStatus,
    postGetManageSubscriptionUrl,
    postVerifyAge,
    postAddSubscriptionOption,
    postGetPaymentUrl,
    postGetNewSubscriptionUrl,
    postUpdateAnimationStatue,
    postClearChat,
    postSendMessage,
    getConversationsHistory,
    getConversationMedia,
    deleteConversationMedia,
    postGenerateCompanionMediaAnimation,
  }

  return <ApiContext.Provider value={value}>{children}</ApiContext.Provider>
}

export const useApi = () => {
  const context = useContext(ApiContext)
  if (!context) throw new Error("useApi can't be null")
  return context
}
