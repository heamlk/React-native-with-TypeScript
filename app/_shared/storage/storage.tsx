import { MMKV } from 'react-native-mmkv'

const mmkv = new MMKV()

type Storage = {
  getString: (key: string) => string | null
  set: (key: string, value: string) => void
  delete: (key: string) => void
}

const storage: Storage = {
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

export default storage
