import { useEffect } from 'react'
import { Text } from '../_shared/components/reusable'
import ProtectedScreen from '../_shared/layout/protectedScreen'
import { Linking, Platform } from 'react-native'

export default function SubscriptionMobile() {
  useEffect(() => {
    if (Platform.OS === 'web') {
      window.location.href = `${process.env.EXPO_PUBLIC_WEB_BASE_URL}/subscription`
    } else {
      Linking.openURL(`${process.env.EXPO_PUBLIC_MOBILE_BASE_URL}subscription`)
    }
  }, [])

  return (
    <ProtectedScreen>
      <Text></Text>
    </ProtectedScreen>
  )
}
