import { useRouter } from 'expo-router'
import { useEffect } from 'react'
import { useAuth } from './context/auth'

export default function All() {
  const router = useRouter()
  const auth = useAuth()

  useEffect(() => {
    const isAuthenticated = !!auth.user?.email

    if (isAuthenticated) {
      router.navigate('/')
    } else {
      router.navigate('/')
    }
  }, [])

  return <></>
}
