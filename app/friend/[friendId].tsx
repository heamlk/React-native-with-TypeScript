import { useLocalSearchParams, useRouter } from 'expo-router'
import AuthenticatedLayout from '../_shared/layout/authenticatedLayout'
import { Text, View } from '../_shared/components/reusable'
import { useEffect, useState } from 'react'

export default function User() {
  const router = useRouter()
  const params = useLocalSearchParams<{ friendId: string }>()
  const friendId = params.friendId

  const [allowUser, setAllowUser] = useState(false)

  useEffect(() => {
    if (friendId && friendId !== 'new') {
      setAllowUser(true)
      return
    }
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
