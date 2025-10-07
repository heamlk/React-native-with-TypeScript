// storage.ts
import AsyncStorage from '@react-native-async-storage/async-storage'
import { MMKV } from 'react-native-mmkv'

// detect if remote debugging is enabled
const isRemoteDebugging = typeof global !== 'undefined' && (global as any).navigator?.product === 'ReactNative' // Chrome debugger environment

let storage: {
  getString: (key: string) => string | null | Promise<string | null>
  set: (key: string, value: string) => void | Promise<void>
  delete: (key: string) => void | Promise<void>
}

// Use AsyncStorage in remote debugging, MMKV otherwise
if (isRemoteDebugging) {
  storage = {
    getString: async (key) => {
      const value = await AsyncStorage.getItem(key)
      try {
        return value ? JSON.parse(value) : null
      } catch {
        return value
      }
    },
    set: async (key, value) => {
      await AsyncStorage.setItem(key, JSON.stringify(value))
    },
    delete: async (key) => {
      await AsyncStorage.removeItem(key)
    },
  }
} else {
  const mmkv = new MMKV()

  storage = {
    getString: (key) => {
      const value = mmkv.getString(key)
      try {
        return value ? JSON.parse(value) : null
      } catch {
        return value
      }
    },
    set: (key, value) => mmkv.set(key, JSON.stringify(value)),
    delete: (key) => mmkv.delete(key),
  }
}

export default storage
