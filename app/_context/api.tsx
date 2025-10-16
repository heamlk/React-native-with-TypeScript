import React, { createContext, useContext, type ReactNode } from 'react'
import axios, { type AxiosInstance, type AxiosResponse } from 'axios'
import storage from '../_shared/storage/storage'

export type ApiContextType = {
  api: AxiosInstance
  login: () => Promise<AxiosResponse<any, any, {}>>
  getProfile: () => Promise<AxiosResponse<any, any, {}>>
  getProducts: () => Promise<AxiosResponse<any, any, {}>>
  getAvailableInterests: () => Promise<AxiosResponse<any, any, {}>>
  postConfirmAccount: ({ username, first_name, last_name, date_of_birth, interests, referral_code }: { username: string; first_name: string; last_name: string; date_of_birth: string; interests: string; referral_code: string }) => Promise<AxiosResponse<any, any, {}>>
  postUpdateProfile: ({ first_name, last_name, date_of_birth, interests, avatar }: { first_name: string; last_name: string; date_of_birth: string; interests: string; avatar?: File | null | undefined }) => Promise<AxiosResponse<any, any, {}>>
  getLifetimeInfo: () => Promise<AxiosResponse<any, any, {}>>
  getAvailableAttributes: () => Promise<AxiosResponse<any, any, {}>>
  getReferralInfo: () => Promise<AxiosResponse<any, any, {}>>
  postCreateCompanion: ({}: { name: string; age: number; gender: string; hair_color: string; hair_length: string; eye_color: string; skin_tone: string; attire: string; universe: string; personality: string; ancestral_region: string }) => Promise<AxiosResponse<any, any, {}>>
}

const ApiContext = createContext<ApiContextType | null>(null)

export default function ApiProvider({ children }: { children: ReactNode }) {
  const api: AxiosInstance = axios.create({
    baseURL: process.env.EXPO_PUBLIC_API_BASE_URL,
    // headers: {
    //   'Content-Type': 'application/json',
    // },
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

  // {\"name\":\"Jennifer\",\"age\":41,\"gender\":\"female\",\"hair_color\":\"red\",\"hair_length\":\"medium length hair\",\"eye_color\":\"hazel\",\"skin_tone\":\"light\",\"attire\":\"casual\",\"universe\":\"fantasy\",\"personality\":\"anxious\",\"ancestral_region\":\"west asian\"}

  const postCreateCompanion = async ({
    name,
    age,
    gender,
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

  const value = {
    api,
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
  }

  return <ApiContext.Provider value={value}>{children}</ApiContext.Provider>
}

export const useApi = () => {
  const context = useContext(ApiContext)
  if (!context) throw new Error("useApi can't be null")
  return context
}
