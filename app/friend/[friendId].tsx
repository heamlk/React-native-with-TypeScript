import { useLocalSearchParams, useRouter } from 'expo-router'
import AuthenticatedLayout from '../_shared/layout/authenticatedLayout'
import { Text, View } from '../_shared/components/reusable'
import { useEffect, useState } from 'react'

export default function User() {
  const router = useRouter()
  const params = useLocalSearchParams<{ friendId: string }>()
  const userId = params.friendId

  const [allowUser, setAllowUser] = useState(false)

  useEffect(() => {
    if (!isNaN(Number(userId)) && userId !== '') {
      setAllowUser(true)
      return
    }

    router.push('/friend')
  }, [])

  if (!allowUser) {
    return <View></View>
  }

  return (
    <AuthenticatedLayout>
      <View>
        <Text>{userId}</Text>
      </View>
    </AuthenticatedLayout>
  )
}
