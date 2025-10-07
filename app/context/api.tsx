import React, { createContext, useContext, useEffect, type ReactNode } from 'react'
import axios, { type AxiosInstance, type AxiosResponse } from 'axios'
import storage from '../shared/storage/storage'

export type ApiContextType = {
  api: AxiosInstance
  login: () => Promise<AxiosResponse<any, any, {}>>
  getProfile: () => Promise<AxiosResponse<any, any, {}>>
  getProducts: () => Promise<AxiosResponse<any, any, {}>>
  getAvailableInterests: () => Promise<AxiosResponse<any, any, {}>>
}

const ApiContext = createContext<ApiContextType | null>(null)

export default function ApiProvider({ children }: { children: ReactNode }) {
  const api: AxiosInstance = axios.create({
    baseURL: process.env.EXPO_PUBLIC_API_BASE_URL,
    headers: {
      'Content-Type': 'application/json',
    },
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

  const value = {
    api,
    login,
    getProfile,
    getProducts,
    getAvailableInterests,
  }

  useEffect(() => {
    // login()
    // getProfile()
    // getProducts()
    // getAvailableInterests()
  }, [])

  return <ApiContext.Provider value={value}>{children}</ApiContext.Provider>
}

export const useApi = () => {
  const context = useContext(ApiContext)
  if (!context) throw new Error("useApi can't be null")
  return context
}
