import { useLocalSearchParams, useRouter } from 'expo-router'
import AuthenticatedLayout from '../_shared/layout/authenticatedLayout'
import { Text, View } from '../_shared/components/reusable'
import { useEffect, useState } from 'react'
import { useUser } from '../_context/user'

export default function User() {
  const router = useRouter()
  const params = useLocalSearchParams<{ friendId: string }>()
  const friendId = params.friendId
  const { user, setUser, updateUser } = useUser()

  const [allowUser, setAllowUser] = useState(false)

  useEffect(() => {
    if (!friendId) {
      router.push('/profile')
      return
    }

    if (!user?.companions || user?.companions?.length === 0) {
      router.push('/profile')
      return
    }

    updateUser()
    setAllowUser(true)
  }, [])

  if (!allowUser) {
    return <View></View>
  }

  return (
    <AuthenticatedLayout>
      <View>
        <Text>{friendId}</Text>
      </View>
    </AuthenticatedLayout>
  )
}
