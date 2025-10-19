import { useLocalSearchParams } from 'expo-router'
import AuthenticatedLayout from '../_shared/layout/authenticatedLayout'
import { Text, View } from '../_shared/components/reusable'

export default function User() {
  const params = useLocalSearchParams<{ friendId: string }>()
  const userId = params.friendId

  return (
    <AuthenticatedLayout>
      <View>
        <Text>{userId}</Text>
      </View>
    </AuthenticatedLayout>
  )
}
